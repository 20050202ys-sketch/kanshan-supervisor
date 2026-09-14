import { useEffect, useMemo } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";

const LINES = [
  "检测到你暂时离开了学习状态。",
  "这一拳只打断拖延。",
  "回来就好，这座山还没爬完。",
];

const VIDEO_SRC = `${import.meta.env.BASE_URL}assets/kanshan/punch-greenscreen.mp4`;

export default function KanshanPunch({ open, onBack }: { open: boolean; onBack: () => void }) {
  const line = useMemo(() => LINES[Math.floor(Math.random() * LINES.length)], [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onBack]);

  if (!open) return null;

  return (
    <div className="punch-overlay" role="dialog" aria-modal="true" aria-label="刘看山专注提醒">
      <div className="punch-overlay__wash" aria-hidden="true" />
      <div className="punch-overlay__content">
        <ChromaKeyVideo src={VIDEO_SRC} active={open} onEnded={onBack} />
        <div className="punch-overlay__message">
          <strong>看山提醒你回到学习</strong>
          <span>{line}</span>
        </div>
        <button type="button" className="button button--primary" onClick={onBack} autoFocus>我回来了</button>
        <span className="punch-overlay__hint">动画播放完后自动返回 · Esc 可关闭</span>
      </div>
    </div>
  );
}
