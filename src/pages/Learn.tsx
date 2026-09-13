import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import { CARDS, NODES, DEMO_FOCUS_NODE, PRACTICE } from "../data/content";
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

  // 动态补学（PRD F07）：未完全掌握时弹一道应用题
  const [showPractice, setShowPractice] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [practiceMsg, setPracticeMsg] = useState("");
  const practiceQuiz = useMemo(() => (PRACTICE[current] ?? [])[0] ?? null, [current]);

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

    if (r.next_action === "advance" || r.mastery === "mastered") {
      // 完全掌握：直接变绿推进
      applyMastery(node.id, r);
      setShowPractice(false);
      setLine("不错，这个营地你站稳了，可以往上爬了。");
    } else if (practiceQuiz) {
      // 未完全掌握且有应用题：弹补学题，答对后再变绿（不立刻推进）
      setShowPractice(true);
      setPicked(null);
      setPracticeMsg("");
      setLine("方向对了，还差一点。来做一道应用题巩固一下。");
    } else {
      // 没有配套题则退回原逻辑，按评估结果处理
      applyMastery(node.id, r);
      setLine("方向对了，还差一点，先记住缺的这块。");
    }
    setLoading(false);
  }

  // 提交补学题答案（PRD F07：同节点最多补学两次，两次仍未过标黄允许继续）
  function submitPractice() {
    if (picked === null || !practiceQuiz || !result) return;
    if (picked === practiceQuiz.answerIndex) {
      applyMastery(node.id, { ...result, mastery: "mastered", next_action: "advance" });
      setPracticeMsg("答对了！这个知识点标记为已掌握 ✅");
      setLine("漂亮，这下真的懂了，节点变绿，继续爬。");
      setShowPractice(false);
    } else {
      incAttempt();
      if (attempts + 1 >= 2) {
        // 两次仍未过：标黄允许继续，不卡死（PRD F07）
        applyMastery(node.id, { ...result, mastery: "partial", next_action: "practice" });
        setPracticeMsg("这道也没答对，先标为待巩固，允许继续，之后再回来看看。");
        setLine("没关系，先记成待巩固，别卡在这，我们往下走。");
        setShowPractice(false);
      } else {
        setPracticeMsg("再想想，回到左边知识卡看看，再选一次。");
        setLine("差一点，回去看看知识卡再选。");
      }
    }
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

        {/* 动态补学题（PRD F07）：未完全掌握时出现，答对才变绿 */}
        {showPractice && practiceQuiz && (
          <div className="mt-4 rounded-xl border-2 border-mountain bg-white p-4">
            <div className="text-sm font-semibold text-mountain-dark">
              📝 补学应用题
            </div>
            <p className="mt-2 text-sm text-gray-800">{practiceQuiz.question}</p>
            <div className="mt-3 space-y-2">
              {practiceQuiz.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm
                    ${picked === i ? "border-mountain bg-mountain-light" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name="practice"
                    checked={picked === i}
                    onChange={() => setPicked(i)}
                  />
                  {opt}
                </label>
              ))}
            </div>
            <button
              onClick={submitPractice}
              disabled={picked === null}
              className="mt-3 rounded-full bg-mountain px-6 py-2 text-sm font-semibold text-white hover:bg-mountain-dark disabled:opacity-50"
            >
              提交答案
            </button>
            {practiceMsg && (
              <div className="mt-2 text-sm text-mountain-dark">{practiceMsg}</div>
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
