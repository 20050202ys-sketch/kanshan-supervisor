import { FaceLandmarker, FilesetResolver, type NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { CameraEvent, CameraReason } from "../types";

export interface DetectorOptions {
  video: HTMLVideoElement;
  onEvent: (event: CameraEvent) => void;
  onStatus?: (status: DetectStatus) => void;
  onAttention?: (state: AttentionState) => void;
}

export type DetectStatus = "idle" | "starting" | "running" | "denied" | "error";
export type AttentionState = "focused" | "face_absent" | "head_turn" | "head_down";

const DISTRACTION_SECONDS = 6;
const SAMPLE_MS = 650;
const WASM_ROOT = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = FilesetResolver.forVisionTasks(WASM_ROOT).then((vision) =>
      FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: `${import.meta.env.BASE_URL}models/face_landmarker.task` },
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.55,
        minFacePresenceConfidence: 0.55,
        minTrackingConfidence: 0.5,
      })
    );
  }
  return landmarkerPromise;
}

export class DistractionDetector {
  private stream: MediaStream | null = null;
  private timer: number | null = null;
  private distractedFor = 0;
  private lastTick = 0;
  private lastVideoTime = -1;
  private opts: DetectorOptions;
  private status: DetectStatus = "idle";
  private landmarker: FaceLandmarker | null = null;
  private activeReason: CameraReason | null = null;

  constructor(opts: DetectorOptions) {
    this.opts = opts;
  }

  private setStatus(status: DetectStatus) {
    this.status = status;
    this.opts.onStatus?.(status);
  }

  async start(): Promise<boolean> {
    this.setStatus("starting");
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
    } catch {
      this.setStatus("denied");
      return false;
    }

    try {
      this.opts.video.srcObject = this.stream;
      await this.opts.video.play();
      this.landmarker = await getLandmarker();
      this.lastTick = performance.now();
      this.setStatus("running");
      this.timer = window.setInterval(() => this.tick(), SAMPLE_MS);
      return true;
    } catch {
      this.stopTracks();
      this.setStatus("error");
      return false;
    }
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    this.stopTracks();
    this.distractedFor = 0;
    this.activeReason = null;
    this.opts.onAttention?.("focused");
    this.setStatus("idle");
  }

  getStatus() {
    return this.status;
  }

  private stopTracks() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.opts.video.srcObject = null;
  }

  private tick() {
    if (!this.landmarker || this.opts.video.readyState < 2) return;
    const now = performance.now();
    if (this.opts.video.currentTime === this.lastVideoTime) return;
    this.lastVideoTime = this.opts.video.currentTime;

    try {
      const result = this.landmarker.detectForVideo(this.opts.video, now);
      const landmarks = result.faceLandmarks[0];
      const reason = landmarks ? this.classify(landmarks) : "face_absent";
      const elapsed = Math.max(0, (now - this.lastTick) / 1000);
      this.lastTick = now;

      if (!reason) {
        this.activeReason = null;
        this.distractedFor = 0;
        this.opts.onAttention?.("focused");
        return;
      }

      if (this.activeReason !== reason) {
        this.activeReason = reason;
        this.distractedFor = 0;
      }
      this.distractedFor += elapsed;
      this.opts.onAttention?.(reason);

      if (this.distractedFor >= DISTRACTION_SECONDS) {
        this.opts.onEvent({
          event: "possible_distraction",
          reason,
          duration_seconds: Math.round(this.distractedFor),
          timestamp: Math.floor(Date.now() / 1000),
        });
        this.distractedFor = 0;
      }
    } catch {
      this.setStatus("error");
    }
  }

  private classify(face: NormalizedLandmark[]): CameraReason | null {
    const nose = face[1];
    const forehead = face[10];
    const chin = face[152];
    const leftCheek = face[234];
    const rightCheek = face[454];
    const leftEye = face[33];
    const rightEye = face[263];
    if (!nose || !forehead || !chin || !leftCheek || !rightCheek || !leftEye || !rightEye) return "face_absent";

    const faceWidth = Math.max(0.01, Math.abs(rightCheek.x - leftCheek.x));
    const cheekCenter = (rightCheek.x + leftCheek.x) / 2;
    if (Math.abs(nose.x - cheekCenter) / faceWidth > 0.17) return "head_turn";

    const eyeY = (leftEye.y + rightEye.y) / 2;
    const lowerFace = Math.max(0.01, chin.y - eyeY);
    const noseRatio = (nose.y - eyeY) / lowerFace;
    const faceCenterY = (forehead.y + chin.y) / 2;
    if (noseRatio > 0.58 || faceCenterY > 0.72) return "head_down";

    return null;
  }
}
