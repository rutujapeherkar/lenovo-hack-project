/**
 * Sahayak AI — Explain Screen Explanation Panel Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 25 & DATA-CONTRACTS.md Section 26
 * Phase: P07 — Explain Screen
 * 
 * Renders structured screen analysis:
 * - High-level summary
 * - Detected UI elements (fields, buttons, labels) with importance badges
 * - "What should I do next?" highlighted guidance box
 * - Security warnings & official information disclaimer
 */

import React from "react";
import type { ScreenExplanation, ScreenElement } from "../../core/shared/types";
import { Card, CardTitle, Badge, Alert } from "../ui";
import { useLanguage } from "../../core/language";

export interface ExplanationPanelProps {
  explanation: ScreenExplanation;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation }) => {
  const { t } = useLanguage();

  const getElementTypeLabel = (type: ScreenElement["type"]): string => {
    switch (type) {
      case "field":
        return "Field / रकाना";
      case "button":
        return "Button / बटण";
      case "heading":
        return "Heading / मथळा";
      case "label":
        return "Label / लेबल";
      case "message":
        return "Message / संदेश";
      case "section":
        return "Section / विभाग";
      default:
        return "Element / घटक";
    }
  };

  const getImportanceBadge = (importance?: "high" | "medium" | "low") => {
    switch (importance) {
      case "high":
        return <Badge variant="warning">{t("importanceHigh")}</Badge>;
      case "medium":
        return <Badge variant="neutral">{t("importanceMedium")}</Badge>;
      case "low":
        return <Badge variant="neutral">{t("importanceLow")}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="explanation-panel" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* 1. Header & Distinction Badge */}
      <Card variant="default" style={{ padding: "var(--space-6)", borderLeft: "4px solid var(--sahayak-blue)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
          <Badge variant="info">{t("sahayakExplanation")}</Badge>
        </div>
        <CardTitle style={{ fontSize: "1.25rem", marginBottom: "var(--space-3)", color: "var(--sahayak-blue-dark)" }}>
          {explanation.summary}
        </CardTitle>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>
          {t("officialDisclaimer")}
        </p>
      </Card>

      {/* 2. "What should I do next?" Highlighted Box */}
      {explanation.nextAction && (
        <div
          style={{
            backgroundColor: "rgba(10, 102, 194, 0.08)",
            border: "1.5px solid var(--sahayak-blue)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-5)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontWeight: 700,
              fontSize: "1.0625rem",
              color: "var(--sahayak-blue-dark)",
              marginBottom: "var(--space-2)",
            }}
          >
            <span>👉</span>
            <span>{t("whatShouldIDoNext")}</span>
          </div>
          <p
            style={{
              color: "var(--text-primary)",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {explanation.nextAction}
          </p>
        </div>
      )}

      {/* 3. Detected Form Fields & Interactive Elements */}
      {explanation.elements && explanation.elements.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "1.1875rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "var(--space-4)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span>📋</span>
            <span>{t("detectedElements")}</span>
            <Badge variant="neutral">{explanation.elements.length}</Badge>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {explanation.elements.map((element, idx) => (
              <Card
                key={idx}
                variant="default"
                style={{
                  padding: "var(--space-4)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "var(--space-2)",
                      gap: "var(--space-2)",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        color: "var(--text-primary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {element.name}
                    </span>
                    <div style={{ display: "flex", gap: "var(--space-1)", flexShrink: 0 }}>
                      <Badge variant="neutral" style={{ fontSize: "0.6875rem" }}>
                        {getElementTypeLabel(element.type)}
                      </Badge>
                      {getImportanceBadge(element.importance)}
                    </div>
                  </div>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {element.explanation}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 4. Security Alerts / Warnings */}
      {explanation.warnings && explanation.warnings.length > 0 && (
        <div>
          {explanation.warnings.map((warning, wIdx) => (
            <Alert
              key={wIdx}
              variant="warning"
              style={{
                fontSize: "0.875rem",
                marginBottom: "var(--space-2)",
                lineHeight: 1.5,
              }}
            >
              ⚠️ {warning}
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};
