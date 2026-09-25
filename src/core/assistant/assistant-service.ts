/**
 * Sahayak AI — Assistant Service Orchestration Layer
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 9, 33, 35 & SECURITY.md
 * Phase: P10 — Trust, Safety & Fallback
 * 
 * Orchestrates the canonical flow:
 * USER INPUT -> SANITIZATION -> INTENT DETECTION -> RETRIEVAL BOUNDARY -> AI PROVIDER -> VALIDATION -> SAHAYAK RESPONSE
 * With fallback to deterministic registry data whenever external AI providers fail.
 */

import type {
  AssistantRequest,
  Language,
  SahayakResponse,
  Service,
  Scheme,
  Intent,
} from "../shared/types";
import { isSahayakResponse, hasNoSensitiveKeys, isLanguage } from "../shared/validators";
import { detectIntent } from "./intent-engine";
import { getAIProvider } from "../ai/factory";
import { getServiceById, getSchemeById, getSchemes } from "../shared/data-loader";
import { sanitizeUserInput, SENSITIVE_WARNING_MESSAGES } from "../security/sanitizer";
import { validateOfficialSource } from "../security/official-url-validator";

export class AssistantService {
  /**
   * Processes an incoming citizen assistant request end-to-end with safety and fallback.
   */
  public static async processRequest(rawRequest: unknown): Promise<SahayakResponse> {
    // 1. Validate & Normalize Request
    const normalizedRequest = this.validateAndNormalizeRequest(rawRequest);

    // 2. Sensitive Keys & Credential Interception Guard (AC-P10-01, AC-P10-02)
    const sanitization = sanitizeUserInput(
      normalizedRequest.message,
      normalizedRequest.language
    );

    if (!hasNoSensitiveKeys(normalizedRequest) || sanitization.isSensitive) {
      return this.createSafetyRefusalResponse(normalizedRequest.language);
    }

    // 3. Handle Empty or Whitespace Message
    if (!normalizedRequest.message || normalizedRequest.message.trim().length === 0) {
      return this.createIntroductoryResponse(normalizedRequest.language);
    }

    // 4. Intent Detection
    const detectedIntent = detectIntent(
      sanitization.sanitized,
      normalizedRequest.pageContext
    );

    // 5. Retrieval Boundary (Context enrichment from verified Maharashtra registry)
    const contextEnrichment = this.retrieveContext(
      detectedIntent,
      sanitization.sanitized,
      normalizedRequest.language
    );

    // 6. AI Generation Boundary with Graceful Error Catching (AC-P10-06)
    let rawResponse: unknown;
    try {
      const provider = getAIProvider();
      rawResponse = await provider.generateResponse({
        ...normalizedRequest,
        message: sanitization.sanitized,
      });
    } catch (err: any) {
      console.warn(
        "[AssistantService] External AI Provider failed or timed out. Falling back to deterministic registry:",
        err?.message || err
      );
      return this.createGracefulFallbackResponse(
        normalizedRequest.language,
        detectedIntent,
        contextEnrichment
      );
    }

    // 7. Response Validation & Contract Enforcement
    if (!isSahayakResponse(rawResponse)) {
      console.warn(
        "[AssistantService] Provider response failed contract validation; applying safety defaults."
      );
      return this.createGracefulFallbackResponse(
        normalizedRequest.language,
        detectedIntent,
        contextEnrichment
      );
    }

    // Ensure detected intent is preserved if provider did not assign one
    if (!rawResponse.intent) {
      rawResponse.intent = detectedIntent;
    }

    // Merge retrieved verified entities if provider omitted them but intent matched
    if (contextEnrichment.service && !rawResponse.service) {
      rawResponse.service = {
        id: contextEnrichment.service.id,
        name:
          contextEnrichment.service.name[normalizedRequest.language] ||
          contextEnrichment.service.name.en,
      };
    }

    if (
      contextEnrichment.schemes &&
      (!rawResponse.schemes || rawResponse.schemes.length === 0)
    ) {
      rawResponse.schemes = contextEnrichment.schemes;
    }

    // Official URL Protection (AC-P10-07): Validate any provided officialSource
    if (rawResponse.officialSource) {
      const validated = validateOfficialSource(rawResponse.officialSource);
      if (!validated) {
        // Strip invalid or non-government URL
        delete rawResponse.officialSource;
      }
    }

    // Mandatory Trust Disclaimer Invariant
    rawResponse.safetyNote =
      "Sahayak AI provides guidance and does not represent a government department.";

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
    const warning = SENSITIVE_WARNING_MESSAGES[lang] || SENSITIVE_WARNING_MESSAGES.en;

    return {
      message: `${warning} ${
        lang === "mr"
          ? "सुरक्षा कारणास्तव साहायक हे इनपुट स्वीकारत नाही."
          : lang === "hi"
          ? "सुरक्षा कारणों से साहायक यह इनपुट स्वीकार नहीं करता है।"
          : "For security reasons, Sahayak does not process this input."
      }`,
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

  /**
   * Deterministic fallback when AI provider fails or is unreachable (AC-P10-06)
   */
  private static createGracefulFallbackResponse(
    lang: Language,
    intent: Intent,
    context: { service?: Service; schemes?: Scheme[] }
  ): SahayakResponse {
    if (context.service) {
      const svcName = context.service.name[lang] || context.service.name.en;
      const msgs = {
        en: `Sahayak could not process the dynamic AI response right now, but verified deterministic guidance for ${svcName} is available below.`,
        mr: `साहायक या वेळी एआय प्रतिसादावर प्रक्रिया करू शकला नाही, परंतु ${svcName} साठी अधिकृत पडताळलेले मार्गदर्शन खाली उपलब्ध आहे.`,
        hi: `साहायक इस समय एआई प्रतिक्रिया उत्पन्न नहीं कर सका, लेकिन ${svcName} के लिए सत्यापित आधिकारिक मार्गदर्शन नीचे उपलब्ध है।`,
      };
      return {
        message: msgs[lang] || msgs.en,
        language: lang,
        intent,
        service: {
          id: context.service.id,
          name: svcName,
        },
        steps: context.service.steps,
        officialSource: context.service.officialSource,
        safetyNote: "Sahayak AI provides guidance and does not represent a government department.",
      };
    }

    if (context.schemes && context.schemes.length > 0) {
      const msgs = {
        en: "Sahayak could not connect to external AI services right now, but here are verified welfare schemes matching your topic.",
        mr: "साहायक या वेळी बाह्य एआय सेवेशी संपर्क करू शकला नाही, परंतु आपल्या विषयाशी जुळणाऱ्या अधिकृत कल्याणकारी योजना खाली दिल्या आहेत.",
        hi: "साहायक इस समय बाहरी एआई सेवा से कनेक्ट नहीं कर सका, लेकिन आपके विषय से संबंधित सत्यापित कल्याणकारी योजनाएं नीचे दी गई हैं।",
      };
      return {
        message: msgs[lang] || msgs.en,
        language: lang,
        intent,
        schemes: context.schemes,
        safetyNote: "Sahayak AI provides guidance and does not represent a government department.",
      };
    }

    const fallbackMsgs = {
      en: "Sahayak could not process that request right now. You can try again or continue with the available service guidance.",
      mr: "साहायक या वेळी आपल्या विनंतीवर प्रक्रिया करू शकला नाही. आपण पुन्हा प्रयत्न करू शकता किंवा उपलब्ध अधिकृत सेवा मार्गदर्शन पाहू शकता.",
      hi: "साहायक इस समय आपके अनुरोध पर कार्रवाई नहीं कर सका। आप पुनः प्रयास कर सकते हैं या उपलब्ध आधिकारिक सेवा मार्गदर्शन देख सकते हैं।",
    };

    return {
      message: fallbackMsgs[lang] || fallbackMsgs.en,
      language: lang,
      intent,
      safetyNote: "Sahayak AI provides guidance and does not represent a government department.",
    };
  }
}

/**
 * Convenience wrapper for the assistant orchestrator.
 */
export async function processAssistantRequest(
  request: AssistantRequest
): Promise<SahayakResponse> {
  return AssistantService.processRequest(request);
}
