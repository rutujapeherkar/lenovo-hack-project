/**
 * Sahayak AI — Assistant Service Orchestration Layer
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 9, 33 & DATA-CONTRACTS.md Section 20-24
 * Phase: P04 — AI Assistant Core
 * 
 * Orchestrates the canonical flow:
 * USER INPUT -> REQUEST NORMALIZATION -> INTENT DETECTION -> RETRIEVAL BOUNDARY -> AI PROVIDER -> VALIDATION -> SAHAYAK RESPONSE
 */

import type {
  AssistantRequest,
  Language,
  SahayakResponse,
  Service,
  Scheme,
} from "../shared/types";
import { isSahayakResponse, hasNoSensitiveKeys, isLanguage } from "../shared/validators";
import { detectIntent } from "./intent-engine";
import { getAIProvider } from "../ai/factory";
import { getServiceById, getSchemeById, getSchemes } from "../shared/data-loader";

export class AssistantService {
  /**
   * Processes an incoming citizen assistant request end-to-end.
   */
  public static async processRequest(rawRequest: unknown): Promise<SahayakResponse> {
    // 1. Validate & Normalize Request
    const normalizedRequest = this.validateAndNormalizeRequest(rawRequest);

    // 2. Sensitive Keys & Security Sanitization
    if (!hasNoSensitiveKeys(normalizedRequest)) {
      return this.createSafetyRefusalResponse(normalizedRequest.language);
    }

    // 3. Handle Empty or Whitespace Message
    if (!normalizedRequest.message || normalizedRequest.message.trim().length === 0) {
      return this.createIntroductoryResponse(normalizedRequest.language);
    }

    // 4. Intent Detection
    const detectedIntent = detectIntent(
      normalizedRequest.message,
      normalizedRequest.pageContext
    );

    // 5. Retrieval Boundary (Context enrichment without coupling AI to data storage)
    const contextEnrichment = this.retrieveContext(
      detectedIntent,
      normalizedRequest.message,
      normalizedRequest.language
    );

    // 6. AI Generation Boundary
    const provider = getAIProvider();
    const rawResponse = await provider.generateResponse({
      ...normalizedRequest,
    });

    // 7. Response Validation & Contract Enforcement
    if (!isSahayakResponse(rawResponse)) {
      console.warn("[AssistantService] Provider response failed contract validation; applying safety defaults.");
      const fallbackMsg = typeof (rawResponse as unknown as Record<string, unknown>)?.message === "string"
        ? (rawResponse as unknown as Record<string, unknown>).message as string
        : "Service guidance is available on official portals.";
      return {
        message: fallbackMsg,
        language: normalizedRequest.language,
        intent: detectedIntent,
        safetyNote: "Sahayak AI provides guidance and does not represent a government department.",
      };
    }

    // Ensure detected intent is preserved if provider did not assign one
    if (!rawResponse.intent) {
      rawResponse.intent = detectedIntent;
    }

    // Merge retrieved verified entities if provider omitted them but intent matched
    if (contextEnrichment.service && !rawResponse.service) {
      rawResponse.service = {
        id: contextEnrichment.service.id,
        name: contextEnrichment.service.name[normalizedRequest.language] || contextEnrichment.service.name.en,
      };
    }

    if (contextEnrichment.schemes && (!rawResponse.schemes || rawResponse.schemes.length === 0)) {
      rawResponse.schemes = contextEnrichment.schemes;
    }

    return rawResponse;
  }

  /**
   * Validates and normalizes incoming request payload against contract invariants.
   */
  private static validateAndNormalizeRequest(input: unknown): AssistantRequest {
    if (!input || typeof input !== "object") {
      return {
        message: "",
        language: "en",
      };
    }

    const obj = input as Record<string, unknown>;
    const rawLang = obj.language;
    const language: Language = isLanguage(rawLang) ? rawLang : "en";

    let message = typeof obj.message === "string" ? obj.message.trim() : "";
    if (message.length > 2000) {
      message = message.substring(0, 2000);
    }

    return {
      message,
      language,
      pageContext: obj.pageContext as AssistantRequest["pageContext"],
    };
  }

