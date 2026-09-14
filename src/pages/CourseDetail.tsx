import type { Page } from "../App";
import Icon from "../components/Icon";
import LiuKanshan from "../components/LiuKanshan";
import SiteHeader from "../components/SiteHeader";
import { COURSE_LESSONS } from "../data/courses";

export default function CourseDetail({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <main className="page page--detail">
      <div className="page-wrap">
        <SiteHeader current="courses" onNavigate={onNavigate} />
        <button type="button" className="back-link" onClick={() => onNavigate("courses")}>← 返回课程广场</button>

        <section className="detail-hero">
          <div className="detail-hero__copy">
            <span className="section-label">AI 入门课</span>
            <h1>AI 产品经理入门</h1>
            <p>从真实问题出发，完成你的第一个 AI 产品方案。</p>
            <div className="detail-meta"><span><Icon name="book" />6 节课</span><span><Icon name="clock" />3 天</span><span><Icon name="user" />零基础</span></div>
            <div className="progress-line"><span>已学习 <b>2/6</b></span><i><b style={{ width: "33%" }} /></i></div>
            <button type="button" className="button button--primary" onClick={() => onNavigate("learn")}>继续学习 <Icon name="arrow" /></button>
          </div>
          <div className="detail-hero__companion">
            <LiuKanshan reaction="peek" showTitle={false} />
            <article>
              <h2>刘看山全程陪学</h2>
              <Feature icon="focus" title="专注提醒" text="帮你保持学习节奏" />
              <Feature icon="message" title="课程答疑" text="遇到问题，随时解答" />
              <Feature icon="brain" title="进度督促" text="见证你的每一步成长" />
            </article>
          </div>
        </section>

        <section className="detail-body">
          <article className="lesson-list panel">
            <h2>课程内容</h2>
            <ol>
              {COURSE_LESSONS.map((lesson, index) => (
                <li className={index === 1 ? "is-current" : index === 0 ? "is-done" : ""} key={lesson}>
                  <span>{index === 0 ? <Icon name="check" /> : index + 1}</span><b>{lesson}</b><Icon name={index > 1 ? "lock" : "arrow"} />
                </li>
              ))}
            </ol>
          </article>
          <aside className="detail-side">
            <article className="panel outcomes"><h2>你将获得</h2><Feature icon="brain" title="发现真实需求" text="从用户场景中找到有价值的问题" /><Feature icon="book" title="设计 AI 产品方案" text="掌握从需求到方案的完整方法" /><Feature icon="check" title="完成可展示作品" text="独立完成一个可展示的 AI 产品方案" /></article>
            <article className="panel fit-for"><h2>适合谁学</h2><p>零基础学生 · 转行新人 · 产品爱好者</p></article>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: "focus" | "message" | "brain" | "book" | "check"; title: string; text: string }) {
  return <div className="feature-row"><span className="icon-tile"><Icon name={icon} /></span><div><strong>{title}</strong><p>{text}</p></div></div>;
}
