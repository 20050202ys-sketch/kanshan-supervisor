import type { CameraEvent, CameraReason } from "../types";

// ============================================================
// 本地摄像头分心检测（PRD F09）· Issue #13
// 原则：画面只在本地（浏览器内）分析，绝不上传；只对外产出 CameraEvent 状态事件。
// 实现：通过 CDN 动态加载 MediaPipe Tasks Vision 的 FaceLandmarker，
//       用面部关键点判断：人是否在画面 / 是否持续低头 / 是否持续转头。
// 降级：MediaPipe 加载失败或不支持时，自动退回"不误报"模式，绝不阻断课程。
// ============================================================

export interface DetectorOptions {
  video: HTMLVideoElement;
  onEvent: (e: CameraEvent) => void; // 判定为一次持续分心时回调
  onStatus?: (status: DetectStatus) => void; // 检测状态提示
}

export type DetectStatus = "idle" | "starting" | "loading-model" | "running" | "denied" | "error";

// 触发阈值（PRD 第十七章：用较长的持续时间，避免误判）
const ABSENT_SECONDS = 6; // 持续离开画面
const HEAD_DOWN_SECONDS = 8; // 持续低头
const HEAD_TURN_SECONDS = 8; // 持续转头
const TICK_MS = 400; // 采样间隔

// MediaPipe CDN 资源（固定版本，避免不稳定）
const MP_VERSION = "0.10.14";
const MP_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MP_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export class DistractionDetector {
  private stream: MediaStream | null = null;
  private timer: number | null = null;
  private opts: DetectorOptions;
  private status: DetectStatus = "idle";

  // 各类分心的持续时间累计（秒）
  private absentAccum = 0;
  private downAccum = 0;
  private turnAccum = 0;
  private lastTick = 0;

  private landmarker: any = null; // MediaPipe FaceLandmarker 实例
  private useModel = false; // 模型是否可用

  constructor(opts: DetectorOptions) {
    this.opts = opts;
  }

  private setStatus(s: DetectStatus) {
    this.status = s;
    this.opts.onStatus?.(s);
  }

  getStatus() {
    return this.status;
  }

  async start(): Promise<boolean> {
    this.setStatus("starting");
    // 1) 申请摄像头
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch {
      this.setStatus("denied"); // 拒绝授权 -> 普通学习模式（PRD F08）
      return false;
    }
    this.opts.video.srcObject = this.stream;
    await this.opts.video.play().catch(() => {});

    // 2) 尝试加载 MediaPipe 模型（失败则降级为不误报）
    this.setStatus("loading-model");
    try {
      await this.loadModel();
      this.useModel = true;
    } catch {
      this.useModel = false; // 降级：不误报，不阻断课程
    }

    this.lastTick = performance.now();
    this.setStatus("running");
    this.timer = window.setInterval(() => this.tick(), TICK_MS);
    return true;
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.absentAccum = this.downAccum = this.turnAccum = 0;
    try {
      this.landmarker?.close?.();
    } catch {
      /* ignore */
    }
    this.landmarker = null;
    this.setStatus("idle");
  }

  // 动态从 CDN 加载 MediaPipe FaceLandmarker
  private async loadModel() {
    // @ts-ignore 运行时从 CDN 动态 import，无需本地依赖
    const vision: any = await import(
      /* @vite-ignore */ `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}`
    );
    const { FaceLandmarker, FilesetResolver } = vision;
    const fileset = await FilesetResolver.forVisionTasks(MP_WASM);
    this.landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MP_MODEL, delegate: "GPU" },
      runningMode: "VIDEO",
      numFaces: 1,
    });
  }

  private tick() {
    const now = performance.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    // 没有可用模型时，不做误报（保证演示不被打扰；可用"演示模式"手动触发铁拳）
    if (!this.useModel || !this.landmarker) return;

    const video = this.opts.video;
    if (video.readyState < 2) return; // 画面还没准备好

    let result: any;
    try {
      result = this.landmarker.detectForVideo(video, now);
    } catch {
      return;
    }

    const faces = result?.faceLandmarks ?? [];
    const present = faces.length > 0;

    // (1) 人不在画面
    if (!present) {
      this.absentAccum += dt;
      this.downAccum = 0;
      this.turnAccum = 0;
      if (this.absentAccum >= ABSENT_SECONDS) {
        this.emit("face_absent", Math.round(this.absentAccum));
        this.absentAccum = 0;
      }
      return;
    }
    this.absentAccum = 0;

    // 有人脸：用关键点粗略判断低头 / 转头
    const lm = faces[0]; // 468 个点，坐标已归一化到 0..1
    // 关键点索引（MediaPipe FaceLandmarker 常用点）
    const noseTip = lm[1];
    const leftEye = lm[33];
    const rightEye = lm[263];
    const chin = lm[152];
    const forehead = lm[10];

    // --- 转头：鼻尖水平位置相对两眼中心的偏移 ---
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const eyeWidth = Math.abs(rightEye.x - leftEye.x) || 0.0001;
    const turnRatio = Math.abs(noseTip.x - eyeCenterX) / eyeWidth; // 越大越偏
    const isTurning = turnRatio > 0.35;

    // --- 低头：脸的上下方向压缩（额头到下巴的垂直跨度变小）---
    const faceHeight = Math.abs(chin.y - forehead.y);
    // 正对时额-颏跨度较大；低头时脸在画面里"变扁"，跨度变小
    const isDown = faceHeight < 0.28;

    if (isTurning) {
      this.turnAccum += dt;
      if (this.turnAccum >= HEAD_TURN_SECONDS) {
        this.emit("head_turn", Math.round(this.turnAccum));
        this.turnAccum = 0;
      }
    } else {
      this.turnAccum = 0;
    }

    if (isDown) {
      this.downAccum += dt;
      if (this.downAccum >= HEAD_DOWN_SECONDS) {
        this.emit("head_down", Math.round(this.downAccum));
        this.downAccum = 0;
      }
    } else {
      this.downAccum = 0;
    }
  }

  private emit(reason: CameraReason, duration: number) {
    this.opts.onEvent({
      event: "possible_distraction",
      reason,
      duration_seconds: duration,
      timestamp: Math.floor(Date.now() / 1000),
    });
  }
}
