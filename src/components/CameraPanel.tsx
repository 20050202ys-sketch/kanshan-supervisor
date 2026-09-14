import { useEffect, useRef, useState } from "react";
import { DistractionDetector, type AttentionState, type DetectStatus } from "../camera/detector";
import type { CameraEvent } from "../types";
import Icon from "./Icon";

const STATUS_TEXT: Record<DetectStatus, string> = {
  idle: "摄像头已关闭",
  starting: "正在加载本地检测…",
  running: "专注模式进行中",
  denied: "未获得摄像头权限",
  error: "本地检测暂时不可用",
};

const ATTENTION_TEXT: Record<AttentionState, string> = {
  focused: "状态正常",
  face_absent: "暂未检测到你",
  head_turn: "你似乎看向了别处",
  head_down: "你似乎低头了",
};

export default function CameraPanel({
  enabled,
  onToggle,
  onEvent,
  onCorrect,
}: {
  enabled: boolean;
  onToggle: (on: boolean) => void;
  onEvent: (event: CameraEvent) => void;
  onCorrect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<DistractionDetector | null>(null);
  const [status, setStatus] = useState<DetectStatus>("idle");
  const [attention, setAttention] = useState<AttentionState>("focused");

  useEffect(() => {
    if (!enabled || !videoRef.current) {
      setStatus("idle");
      setAttention("focused");
      return;
    }

    const detector = new DistractionDetector({
      video: videoRef.current,
      onEvent,
      onStatus: setStatus,
      onAttention: setAttention,
    });
    detectorRef.current = detector;
    detector.start().then((ok) => {
      if (!ok) onToggle(false);
    });
    return () => detector.stop();
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const isWarning = attention !== "focused" && status === "running";

  return (
    <section className="focus-panel" aria-label="刘看山专注检测">
      <div className="focus-panel__head">
        <div className="focus-panel__title">
          <span className="icon-tile"><Icon name="focus" /></span>
          <div>
            <strong>{enabled ? "专注模式" : "开启专注陪学"}</strong>
            <span>{STATUS_TEXT[status]}</span>
          </div>
        </div>
        <label className="switch">
          <input type="checkbox" checked={enabled} onChange={(event) => onToggle(event.target.checked)} />
          <span aria-hidden="true" />
          <b>{enabled ? "开启" : "关闭"}</b>
        </label>
      </div>

      {!enabled ? (
        <p className="focus-panel__privacy">
          开启后只在浏览器本地判断是否离席、转头或低头。
          <strong>不上传、不录像、不保存</strong>，不开启也可以正常学习。
        </p>
      ) : (
        <div className="focus-panel__camera">
          <div className="camera-preview">
            <video ref={videoRef} muted playsInline />
            <span className={`camera-status ${isWarning ? "is-warning" : ""}`}>
              <i />{status === "running" ? ATTENTION_TEXT[attention] : STATUS_TEXT[status]}
            </span>
          </div>
          <div className="focus-panel__foot">
            <span><Icon name="camera" />画面仅在本地分析</span>
            <button type="button" onClick={onCorrect}>看山你看错了</button>
          </div>
        </div>
      )}
    </section>
  );
}
