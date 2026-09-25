/**
 * Sahayak AI — Welfare Scheme Card Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 23 & DATA-CONTRACTS.md Section 10
 * Phase: P06 — Scheme Finder
 * 
 * Scannable card rendering scheme metadata, category tag, key benefits teaser,
 * and navigation action to full profile.
 */

import React from "react";
import type { Scheme } from "../../core/shared/types";
import { useLanguage } from "../../core/language";
import { Card, CardHeader, CardTitle, CardBody, CardFooter, Badge, Button } from "../ui";
import { Link } from "../../router";

export interface SchemeCardProps {
  scheme: Scheme;
  onSelect?: (schemeId: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onSelect }) => {
  const { language, t } = useLanguage();

  const schemeName = scheme.name[language] || scheme.name.en;
  const primaryBenefit = scheme.benefits[0];
  const primaryEligibility = scheme.eligibility[0];

  const handleAction = () => {
    if (onSelect) {
      onSelect(scheme.id);
    }
  };

  return (
    <Card
      className="scheme-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div>
        <CardHeader style={{ flexDirection: "column", alignItems: "flex-start", gap: "var(--space-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Badge variant="success" size="sm">
              {scheme.category}
            </Badge>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {scheme.state}
            </span>
          </div>

          <CardTitle style={{ fontSize: "1.25rem", color: "var(--sahayak-blue-dark)" }}>
            {schemeName}
          </CardTitle>
        </CardHeader>

        <CardBody style={{ paddingTop: 0 }}>
          {/* Key Benefit Teaser */}
          {primaryBenefit && (
            <div style={{ marginBottom: "var(--space-3)" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--success)",
                  letterSpacing: "0.05em",
                  marginBottom: "2px",
                }}
              >
                💰 {t("benefitsProvided")}
              </span>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  margin: 0,
                  lineHeight: "1.4",
                  fontWeight: 500,
                }}
              >
                {primaryBenefit}
              </p>
            </div>
          )}

          {/* Key Eligibility Teaser */}
          {primaryEligibility && (
            <div style={{ marginBottom: "var(--space-3)" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  letterSpacing: "0.05em",
                  marginBottom: "2px",
                }}
              >
                🎯 {t("whoCanApply")}
              </span>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: "1.4",
                }}
              >
                {primaryEligibility}
              </p>
            </div>
          )}

          {/* Document count pill */}
          <div style={{ marginTop: "var(--space-2)" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "var(--surface-soft)",
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              📄 {scheme.documents.length} {t("mandatoryDocuments")}
            </span>
          </div>
        </CardBody>
      </div>

      <CardFooter style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-3)" }}>
        <Link
          href={`/schemes/${scheme.id}`}
          style={{ textDecoration: "none", width: "100%" }}
          onClick={handleAction}
          aria-label={`${t("viewSchemeDetails")}: ${schemeName}`}
        >
          <Button variant="primary" style={{ width: "100%" }}>
            {t("viewSchemeDetails")} →
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
