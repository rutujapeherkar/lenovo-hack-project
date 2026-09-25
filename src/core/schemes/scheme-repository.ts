/**
 * Sahayak AI — Verified Scheme Repository
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 14-15 & DATA-CONTRACTS.md Section 10, 40
 * Phase: P06 — Scheme Finder
 * 
 * Provides deterministic retrieval, multi-facet filtering, and multilingual keyword/semantic search
 * for verified Maharashtra welfare schemes. All records are sourced from verified registries.
 * Anti-hallucination invariant: Never invents or generates unverified schemes or URLs.
 */

import type { Scheme, Language, SchemeDiscoveryResult } from "../shared/types";
import { getSchemes, getSchemeById, getSchemesByCategory } from "../shared/data-loader";

export class SchemeRepository {
  /**
   * Retrieves all verified Maharashtra and applicable Central welfare schemes.
   */
  public static getAllSchemes(): Scheme[] {
    return getSchemes();
  }

  /**
   * Looks up a verified welfare scheme by unique identifier.
   */
  public static getSchemeById(id: string): Scheme | undefined {
    return getSchemeById(id);
  }

  /**
   * Retrieves all unique categories present in the verified scheme registry.
   */
  public static getCategories(): string[] {
    const schemes = getSchemes();
    const categories = new Set<string>();
    for (const scheme of schemes) {
      if (scheme.category) {
        categories.add(scheme.category);
      }
    }
    return Array.from(categories);
  }

  /**
   * Filters verified schemes by category.
   * Supports both exact category names and case-insensitive keyword matching (e.g. "education", "agriculture").
   */
  public static filterByCategory(category: string): Scheme[] {
    if (!category || category === "all" || category === "All") {
      return getSchemes();
    }

    const schemes = getSchemes();
    const normalized = category.trim().toLowerCase();

    // 1. Try exact match first
    const exactMatches = getSchemesByCategory(category);
    if (exactMatches.length > 0) {
      return exactMatches;
    }

    // 2. Partial / keyword match on category string
    return schemes.filter((scheme) =>
      scheme.category.toLowerCase().includes(normalized)
    );
  }

  /**
   * Filters verified schemes by broad beneficiary group.
   * Maps user demographic/need to relevant scheme categories and eligibility criteria.
   */
  public static filterByBeneficiary(beneficiary: string): Scheme[] {
    const b = beneficiary.trim().toLowerCase();
    if (!b || b === "all") return getSchemes();

    const schemes = getSchemes();

    return schemes.filter((s) => {
      const text = [
        s.id,
        s.name.en,
        s.name.mr,
        s.name.hi,
        s.category,
        ...s.eligibility,
        ...s.benefits,
      ]
        .join(" ")
        .toLowerCase();

      if (b === "student" || b === "education" || b === "विद्यार्थी") {
        return text.includes("student") || text.includes("scholarship") || text.includes("admission") || text.includes("विद्यार्थी");
      }
      if (b === "farmer" || b === "agriculture" || b === "शेतकरी") {
        return text.includes("farmer") || text.includes("cultivable") || text.includes("landholder") || text.includes("शेतकरी");
      }
      if (b === "woman" || b === "women" || b === "महिला") {
        return text.includes("woman") || text.includes("women") || text.includes("महिला") || text.includes("widow");
      }
      if (b === "senior_citizen" || b === "senior" || b === "elderly" || b === "ज्येष्ठ नागरिक") {
        return text.includes("senior citizen") || text.includes("65 years") || text.includes("ज्येष्ठ");
      }
      if (b === "divyang" || b === "disability" || b === "दिव्यांग" || b === "अपंग") {
        return text.includes("disability") || text.includes("divyang") || text.includes("अपंग") || text.includes("दिव्यांग") || text.includes("udid");
      }

      return text.includes(b);
    });
  }

  /**
   * Searches verified schemes by multilingual keyword, phrase, or topic.
   * Matches across English, Marathi, and Hindi names, categories, eligibility, benefits, and documents.
   */
  public static searchSchemes(query: string, language?: Language): Scheme[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return getSchemes();
    }

    const schemes = getSchemes();

