import { useCallback, useState } from "react";
import type { CameraEvent } from "../types";

// ============================================================
// 督学 Agent：专注提醒规则
// - 任一种分心状态持续 6 秒后触发铁拳
// - 不限制触发次数，不设置额外冷却
// - 每次触发后由检测器重新累计 6 秒
// - 摄像头不可用时不触发任何惩罚（由上层保证不产生事件）
// ============================================================

export type SupervisorReaction = "peek" | "knock" | "punch" | "none";
// peek=探头提醒  knock=敲屏幕  punch=看山铁拳

export function useSupervisor() {
  const [reaction, setReaction] = useState<SupervisorReaction>("none");

  // 每个合格的摄像头事件都直接触发铁拳。
  const onCameraEvent = useCallback((_e: CameraEvent): SupervisorReaction => {
    setReaction("punch");
    return "punch";
  }, []);

  // 用户点击「看山你看错了」只关闭当前提醒，不额外设置冷却。
  const correctMisjudge = useCallback(() => {
    setReaction("none");
  }, []);

  // 用户点击「我回来了」恢复学习
  const dismiss = useCallback(() => setReaction("none"), []);

  // 进入新任务时恢复普通陪学状态。
  const resetForNewTask = useCallback(() => {
    setReaction("none");
  }, []);

  return { reaction, onCameraEvent, correctMisjudge, dismiss, resetForNewTask };
}
