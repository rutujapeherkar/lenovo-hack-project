/**
 * Sahayak AI — Explain Screen Civic Glossary Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 26 & ARCHITECTURE.md Section 22
 * Phase: P07 — Explain Screen
 * 
 * Displays plain-language definitions for administrative terms identified on screen.
 */

import React, { useState } from "react";
import type { GlossaryEntry } from "../../core/explain-screen/glossary";
import { Card, Badge, Button } from "../ui";
import { useLanguage } from "../../core/language";
import { CivicGlossary } from "../../core/explain-screen/glossary";

export interface GlossaryProps {
  terms?: GlossaryEntry[];
  showAllFallback?: boolean;
}

export const Glossary: React.FC<GlossaryProps> = ({ terms, showAllFallback = true }) => {
  const { language, t } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  // If specific detected terms are passed and not empty, display them; otherwise display all terms if enabled
  const detectedTerms = terms && terms.length > 0 ? terms : [];
  const allTerms = CivicGlossary.getAllTerms(language);
  const displayTerms = showAll || detectedTerms.length === 0 ? allTerms : detectedTerms;

  if (displayTerms.length === 0 && !showAllFallback) {
    return null;
  }

  return (
    <div className="civic-glossary-section" style={{ marginTop: "var(--space-6)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-4)",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span>📖</span>
          <span>{t("glossaryTitle")}</span>
          <Badge variant="neutral">{displayTerms.length}</Badge>
        </h3>

        {detectedTerms.length > 0 && showAllFallback && (
          <Button
            type="button"
            variant="text"
            size="sm"
            onClick={() => setShowAll((prev) => !prev)}
            style={{ fontSize: "0.8125rem" }}
          >
            {showAll ? "Show Detected Terms Only" : "View Full Civic Glossary"}
          </Button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {displayTerms.map((entry) => (
          <Card
            key={entry.id}
            variant="default"
            style={{
              padding: "var(--space-4)",
              borderLeft: "4px solid var(--sahayak-orange)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "var(--space-2)",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "var(--sahayak-blue-dark)",
                }}
              >
                {entry.term}
              </span>
              <Badge variant="neutral" style={{ fontSize: "0.6875rem" }}>
                {entry.category}
              </Badge>
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {entry.definition}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
