import type { Page } from "../App";
import Icon from "../components/Icon";
import LiuKanshan from "../components/LiuKanshan";
import SiteHeader from "../components/SiteHeader";

export default function MyLearning({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <main className="page page--my-learning">
      <div className="page-wrap">
        <SiteHeader current="my-learning" onNavigate={onNavigate} />
        <section className="learning-hero">
          <div><p>下午好，继续保持</p><h1>今天学一点，离完成又近一步。</h1></div>
          <aside>
            <LiuKanshan reaction="peek" showTitle={false} />
            <div><h2>看山今日陪学</h2><p>准备好就开始吧</p><button type="button" className="button button--outline" onClick={() => onNavigate("learn")}>进入专注模式 <Icon name="arrow" /></button></div>
          </aside>
        </section>

        <section className="learning-dashboard">
          <article className="panel learning-main">
            <h2>继续学习</h2>
            <div className="active-course">
              <div className="course-mark"><span>AI</span></div>
              <div><h3>AI 产品经理入门</h3><p>第 2 课　用户需求与痛点</p><div className="progress-line"><span>已学习 <b>2/6</b></span><i><b style={{ width: "33%" }} /></i></div><small><Icon name="clock" />预计 18 分钟</small></div>
              <button type="button" className="button button--primary" onClick={() => onNavigate("learn")}>继续本节 <Icon name="arrow" /></button>
            </div>
            <div className="recent-learning"><h2>最近学习</h2><div><time>今天　14:20</time><span>完成第 1 课　认识 AI 产品经理</span></div><div><time>昨天　21:05</time><span>向 AI 助教提问 3 次</span></div></div>
          </article>
          <aside className="learning-side">
            <article className="panel"><h2>本周学习</h2><div className="week-stats"><Stat icon="clock" label="专注" value="46 分钟" /><Stat icon="book" label="完成" value="1 节" /><Stat icon="check" label="连续学习" value="2 天" /></div></article>
            <article className="panel work-card"><h2>我的作品</h2><div><span className="icon-tile"><Icon name="book" /></span><div><h3>AI 产品方案 <em>草稿</em></h3><p>完成课程后生成可展示作品</p></div><button type="button" className="button button--outline">查看草稿</button></div></article>
          </aside>
        </section>
        <article className="next-course panel"><h2>下一门课</h2><span className="course-mini__icon">对话</span><strong>Prompt 基础</strong><span className="muted-badge">即将开放</span></article>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: "clock" | "book" | "check"; label: string; value: string }) {
  return <div><span className="icon-tile"><Icon name={icon} /></span><small>{label}</small><strong>{value}</strong></div>;
}
