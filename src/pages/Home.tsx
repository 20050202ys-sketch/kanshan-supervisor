import type { Page } from "../App";
import Icon from "../components/Icon";
import LiuKanshan from "../components/LiuKanshan";
import SiteHeader from "../components/SiteHeader";
import { COURSE_LIST } from "../data/courses";

export default function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <main className="page page--home">
      <div className="page-wrap">
        <SiteHeader current="home" onNavigate={onNavigate} />

        <section className="home-hero">
          <div className="home-hero__main">
            <h1>选一门想学的课，<br />刘看山陪你真正学会</h1>
            <p>好奇，动手，坚持。把“我看过”变成“我会了”。</p>

            <article className="continue-card">
              <div className="course-mark"><span>AI</span></div>
              <div className="continue-card__body">
                <span className="badge">3 天入门</span>
                <h2>AI 产品经理入门</h2>
                <div className="progress-line">
                  <span>已学习 <b>2/6</b></span>
                  <i><b style={{ width: "33%" }} /></i>
                </div>
              </div>
              <button className="button button--primary" type="button" onClick={() => onNavigate("learn")}>
                继续学习 <Icon name="arrow" />
              </button>
            </article>
          </div>

          <aside className="supervisor-card supervisor-card--hero">
            <div className="supervisor-card__copy">
              <h2>刘看山正在<br />陪你学习</h2>
              <div className="status-row"><i />今日在线</div>
              <p>不着急，一步一步来。</p>
            </div>
            <LiuKanshan reaction="idle" showTitle={false} />
            <button type="button" className="text-button" onClick={() => onNavigate("my-learning")}>查看陪学设置 <Icon name="arrow" /></button>
          </aside>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div><h2>探索课程</h2><p>根据你的目标，找到下一个想学的能力。</p></div>
            <button type="button" className="text-button" onClick={() => onNavigate("courses")}>全部课程 <Icon name="arrow" /></button>
          </div>
          <div className="course-preview-grid">
            {COURSE_LIST.slice(1, 4).map((course) => (
              <article className="course-mini" key={course.id}>
                <span className="course-mini__icon">{course.icon}</span>
                <div><h3>{course.title}</h3><p>{course.summary}</p></div>
                <span className="muted-badge">即将开放</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
