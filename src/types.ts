// ============================================================
// 两人协作的「接口契约」—— 冻结此文件，双方各自 mock 对方数据并行开发
// 来源：《看山督学局》PRD 第十一章
// ============================================================

// ---- 摄像头模块 → 督学Agent（A 产出事件，B 消费）----
export type CameraReason = "face_absent" | "head_turn" | "head_down";

export interface CameraEvent {
  event: "possible_distraction";
  reason: CameraReason;
  duration_seconds: number;
  timestamp: number; // 秒级时间戳
}

// ---- 评估Agent → UI（B 产出，A 渲染）----
export type Mastery = "mastered" | "partial" | "weak";
export type NextAction = "advance" | "practice" | "relearn";

export interface MasteryResult {
  mastery: Mastery;
  understood_points: string[];
  missing_points: string[];
  next_action: NextAction;
}

// ---- 知识节点状态（PRD 5.2 学习地图）----
export type NodeStatus = "locked" | "gray" | "yellow" | "green";
// locked=未解锁 gray=尚未学习 yellow=接触过不稳定 green=已通过验证

export interface KnowledgeNode {
  id: string; // 如 "llm_boundary"
  title: string; // 如 "大语言模型的能力与边界"
  order: number; // 1..6 登山顺序
}

// ---- 知乎知识卡（PRD F04）----
export interface KnowledgeCard {
  id: string;
  nodeId: string; // 关联的知识节点
  title: string;
  author: string; // 保留作者署名（版权合规）
  snippet: string; // 核心片段（≤2 分钟阅读）
  sourceUrl: string; // 原文链接（必须可打开）
  aiSummary?: string; // AI 总结，需与原文明确区分
}

// ---- 用户学习状态（PRD 第十一章，存 localStorage）----
export interface LearningState {
  course_day: number;
  current_node: string;
  mastery_map: Record<string, NodeStatus>;
  camera_mode: boolean;
  current_task_attempts: number;
}
