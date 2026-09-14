import type { MasteryResult } from "../types";

// ============================================================
// 评估 Agent 的前端适配层。
// 当前静态演示站仅返回兜底结果；后续由 Dify/后端代理实现真实评估。
// ============================================================

// GitHub Pages 是公开静态站点，浏览器端不得持有模型密钥。
// 接入 Dify 或后端代理前，评估使用本地兜底结果，保证学习流程可演示。
const FALLBACK: MasteryResult = {
  mastery: "partial",
  understood_points: ["你已经开始用自己的话表达，这一步很关键"],
  missing_points: ["再补充一个具体例子会更清楚"],
  next_action: "practice",
};

export interface EvaluateInput {
  nodeTitle: string;
  cardSnippet: string;
  userAnswer: string;
  attempt: number; // 第几次尝试（用于 PRD F07 补学控制）
}

export async function evaluate(_input: EvaluateInput): Promise<MasteryResult> {
  return FALLBACK;
}
