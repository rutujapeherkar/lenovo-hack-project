/**
 * Sahayak AI — Welfare Scheme Finder & Discovery Page
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 22-23 & DATA-CONTRACTS.md Section 10, 40
 * Phase: P06 — Scheme Finder
 * 
 * Provides:
 * 1. Faceted filtering by category and beneficiary demographic.
 * 2. Multilingual keyword and natural-language scheme query processing.
 * 3. Scannable scheme result cards.
 * 4. Comprehensive scheme details profile and grounded AI explanation.
 * 5. Honest empty states with links to official discovery portals.
 */

import React, { useState, useMemo } from "react";
import { SchemeRepository } from "../core/schemes/scheme-repository";
import { useLanguage } from "../core/language";
import { SchemeCard, SchemeDetails } from "../components/schemes";
import { Badge, Button, Input, Alert } from "../components/ui";
import { useRouter } from "../router";

export interface SchemesPageProps {
  initialSchemeId?: string;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({ initialSchemeId }) => {
  const { language, t } = useLanguage();
  const { path, navigate } = useRouter();

  // Extract scheme ID from URL path (e.g. /schemes/majhi-ladki-bahin-yojna)
  const routeSchemeId = useMemo(() => {
    if (initialSchemeId) return initialSchemeId;
    if (path.startsWith("/schemes/")) {
      const id = path.replace("/schemes/", "").split("/")[0].trim();
      return id.length > 0 ? id : undefined;
    }
    return undefined;
  }, [path, initialSchemeId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>("all");

  const allSchemes = useMemo(() => SchemeRepository.getAllSchemes(), []);
  const categories = useMemo(() => SchemeRepository.getCategories(), []);

  const beneficiaryOptions = [
    { id: "all", labelEn: "All Beneficiaries", labelMr: "सर्व लाभार्थी", labelHi: "सभी लाभार्थी" },
    { id: "student", labelEn: "Students", labelMr: "विद्यार्थी", labelHi: "छात्र" },
    { id: "farmer", labelEn: "Farmers", labelMr: "शेतकरी", labelHi: "किसान" },
    { id: "woman", labelEn: "Women", labelMr: "महिला", labelHi: "महिलाएं" },
    { id: "senior_citizen", labelEn: "Senior Citizens", labelMr: "ज्येष्ठ नागरिक", labelHi: "वरिष्ठ नागरिक" },
    { id: "divyang", labelEn: "Divyang / Disability", labelMr: "दिव्यांग व्यक्ती", labelHi: "दिव्यांग व्यक्ति" },
  ];

  // Multi-facet filtering
  const filteredSchemes = useMemo(() => {
    let result = allSchemes;

    // 1. Filter by category
    if (selectedCategory !== "all") {
      result = SchemeRepository.filterByCategory(selectedCategory);
    }

    // 2. Filter by beneficiary
    if (selectedBeneficiary !== "all") {
      const byBeneficiary = SchemeRepository.filterByBeneficiary(selectedBeneficiary);
      const bIds = new Set(byBeneficiary.map((s) => s.id));
      result = result.filter((s) => bIds.has(s.id));
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const searched = SchemeRepository.searchSchemes(searchQuery, language);
      const sIds = new Set(searched.map((s) => s.id));
      result = result.filter((s) => sIds.has(s.id));
    }

    return result;
  }, [allSchemes, selectedCategory, selectedBeneficiary, searchQuery, language]);

  // If a specific scheme is selected via URL route, render SchemeDetails
  if (routeSchemeId) {
    const selectedScheme = SchemeRepository.getSchemeById(routeSchemeId);

    if (!selectedScheme) {
      return (
        <div className="schemes-not-found" style={{ maxWidth: "600px", margin: "var(--space-12) auto", textAlign: "center" }}>
          <Alert variant="warning" style={{ marginBottom: "var(--space-6)" }}>
            <strong>Scheme Not Found / योजना आढळली नाही</strong>
            <p style={{ margin: "var(--space-2) 0 0 0" }}>
              The requested scheme <code>{routeSchemeId}</code> is not present in the verified Maharashtra schemes registry.
            </p>
          </Alert>
          <Button variant="primary" onClick={() => navigate("/schemes")}>
            ← {t("backToSchemes")}
          </Button>
        </div>
      );
    }

    return (
      <SchemeDetails
        scheme={selectedScheme}
        onBack={() => navigate("/schemes")}
      />
    );
  }

  // Otherwise, render Scheme Finder Catalog
  return (
    <div className="schemes-finder-page">
      {/* Page Header */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Badge variant="success" style={{ marginBottom: "var(--space-2)" }}>
          कल्याणकारी योजना शोध • Verified Welfare Schemes
        </Badge>
        <h1
          style={{
            fontSize: "2rem",
            color: "var(--sahayak-blue-dark)",
            marginBottom: "var(--space-2)",
            lineHeight: "1.2",
          }}
        >
          {t("schemesTitle")}
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            maxWidth: "800px",
            lineHeight: "1.5",
            margin: 0,
          }}
        >
          {t("schemesSubtitle")}
        </p>
      </div>

      {/* Filter and Search Box */}
      <div
        className="schemes-filter-panel"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-card)",
          padding: "var(--space-5)",
          marginBottom: "var(--space-8)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Search Input */}
        <div style={{ marginBottom: "var(--space-4)" }}>
          <Input
            id="scheme-search-input"
            label="Search Schemes / योजना शोधा"
            placeholder={t("searchSchemesPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t("searchSchemesPlaceholder")}
          />
        </div>

        {/* Beneficiary Demographic Pills */}
        <div style={{ marginBottom: "var(--space-4)" }}>
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: "var(--space-2)",
            }}
          >
            {t("beneficiaryGroup")}:
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }} role="group" aria-label={t("beneficiaryGroup")}>
            {beneficiaryOptions.map((opt) => {
              const label = language === "mr" ? opt.labelMr : language === "hi" ? opt.labelHi : opt.labelEn;
              const isSelected = selectedBeneficiary === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setSelectedBeneficiary(opt.id)}
                  aria-pressed={isSelected}
                  style={{ padding: "6px 14px", fontSize: "0.8125rem", minHeight: "36px" }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div>
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: "var(--space-2)",
            }}
          >
            {t("filterByCategory")}:
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }} role="group" aria-label={t("filterByCategory")}>
            <button
              type="button"
              className={`btn btn-sm ${selectedCategory === "all" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedCategory("all")}
              aria-pressed={selectedCategory === "all"}
              style={{ padding: "6px 14px", fontSize: "0.8125rem", minHeight: "36px" }}
            >
              {t("allCategories")} ({allSchemes.length})
            </button>

            {categories.map((cat) => {
              const count = allSchemes.filter((s) => s.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isSelected}
                  style={{ padding: "6px 14px", fontSize: "0.8125rem", minHeight: "36px" }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredSchemes.length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-4)",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Showing {filteredSchemes.length} verified scheme{filteredSchemes.length > 1 ? "s" : ""}
            </span>
          </div>

          <div
            className="grid grid-cols-1 grid-cols-2-md grid-cols-3-lg"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {filteredSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onSelect={(id) => navigate(`/schemes/${id}`)}
              />
            ))}
          </div>
        </>
      ) : (
        /* Honest Empty State linking to official government discovery portals */
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px dashed var(--border-strong)",
            borderRadius: "var(--radius-card)",
            padding: "var(--space-8)",
            textAlign: "center",
            maxWidth: "700px",
            margin: "var(--space-6) auto",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>🌾</div>
          <h3 style={{ color: "var(--sahayak-blue-dark)", marginBottom: "var(--space-2)" }}>
            {t("noSchemesFound")}
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)", lineHeight: "1.5" }}>
            {t("noSchemesFoundDesc")}
          </p>

          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
            <Button
              variant="primary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedBeneficiary("all");
              }}
            >
              {t("browseAllSchemes")}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Ask Sahayak Assistant / सहाय्यकला विचारा
            </Button>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "var(--space-4)",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
            }}
          >
            <span>Official Government Discovery Portals: </span>
            <a
              href="https://www.myscheme.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--sahayak-blue)", textDecoration: "underline", marginRight: "12px" }}
            >
              myScheme Portal ↗
            </a>
            <a
              href="https://mahadbt.maharashtra.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--sahayak-blue)", textDecoration: "underline" }}
            >
              MahaDBT Portal ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
