import type { CameraEvent, CameraReason } from "../types";

// ============================================================
// 本地摄像头分心检测（PRD F09）
// 原则：画面只在本地分析，绝不上传；只对外产出 CameraEvent 状态事件。
// 1 天版策略：MediaPipe 通过 CDN 动态加载；若加载/授权失败，检测降级为
//            "不产生事件"，绝不阻断课程（PRD F08：拒绝授权走普通模式）。
//
// ⚠️ TODO(A同学)：接入 MediaPipe FaceLandmarker，用 landmark 计算
//   - 人是否在画面内 -> face_absent
//   - 是否持续转头   -> head_turn（用鼻尖 x 相对两眼中心的偏移判断）
//   - 是否持续低头   -> head_down（用鼻尖 y / 眼-嘴垂直比判断）
// 下面给出一个基于 "getUserMedia + 定时采样" 的骨架与阈值位，
// 目前用简单的"亮度/无信号"占位，替换为真实 landmark 逻辑即可。
// ============================================================

export interface DetectorOptions {
  video: HTMLVideoElement;
  // 每当判定为一次持续分心时回调（已按最短持续时间聚合）
  onEvent: (e: CameraEvent) => void;
  // 检测状态提示（PRD F09：页面提供检测状态提示）
  onStatus?: (status: DetectStatus) => void;
}

export type DetectStatus = "idle" | "starting" | "running" | "denied" | "error";

// 触发阈值（PRD 第十七章：用较长触发时间，避免误判）
const ABSENT_SECONDS = 6; // 持续离开画面判定为可能分心

export class DistractionDetector {
  private stream: MediaStream | null = null;
  private timer: number | null = null;
  private absentAccum = 0;
  private lastTick = 0;
  private opts: DetectorOptions;
  private status: DetectStatus = "idle";

  constructor(opts: DetectorOptions) {
    this.opts = opts;
  }

  private setStatus(s: DetectStatus) {
    this.status = s;
    this.opts.onStatus?.(s);
  }

  async start(): Promise<boolean> {
    this.setStatus("starting");
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch {
      this.setStatus("denied"); // 拒绝授权 -> 普通学习模式（PRD F08）
      return false;
    }
    this.opts.video.srcObject = this.stream;
    await this.opts.video.play().catch(() => {});
    this.lastTick = performance.now();
    this.setStatus("running");
    this.timer = window.setInterval(() => this.tick(), 500);
    return true;
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.absentAccum = 0;
    this.setStatus("idle");
  }

  getStatus() {
    return this.status;
  }

  // 占位检测：真实实现请替换为 MediaPipe landmark 判断
  private tick() {
    const now = performance.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    const present = this.isFacePresentPlaceholder();
    if (!present) {
      this.absentAccum += dt;
      if (this.absentAccum >= ABSENT_SECONDS) {
        this.emit("face_absent", Math.round(this.absentAccum));
        this.absentAccum = 0; // 触发后清零，配合上层做 60s 间隔控制
      }
    } else {
      this.absentAccum = 0;
    }
  }

  // TODO: 用真实模型替换。这里始终返回 true（默认认为在席），
  // 使占位检测不会误触发；接入 MediaPipe 后按 landmark 返回结果。
  private isFacePresentPlaceholder(): boolean {
    return true;
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
