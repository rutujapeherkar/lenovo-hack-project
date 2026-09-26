/**
 * Sahayak AI — Scheme Details Profile Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 22 & DATA-CONTRACTS.md Section 10-11
 * Phase: P06 — Scheme Finder
 * 
 * Renders the full profile of a verified welfare scheme:
 * 1. Overview and category metadata.
 * 2. Grounded AI plain-language simplification.
 * 3. Dedicated Eligibility Criteria section.
 * 4. Benefits and financial assistance breakdown.
 * 5. Mandatory documents checklist.
 * 6. Official source authority box with verified outbound link.
 * 7. Civic safety disclaimers.
 */

import React, { useState } from "react";
import type { Scheme } from "../../core/shared/types";
import { useLanguage, getLocalizedDocument } from "../../core/language";
import { SchemeService } from "../../core/schemes/scheme-service";
import { EligibilityList } from "./EligibilityList";
import { OfficialSourceBox } from "./OfficialSourceBox";
import { Button, Badge, Alert } from "../ui";
import { Link } from "../../router";
import { ReadAloud } from "../accessibility";

export interface SchemeDetailsProps {
  scheme: Scheme;
  onBack?: () => void;
}

export const SchemeDetails: React.FC<SchemeDetailsProps> = ({ scheme, onBack }) => {
  const { language, t } = useLanguage();

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<boolean>(false);

  const schemeName = scheme.name[language] || scheme.name.en;

  const handleExplain = async () => {
    setLoadingExplanation(true);
    try {
      const explanation = await SchemeService.explainScheme(scheme, language);
      setAiExplanation(explanation);
    } catch (_e) {
      setAiExplanation("Unable to generate AI explanation at this time. Please refer to verified details below.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <div className="scheme-details-view" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Back Navigation Bar */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Link
          href="/schemes"
          onClick={onBack}
          style={{ textDecoration: "none" }}
          aria-label={t("backToSchemes")}
        >
          <Button variant="secondary" size="sm">
            ← {t("backToSchemes")}
          </Button>
        </Link>
      </div>

      {/* Scheme Header Card */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-card)",
          padding: "var(--space-6)",
          boxShadow: "var(--shadow-card)",
          marginBottom: "var(--space-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            marginBottom: "var(--space-2)",
            flexWrap: "wrap",
          }}
        >
          <Badge variant="success">{scheme.category}</Badge>
          <Badge variant="neutral">{scheme.state}</Badge>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginLeft: "auto" }}>
            ID: <code>{scheme.id}</code>
          </span>
        </div>

        <h1
          style={{
            fontSize: "2rem",
            color: "var(--sahayak-blue-dark)",
            margin: "var(--space-2) 0 var(--space-4) 0",
            lineHeight: "1.25",
          }}
        >
          {schemeName}
        </h1>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-4)", alignItems: "center" }}>
          <Button
            variant="outline"
            onClick={handleExplain}
            disabled={loadingExplanation}
            aria-label={t("explainSchemeSimply")}
          >
            {loadingExplanation ? `✨ ${t("explainingScheme")}` : `✨ ${t("explainSchemeSimply")}`}
          </Button>

          <ReadAloud
            text={`${schemeName}. ${scheme.category}. ${scheme.benefits.slice(0, 2).join('. ')}`}
            language={language}
          />

          {scheme.officialSource?.url && (
            <a
              href={scheme.officialSource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button variant="primary">
                🏛️ {t("applyOnOfficialPortal")} ↗
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Grounded AI Explanation Box */}
      {aiExplanation && (
        <div
          className="ai-explanation-box"
          style={{
            backgroundColor: "var(--sahayak-blue-light)",
            border: "1px solid var(--sahayak-blue)",
            borderRadius: "var(--radius-card)",
            padding: "var(--space-6)",
            marginBottom: "var(--space-6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--sahayak-blue-dark)" }}>
              ✨ Sahayak AI Simplification (सुलभ मार्गदर्शन)
            </span>
            <Button variant="text" size="sm" onClick={() => setAiExplanation(null)}>
              ✕
            </Button>
          </div>
          <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: "1.6", color: "var(--text-primary)" }}>
            {aiExplanation}
          </p>
        </div>
      )}

      {/* Dedicated Eligibility Criteria Section */}
      <section style={{ marginBottom: "var(--space-6)" }} aria-label={t("whoCanApply")}>
        <EligibilityList eligibility={scheme.eligibility} />
      </section>

      {/* Benefits and Subsidies Section */}
      <section
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-card)",
          padding: "var(--space-6)",
          boxShadow: "var(--shadow-card)",
          marginBottom: "var(--space-6)",
        }}
        aria-label={t("benefitsProvided")}
      >
        <h3
          style={{
            margin: "0 0 var(--space-4) 0",
            fontSize: "1.125rem",
            color: "var(--sahayak-blue-dark)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span>💰</span> {t("benefitsProvided")}
        </h3>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {scheme.benefits.map((benefit, idx) => (
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
              <span style={{ color: "var(--success)", fontWeight: 700, fontSize: "1.125rem" }}>₹</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Mandatory Documents Section */}
      <section
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-card)",
          padding: "var(--space-6)",
          boxShadow: "var(--shadow-card)",
          marginBottom: "var(--space-6)",
        }}
        aria-label={t("mandatoryDocuments")}
      >
        <h3
          style={{
            margin: "0 0 var(--space-4) 0",
            fontSize: "1.125rem",
            color: "var(--sahayak-blue-dark)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span>📄</span> {t("mandatoryDocuments")}
        </h3>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {scheme.documents.map((doc, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-button)",
                backgroundColor: "var(--surface-soft)",
                border: "1px solid var(--border)",
                fontSize: "0.9375rem",
                color: "var(--text-primary)",
              }}
            >
              <span>📋</span>
              <span>{getLocalizedDocument(doc, language)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Official Government Source Section */}
      <section style={{ marginBottom: "var(--space-6)" }} aria-label={t("officialAuthority")}>
        <OfficialSourceBox
          officialSource={scheme.officialSource}
          lastVerified={scheme.lastVerified}
        />
      </section>

      {/* Mandatory Civic Safety & Procedural Disclaimer */}
      <Alert variant="info" style={{ marginBottom: "var(--space-8)" }}>
        <strong>⚠️ {t("disclaimer")}</strong>
      </Alert>
    </div>
  );
};
