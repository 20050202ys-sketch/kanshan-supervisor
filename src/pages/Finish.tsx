import { useStore } from "../store/useStore";
import { NODES } from "../data/content";
import KnowledgeMap from "../components/KnowledgeMap";
import LiuKanshan from "../components/LiuKanshan";

// 结课页（PRD 9.5 / F13，P1）：1 天版做精简总结，不含分享卡
export default function Finish({ onRestart }: { onRestart: () => void }) {
  const mastery = useStore((s) => s.mastery_map);
  const reset = useStore((s) => s.reset);

  const green = NODES.filter((n) => mastery[n.id] === "green");
  const yellow = NODES.filter((n) => mastery[n.id] === "yellow");

  return (
    <div className="mx-auto grid min-h-screen max-w-4xl grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-mountain-dark">结课报告</h1>
        <p className="mt-1 text-sm text-gray-500">刘看山陪你爬完了这段山路</p>

        <div className="mt-4">
          <div className="text-sm font-semibold text-gray-700">已掌握（{green.length}）</div>
          <div className="mt-1 text-sm text-gray-600">
            {green.length ? green.map((n) => n.title).join("、") : "继续加油，还没有绿色节点"}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-sm font-semibold text-gray-700">待巩固（{yellow.length}）</div>
          <div className="mt-1 text-sm text-gray-600">
            {yellow.length ? yellow.map((n) => n.title).join("、") : "暂无"}
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-mountain-light p-4 text-sm text-mountain-dark">
          刘看山说：能坚持把知识讲出来、被追问还不跑，你已经比“只收藏不学”的人强很多了。
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onRestart}
            className="rounded-full bg-mountain px-6 py-2 font-semibold text-white hover:bg-mountain-dark"
          >
            返回首页
          </button>
          <button
            onClick={() => {
              reset();
              onRestart();
            }}
            className="rounded-full border border-gray-300 px-6 py-2 text-gray-600 hover:bg-gray-50"
          >
            清空进度重新开始
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <LiuKanshan reaction="idle" />
        <div className="mt-4">
          <KnowledgeMap />
        </div>
      </section>
    </div>
  );
}
