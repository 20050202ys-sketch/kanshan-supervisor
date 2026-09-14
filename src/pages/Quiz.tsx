import { useState } from "react";
import { QUIZ } from "../data/content";
import LiuKanshan from "../components/LiuKanshan";

// 摸底页（PRD 9.2 / F02）：3 道基础题，做完生成初始知识地图，可跳过走零基础路线
export default function Quiz({
  onDone,
}: {
  onDone: (correctCount: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const q = QUIZ[idx];
  const isLast = idx === QUIZ.length - 1;

  function next() {
    if (picked === null) return;
    const gotIt = picked === q.answerIndex;
    const newCorrect = correct + (gotIt ? 1 : 0);
    setCorrect(newCorrect);
    if (isLast) {
      onDone(newCorrect);
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6">
      <LiuKanshan reaction="idle" line="先做 3 道小题，我好帮你定制学习地图。答错也没关系，只是摸个底。" />

      <div className="mt-6 w-full rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold text-mountain">
          摸底 {idx + 1} / {QUIZ.length}
        </div>
        <h2 className="mt-2 text-lg font-bold text-gray-900">{q.question}</h2>

        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm
                ${picked === i ? "border-mountain bg-mountain-light" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name={`quiz-${idx}`}
                checked={picked === i}
                onChange={() => setPicked(i)}
              />
              {opt}
            </label>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={next}
            disabled={picked === null}
            className="rounded-full bg-mountain px-6 py-2 font-semibold text-white hover:bg-mountain-dark disabled:opacity-50"
          >
            {isLast ? "生成我的知识地图" : "下一题"}
          </button>
          <button
            onClick={() => onDone(0)}
            className="text-sm text-gray-500 underline"
          >
            跳过摸底（按零基础开始）
          </button>
        </div>
      </div>
    </div>
  );
}
