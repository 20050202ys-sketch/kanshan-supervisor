import type { KnowledgeNode, KnowledgeCard } from "../types";

// 六个核心知识节点（PRD 5.2）——登山路线
export const NODES: KnowledgeNode[] = [
  { id: "role", title: "AI 产品经理做什么", order: 1 },
  { id: "llm_boundary", title: "大语言模型的能力与边界", order: 2 },
  { id: "prompt", title: "Prompt 基础", order: 3 },
  { id: "rag_agent", title: "RAG 与 Agent", order: 4 },
  { id: "data_eval", title: "数据与评测", order: 5 },
  { id: "product_fit", title: "AI 产品落地判断", order: 6 },
];

// 1 天版：先做第一天演示要用的 2 张知识卡（人工精选，保留作者与来源）
// ⚠️ TODO(B同学)：补齐其余节点的知识卡；snippet 只放必要片段，勿整段搬运
export const CARDS: KnowledgeCard[] = [
  {
    id: "card_llm_1",
    nodeId: "llm_boundary",
    title: "大语言模型到底擅长什么、不擅长什么",
    author: "知乎作者（示例，替换为真实精选）",
    snippet:
      "大语言模型擅长基于海量文本的模式生成：改写、总结、分类、续写与对话。但它并不真正“知道”事实，本质是预测下一个词，因此可能自信地给出错误信息（幻觉）。它也不擅长精确计算、访问实时数据、以及需要严格因果推理的任务。",
    sourceUrl: "https://www.zhihu.com/",
    aiSummary: "记住一句话：模型强在“语言模式”，弱在“事实与计算”，产品设计要为它的错误留后路。",
  },
  {
    id: "card_prompt_1",
    nodeId: "prompt",
    title: "一个好 Prompt 的四要素",
    author: "知乎作者（示例，替换为真实精选）",
    snippet:
      "结构化 Prompt 通常包含四部分：目标（要模型做什么）、背景（相关上下文）、约束（不能做什么、边界条件）、输出格式（希望返回的结构）。缺少输出格式时，模型回答会发散，难以被程序消费。",
    sourceUrl: "https://www.zhihu.com/",
    aiSummary: "目标 + 背景 + 约束 + 输出格式，四件套齐了，模型才好用、结果才可控。",
  },
];

// 摸底题（PRD F02）——1 天版结果写死，仅做流程演示
export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export const QUIZ: QuizItem[] = [
  {
    id: "q_model",
    question: "下列哪项最能描述大语言模型的本质？",
    options: ["一个联网的搜索引擎", "一个预测下一个词的概率模型", "一个精确的计算器", "一个人类专家数据库"],
    answerIndex: 1,
  },
  {
    id: "q_agent",
    question: "下列哪项最接近“Agent”的特征？",
    options: ["只回答单轮问题", "能观察、判断、行动并根据反馈调整", "只做文本翻译", "只存储数据"],
    answerIndex: 1,
  },
  {
    id: "q_eval",
    question: "评估一个 AI 助手，下列哪个不属于常见评测维度？",
    options: ["准确性", "完成率", "界面配色是否好看", "稳定性"],
    answerIndex: 2,
  },
];

// 演示脚本用：默认聚焦的知识点（PRD 第十五章 1:00 段）
export const DEMO_FOCUS_NODE = "llm_boundary";
export const DEMO_FOCUS_CARD = "card_llm_1";
// 演示时故意遗漏的关键点（第十五章 2:00 段）
export const DEMO_MISSING_POINT = "模型可能产生事实错误（幻觉）";
