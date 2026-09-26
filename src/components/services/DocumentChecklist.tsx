/**
 * Sahayak AI — Mandatory Document Checklist Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 20 & DATA-CONTRACTS.md Section 8
 * Phase: P05 — Services & Deterministic Task Guidance
 * 
 * Renders an interactive prerequisite checklist for verified public services.
 * Features:
 * 1. Accessible checkbox toggles for each verified document requirement.
 * 2. Session/local state persistence across page interactions.
 * 3. Clear civic privacy disclaimer (Sahayak does not upload or retain documents).
 */

import React, { useState, useEffect } from "react";
import { useLanguage, getLocalizedDocument } from "../../core/language";
import { Badge } from "../ui";

export interface DocumentChecklistProps {
  serviceId: string;
  documents: string[];
}

const STORAGE_PREFIX = "sahayak_docs_";

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  serviceId,
  documents,
}) => {
  const { t, language } = useLanguage();

  const [checkedDocs, setCheckedDocs] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.sessionStorage?.getItem(`${STORAGE_PREFIX}${serviceId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (_e) {
        // Fallback to empty list
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage?.setItem(
          `${STORAGE_PREFIX}${serviceId}`,
          JSON.stringify(checkedDocs)
        );
      } catch (_e) {
        // Ignore quota/privacy error
      }
    }
  }, [checkedDocs, serviceId]);

  const toggleDocument = (doc: string) => {
    setCheckedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const isAllChecked = documents.length > 0 && checkedDocs.length === documents.length;

  return (
    <div
      className="document-checklist"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        padding: "var(--space-6)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          marginBottom: "var(--space-3)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.125rem",
            color: "var(--sahayak-blue-dark)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span>📋</span> {t("requiredDocuments")}
        </h3>

        <Badge variant={isAllChecked ? "success" : "info"} size="sm">
          {checkedDocs.length} {t("of")} {documents.length} {t("docsPrepared")}
        </Badge>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          marginBottom: "var(--space-4)",
        }}
      >
        {t("documentsGuidance")}
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
        aria-label={t("requiredDocuments")}
      >
        {documents.map((doc, idx) => {
          const checkboxId = `doc-check-${serviceId}-${idx}`;
          const isChecked = checkedDocs.includes(doc);
          const localizedDoc = getLocalizedDocument(doc, language);

          return (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-3)",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-button)",
                backgroundColor: isChecked ? "var(--surface-soft)" : "transparent",
                border: "1px solid",
                borderColor: isChecked ? "var(--border-strong)" : "var(--border)",
                transition: "all var(--transition-fast)",
              }}
            >
              <input
                type="checkbox"
                id={checkboxId}
                checked={isChecked}
                onChange={() => toggleDocument(doc)}
                style={{
                  width: "18px",
                  height: "18px",
                  marginTop: "2px",
                  accentColor: "var(--sahayak-blue)",
                  cursor: "pointer",
                }}
                aria-label={localizedDoc}
              />
              <label
                htmlFor={checkboxId}
                style={{
                  fontSize: "0.9375rem",
                  color: isChecked ? "var(--text-secondary)" : "var(--text-primary)",
                  textDecoration: isChecked ? "line-through" : "none",
                  cursor: "pointer",
                  lineHeight: "1.4",
                  flex: 1,
                  userSelect: "none",
                }}
              >
                {localizedDoc}
              </label>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          marginTop: "var(--space-4)",
          paddingTop: "var(--space-3)",
          borderTop: "1px solid var(--border)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <span>🔒</span>
        <span>
          {language === "mr"
            ? "साहाय्यक एआय आपली प्रत्यक्ष किंवा डिजिटल कागदपत्रे संकलित किंवा अपलोड करत नाही."
            : language === "hi"
            ? "सहायक एआई आपके भौतिक या डिजिटल दस्तावेज़ एकत्र या अपलोड नहीं करता है।"
            : "Sahayak AI does not collect or upload your physical or digital documents."}
        </span>
      </div>
    </div>
  );
};