    return schemes.filter((scheme) => {
      // 1. Direct ID match
      if (scheme.id.toLowerCase().includes(trimmed)) {
        return true;
      }

      // 2. Multilingual Name match
      if (
        scheme.name.en.toLowerCase().includes(trimmed) ||
        scheme.name.mr.toLowerCase().includes(trimmed) ||
        scheme.name.hi.toLowerCase().includes(trimmed)
      ) {
        return true;
      }

      // 3. Category match
      if (scheme.category.toLowerCase().includes(trimmed)) {
        return true;
      }

      // 4. Eligibility criteria match
      const eligibilityMatch = scheme.eligibility.some((item) =>
        item.toLowerCase().includes(trimmed)
      );
      if (eligibilityMatch) {
        return true;
      }

      // 5. Benefits match
      const benefitsMatch = scheme.benefits.some((item) =>
        item.toLowerCase().includes(trimmed)
      );
      if (benefitsMatch) {
        return true;
      }

      // 6. Documents requirement match
      const docsMatch = scheme.documents.some((item) =>
        item.toLowerCase().includes(trimmed)
      );
      if (docsMatch) {
        return true;
      }

      // 7. Common Multilingual Synonyms & Topics
      // Disability / Divyang: "divyang", "disability", "अपंग", "दिव्यांग"
      if (
        (trimmed.includes("divyang") || trimmed.includes("disability") || trimmed.includes("अपंग") || trimmed.includes("दिव्यांग")) &&
        (scheme.id === "divyang-self-employment-assistance" || scheme.id === "sanjay-gandhi-niradhar-yojna")
      ) {
        return true;
      }

      // Education / Scholarships: "scholarship", "student", "विद्यार्थी", "शिष्यवृत्ती", "छात्रवृत्ति", "ebc"
      if (
        (trimmed.includes("scholarship") || trimmed.includes("student") || trimmed.includes("education") || trimmed.includes("विद्यार्थी") || trimmed.includes("शिष्यवृत्ती") || trimmed.includes("छात्रवृत्ति") || trimmed.includes("ebc")) &&
        scheme.id === "rcsms-shikshan-shulkh-shishyavrutti"
      ) {
        return true;
      }

      // Farmers / Agriculture: "farmer", "agriculture", "kisan", "शेतकरी", "किसान", "शेती"
      if (
        (trimmed.includes("farmer") || trimmed.includes("agriculture") || trimmed.includes("kisan") || trimmed.includes("शेतकरी") || trimmed.includes("किसान") || trimmed.includes("शेती") || trimmed.includes("कृषी")) &&
        scheme.id === "pm-kisan-maharashtra"
      ) {
        return true;
      }

      // Women / Ladki Bahin: "women", "woman", "ladki", "महिला", "लाडकी", "बहीण"
      if (
        (trimmed.includes("women") || trimmed.includes("woman") || trimmed.includes("ladki") || trimmed.includes("महिला") || trimmed.includes("लाडकी") || trimmed.includes("बहीण")) &&
        scheme.id === "majhi-ladki-bahin-yojna"
      ) {
        return true;
      }

      // Pension / Senior Citizen: "pension", "senior", "elderly", "निवृत्तीवेतन", "पेन्शन", "ज्येष्ठ", "पेंशन", "श्रावणबाळ"
      if (
        (trimmed.includes("pension") || trimmed.includes("senior") || trimmed.includes("elderly") || trimmed.includes("निवृत्तीवेतन") || trimmed.includes("पेन्शन") || trimmed.includes("ज्येष्ठ") || trimmed.includes("पेंशन") || trimmed.includes("श्रावणबाळ")) &&
        (scheme.id === "shravanbal-sewa-nivruttivetan" || scheme.id === "sanjay-gandhi-niradhar-yojna")
      ) {
        return true;
      }

      // Language-specific fallback check
      if (language && scheme.name[language]) {
        if (scheme.name[language].toLowerCase().includes(trimmed)) {
          return true;
        }
      }

      return false;
    });
  }

  /**
   * Discovers schemes matching the canonical SchemeDiscoveryResult contract.
   */
  public static discoverSchemes(query: string, language: Language): SchemeDiscoveryResult {
    const matching = this.searchSchemes(query, language);
    return {
      schemes: matching,
      query,
      language,
    };
  }
}

// Standalone function exports for convenience
export const getAllSchemes = SchemeRepository.getAllSchemes;
export const getScheme = SchemeRepository.getSchemeById;
export const searchSchemes = SchemeRepository.searchSchemes;
export const filterSchemesByCategory = SchemeRepository.filterByCategory;
export const filterSchemesByBeneficiary = SchemeRepository.filterByBeneficiary;
export const getSchemeCategories = SchemeRepository.getCategories;
export const discoverSchemes = SchemeRepository.discoverSchemes;
