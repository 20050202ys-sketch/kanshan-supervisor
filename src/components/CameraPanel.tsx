import { useEffect, useRef, useState } from "react";
import { DistractionDetector, type DetectStatus } from "../camera/detector";
import type { CameraEvent } from "../types";

const STATUS_TEXT: Record<DetectStatus, string> = {
  idle: "摄像头已关闭",
  starting: "正在启动摄像头…",
  "loading-model": "正在加载检测模型…",
  running: "本地检测中（画面不上传）",
  denied: "已拒绝授权 · 使用普通学习模式",
  error: "摄像头不可用 · 使用普通学习模式",
};

// 摄像头面板（PRD F08/F09）：默认关闭、明确告知、可随时关闭、提供状态提示与纠正入口
export default function CameraPanel({
  enabled,
  onToggle,
  onEvent,
  onCorrect,
}: {
  enabled: boolean;
  onToggle: (on: boolean) => void;
  onEvent: (e: CameraEvent) => void;
  onCorrect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<DistractionDetector | null>(null);
  const [status, setStatus] = useState<DetectStatus>("idle");

  useEffect(() => {
    if (enabled && videoRef.current) {
      const d = new DistractionDetector({
        video: videoRef.current,
        onEvent,
        onStatus: setStatus,
      });
      detectorRef.current = d;
      d.start().then((ok) => {
        if (!ok) onToggle(false); // 授权失败自动回落普通模式（PRD F08）
      });
      return () => d.stop();
    }
    setStatus("idle");
    return;
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-xl border border-mountain-light bg-white p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-mountain-dark">看山铁拳模式</span>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          {enabled ? "开启" : "关闭"}
        </label>
      </div>

      {!enabled && (
        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          开启后将检测你是否在座、转头或低头。画面仅在本地分析，<b>不上传、不录像、不保存</b>，
          不做人脸识别，可随时关闭；不开启不影响课程。
        </p>
      )}

      {enabled && (
        <div className="mt-2">
          <video
            ref={videoRef}
            muted
            playsInline
            className="w-full rounded-lg bg-black aspect-video object-cover"
          />
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <span>{STATUS_TEXT[status]}</span>
            <button onClick={onCorrect} className="text-mountain underline">
              看山你看错了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
