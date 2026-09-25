/**
 * Sahayak AI — Deterministic Task Guidance Service
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 12-13 & DATA-CONTRACTS.md Section 7, 30
 * Phase: P05 — Services & Deterministic Task Guidance
 * 
 * Manages session-level task state transitions for guided public service applications.
 * Crucial invariants:
 * 1. Step transitions are 100% deterministic, strictly adhering to verified service data.
 * 2. Sensitive user credentials, form inputs, or OTPs are NEVER stored in CurrentTask.
 * 3. Does not automatically submit forms on external portals.
 */

import type { CurrentTask, TaskStep } from "../shared/types";
import { getServiceById } from "../shared/data-loader";

const SESSION_STORAGE_PREFIX = "sahayak_task_";

export class TaskService {
  /**
   * Initializes a deterministic task journey for a verified service.
   */
  public static initializeTask(serviceId: string, initialStepId?: string): CurrentTask {
    const service = getServiceById(serviceId);
    const steps = service?.steps || [];
    const firstStepId = initialStepId || (steps.length > 0 ? steps[0].id : "step-1");

    return {
      serviceId,
      currentStepId: firstStepId,
      completedStepIds: [],
    };
  }

  /**
   * Advances the user to the next sequential step in the verified workflow.
   * Marks the current step as completed.
   */
  public static advanceStep(currentTask: CurrentTask, steps: TaskStep[]): CurrentTask {
    if (!steps || steps.length === 0) {
      return { ...currentTask };
    }

    const currentIndex = steps.findIndex((step) => step.id === currentTask.currentStepId);
    const currentId = currentTask.currentStepId;

    // Mark current step as completed if not already marked
    const updatedCompleted = currentTask.completedStepIds.includes(currentId)
      ? [...currentTask.completedStepIds]
      : [...currentTask.completedStepIds, currentId];

    // If there is a next step, advance to it
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      return {
        ...currentTask,
        currentStepId: nextStep.id,
        completedStepIds: updatedCompleted,
      };
    }

    // Already on the final step; maintain current step and mark completed
    return {
      ...currentTask,
      completedStepIds: updatedCompleted,
    };
  }

  /**
   * Moves the user back to the previous step in the sequence.
   */
  public static previousStep(currentTask: CurrentTask, steps: TaskStep[]): CurrentTask {
    if (!steps || steps.length === 0) {
      return { ...currentTask };
    }

    const currentIndex = steps.findIndex((step) => step.id === currentTask.currentStepId);

    // If not at the first step, move to previous step
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      return {
        ...currentTask,
        currentStepId: prevStep.id,
      };
    }

    return { ...currentTask };
  }

  /**
   * Jumps to a specific step if the step exists.
   */
  public static goToStep(currentTask: CurrentTask, targetStepId: string, steps: TaskStep[]): CurrentTask {
    const exists = steps.some((s) => s.id === targetStepId);
    if (!exists) {
      return currentTask;
    }

    return {
      ...currentTask,
      currentStepId: targetStepId,
    };
  }

  /**
   * Evaluates the status ("completed" | "current" | "upcoming") of a given step.
   */
  public static getStepStatus(
    stepId: string,
    currentTask: CurrentTask
  ): "completed" | "current" | "upcoming" {
    if (stepId === currentTask.currentStepId) {
      return "current";
    }
    if (currentTask.completedStepIds.includes(stepId)) {
      return "completed";
    }
    return "upcoming";
  }

  /**
   * Determines whether all steps in the verified workflow are completed.
   */
  public static isTaskCompleted(currentTask: CurrentTask, steps: TaskStep[]): boolean {
    if (!steps || steps.length === 0) return false;
    return steps.every((s) => currentTask.completedStepIds.includes(s.id));
  }

  /**
   * Retrieves the 0-indexed position of the current step in the workflow.
   */
  public static getCurrentStepIndex(currentTask: CurrentTask, steps: TaskStep[]): number {
    const index = steps.findIndex((s) => s.id === currentTask.currentStepId);
    return index >= 0 ? index : 0;
  }

  /**
   * Safely persists task state to browser session storage.
   */
  public static saveTaskToSession(task: CurrentTask): void {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    try {
      const key = `${SESSION_STORAGE_PREFIX}${task.serviceId}`;
      window.sessionStorage.setItem(key, JSON.stringify(task));
    } catch (_e) {
      // Session storage quota or privacy mode error ignored
    }
  }

  /**
   * Safely restores task state from browser session storage.
   */
  public static loadTaskFromSession(serviceId: string): CurrentTask | null {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    try {
      const key = `${SESSION_STORAGE_PREFIX}${serviceId}`;
      const saved = window.sessionStorage.getItem(key);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.serviceId === "string" && typeof parsed.currentStepId === "string") {
        return parsed as CurrentTask;
      }
    } catch (_e) {
      return null;
    }
    return null;
  }

  /**
   * Clears saved task state from browser session storage.
   */
  public static clearTaskSession(serviceId: string): void {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    try {
      const key = `${SESSION_STORAGE_PREFIX}${serviceId}`;
      window.sessionStorage.removeItem(key);
    } catch (_e) {
      // Ignore
    }
  }
}

// Standalone exports
export const initializeTask = TaskService.initializeTask;
export const advanceStep = TaskService.advanceStep;
export const previousStep = TaskService.previousStep;
export const goToStep = TaskService.goToStep;
export const getStepStatus = TaskService.getStepStatus;
export const isTaskCompleted = TaskService.isTaskCompleted;
export const getCurrentStepIndex = TaskService.getCurrentStepIndex;
export const saveTaskToSession = TaskService.saveTaskToSession;
export const loadTaskFromSession = TaskService.loadTaskFromSession;
export const clearTaskSession = TaskService.clearTaskSession;
