import { create } from "zustand";
import type { LearningState, NodeStatus, MasteryResult } from "../types";
import { NODES } from "../data/content";

const STORAGE_KEY = "kanshan_learning_state_v1";

function initialMasteryMap(): Record<string, NodeStatus> {
  const map: Record<string, NodeStatus> = {};
  NODES.forEach((n, i) => {
    map[n.id] = i === 0 ? "gray" : "locked"; // 第一个节点默认可学，其余锁定
  });
  return map;
}

function loadState(): LearningState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LearningState;
  } catch {
    /* ignore */
  }
  return {
    course_day: 1,
    current_node: NODES[0].id,
    mastery_map: initialMasteryMap(),
    camera_mode: false,
    current_task_attempts: 0,
  };
}

interface Store extends LearningState {
  // 动作
  setCameraMode: (on: boolean) => void;
  setCurrentNode: (id: string) => void;
  /** 根据评估结果推进流程（PRD F06/F07） */
  applyMastery: (nodeId: string, result: MasteryResult) => void;
  incAttempt: () => void;
  resetAttempts: () => void;
  reset: () => void;
}

function persist(state: LearningState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export const useStore = create<Store>((set, get) => ({
  ...loadState(),

  setCameraMode: (on) => {
    set({ camera_mode: on });
    persist(get());
  },

  setCurrentNode: (id) => {
    set({ current_node: id, current_task_attempts: 0 });
    persist(get());
  },

  applyMastery: (nodeId, result) => {
    const map = { ...get().mastery_map };
    if (result.next_action === "advance" || result.mastery === "mastered") {
      map[nodeId] = "green";
      // 解锁下一个节点
      const idx = NODES.findIndex((n) => n.id === nodeId);
      const next = NODES[idx + 1];
      if (next && map[next.id] === "locked") map[next.id] = "gray";
    } else {
      // partial / weak → 标黄（PRD F07：两次仍未掌握标黄允许继续）
      map[nodeId] = "yellow";
    }
    set({ mastery_map: map });
    persist(get());
  },

  incAttempt: () => {
    set({ current_task_attempts: get().current_task_attempts + 1 });
    persist(get());
  },

  resetAttempts: () => {
    set({ current_task_attempts: 0 });
    persist(get());
  },

  reset: () => {
    const fresh: LearningState = {
      course_day: 1,
      current_node: NODES[0].id,
      mastery_map: initialMasteryMap(),
      camera_mode: false,
      current_task_attempts: 0,
    };
    set(fresh);
    persist(fresh);
  },
}));
