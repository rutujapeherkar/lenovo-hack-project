/**
 * Sahayak AI — Public Services Catalog & Guidance Page
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 19-21 & DATA-CONTRACTS.md Section 8-9
 * Phase: P05 — Services & Deterministic Task Guidance
 * 
 * Delivers:
 * 1. Verified Maharashtra public service discovery with multilingual search.
 * 2. Category filtering across verified government departments.
 * 3. Service details & deterministic task journey view for selected services.
 * 4. Safe fallback for unknown or ambiguous search queries.
 */

import React, { useState, useMemo } from "react";
import { ServiceRepository } from "../core/services/service-repository";
import { useLanguage } from "../core/language";
import { ServiceCard, ServiceDetails } from "../components/services";
import { Badge, Button, Input, Alert } from "../components/ui";
import { useRouter } from "../router";

export interface ServicesPageProps {
  initialServiceId?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ initialServiceId }) => {
  const { language, t } = useLanguage();
  const { path, navigate } = useRouter();

  // Extract service ID from URL path (e.g. /services/income-certificate)
  const routeServiceId = useMemo(() => {
    if (initialServiceId) return initialServiceId;
    if (path.startsWith("/services/")) {
      const id = path.replace("/services/", "").split("/")[0].trim();
      return id.length > 0 ? id : undefined;
    }
    return undefined;
  }, [path, initialServiceId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allServices = useMemo(() => ServiceRepository.getAllServices(), []);
  const categories = useMemo(() => ServiceRepository.getCategories(), []);

  // Filter and search services
  const filteredServices = useMemo(() => {
    let result = allServices;

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const searched = ServiceRepository.searchServices(searchQuery, language);
      const searchIds = new Set(searched.map((s) => s.id));
      result = result.filter((s) => searchIds.has(s.id));
    }

    return result;
  }, [allServices, selectedCategory, searchQuery, language]);

  // If a specific service is requested via route, render ServiceDetails
  if (routeServiceId) {
    const selectedService = ServiceRepository.getServiceById(routeServiceId);

    if (!selectedService) {
      return (
        <div className="services-not-found" style={{ maxWidth: "600px", margin: "var(--space-12) auto", textAlign: "center" }}>
          <Alert variant="warning" style={{ marginBottom: "var(--space-6)" }}>
            <strong>Service Not Found / सेवा आढळली नाही</strong>
            <p style={{ margin: "var(--space-2) 0 0 0" }}>
              The requested service <code>{routeServiceId}</code> is not present in the verified Maharashtra service registry.
            </p>
          </Alert>
          <Button variant="primary" onClick={() => navigate("/services")}>
            ← {t("backToServices")}
          </Button>
        </div>
      );
    }

    return (
      <ServiceDetails
        service={selectedService}
        onBack={() => navigate("/services")}
      />
    );
  }

  // Otherwise, render the searchable catalog
  return (
    <div className="services-catalog-page">
      {/* Page Header */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Badge variant="info" style={{ marginBottom: "var(--space-2)" }}>
          नागरी सेवा मार्गदर्शक • Maharashtra Public Services
        </Badge>
        <h1
          style={{
            fontSize: "2rem",
            color: "var(--sahayak-blue-dark)",
            marginBottom: "var(--space-2)",
            lineHeight: "1.2",
          }}
        >
          {t("servicesTitle")}
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
          {t("servicesSubtitle")}
        </p>
      </div>

      {/* Search and Category Filter Section */}
      <div
        className="services-filter-controls"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-card)",
          padding: "var(--space-5)",
          marginBottom: "var(--space-8)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ marginBottom: "var(--space-4)" }}>
          <Input
            id="service-search-input"
            label="Search Services / सेवा शोधा"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t("searchPlaceholder")}
          />
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
            role="group"
            aria-label={t("filterByCategory")}
          >
            <button
              type="button"
              className={`btn btn-sm ${selectedCategory === "all" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedCategory("all")}
              aria-pressed={selectedCategory === "all"}
              style={{ padding: "6px 14px", fontSize: "0.8125rem", minHeight: "36px" }}
            >
              {t("allCategories")} ({allServices.length})
            </button>

            {categories.map((cat) => {
              const count = allServices.filter((s) => s.category === cat).length;
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

      {/* Services Grid or Safe Fallback */}
      {filteredServices.length > 0 ? (
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
              Showing {filteredServices.length} verified service{filteredServices.length > 1 ? "s" : ""}
            </span>
          </div>

          <div
            className="grid grid-cols-1 grid-cols-2-md grid-cols-3-lg"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={(id) => navigate(`/services/${id}`)}
              />
            ))}
          </div>
        </>
      ) : (
        /* Safe Fallback for Unknown / Ambiguous Search */
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
          <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>🔍</div>
          <h3 style={{ color: "var(--sahayak-blue-dark)", marginBottom: "var(--space-2)" }}>
            {t("noServicesFound")}
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)", lineHeight: "1.5" }}>
            {language === "mr"
              ? "आपण प्रविष्ट केलेल्या शब्दांसाठी कोणतीही पडताळलेली महाराष्ट्र सेवा सापडली नाही. कृपया अचूक कीवर्ड वापरा किंवा खालील पर्यायांवर क्लिक करा."
              : language === "hi"
              ? "आपके द्वारा दर्ज किए गए शब्दों के लिए कोई सत्यापित महाराष्ट्र सेवा नहीं मिली। कृपया सटीक कीवर्ड का उपयोग करें या नीचे दिए गए विकल्पों पर क्लिक करें।"
              : "No verified Maharashtra government services matched your query. You can view all available services or consult Sahayak Assistant."}
          </p>

          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="primary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              {t("browseAllServices")}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Ask Sahayak AI / साहाय्यकला विचारा
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
