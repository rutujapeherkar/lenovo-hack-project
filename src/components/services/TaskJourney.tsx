/**
 * Sahayak AI — Deterministic Task Journey Step Wizard Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 21 & DATA-CONTRACTS.md Section 7, 30
 * Phase: P05 — Services & Deterministic Task Guidance
 * 
 * Renders an interactive, deterministic step-by-step guidance wizard.
 * Invariants:
 * 1. Step progression is 100% deterministic, strictly following verified registry data.
 * 2. Visual step indicators distinguish Completed (✓), Current (●), and Upcoming (○).
 * 3. Active step has aria-current="step" for assistive tech.
 * 4. Language switching immediately updates step labels without resetting user progress.
 * 5. Does not automatically post or submit forms.
 */

import React, { useState, useEffect } from "react";
import type { Service, CurrentTask } from "../../core/shared/types";
import { useLanguage } from "../../core/language";
import { TaskService } from "../../core/services/task-service";
import { Button, Badge } from "../ui";
import { ReadAloud } from "../accessibility";
import { SafetyNotice } from "../common";
import { isPaymentStep } from "../../core/security";

export interface TaskJourneyProps {
  service: Service;
  initialTask?: CurrentTask;
  onTaskChange?: (task: CurrentTask) => void;
}

export const TaskJourney: React.FC<TaskJourneyProps> = ({
  service,
  initialTask,
  onTaskChange,
}) => {
  const { language, t } = useLanguage();
  const steps = service.steps;

  // Initialize or restore task state from session
  const [task, setTask] = useState<CurrentTask>(() => {
    if (initialTask) return initialTask;
    const restored = TaskService.loadTaskFromSession(service.id);
    if (restored) return restored;
    return TaskService.initializeTask(service.id);
  });

  // Keep session storage synchronized
  useEffect(() => {
    TaskService.saveTaskToSession(task);
    if (onTaskChange) {
      onTaskChange(task);
    }
  }, [task, onTaskChange]);

  const currentIndex = TaskService.getCurrentStepIndex(task, steps);
  const currentStep = steps[currentIndex] || steps[0];
  const isCompleted = TaskService.isTaskCompleted(task, steps);

  const handleNext = () => {
    const nextTask = TaskService.advanceStep(task, steps);
    setTask(nextTask);
  };

  const handlePrevious = () => {
    const prevTask = TaskService.previousStep(task, steps);
    setTask(prevTask);
  };

  const handleJumpToStep = (stepId: string) => {
    const jumpedTask = TaskService.goToStep(task, stepId, steps);
    setTask(jumpedTask);
  };

  const handleRestart = () => {
    const fresh = TaskService.initializeTask(service.id);
    setTask(fresh);
  };

  return (
    <div
      className="task-journey-container"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        padding: "var(--space-6)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header with Title and Step Progress */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          marginBottom: "var(--space-6)",
          paddingBottom: "var(--space-4)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--sahayak-blue)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {t("stepRoadmap")}
          </span>
          <h3
            style={{
              margin: "var(--space-1) 0 0 0",
              fontSize: "1.25rem",
              color: "var(--sahayak-blue-dark)",
            }}
          >
            {service.name[language] || service.name.en}
          </h3>
        </div>

        <Badge variant={isCompleted ? "success" : "info"} size="md">
          {t("stepOf")} {currentIndex + 1} {t("of")} {steps.length}
        </Badge>
      </div>

      {/* Stepper Progression Track */}
      <nav
        aria-label="Workflow Steps"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          overflowX: "auto",
          paddingBottom: "var(--space-4)",
          marginBottom: "var(--space-6)",
        }}
      >
        {steps.map((step, idx) => {
          const status = TaskService.getStepStatus(step.id, task);
          const isCurrent = status === "current";
          const isDone = status === "completed";
          const stepNum = idx + 1;

          let indicatorSymbol = "○";
          let labelPrefix = t("upcomingStatus");

          if (isDone) {
            indicatorSymbol = "✓";
            labelPrefix = t("completedStatus");
          } else if (isCurrent) {
            indicatorSymbol = "●";
            labelPrefix = t("currentStatus");
          }

          const stepTitle = step.title[language] || step.title.en;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleJumpToStep(step.id)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`${labelPrefix}: ${t("stepOf")} ${stepNum} - ${stepTitle}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "8px 12px",
                borderRadius: "var(--radius-button)",
                border: "1px solid",
                borderColor: isCurrent
                  ? "var(--sahayak-blue)"
                  : isDone
                  ? "var(--border-strong)"
                  : "var(--border)",
                backgroundColor: isCurrent
                  ? "var(--sahayak-blue-light)"
                  : isDone
                  ? "var(--surface-soft)"
                  : "transparent",
                color: isCurrent
                  ? "var(--sahayak-blue-dark)"
                  : isDone
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                fontWeight: isCurrent ? 700 : 500,
                transition: "all var(--transition-fast)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: isCurrent
                    ? "var(--sahayak-blue)"
                    : isDone
                    ? "var(--success)"
                    : "var(--surface-muted)",
                  color: isCurrent || isDone ? "var(--text-inverse)" : "var(--text-secondary)",
                  fontSize: isDone ? "0.75rem" : "0.6875rem",
                  fontWeight: 700,
                }}
              >
                {indicatorSymbol}
              </span>
              <span>
                {t("stepOf")} {stepNum}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Active Step Content Card */}
      {currentStep && (
        <div
          className="active-step-card"
          style={{
            backgroundColor: "var(--surface-soft)",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--sahayak-blue)",
            borderRadius: "var(--radius-card)",
            padding: "var(--space-6)",
            marginBottom: "var(--space-6)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-3)",
            }}
          >
            <Badge variant="info" size="sm">
              {t("currentStatus")} • {t("stepOf")} {currentIndex + 1} {t("of")} {steps.length}
            </Badge>

            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
              <ReadAloud
                text={`${currentStep.title[language] || currentStep.title.en}. ${currentStep.description[language] || currentStep.description.en}`}
                language={language}
              />
              {task.completedStepIds.includes(currentStep.id) && (
                <Badge variant="success" size="sm">
                  ✓ {t("completedStatus")}
                </Badge>
              )}
            </div>
          </div>

          <h4
            style={{
              margin: "0 0 var(--space-3) 0",
              fontSize: "1.25rem",
              color: "var(--sahayak-blue-dark)",
            }}
          >
            {currentStep.title[language] || currentStep.title.en}
          </h4>

          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.6",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            {currentStep.description[language] || currentStep.description.en}
          </p>

          {isPaymentStep(currentStep) && (
            <div style={{ marginTop: "var(--space-4)" }}>
              <SafetyNotice type="payment" language={language} />
            </div>
          )}
        </div>
      )}

      {/* Completion Banner if all steps are marked */}
      {isCompleted && (
        <div
          style={{
            backgroundColor: "var(--surface-soft)",
            border: "1px solid var(--success)",
            borderRadius: "var(--radius-card)",
            padding: "var(--space-5)",
            marginBottom: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "1.25rem" }}>🎉</span>
            <strong style={{ color: "var(--success)" }}>{t("taskCompleted")}</strong>
          </div>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
            {t("taskCompletedDesc")}
          </p>
        </div>
      )}

      {/* Step Navigation Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label={t("prevStep")}
        >
          ← {t("prevStep")}
        </Button>

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {isCompleted && (
            <Button variant="outline" onClick={handleRestart}>
              🔄 Restart
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleNext}
            aria-label={currentIndex === steps.length - 1 ? t("taskCompleted") : t("nextStep")}
          >
            {currentIndex === steps.length - 1 ? `✓ ${t("taskCompleted")}` : `${t("nextStep")} →`}
          </Button>
        </div>
      </div>
    </div>
  );
};
