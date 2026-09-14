import { useMemo, useRef, useState } from "react";
import type { Page } from "../App";
import { evaluate } from "../agent/evaluate";
import { useSupervisor } from "../agent/useSupervisor";
import CameraPanel from "../components/CameraPanel";
import Icon from "../components/Icon";
import KanshanPunch from "../components/KanshanPunch";
import LiuKanshan from "../components/LiuKanshan";
import { CARDS, DEMO_FOCUS_NODE, NODES } from "../data/content";
import { useStore } from "../store/useStore";
import type { MasteryResult } from "../types";

export default function Learn({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const current = useStore((state) => state.current_node);
  const cameraMode = useStore((state) => state.camera_mode);
  const setCameraMode = useStore((state) => state.setCameraMode);
  const setCurrentNode = useStore((state) => state.setCurrentNode);
  const applyMastery = useStore((state) => state.applyMastery);
  const attempts = useStore((state) => state.current_task_attempts);
  const incAttempt = useStore((state) => state.incAttempt);
  const mastery = useStore((state) => state.mastery_map);

  const node = useMemo(() => NODES.find((item) => item.id === current) ?? NODES[0], [current]);
  const card = useMemo(() => CARDS.find((item) => item.nodeId === current) ?? CARDS[0], [current]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MasteryResult | null>(null);
  const [line, setLine] = useState("我会陪你学，不会上传你的画面。");
  const [question, setQuestion] = useState("");
  const [assistantReply, setAssistantReply] = useState("大语言模型擅长处理语言模式，但事实与计算结果需要额外验证。");
  const supervisorOriginRef = useRef<HTMLDivElement>(null);
  const supervisor = useSupervisor();

  const learnedCount = Object.values(mastery).filter((status) => status === "green").length;
  const currentIndex = NODES.findIndex((item) => item.id === current);

  async function submit() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setLine("嗯，我在听……");
    incAttempt();
    const nextResult = await evaluate({ nodeTitle: node.title, cardSnippet: card?.snippet ?? "", userAnswer: answer, attempt: attempts + 1 });
    setResult(nextResult);
    applyMastery(node.id, nextResult);
    setLine(nextResult.next_action === "advance" ? "不错，你已经能用自己的话讲明白了。" : "方向对了，再补一个具体例子会更清楚。");
    setLoading(false);
  }

  function askAssistant() {
    if (!question.trim()) return;
    setAssistantReply("可以先说你的判断，再举一个具体场景。如果还有不确定的地方，我会继续追问。");
    setQuestion("");
  }

  return (
    <main className="learn-page">
      <header className="learn-header">
        <button type="button" className="brand" onClick={() => onNavigate("home")}>看山督学局</button>
        <div><b>AI 产品经理入门</b><span>/</span><span>第 {currentIndex + 1} 课</span></div>
        <div><button type="button" onClick={() => onNavigate("course")}><Icon name="book" />课程目录</button><button type="button" onClick={() => onNavigate("my-learning")}>退出学习</button></div>
      </header>

      <div className="learn-grid">
        <aside className="learn-outline panel">
          <h2>AI 产品经理入门</h2>
          <div className="progress-line"><span>学习进度 <b>{Math.max(learnedCount, 1)}/6</b></span><i><b style={{ width: `${Math.max(learnedCount, 1) / 6 * 100}%` }} /></i></div>
          <ol>
            {NODES.map((item, index) => {
              const status = mastery[item.id];
              return <li key={item.id} className={item.id === current ? "is-current" : status === "green" ? "is-done" : status === "locked" ? "is-locked" : ""}>
                <button type="button" disabled={status === "locked"} onClick={() => { setCurrentNode(item.id); setResult(null); setAnswer(""); supervisor.resetForNewTask(); }}>
                  <span>{status === "green" ? <Icon name="check" /> : index + 1}</span><span><b>第 {index + 1} 课</b><small>{item.title}</small></span>{status === "locked" && <Icon name="lock" />}
                </button>
              </li>;
            })}
          </ol>
          <button type="button" className="demo-link" onClick={() => setCurrentNode(DEMO_FOCUS_NODE)}>跳到演示知识点</button>
        </aside>

        <section className="lesson-canvas panel">
          <span className="section-label">第 {currentIndex + 1} 课</span>
          <h1>{node.title}</h1>
          <p className="lesson-canvas__intro">先读知识卡，再用自己的话讲给刘看山听。</p>
          <article className="knowledge-card">
            <div><span>知乎精选知识卡</span><h2>{card?.title}</h2><small>作者：{card?.author}</small></div>
            <p>{card?.snippet}</p>
            {card?.aiSummary && <div className="ai-highlight"><Icon name="brain" /><span><b>AI 划重点</b>{card.aiSummary}</span></div>}
            <a href={card?.sourceUrl} target="_blank" rel="noreferrer">阅读知乎原文 ↗</a>
          </article>
          <div className="explain-task">
            <h2>现在，讲给看山听</h2>
            <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="不要照抄原文，用自己的话说，最好举个例子…" />
            <div><button type="button" className="button button--outline" onClick={() => onNavigate("course")}>上一页</button><button type="button" className="button button--primary" onClick={submit} disabled={!answer.trim() || loading}>{loading ? "评估中…" : "讲给刘看山听"}<Icon name="arrow" /></button></div>
          </div>
          {result && <div className="result-card" aria-live="polite"><strong>{result.mastery === "mastered" ? "已掌握" : result.mastery === "partial" ? "待巩固" : "需要再学一次"}</strong><p>{result.understood_points.join("；")}</p>{result.missing_points.length > 0 && <p>再补充：{result.missing_points.join("；")}</p>}<button type="button" onClick={() => onNavigate("finish")}>查看学习报告 →</button></div>}
        </section>

        <aside className="learn-tools">
          <section className="assistant-card panel">
            <div className="tool-title"><span className="icon-tile"><Icon name="message" /></span><h2>问问 AI 助教</h2></div>
            <div className="assistant-message">{assistantReply}</div>
            <label className="assistant-input"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") askAssistant(); }} placeholder="输入你不懂的问题" /><button type="button" onClick={askAssistant} aria-label="发送问题"><Icon name="send" /></button></label>
          </section>

          <section className={`supervisor-live panel ${supervisor.reaction === "punch" ? "is-launching" : ""}`}>
            <div className="tool-title"><span className="icon-tile"><Icon name="focus" /></span><div><h2>{cameraMode ? "专注模式进行中" : "刘看山正在陪学"}</h2><span className="live-dot"><i />{cameraMode ? "本地检测中" : "普通陪学模式"}</span></div></div>
            <div ref={supervisorOriginRef} className="supervisor-launchpad">
              <LiuKanshan reaction={supervisor.reaction} line={line} showTitle={false} />
            </div>
          </section>

          <CameraPanel enabled={cameraMode} onToggle={setCameraMode} onEvent={supervisor.onCameraEvent} onCorrect={supervisor.correctMisjudge} />
        </aside>
      </div>

      <KanshanPunch open={supervisor.reaction === "punch"} originRef={supervisorOriginRef} onBack={supervisor.dismiss} />
    </main>
  );
}
