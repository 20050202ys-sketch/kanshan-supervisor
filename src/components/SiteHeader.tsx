import type { Page } from "../App";
import Icon from "./Icon";

const NAV: { page: Page; label: string }[] = [
  { page: "home", label: "首页" },
  { page: "courses", label: "课程广场" },
  { page: "my-learning", label: "我的学习" },
];

export default function SiteHeader({
  current,
  onNavigate,
  compact = false,
}: {
  current: Page;
  onNavigate: (page: Page) => void;
  compact?: boolean;
}) {
  return (
    <header className={`site-header ${compact ? "site-header--compact" : ""}`}>
      <button className="brand" type="button" onClick={() => onNavigate("home")} aria-label="返回首页">
        看山督学局
      </button>
      <nav aria-label="主导航">
        {NAV.map((item) => (
          <button
            key={item.page}
            type="button"
            className={current === item.page ? "is-active" : ""}
            aria-current={current === item.page ? "page" : undefined}
            onClick={() => onNavigate(item.page)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button type="button" className="icon-button" aria-label="搜索课程" onClick={() => onNavigate("courses")}><Icon name="search" /></button>
        <button type="button" className="avatar-button" aria-label="我的学习" onClick={() => onNavigate("my-learning")}><Icon name="user" /></button>
      </div>
    </header>
  );
}
