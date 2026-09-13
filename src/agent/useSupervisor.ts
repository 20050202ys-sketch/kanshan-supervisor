import { useCallback, useRef, useState } from "react";
import type { CameraEvent } from "../types";

// ============================================================
// 督学Agent：分级提醒规则（PRD F10）
// - 两次提醒之间至少间隔 60 秒
// - 用户纠正误判后，本次事件不再升级
// - 同一学习任务最多触发两次铁拳
// - 摄像头不可用时不触发任何惩罚（由上层保证不产生事件）
// ============================================================

export type SupervisorReaction = "peek" | "knock" | "punch" | "none";
// peek=探头提醒  knock=敲屏幕  punch=看山铁拳

const MIN_INTERVAL_MS = 60_000; // 两次提醒最小间隔
const MAX_PUNCH_PER_TASK = 2; // 单任务最多两次铁拳

export function useSupervisor() {
  const [reaction, setReaction] = useState<SupervisorReaction>("none");
  const lastRemindAt = useRef(0);
  const escalation = useRef(0); // 0->peek 1->knock 2+->punch
  const punchCount = useRef(0);
  const correctedUntil = useRef(0); // 纠正误判后的静默截止时间

  // 消费一个摄像头事件，返回本次应触发的反应
  const onCameraEvent = useCallback((_e: CameraEvent): SupervisorReaction => {
    const now = Date.now();
    if (now < correctedUntil.current) return "none"; // 刚纠正过，静默
    if (now - lastRemindAt.current < MIN_INTERVAL_MS) return "none"; // 间隔不足

    let next: SupervisorReaction;
    if (escalation.current === 0) next = "peek";
    else if (escalation.current === 1) next = "knock";
    else next = "punch";

    if (next === "punch") {
      if (punchCount.current >= MAX_PUNCH_PER_TASK) {
        next = "knock"; // 达到铁拳上限，降级为敲屏
      } else {
        punchCount.current += 1;
      }
    }

    lastRemindAt.current = now;
    escalation.current += 1;
    setReaction(next);
    return next;
  }, []);

  // 用户点击「看山你看错了」纠正误判 -> 本次事件不再升级（PRD F09/F10）
  const correctMisjudge = useCallback(() => {
    correctedUntil.current = Date.now() + MIN_INTERVAL_MS;
    escalation.current = Math.max(0, escalation.current - 1);
    setReaction("none");
  }, []);

  // 演示模式：手动强制触发铁拳（保命后路，PRD 第十七章）
  const forcePunch = useCallback(() => {
    setReaction("punch");
  }, []);

  // 用户点击「我回来了」恢复学习
  const dismiss = useCallback(() => setReaction("none"), []);

  // 进入新任务时重置计数
  const resetForNewTask = useCallback(() => {
    escalation.current = 0;
    punchCount.current = 0;
    lastRemindAt.current = 0;
    correctedUntil.current = 0;
    setReaction("none");
  }, []);

  return { reaction, onCameraEvent, correctMisjudge, forcePunch, dismiss, resetForNewTask };
}
