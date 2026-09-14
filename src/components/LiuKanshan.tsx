import type { SupervisorReaction } from "../agent/useSupervisor";

const ASSET_ROOT = `${import.meta.env.BASE_URL}assets/kanshan`;

const MOTION: Record<SupervisorReaction | "idle", string> = {
  idle: `${ASSET_ROOT}/idle.gif`,
  none: `${ASSET_ROOT}/studying.gif`,
  peek: `${ASSET_ROOT}/greeting.gif`,
  knock: `${ASSET_ROOT}/wander.gif`,
  punch: `${ASSET_ROOT}/studying.gif`,
};

export default function LiuKanshan({
  reaction,
  line,
  className = "",
  showTitle = true,
}: {
  reaction: SupervisorReaction | "idle";
  line?: string;
  className?: string;
  showTitle?: boolean;
}) {
  const label = reaction === "none" || reaction === "idle" ? "刘看山正在陪你学习" : "刘看山提醒你回到学习";

  return (
    <div className={`kanshan-character ${className}`}>
      <img src={MOTION[reaction] ?? MOTION.idle} alt={label} className="kanshan-character__image" draggable={false} />
      {showTitle && <div className="kanshan-character__title">刘看山 · 督学官</div>}
      {line && <p className="kanshan-character__line" aria-live="polite">{line}</p>}
    </div>
  );
}
