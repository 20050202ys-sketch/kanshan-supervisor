import { useStore } from "../store/useStore";
import { NODES } from "../data/content";
import KnowledgeMap from "../components/KnowledgeMap";
import LiuKanshan from "../components/LiuKanshan";
import type { Page } from "../App";
import SiteHeader from "../components/SiteHeader";

// 结课页（PRD 9.5 / F13，P1）：1 天版做精简总结，不含分享卡
export default function Finish({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const mastery = useStore((s) => s.mastery_map);
  const reset = useStore((s) => s.reset);

  const green = NODES.filter((n) => mastery[n.id] === "green");
  const yellow = NODES.filter((n) => mastery[n.id] === "yellow");

  return (
    <main className="page page--finish">
      <div className="page-wrap">
      <SiteHeader current="my-learning" onNavigate={onNavigate} />
      <div className="finish-grid">
      <section className="panel finish-report">
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
            onClick={() => onNavigate("my-learning")}
            className="button button--primary"
          >
            返回首页
          </button>
          <button
            onClick={() => {
              reset();
              onNavigate("home");
            }}
            className="button button--outline"
          >
            清空进度重新开始
          </button>
        </div>
      </section>

      <section className="panel finish-companion">
        <LiuKanshan reaction="idle" />
        <div className="mt-4">
          <KnowledgeMap />
        </div>
      </section>
      </div>
      </div>
    </main>
  );
}