  /**
   * Context retrieval boundary: loads verified records from P03 registries matching the query.
   */
  private static retrieveContext(
    intent: string,
    message: string,
    _lang: Language
  ): { service?: Service; schemes?: Scheme[] } {
    const lower = message.toLowerCase();

    if (intent === "service_guidance" || intent === "service_discovery") {
      if (lower.includes("income") || lower.includes("उत्पन्न") || lower.includes("आय")) {
        return { service: getServiceById("income-certificate") };
      }
      if (lower.includes("domicile") || lower.includes("अधिवास") || lower.includes("रहिवासी") || lower.includes("निवास")) {
        return { service: getServiceById("domicile-certificate") };
      }
      if (lower.includes("ration") || lower.includes("रेशन") || lower.includes("राशन")) {
        return { service: getServiceById("ration-card-member-addition") };
      }
    }

    if (intent === "scheme_discovery") {
      if (lower.includes("scholarship") || lower.includes("शिष्यवृत्ती") || lower.includes("छात्रवृत्ति") || lower.includes("ebc")) {
        const sc = getSchemeById("rcsms-shikshan-shulkh-shishyavrutti");
        return { schemes: sc ? [sc] : undefined };
      }
      if (lower.includes("ladki") || lower.includes("लाडकी") || lower.includes("बहीण")) {
        const sc = getSchemeById("majhi-ladki-bahin-yojna");
        return { schemes: sc ? [sc] : undefined };
      }
      if (lower.includes("pension") || lower.includes("पेन्शन") || lower.includes("संजय गांधी")) {
        const sc = getSchemeById("sanjay-gandhi-niradhar-yojna");
        return { schemes: sc ? [sc] : undefined };
      }
      return { schemes: getSchemes().slice(0, 3) };
    }

    return {};
  }

  private static createSafetyRefusalResponse(lang: Language): SahayakResponse {
    const messages: Record<Language, string> = {
      en: "Security Alert: Sahayak AI never requests or processes passwords, OTPs, PINs, or banking credentials. Never share these with anyone.",
      mr: "सुरक्षा सूचना: सहायक एआय कधीही पासवर्ड, ओटीपी, पिन किंवा बँक तपशील विचारत नाही. हे तपशील कोणाशीही शेअर करू नका.",
      hi: "सुरक्षा चेतावनी: सहायक एआई कभी भी पासवर्ड, ओटीपी, पिन या बैंक क्रेडेंशियल नहीं मांगता है। इन्हें किसी के साथ साझा न करें।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: "general_information",
      safetyNote: "Never share confidential security credentials or OTPs with any person or software application.",
    };
  }

  private static createIntroductoryResponse(lang: Language): SahayakResponse {
    const messages: Record<Language, string> = {
      en: "Namaste! I am Sahayak AI. How may I assist you today with Maharashtra government services, certificates, or welfare schemes?",
      mr: "नमस्कार! मी सहायक एआय आहे. महाराष्ट्र शासकीय सेवा, प्रमाणपत्रे किंवा कल्याणकारी योजनांबाबत मी आपल्याला कशी मदत करू शकतो?",
      hi: "नमस्ते! मैं सहायक एआई हूं। महाराष्ट्र सरकारी सेवाओं, प्रमाण पत्रों या कल्याणकारी योजनाओं के संबंध में आज मैं आपकी क्या सहायता कर सकता हूं?",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: "general_information",
      safetyNote: "Sahayak AI provides public guidance and does not represent a government department.",
    };
  }
}

/**
 * Convenience wrapper for the assistant orchestrator.
 */
export async function processAssistantRequest(request: AssistantRequest): Promise<SahayakResponse> {
  return AssistantService.processRequest(request);
}
