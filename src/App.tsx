import { useState } from "react";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Learn from "./pages/Learn";
import Finish from "./pages/Finish";

export type Page = "home" | "quiz" | "learn" | "finish";

// 1 天版用极简状态路由，不引入 react-router，减少体积与心智负担
export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen">
      {page === "home" && <Home onStart={() => setPage("quiz")} />}
      {page === "quiz" && (
        // 摸底完成 -> 进入学习页（结果暂用于演示，学习路线仍按顺序解锁）
        <Quiz onDone={() => setPage("learn")} />
      )}
      {page === "learn" && <Learn onFinish={() => setPage("finish")} />}
      {page === "finish" && <Finish onRestart={() => setPage("home")} />}
    </div>
  );
}
