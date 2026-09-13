import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import { CARDS, NODES, DEMO_FOCUS_NODE } from "../data/content";
import { evaluate } from "../agent/evaluate";
import { useSupervisor } from "../agent/useSupervisor";
import type { MasteryResult } from "../types";
import KnowledgeMap from "../components/KnowledgeMap";
import LiuKanshan from "../components/LiuKanshan";
import CameraPanel from "../components/CameraPanel";
import KanshanPunch from "../components/KanshanPunch";

// 学习页（PRD 9.4）：左知识卡 / 中回答与反馈 / 右刘看山、摄像头、进度
export default function Learn({ onFinish }: { onFinish: () => void }) {
  const current = useStore((s) => s.current_node);
  const cameraMode = useStore((s) => s.camera_mode);
  const setCameraMode = useStore((s) => s.setCameraMode);
  const setCurrentNode = useStore((s) => s.setCurrentNode);
  const applyMastery = useStore((s) => s.applyMastery);
  const attempts = useStore((s) => s.current_task_attempts);
  const incAttempt = useStore((s) => s.incAttempt);

  const node = useMemo(() => NODES.find((n) => n.id === current) ?? NODES[0], [current]);
  const card = useMemo(
    () => CARDS.find((c) => c.nodeId === current) ?? CARDS[0],
    [current]
  );

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MasteryResult | null>(null);
  const [line, setLine] = useState("先读左边的知识卡，然后用你自己的话讲给我听。");

  const sup = useSupervisor();

  async function submit() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setLine("嗯，我在听……");
    incAttempt();
    const r = await evaluate({
      nodeTitle: node.title,
      cardSnippet: card?.snippet ?? "",
      userAnswer: answer,
      attempt: attempts + 1,
    });
    setResult(r);
    applyMastery(node.id, r);
    setLine(
      r.next_action === "advance"
        ? "不错，这个营地你站稳了，可以往上爬了。"
        : "方向对了，还差一点，我给你补一道题。"
    );
    setLoading(false);
  }

  function handleCameraEvent(e: Parameters<typeof sup.onCameraEvent>[0]) {
    sup.onCameraEvent(e);
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_1.4fr_0.9fr]">
      {/* 左：知识卡 */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-mountain">
          知乎知识卡
        </div>
        <h2 className="text-lg font-bold text-gray-900">{card?.title}</h2>
        <div className="mt-1 text-xs text-gray-400">作者：{card?.author}</div>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{card?.snippet}</p>
        {card?.aiSummary && (
          <div className="mt-3 rounded-lg bg-mountain-light p-3 text-sm text-mountain-dark">
            <span className="mr-1 font-semibold">AI 划重点</span>
            {card.aiSummary}
          </div>
        )}
        <a
          href={card?.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm text-mountain underline"
        >
          阅读知乎原文 →
        </a>
        <div className="mt-3 border-t pt-2">
          <KnowledgeMap onPick={(id) => setCurrentNode(id)} />
        </div>
      </section>

      {/* 中：任务 + 回答 + 反馈 */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-mountain">
          当前任务 · {node.title}
        </div>
        <h2 className="mt-1 text-lg font-bold text-gray-900">
          用你自己的话，向刘看山解释这个知识点
        </h2>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="不要照抄原文，用自己的话说，最好举个例子…"
          className="mt-3 h-40 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-mountain"
        />

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-full bg-mountain px-6 py-2 font-semibold text-white hover:bg-mountain-dark disabled:opacity-50"
          >
            {loading ? "评估中…" : "讲给刘看山听"}
          </button>
          <button onClick={onFinish} className="text-sm text-gray-500 underline">
            查看结课报告
          </button>
        </div>

        {result && (
          <div className="mt-4 rounded-xl border border-mountain-light bg-mountain-light/50 p-4">
            <div className="text-sm font-semibold text-mountain-dark">
              掌握度：
              {result.mastery === "mastered"
                ? "已掌握 ✅"
                : result.mastery === "partial"
                ? "待巩固 🟡"
                : "未掌握 🔁"}
            </div>
            {result.understood_points.length > 0 && (
              <div className="mt-2 text-sm text-gray-700">
                <b>你已掌握：</b>
                {result.understood_points.join("；")}
              </div>
            )}
            {result.missing_points.length > 0 && (
              <div className="mt-1 text-sm text-gray-700">
                <b>还需补充：</b>
                {result.missing_points.join("；")}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 右：刘看山 + 摄像头 + 进度 */}
      <section className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <LiuKanshan reaction={sup.reaction} line={line} />
        </div>

        <CameraPanel
          enabled={cameraMode}
          onToggle={setCameraMode}
          onEvent={handleCameraEvent}
          onCorrect={sup.correctMisjudge}
        />

        {/* 演示模式：手动触发铁拳的保命后路（PRD 第十七章） */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 text-xs font-semibold text-gray-400">演示模式</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={sup.forcePunch}
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm text-white hover:bg-orange-600"
            >
              触发看山铁拳
            </button>
            <button
              onClick={() => setCurrentNode(DEMO_FOCUS_NODE)}
              className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300"
            >
              跳到演示知识点
            </button>
          </div>
        </div>
      </section>

      <KanshanPunch open={sup.reaction === "punch"} onBack={sup.dismiss} />
    </div>
  );
}
