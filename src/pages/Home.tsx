import LiuKanshan from "../components/LiuKanshan";
import { NODES } from "../data/content";

// 首页（PRD 9.1 / F01）
export default function Home({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <LiuKanshan reaction="idle" />
      <h1 className="mt-6 text-3xl font-bold text-mountain-dark">看山督学局</h1>
      <p className="mt-2 text-lg text-gray-700">3 天入门 AI 产品经理，每天约 15 分钟</p>
      <p className="mt-1 text-sm text-gray-500">
        刘看山陪你从「看过」走向「学会」——读知乎精选、讲给他听、被他追问、拿到反馈。
      </p>

      <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {NODES.map((n) => (
          <div
            key={n.id}
            className="rounded-lg border border-mountain-light bg-white px-3 py-3 text-sm text-gray-700"
          >
            <span className="mr-1 font-semibold text-mountain">{n.order}</span>
            {n.title}
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="mt-10 rounded-full bg-mountain px-10 py-3 text-lg font-semibold text-white shadow hover:bg-mountain-dark"
      >
        开始学习
      </button>
      <p className="mt-3 text-xs text-gray-400">未登录也可体验 · 摄像头默认关闭</p>
    </div>
  );
}
