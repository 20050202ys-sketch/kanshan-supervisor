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
// 内容片段为教学精编，作者/链接来自知乎真实检索结果（保留署名与原文链接）；
// snippet 只放必要片段、不整段搬运；aiSummary 是 AI 划重点，与原文明确区分（UI 用不同底色）。
export const CARDS: KnowledgeCard[] = [
  // 节点 1：AI 产品经理做什么
  {
    id: "card_role_1",
    nodeId: "role",
    title: "AI 产品经理和普通产品经理有什么不同",
    author: "邓木（知乎）",
    snippet:
      "AI 产品经理的核心差异在于：要理解模型能力的“不确定性”。传统功能是确定的输入输出，而 AI 功能的结果是概率性的、可能出错的。因此 AI PM 要做的不只是画原型，还要定义“模型做什么、边界在哪、出错了怎么兜底、用什么指标衡量好坏”。",
    sourceUrl: "https://zhuanlan.zhihu.com/p/2080314775037276865",
    aiSummary: "AI PM = 传统 PM + 会为“模型的不确定性”做产品设计（定边界、做兜底、定指标）。",
  },
  // 节点 2：大语言模型的能力与边界（演示主打）
  {
    id: "card_llm_1",
    nodeId: "llm_boundary",
    title: "大语言模型到底擅长什么、不擅长什么",
    author: "数据与AI爱好者（知乎）",
    snippet:
      "大语言模型擅长基于海量文本的模式生成：改写、总结、分类、续写与对话。但它并不真正“知道”事实，本质是预测下一个词，因此可能自信地给出错误信息（幻觉）。它也不擅长精确计算、访问实时数据、以及需要严格因果推理的任务。",
    sourceUrl: "https://zhuanlan.zhihu.com/p/1975881068218427143",
    aiSummary: "记住一句话：模型强在“语言模式”，弱在“事实与计算”，产品设计要为它的错误留后路。",
  },
  // 节点 3：Prompt 基础
  {
    id: "card_prompt_1",
    nodeId: "prompt",
    title: "一个好 Prompt 的四要素",
    author: "香蕉讨厌苹果（知乎）",
    snippet:
      "结构化 Prompt 通常包含四部分：目标（要模型做什么）、背景（相关上下文）、约束（不能做什么、边界条件）、输出格式（希望返回的结构）。缺少输出格式时，模型回答会发散，难以被程序消费。",
    sourceUrl: "https://zhuanlan.zhihu.com/p/2070699874937476747",
    aiSummary: "目标 + 背景 + 约束 + 输出格式，四件套齐了，模型才好用、结果才可控。",
  },
  // 节点 4：RAG 与 Agent
  {
    id: "card_rag_agent_1",
    nodeId: "rag_agent",
    title: "RAG、工作流和 Agent，到底有什么区别",
    author: "智循AI（知乎）",
    snippet:
      "RAG 是“先检索资料再回答”，解决模型不知道最新/私有知识的问题；工作流是把固定步骤串起来，按预设路线走；Agent 则能自己观察、判断、决定下一步做什么并根据反馈调整。区别的关键在于“谁决定下一步”——工作流是人预设的，Agent 是模型自己决定的。",
    sourceUrl: "https://www.zhihu.com/question/1996526558727395145/answer/2079220961266627587",
    aiSummary: "RAG=带资料回答；工作流=按剧本走；Agent=自己看情况决定下一步。会“自主决策”才是 Agent。",
  },
  // 节点 5：数据与评测
  {
    id: "card_data_eval_1",
    nodeId: "data_eval",
    title: "AI 产品要怎么衡量“好不好用”",
    author: "不想成钢的铁（知乎）",
    snippet:
      "评测 AI 产品常看几个维度：准确性（答得对不对）、完成率（任务能不能走完）、稳定性（同样的问题每次表现是否一致）、安全性（会不会输出有害内容）。好的评测要有一批固定测试用例，而不是凭感觉“试几下觉得还行”。",
    sourceUrl: "https://zhuanlan.zhihu.com/p/2046881465330405974",
    aiSummary: "别凭感觉评价 AI：用准确性、完成率、稳定性、安全性 + 一批固定用例来量化。",
  },
  // 节点 6：AI 产品落地判断
  {
    id: "card_product_fit_1",
    nodeId: "product_fit",
    title: "什么样的场景适合用 AI，什么样的不适合",
    author: "观远数据（知乎）",
    snippet:
      "适合用 AI 的场景通常具备：容忍一定错误率、有大量重复的语言类工作、结果可由人快速校验。不适合的场景则是：要求 100% 精确、错一次代价极高、或本可用简单规则解决。判断一个 AI 想法值不值得做，先问“错了会怎样、错误成本高不高”。",
    sourceUrl: "https://zhuanlan.zhihu.com/p/2062863695210976519",
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

// 动态补学应用题（PRD F07）：答错/未完全掌握时，按节点弹一道应用题巩固
// 每个节点至少配 1 道；answerIndex 是正确选项下标（从 0 开始）
export const PRACTICE: Record<string, QuizItem[]> = {
  role: [
    {
      id: "p_role_1",
      question: "作为 AI 产品经理，下面哪件事最该由你负责？",
      options: [
        "亲自训练一个大模型",
        "定义模型的使用边界和出错时的兜底方案",
        "编写底层推理框架",
        "决定服务器用什么品牌",
      ],
      answerIndex: 1,
    },
  ],
  llm_boundary: [
    {
      id: "p_llm_1",
      question: "用户问模型“今天的天气”，模型一本正经地编了一个答案。这最能说明什么？",
      options: [
        "模型联网失败了",
        "模型会预测下一个词，但不保证事实正确（可能幻觉）",
        "模型坏了需要重启",
        "这是正常且准确的回答",
      ],
      answerIndex: 1,
    },
  ],
  prompt: [
    {
      id: "p_prompt_1",
      question: "你希望模型只返回 JSON，但它每次都多写一堆解释。最该补充 Prompt 的哪一部分？",
      options: ["目标", "背景", "约束与输出格式", "礼貌用语"],
      answerIndex: 2,
    },
  ],
  rag_agent: [
    {
      id: "p_rag_1",
      question: "一个客服系统能自己判断“该查订单还是该转人工”并执行。它更接近？",
      options: ["普通问答", "固定工作流", "Agent（自主决策）", "纯 RAG 检索"],
      answerIndex: 2,
    },
  ],
  data_eval: [
    {
      id: "p_eval_1",
      question: "要判断一个 AI 翻译工具好不好，下面哪种做法更靠谱？",
      options: [
        "自己随手试两句觉得还行",
        "用一批固定的测试句子，量化准确性和稳定性",
        "看界面好不好看",
        "问模型自己翻得怎么样",
      ],
      answerIndex: 1,
    },
  ],
  product_fit: [
    {
      id: "p_fit_1",
      question: "下面哪个场景最不适合直接用大模型？",
      options: [
        "帮用户润色一段文案",
        "给客服回答生成初稿",
        "计算银行转账的精确金额",
        "总结一篇长文章",
      ],
      answerIndex: 2,
    },
  ],
};
