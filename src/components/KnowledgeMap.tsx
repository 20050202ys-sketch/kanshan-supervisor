import { useStore } from "../store/useStore";
import { NODES } from "../data/content";
import type { NodeStatus } from "../types";

const COLOR: Record<NodeStatus, string> = {
  locked: "bg-node-gray/40 text-gray-400",
  gray: "bg-node-gray text-gray-700",
  yellow: "bg-node-yellow text-yellow-900",
  green: "bg-node-green text-white",
};

const LABEL: Record<NodeStatus, string> = {
  locked: "未解锁",
  gray: "待学习",
  yellow: "待巩固",
  green: "已掌握",
};

// 知识地图（PRD F12 / 5.2）：六节点登山路线，按状态变色
export default function KnowledgeMap({ onPick }: { onPick?: (id: string) => void }) {
  const mastery = useStore((s) => s.mastery_map);
  const current = useStore((s) => s.current_node);

  return (
    <div className="space-y-2">
      <div className="font-semibold text-mountain-dark mb-1">🏔️ 知识地图</div>
      {NODES.map((n) => {
        const st = mastery[n.id] ?? "locked";
        const isCurrent = n.id === current;
        return (
          <button
            key={n.id}
            disabled={st === "locked"}
            onClick={() => onPick?.(n.id)}
            className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition
              ${COLOR[st]} ${isCurrent ? "ring-2 ring-mountain" : ""}
              ${st === "locked" ? "cursor-not-allowed" : "hover:opacity-90"}`}
          >
            <span className="w-5 shrink-0 text-center">{n.order}</span>
            <span className="flex-1">{n.title}</span>
            <span className="text-xs opacity-80">{LABEL[st]}</span>
          </button>
        );
      })}
    </div>
  );
}
