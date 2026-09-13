import type { SupervisorReaction } from "../agent/useSupervisor";

// 刘看山形象（1 天版用 emoji + 表情文案占位）
// ⚠️ TODO(A同学)：替换为正式 IP 素材，注意赛事授权边界（PRD 第十七章）
const FACE: Record<SupervisorReaction | "idle", string> = {
  idle: "🐻",
  none: "🐻",
  peek: "🐻👀",
  knock: "🐻✊",
  punch: "🥊",
};

export default function LiuKanshan({
  reaction,
  line,
}: {
  reaction: SupervisorReaction | "idle";
  line?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-6xl select-none">{FACE[reaction] ?? "🐻"}</div>
      <div className="mt-2 font-semibold text-mountain-dark">刘看山 · 督学官</div>
      {line && <div className="mt-1 text-sm text-gray-600 max-w-[220px]">{line}</div>}
    </div>
  );
}
