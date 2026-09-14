import type { MasteryResult } from "../types";

// ============================================================
// 评估Agent（1 天版：把教学/追问/评估合并成一次 LLM 调用）
// 关键：强制 JSON 输出 + 解析失败走默认分支（PRD F06 / 第十七章风险）
// ============================================================

// 配置：把 key 放到 .env.local -> VITE_LLM_API_KEY / VITE_LLM_BASE_URL / VITE_LLM_MODEL
// ⚠️ 演示阶段前端直连可接受；正式上线请改为 Serverless 转发，勿泄露 key
const API_KEY = import.meta.env.VITE_LLM_API_KEY as string | undefined;
const BASE_URL =
  (import.meta.env.VITE_LLM_BASE_URL as string | undefined) ||
  "https://api.openai.com/v1";
const MODEL = (import.meta.env.VITE_LLM_MODEL as string | undefined) || "gpt-4o-mini";

// 解析失败 / 无 key 时的默认结果：走「补一道基础题」保底路径
const FALLBACK: MasteryResult = {
  mastery: "partial",
  understood_points: ["你已经开始用自己的话表达，这一步很关键"],
  missing_points: ["再补充一个具体例子会更清楚"],
  next_action: "practice",
};

const SYSTEM_PROMPT = `你是"刘看山"，一名温和、好奇、带轻微冷幽默的督学官，正在检验初学者是否真正理解一个 AI 产品经理知识点。
规则：
1. 不训斥、不羞辱；先肯定用户已掌握的点，再指出缺口。
2. 判断用户是否只是复述原文，鼓励用自己的话表达和举例。
3. 你必须只输出一个 JSON 对象，不要任何解释文字、不要 markdown 代码块围栏。
JSON 结构固定为：
{"mastery":"mastered|partial|weak","understood_points":[],"missing_points":[],"next_action":"advance|practice|relearn"}
mastery=mastered 时 next_action 应为 advance；weak 时应为 relearn；partial 时应为 practice。`;

function safeParse(text: string): MasteryResult | null {
  try {
    // 容错：去掉可能的 ```json 围栏，截取第一个 { 到最后一个 }
    const cleaned = text.replace(/```json|```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const obj = JSON.parse(cleaned.slice(start, end + 1));
    if (
      obj &&
      ["mastered", "partial", "weak"].includes(obj.mastery) &&
      ["advance", "practice", "relearn"].includes(obj.next_action)
    ) {
      return {
        mastery: obj.mastery,
        understood_points: Array.isArray(obj.understood_points) ? obj.understood_points : [],
        missing_points: Array.isArray(obj.missing_points) ? obj.missing_points : [],
        next_action: obj.next_action,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export interface EvaluateInput {
  nodeTitle: string;
  cardSnippet: string;
  userAnswer: string;
  attempt: number; // 第几次尝试（用于 PRD F07 补学控制）
}

export async function evaluate(input: EvaluateInput): Promise<MasteryResult> {
  // 无 key：直接返回兜底结果，保证学习流程可继续。
  if (!API_KEY) return FALLBACK;

  const userMsg = `知识点：${input.nodeTitle}
参考片段：${input.cardSnippet}
这是用户第 ${input.attempt} 次回答。
用户的复述：${input.userAnswer}
请评估并只返回规定的 JSON。`;

  try {
    const resp = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
      }),
    });
    if (!resp.ok) return FALLBACK;
    const data = await resp.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    return safeParse(text) ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}
