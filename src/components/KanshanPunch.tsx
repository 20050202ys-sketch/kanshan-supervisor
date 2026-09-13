import { useEffect, useState } from "react";

// 候选文案（PRD F11）
const LINES = [
  "检测到一名肉身在场、灵魂出走的学习者。",
  "这一拳只打断拖延。",
  "回来就好，这座山还没爬完。",
  "我没有生气，我只是在活动前爪。",
];

// 看山铁拳（PRD F11）：拳头放大 + 屏幕震动 + 卡通裂纹 + 幽默文案
// 约束：动画 ≤3 秒、可关闭、无真实暴力/受伤/血腥、无羞辱/威胁文案
export default function KanshanPunch({
  open,
  soundOn = true,
  onBack,
}: {
  open: boolean;
  soundOn?: boolean;
  onBack: () => void;
}) {
  const [line, setLine] = useState(LINES[0]);

  useEffect(() => {
    if (open) {
      setLine(LINES[Math.floor(Math.random() * LINES.length)]);
      // 轻量音效占位（可关闭）：用 Web Audio 蜂鸣，避免额外音频资源
      if (soundOn) beep();
    }
  }, [open, soundOn]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-shake">
      {/* 卡通裂纹 */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <svg width="100%" height="100%">
          <polyline
            points="50%,0 46%,30% 55%,45% 44%,60% 52%,100%"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          <polyline
            points="20%,20% 35%,35% 25%,55% 40%,75%"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative flex flex-col items-center text-center px-6">
        <div className="text-[120px] leading-none animate-punchIn select-none">🥊</div>
        <div className="mt-4 max-w-sm rounded-xl bg-white/95 px-5 py-3 text-mountain-dark font-medium shadow-lg">
          {line}
        </div>
        <button
          onClick={onBack}
          className="mt-5 rounded-full bg-mountain px-6 py-2 text-white font-semibold hover:bg-mountain-dark"
        >
          我回来了
        </button>
      </div>
    </div>
  );
}

function beep() {
  // 轻量音效，播放失败（无音频设备 / 未获得用户手势 / headless）时静默降级
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    // 需要用户手势后才能 resume；失败则直接放弃，不抛错到控制台
    const run = () => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 220;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => {
          try {
            osc.stop();
            ctx.close();
          } catch {
            /* ignore */
          }
        }, 180);
      } catch {
        /* ignore */
      }
    };
    if (ctx.state === "suspended") {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  } catch {
    /* ignore */
  }
}
