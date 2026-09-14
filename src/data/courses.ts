export const COURSE_LIST = [
  { id: "ai-pm", title: "AI 产品经理入门", category: "AI 与产品", summary: "从真实问题到完整方案", meta: "6 节课 · 3 天", available: true, icon: "AI" },
  { id: "prompt", title: "Prompt 基础", category: "AI 与产品", summary: "学会与 AI 高效沟通", meta: "5 节课", available: false, icon: "对话" },
  { id: "paper", title: "论文拆解", category: "学习效率", summary: "把长论文变成知识地图", meta: "3 天", available: false, icon: "文档" },
  { id: "interview", title: "面试准备", category: "职业成长", summary: "模拟问答与针对性复盘", meta: "5 节课", available: false, icon: "面试" },
  { id: "learning", title: "高效学习法", category: "学习效率", summary: "建立可执行的学习路径", meta: "3 天", available: false, icon: "路径" },
  { id: "expression", title: "观点表达", category: "写作表达", summary: "从观点到有说服力的表达", meta: "5 节课", available: false, icon: "表达" },
] as const;

export const COURSE_LESSONS = [
  "认识 AI 产品经理",
  "用户需求与痛点",
  "市场与竞品分析",
  "产品方案设计",
  "产品落地与迭代",
  "完成你的 AI 产品方案",
] as const;
