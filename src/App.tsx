import { useState } from "react";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MyLearning from "./pages/MyLearning";
import Learn from "./pages/Learn";
import Finish from "./pages/Finish";

export type Page = "home" | "courses" | "course" | "my-learning" | "learn" | "finish";

// 1 天版用极简状态路由，不引入 react-router，减少体积与心智负担
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
      {page === "learn" && <Learn onNavigate={navigate} />}
      {page === "finish" && <Finish onNavigate={navigate} />}
    </div>
  );
}
