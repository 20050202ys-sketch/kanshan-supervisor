import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";

const LINES = [
  "检测到你暂时离开了学习状态。",
  "这一拳只打断拖延。",
  "回来就好，这座山还没爬完。",
];

const ASSET_ROOT = `${import.meta.env.BASE_URL}assets/kanshan`;
const VIDEO_SRC = `${ASSET_ROOT}/punch-transparent.webm`;
const LAUNCH_SRC = `${ASSET_ROOT}/studying.gif`;
const LAUNCH_MS = 680;
const RETURN_MS = 420;

type Phase = "launch" | "impact" | "return";
type OriginStyle = CSSProperties & {
  "--origin-x": string;
  "--origin-y": string;
  "--origin-scale": string;
};

export default function KanshanPunch({
  open,
  originRef,
  onBack,
}: {
  open: boolean;
  originRef: { current: HTMLElement | null };
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("launch");
  const [ready, setReady] = useState(false);
  const [needsPlayback, setNeedsPlayback] = useState(false);
  const [originStyle, setOriginStyle] = useState<OriginStyle>({
    "--origin-x": "38vw",
    "--origin-y": "18vh",
    "--origin-scale": "0.45",
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const returnTimerRef = useRef<number | null>(null);
  const line = useMemo(() => LINES[Math.floor(Math.random() * LINES.length)], [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const originElement = originRef.current?.querySelector("img") ?? originRef.current;
    const rect = originElement?.getBoundingClientRect();
    const targetSize = Math.min(520, window.innerWidth * 0.7, window.innerHeight * 0.72);
    const sourceX = rect ? rect.left + rect.width / 2 : window.innerWidth * 0.82;
    const sourceY = rect ? rect.top + rect.height / 2 : window.innerHeight * 0.45;
    const sourceSize = rect ? Math.min(rect.width, rect.height) : targetSize * 0.42;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setOriginStyle({
      "--origin-x": `${sourceX - window.innerWidth / 2}px`,
      "--origin-y": `${sourceY - window.innerHeight / 2}px`,
      "--origin-scale": `${Math.max(0.28, Math.min(0.72, sourceSize / targetSize))}`,
    });
    setNeedsPlayback(false);
    setPhase(reducedMotion ? "impact" : "launch");
    setReady(true);

    if (reducedMotion) return;
    const launchTimer = window.setTimeout(() => setPhase("impact"), LAUNCH_MS);
    return () => window.clearTimeout(launchTimer);
  }, [open, originRef]);

  useEffect(() => {
    if (!open || phase !== "impact") return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.volume = 1;
    video.play().then(() => setNeedsPlayback(false)).catch(() => setNeedsPlayback(true));
  }, [open, phase]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (returnTimerRef.current) window.clearTimeout(returnTimerRef.current);
    };
  }, [open, onBack]);

  function finishImpact() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onBack();
      return;
    }
    setPhase("return");
    returnTimerRef.current = window.setTimeout(onBack, RETURN_MS);
  }

  function resumePlayback() {
    videoRef.current?.play().then(() => setNeedsPlayback(false)).catch(() => setNeedsPlayback(true));
  }

  if (!open) return null;

  return (
    <div
      className={`punch-overlay punch-overlay--${phase} ${ready ? "is-ready" : ""}`}
      style={originStyle}
      role="dialog"
      aria-modal="true"
      aria-label="刘看山专注提醒"
    >
      <div className="punch-overlay__wash" aria-hidden="true" />
      <div className="punch-overlay__impact" aria-hidden="true" />
      <img className="punch-overlay__traveler" src={LAUNCH_SRC} alt="" draggable={false} />
      <div className="punch-overlay__content">
        {phase === "impact" && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            playsInline
            preload="auto"
            onEnded={finishImpact}
            className="punch-video"
            aria-label="刘看山冲拳提醒动画"
          />
        )}
        <div className="punch-overlay__message">
          <strong>看山提醒你回到学习</strong>
          <span>{line}</span>
        </div>
        {needsPlayback ? (
          <button type="button" className="button button--primary" onClick={resumePlayback} autoFocus>播放提醒</button>
        ) : (
          <button type="button" className="button button--primary" onClick={onBack} autoFocus>我回来了</button>
        )}
        <span className="punch-overlay__hint">动画播放完后自动返回 · Esc 可关闭</span>
      </div>
    </div>
  );
}
