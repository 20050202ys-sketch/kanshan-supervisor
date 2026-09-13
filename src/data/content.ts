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

// 六个节点各配一张知乎知识卡（PRD F04）
// ⚠️ 重要：author / sourceUrl 目前是占位，请 B 同学到知乎精选真实回答/文章后替换为
//    真实标题、真实作者、真实原文链接；snippet 只放必要片段，保留署名，勿整段搬运。
//    aiSummary 是 AI 划重点，需与知乎原文内容明确区分（UI 已用不同底色区分）。
export const CARDS: KnowledgeCard[] = [
  // 节点 1：AI 产品经理做什么
  {
    id: "card_role_1",
    nodeId: "role",
    title: "AI 产品经理和普通产品经理有什么不同",
    author: "【待替换为真实知乎作者】",
    snippet:
      "AI 产品经理的核心差异在于：要理解模型能力的“不确定性”。传统功能是确定的输入输出，而 AI 功能的结果是概率性的、可能出错的。因此 AI PM 要做的不只是画原型，还要定义“模型做什么、边界在哪、出错了怎么兜底、用什么指标衡量好坏”。",
    sourceUrl: "https://www.zhihu.com/",
    aiSummary: "AI PM = 传统 PM + 会为“模型的不确定性”做产品设计（定边界、做兜底、定指标）。",
  },
  // 节点 2：大语言模型的能力与边界（演示主打）
  {
    id: "card_llm_1",
    nodeId: "llm_boundary",
    title: "大语言模型到底擅长什么、不擅长什么",
    author: "【待替换为真实知乎作者】",
    snippet:
      "大语言模型擅长基于海量文本的模式生成：改写、总结、分类、续写与对话。但它并不真正“知道”事实，本质是预测下一个词，因此可能自信地给出错误信息（幻觉）。它也不擅长精确计算、访问实时数据、以及需要严格因果推理的任务。",
    sourceUrl: "https://www.zhihu.com/",
    aiSummary: "记住一句话：模型强在“语言模式”，弱在“事实与计算”，产品设计要为它的错误留后路。",
  },
  // 节点 3：Prompt 基础
  {
    id: "card_prompt_1",
    nodeId: "prompt",
    title: "一个好 Prompt 的四要素",
    author: "【待替换为真实知乎作者】",
    snippet:
      "结构化 Prompt 通常包含四部分：目标（要模型做什么）、背景（相关上下文）、约束（不能做什么、边界条件）、输出格式（希望返回的结构）。缺少输出格式时，模型回答会发散，难以被程序消费。",
    sourceUrl: "https://www.zhihu.com/",
    aiSummary: "目标 + 背景 + 约束 + 输出格式，四件套齐了，模型才好用、结果才可控。",
  },
  // 节点 4：RAG 与 Agent
  {
    id: "card_rag_agent_1",
    nodeId: "rag_agent",
    title: "RAG、工作流和 Agent，到底有什么区别",
    author: "【待替换为真实知乎作者】",
    snippet:
      "RAG 是“先检索资料再回答”，解决模型不知道最新/私有知识的问题；工作流是把固定步骤串起来，按预设路线走；Agent 则能自己观察、判断、决定下一步做什么并根据反馈调整。区别的关键在于“谁决定下一步”——工作流是人预设的，Agent 是模型自己决定的。",
    sourceUrl: "https://www.zhihu.com/",
    aiSummary: "RAG=带资料回答；工作流=按剧本走；Agent=自己看情况决定下一步。会“自主决策”才是 Agent。",
  },
  // 节点 5：数据与评测
  {
    id: "card_data_eval_1",
    nodeId: "data_eval",
    title: "AI 产品要怎么衡量“好不好用”",
    author: "【待替换为真实知乎作者】",
    snippet:
      "评测 AI 产品常看几个维度：准确性（答得对不对）、完成率（任务能不能走完）、稳定性（同样的问题每次表现是否一致）、安全性（会不会输出有害内容）。好的评测要有一批固定测试用例，而不是凭感觉“试几下觉得还行”。",
    sourceUrl: "https://www.zhihu.com/",
    aiSummary: "别凭感觉评价 AI：用准确性、完成率、稳定性、安全性 + 一批固定用例来量化。",
  },
  // 节点 6：AI 产品落地判断
  {
    id: "card_product_fit_1",
    nodeId: "product_fit",
    title: "什么样的场景适合用 AI，什么样的不适合",
    author: "【待替换为真实知乎作者】",
    snippet:
      "适合用 AI 的场景通常具备：容忍一定错误率、有大量重复的语言类工作、结果可由人快速校验。不适合的场景则是：要求 100% 精确、错一次代价极高、或本可用简单规则解决。判断一个 AI 想法值不值得做，先问“错了会怎样、错误成本高不高”。",
    sourceUrl: "https://www.zhihu.com/",
    aiSummary: "判断能不能用 AI，先看“容不容错”：能容错、量大、可校验就适合；要求零错、错一次代价大就别硬上。",
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
