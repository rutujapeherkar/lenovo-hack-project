/**
 * Sahayak AI — Scheme Eligibility Criteria Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 22 & DATA-CONTRACTS.md Section 10
 * Phase: P06 — Scheme Finder
 * 
 * Renders structured, verified eligibility criteria with accessible bullet markers.
 */

import React from "react";
import { useLanguage } from "../../core/language";

export interface EligibilityListProps {
  eligibility: string[];
}

export const EligibilityList: React.FC<EligibilityListProps> = ({ eligibility }) => {
  const { t } = useLanguage();

  return (
    <div
      className="eligibility-list-card"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        padding: "var(--space-6)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <h3
        style={{
          margin: "0 0 var(--space-3) 0",
          fontSize: "1.125rem",
          color: "var(--sahayak-blue-dark)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <span>🎯</span> {t("whoCanApply")}
      </h3>

      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
        All eligibility criteria are strictly verified from official Maharashtra government gazettes.
      </p>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {eligibility.map((criterion, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--space-3)",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-button)",
              backgroundColor: "var(--surface-soft)",
              border: "1px solid var(--border)",
              fontSize: "0.9375rem",
              lineHeight: "1.5",
              color: "var(--text-primary)",
            }}
          >
            <span
              style={{
                color: "var(--sahayak-blue)",
                fontWeight: 700,
                fontSize: "1rem",
                lineHeight: "1.2",
              }}
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{criterion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
