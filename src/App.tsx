import { useState } from "react";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MyLearning from "./pages/MyLearning";
import Quiz from "./pages/Quiz";
import Learn from "./pages/Learn";
import Finish from "./pages/Finish";

export type Page = "home" | "courses" | "course" | "my-learning" | "quiz" | "learn" | "finish";

// MVP 使用轻量状态路由，避免为了六个页面额外引入路由依赖。
export default function App() {
  const [page, setPage] = useState<Page>("home");

  const navigate = (next: Page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(next);
  };

  return (
    <div className="app-shell">
      {page === "home" && <Home onNavigate={navigate} />}
      {page === "courses" && <Courses onNavigate={navigate} />}
      {page === "course" && <CourseDetail onNavigate={navigate} />}
      {page === "my-learning" && <MyLearning onNavigate={navigate} />}
      {page === "quiz" && <Quiz onDone={() => navigate("learn")} />}
      {page === "learn" && <Learn onNavigate={navigate} />}
      {page === "finish" && <Finish onNavigate={navigate} />}
    </div>
  );
}
