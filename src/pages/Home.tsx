import LiuKanshan from "../components/LiuKanshan";
import { NODES } from "../data/content";

const COURSE_DAYS = [
  { day: "DAY 01", title: "看懂模型", note: "建立 AI 产品视角", nodes: NODES.slice(0, 2) },
  { day: "DAY 02", title: "设计方案", note: "从 Prompt 到 Agent", nodes: NODES.slice(2, 4) },
  { day: "DAY 03", title: "判断落地", note: "用数据验证价值", nodes: NODES.slice(4, 6) },
] as const;

// 首页（PRD 9.1 / F01）：未登录即可开始。
export default function Home({ onStart }: { onStart: () => void }) {
  return (
    <main className="home-shell min-h-screen overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-5 sm:px-8 sm:pt-7 lg:px-10">
        <header className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-mountain text-sm font-black text-white">
              山
            </div>
            <div>
              <div className="text-sm font-black tracking-[0.14em] text-ink">看山督学局</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45">
                Kanshan Study Office
              </div>
            </div>
          </div>
          <div className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink/60 backdrop-blur">
            知乎黑客松 2026
          </div>
        </header>

        <section className="grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-20 lg:pt-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border-l-2 border-blue pl-3 text-xs font-bold tracking-[0.16em] text-ink/55">
              3 天入门 AI 产品经理 · 每天 15 分钟
            </div>
            <h1 className="home-title max-w-3xl text-[3.15rem] font-black leading-[1.04] tracking-[-0.055em] text-ink sm:text-6xl lg:text-7xl">
              别只看懂，
              <br />
              <span className="relative inline-block text-mountain">
                讲给看山听。
                <span className="title-underline" aria-hidden="true" />
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-ink/65 sm:text-lg">
              读知乎精选、用自己的话讲出来，再让刘看山追问你。
              从“我看过”到“我真会了”，每一步都留在你的知识地图上。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onStart}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink px-7 py-3.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(25,39,34,0.18)] transition hover:-translate-y-0.5 hover:bg-mountain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mountain"
              >
                开始第一次爬山
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </button>
              <a
                href="#route"
                className="inline-flex min-h-11 items-center justify-center px-5 text-sm font-bold text-ink/55 underline decoration-ink/20 underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mountain"
              >
                先看三天学习路线
              </a>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink/48" aria-label="体验说明">
              <li>✓ 无需登录</li>
              <li>✓ 摄像头默认关闭</li>
              <li>✓ 画面仅在本地处理</li>
            </ul>
          </div>

          <aside className="mascot-stage relative mx-auto w-full max-w-md" aria-label="刘看山督学官">
            <div className="absolute -left-5 top-12 h-24 w-24 rounded-full bg-blue/10 blur-2xl" aria-hidden="true" />
            <div className="absolute -right-6 bottom-8 h-32 w-32 rounded-full bg-node-yellow/20 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white/80 p-5 shadow-[0_24px_70px_rgba(30,68,57,0.12)] backdrop-blur sm:p-7">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                <span>督学值班室</span>
                <span className="flex items-center gap-1.5 text-mountain">
                  <i className="h-2 w-2 rounded-full bg-node-green" /> 在线
                </span>
              </div>
              <div className="mascot-window mt-5 grid min-h-56 place-items-center rounded-[1.4rem] border border-mountain/10 bg-mountain-light/70 px-5">
                <LiuKanshan reaction="idle" line="今天不查你背了多少，只查你能不能讲明白。" />
              </div>
              <div className="mt-5 grid grid-cols-3 divide-x divide-ink/10 text-center">
                <Stat value="3" label="天路线" />
                <Stat value="6" label="核心节点" />
                <Stat value="1" label="张知识地图" />
              </div>
            </div>
            <div className="supervisor-stamp absolute -bottom-5 -right-2 grid h-24 w-24 place-items-center rounded-full border-2 border-blue/55 bg-paper text-center text-xs font-black leading-4 text-blue shadow-sm" aria-hidden="true">
              看山<br />已阅
            </div>
          </aside>
        </section>

        <section id="route" className="border-t border-ink/10 pb-6 pt-8 sm:pt-10">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue">三日登山路线</div>
              <h2 className="home-title mt-2 text-2xl font-black text-ink sm:text-3xl">每天学两个，学完讲一次。</h2>
            </div>
            <p className="text-sm text-ink/45">通过复述验证掌握度，学不稳就动态补学</p>
          </div>

          <ol className="route-grid grid gap-px overflow-hidden rounded-[1.5rem] border border-ink/10 bg-ink/10 lg:grid-cols-3">
            {COURSE_DAYS.map((item, dayIndex) => (
              <li key={item.day} className="group bg-white/80 p-5 transition-colors hover:bg-white sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[11px] font-bold tracking-[0.16em] text-blue">{item.day}</div>
                    <h3 className="mt-2 text-xl font-black text-ink">{item.title}</h3>
                    <p className="mt-1 text-xs text-ink/45">{item.note}</p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 text-xs font-black text-ink/45 transition group-hover:border-mountain group-hover:bg-mountain group-hover:text-white">
                    {dayIndex + 1}
                  </span>
                </div>
                <ul className="mt-5 space-y-3">
                  {item.nodes.map((node) => (
                    <li key={node.id} className="flex items-start gap-3 text-sm leading-6 text-ink/70">
                      <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-node-yellow" aria-hidden="true" />
                      {node.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl font-black text-ink">{value}</div>
      <div className="mt-1 text-[11px] text-ink/45">{label}</div>
    </div>
  );
}
