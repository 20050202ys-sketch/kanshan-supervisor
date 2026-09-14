import { useMemo, useState } from "react";
import type { Page } from "../App";
import Icon from "../components/Icon";
import LiuKanshan from "../components/LiuKanshan";
import SiteHeader from "../components/SiteHeader";
import { COURSE_LIST } from "../data/courses";

const FILTERS = ["全部课程", "AI 与产品", "学习效率", "职业成长", "写作表达"];

export default function Courses({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [filter, setFilter] = useState("全部课程");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => COURSE_LIST.slice(1).filter((course) => {
    const inCategory = filter === "全部课程" || course.category === filter;
    const matches = !query.trim() || `${course.title}${course.summary}`.toLowerCase().includes(query.trim().toLowerCase());
    return inCategory && matches;
  }), [filter, query]);

  return (
    <main className="page page--courses">
      <div className="page-wrap">
        <SiteHeader current="courses" onNavigate={onNavigate} />
        <section className="courses-hero">
          <div className="courses-search">
            <p>找到适合你的下一门课</p>
            <h1>今天想学点什么？</h1>
            <label className="search-box">
              <Icon name="search" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索课程、技能或学习目标" />
              <button type="button" aria-label="搜索"><Icon name="search" /></button>
            </label>
          </div>
          <aside className="selector-card">
            <LiuKanshan reaction="peek" showTitle={false} />
            <div><h2>不知道学什么？</h2><p>告诉看山你的目标</p><button type="button" className="button button--outline">帮我选课 <Icon name="arrow" /></button></div>
          </aside>
        </section>

        <div className="filter-row" role="group" aria-label="课程分类">
          {FILTERS.map((item) => <button type="button" className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}
        </div>

        <article className="course-resume">
          <div className="course-resume__art"><LiuKanshan reaction="idle" showTitle={false} /></div>
          <div className="course-resume__copy"><span>继续学习</span><h2>AI 产品经理入门</h2><p>从真实问题到完整方案</p><div className="progress-line"><span>已学习 <b>2/6</b></span><i><b style={{ width: "33%" }} /></i></div></div>
          <button type="button" className="button button--primary" onClick={() => onNavigate("course")}>查看课程 <Icon name="arrow" /></button>
        </article>

        <section className="section-block course-explore">
          <div className="section-heading"><div><h2>探索课程</h2><p>{visible.length ? `找到 ${visible.length} 门课程` : "没有找到匹配的课程"}</p></div></div>
          <div className="course-grid">
            {visible.map((course) => (
              <article className="course-card" key={course.id}>
                <span className="course-card__art">{course.icon}</span>
                <div className="course-card__meta"><span>{course.category}</span><span>{course.meta}</span></div>
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
                <span className="muted-badge">即将开放</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
