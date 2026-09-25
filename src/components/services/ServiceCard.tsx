/**
 * Sahayak AI — Public Service Card Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 19 & DATA-CONTRACTS.md Section 8
 * Phase: P05 — Services & Deterministic Task Guidance
 * 
 * Displays a verified public service card with scannable metadata, category badge,
 * document count, step count, and direct link to guidance.
 */

import React from "react";
import type { Service } from "../../core/shared/types";
import { useLanguage } from "../../core/language";
import { Card, CardHeader, CardTitle, CardBody, CardFooter, Badge, Button } from "../ui";
import { Link } from "../../router";

export interface ServiceCardProps {
  service: Service;
  onSelect?: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const { language, t } = useLanguage();

  const serviceName = service.name[language] || service.name.en;
  const serviceDesc = service.description[language] || service.description.en;

  const handleAction = () => {
    if (onSelect) {
      onSelect(service.id);
    }
  };

  return (
    <Card
      className="service-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div>
        <CardHeader style={{ flexDirection: "column", alignItems: "flex-start", gap: "var(--space-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", gap: "var(--space-2)" }}>
            <Badge variant="info" size="sm">
              {service.category}
            </Badge>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {service.state}
            </span>
          </div>

          <CardTitle style={{ fontSize: "1.25rem", color: "var(--sahayak-blue-dark)" }}>
            {serviceName}
          </CardTitle>
        </CardHeader>

        <CardBody style={{ paddingTop: 0 }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "var(--space-4)" }}>
            {serviceDesc}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
              fontSize: "0.8125rem",
              color: "var(--text-primary)",
              marginBottom: "var(--space-2)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "var(--surface-soft)",
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
              }}
            >
              📄 {service.documents.length} {t("requiredDocsCount")}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "var(--surface-soft)",
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
              }}
            >
              🧭 {service.steps.length} {t("stepsCount")}
            </span>
          </div>
        </CardBody>
      </div>

      <CardFooter style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-3)" }}>
        <Link
          href={`/services/${service.id}`}
          style={{ textDecoration: "none", width: "100%" }}
          onClick={handleAction}
          aria-label={`${t("viewGuidance")}: ${serviceName}`}
        >
          <Button variant="primary" style={{ width: "100%" }}>
            {t("viewGuidance")} →
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
