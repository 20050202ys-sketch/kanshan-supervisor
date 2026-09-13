import type { MasteryResult } from "../types";

export interface DemoEvaluationCase {
  id: "missing_hallucination" | "complete_answer";
  label: string;
  userAnswer: string;
  expected: MasteryResult;
}

/**
 * 现场演示专用的已审核样例。
 *
 * 仅在没有配置 LLM Key 且回答与样例完全一致时命中，避免影响普通回答的
 * 兜底逻辑。演示者可以稳定复现“发现缺口 → 补充回答 → 掌握”的流程。
 */
export const DEMO_EVALUATION_CASES: readonly DemoEvaluationCase[] = [
  {
    id: "missing_hallucination",
    label: "第一次复述，故意漏掉事实错误",
    userAnswer:
      "大语言模型会根据学过的大量文字预测接下来最可能出现的内容，所以很擅长总结、改写和对话。",
    expected: {
      mastery: "partial",
      understood_points: [
        "知道模型会根据文本规律生成内容",
        "说出了总结、改写和对话等擅长任务",
      ],
      missing_points: [
        "还没有说明模型可能把错误内容说得很像真的",
        "请再补一个产品如何处理事实错误的例子",
      ],
      next_action: "practice",
    },
  },
  {
    id: "complete_answer",
    label: "第二次复述，补齐能力边界和产品对策",
    userAnswer:
      "大语言模型本质上根据文本规律预测下一个词，擅长总结、改写和对话。但它可能把错误内容说得很像真的，也不擅长精确计算。做产品时要增加检索、来源引用或人工确认，不能直接把回答当事实。",
    expected: {
      mastery: "mastered",
      understood_points: [
        "理解了模型通过文本规律进行预测",
        "说清了模型的擅长任务和事实错误风险",
        "给出了检索、引用来源和人工确认等产品对策",
      ],
      missing_points: [],
      next_action: "advance",
    },
  },
];

function normalizeAnswer(value: string): string {
  return value
    .replace(/\s+/g, "")
    .replace(/[，。、“”‘’！？；：,.!?;:'"]/g, "")
    .toLowerCase();
}

export function matchDemoEvaluation(userAnswer: string): MasteryResult | null {
  const normalizedAnswer = normalizeAnswer(userAnswer);
  const matched = DEMO_EVALUATION_CASES.find(
    (item) => normalizeAnswer(item.userAnswer) === normalizedAnswer,
  );

  if (!matched) return null;

  return {
    ...matched.expected,
    understood_points: [...matched.expected.understood_points],
    missing_points: [...matched.expected.missing_points],
  };
}
