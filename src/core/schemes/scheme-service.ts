/**
 * Sahayak AI — Scheme Guidance & AI Simplification Service
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 14 & DATA-CONTRACTS.md Section 10-11
 * Phase: P06 — Scheme Finder
 * 
 * Coordinates multi-facet scheme matching and grounded AI explanation.
 * Invariants:
 * 1. AI explanation is grounded exclusively in verified Scheme records.
 * 2. Never invents synthetic eligibility conditions, benefits, or URLs.
 * 3. Does not calculate fake eligibility probabilities ("95% eligible").
 * 4. Client-safe: delegates to server-side assistant API with offline deterministic fallback.
 */

import type { Scheme, Language } from "../shared/types";
import { SchemeRepository } from "./scheme-repository";

export interface SchemeFilterOptions {
  category?: string;
  beneficiary?: string;
  query?: string;
  language?: Language;
}

export class SchemeService {
  /**
   * Retrieves schemes matching search criteria, category, and beneficiary filters.
   */
  public static findSchemes(options: SchemeFilterOptions): Scheme[] {
    const { category, beneficiary, query, language } = options;

    let results = SchemeRepository.getAllSchemes();

    // 1. Filter by category
    if (category && category !== "all" && category !== "All") {
      results = SchemeRepository.filterByCategory(category);
    }

    // 2. Filter by beneficiary group
    if (beneficiary && beneficiary !== "all" && beneficiary !== "All") {
      const byBeneficiary = SchemeRepository.filterByBeneficiary(beneficiary);
      const bIds = new Set(byBeneficiary.map((s) => s.id));
      results = results.filter((s) => bIds.has(s.id));
    }

    // 3. Search query
    if (query && query.trim().length > 0) {
      const searched = SchemeRepository.searchSchemes(query, language);
      const sIds = new Set(searched.map((s) => s.id));
      results = results.filter((s) => sIds.has(s.id));
    }

    return results;
  }

  /**
   * Generates a plain-language civic explanation of a verified scheme.
   * Strictly grounded in verified data: never introduces unvetted rules or URLs.
   */
  public static async explainScheme(scheme: Scheme, language: Language): Promise<string> {
    const schemeName = scheme.name[language] || scheme.name.en;

    const groundedContext = `
SCHEME: ${schemeName}
CATEGORY: ${scheme.category}
STATE: ${scheme.state}
ELIGIBILITY:
${scheme.eligibility.map((e) => `- ${e}`).join("\n")}
BENEFITS:
${scheme.benefits.map((b) => `- ${b}`).join("\n")}
DOCUMENTS:
${scheme.documents.map((d) => `- ${d}`).join("\n")}
OFFICIAL AUTHORITY: ${scheme.officialSource.name}
`.trim();

    const instructionsByLanguage: Record<Language, string> = {
      en: "Explain the following verified government scheme in simple, plain language for a citizen. Summarize who can apply and what key benefits they will receive. Do NOT invent any facts or URLs.",
      mr: "खालील अधिकृत शासकीय योजना सामान्य नागरिकासाठी सोप्या भाषेत समजावून सांगा. कोण अर्ज करू शकते आणि काय लाभ मिळतील हे थोडक्यात सांगा. कोणतीही नवीन माहिती किंवा संकेतस्थळ स्वतःहून जोडू नका.",
      hi: "निम्नलिखित आधिकारिक सरकारी योजना को एक सामान्य नागरिक के लिए सरल भाषा में समझाएं। संक्षेप में बताएं कि कौन आवेदन कर सकता है और क्या लाभ मिलेंगे। कोई नई जानकारी या लिंक न जोड़ें.",
    };

    // Client/Server AI boundary: call backend assistant proxy if reachable
    if (typeof fetch !== "undefined") {
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `${instructionsByLanguage[language]}\n\n${groundedContext}`,
            language,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.message) {
            return json.data.message.trim();
          }
        }
      } catch (_e) {
        // Fall through to deterministic summary
      }
    }

    // Deterministic fallback explanation
    return this.createDeterministicSummary(scheme, language);
  }

  /**
   * Safe offline deterministic summary template.
   */
  public static createDeterministicSummary(scheme: Scheme, language: Language): string {
    const name = scheme.name[language] || scheme.name.en;
    const primaryBenefit = scheme.benefits[0] || "Financial and social welfare assistance";
    const primaryEligibility = scheme.eligibility[0] || "Residents of Maharashtra meeting scheme criteria";

    if (language === "mr") {
      return `"${name}" ही महाराष्ट्र शासनाची अधिकृत योजना आहे. या योजनेचा मुख्य उद्देश पात्र नागरिकांना सहाय्य करणे हा आहे. मुख्य लाभ: ${primaryBenefit}. प्रमुख पात्रता: ${primaryEligibility}. अर्जासाठी आवश्यक कागदपत्रे तयार ठेवा आणि अधिकृत पोर्टलला भेट द्या.`;
    }

    if (language === "hi") {
      return `"${name}" महाराष्ट्र सरकार की एक आधिकारिक योजना है। इसका मुख्य उद्देश्य पात्र नागरिकों को सहायता प्रदान करना है। मुख्य लाभ: ${primaryBenefit}। मुख्य पात्रता: ${primaryEligibility}। आवेदन के लिए आवश्यक दस्तावेज तैयार रखें और आधिकारिक पोर्टल पर जाएं।`;
    }

    return `"${name}" is an official welfare scheme in Maharashtra. Key benefit: ${primaryBenefit}. Primary eligibility requirement: ${primaryEligibility}. Review the required documents checklist and access the verified government portal to proceed.`;
  }
}
