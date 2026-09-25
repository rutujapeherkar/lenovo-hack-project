/**
 * Sahayak AI — Canonical Runtime Data Validators & Type Guards
 * 
 * Source of Truth: docs/source-of-truth/DATA-CONTRACTS.md
 * Status: Frozen for MVP
 * 
 * Provides type assertions and runtime integrity validation for all canonical types.
 */

import type {
  Language,
  LocalizedText,
  OfficialSource,
  SchemeSource,
  TaskStep,
  Service,
  Scheme,
  Portal,
  PortalMatch,
  PageContext,
  FormGuide,
  FormPage,
  FormField,
  AssistantRequest,
  Intent,
  SahayakResponse,
  ScreenExplanation,
  ScreenElement,
  AccessibilityPreferences,
  GuidanceMode,
  CurrentTask,
  ExtensionMessage,
  ExtensionResponse,
  ExtensionError,
  VerificationMetadata,
  ApiResponse,
  ApiError,
  ServiceDiscoveryResult,
  SchemeDiscoveryResult,
  FormGuidanceResult,
  PageDetectionResult,
} from "./types";

// ============================================================================
// 1. URL & Security Validation Helpers
// ============================================================================

/** Approved government top-level and second-level domain suffixes */
const APPROVED_GOVERNMENT_DOMAINS = [
  ".gov.in",
  ".nic.in",
  ".mahaonline.gov.in",
  ".eci.gov.in",
  ".maharashtra.gov.in",
  ".mahafood.gov.in",
];

/**
 * Validates that an official URL uses HTTPS and belongs to an approved government domain.
 * Per OFFICIAL-SOURCES.md & SECURITY.md, official URLs must never be synthetic or insecure.
 */
export function validateOfficialUrl(urlString: string): boolean {
  if (typeof urlString !== "string" || !urlString.trim()) {
    return false;
  }
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    return APPROVED_GOVERNMENT_DOMAINS.some(
      (approved) => hostname.endsWith(approved) || hostname === approved.replace(/^\./, "")
    );
  } catch {
    return false;
  }
}

/** Prohibited sensitive credential keys that must never appear in shared data */
const SENSITIVE_KEY_PATTERNS = [
  "otp",
  "pin",
  "password",
  "cvv",
  "bankcredential",
  "atmpin",
  "upipin",
  "secret",
  "privatekey",
];

/**
 * Deeply inspects an object to ensure no sensitive credential keys exist.
 * Enforces SECURITY.md Section 3 (Zero Sensitive Data Custody).
 */
export function hasNoSensitiveKeys(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return true;
  }

  if (Array.isArray(data)) {
    return data.every(hasNoSensitiveKeys);
  }

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (SENSITIVE_KEY_PATTERNS.some((pattern) => normalizedKey.includes(pattern))) {
      return false;
    }
    if (typeof value === "object" && value !== null) {
      if (!hasNoSensitiveKeys(value)) {
        return false;
      }
    }
  }

  return true;
}

// ============================================================================
// 2. Primitive & Localization Type Guards
// ============================================================================

/** Type guard for supported languages ('en' | 'mr' | 'hi') */
export function isLanguage(val: unknown): val is Language {
  return val === "en" || val === "mr" || val === "hi";
}

/** Type guard for LocalizedText ({ en: string; mr: string; hi: string }) */
export function isLocalizedText(val: unknown): val is LocalizedText {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.en === "string" &&
    obj.en.trim().length > 0 &&
    typeof obj.mr === "string" &&
    obj.mr.trim().length > 0 &&
    typeof obj.hi === "string" &&
    obj.hi.trim().length > 0
  );
}

// ============================================================================
// 3. Official Source Type Guards
// ============================================================================

/** Type guard for OfficialSource */
export function isOfficialSource(val: unknown): val is OfficialSource {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const hasValidName = typeof obj.name === "string" && obj.name.trim().length > 0;
  const hasValidUrl = typeof obj.url === "string" && validateOfficialUrl(obj.url);
  const hasValidTimestamp =
    obj.lastVerified === undefined || typeof obj.lastVerified === "string";
  return hasValidName && hasValidUrl && hasValidTimestamp;
}

/** Type guard for SchemeSource */
export function isSchemeSource(val: unknown): val is SchemeSource {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validSourceTypes = ["maharashtra_state", "government_of_india", "central_state_joint"];
  const validStatuses = [
    "verified",
    "temporarily_closed",
    "information_only",
    "application_route_pending",
  ];

  return (
    typeof obj.authority === "string" &&
    validSourceTypes.includes(obj.sourceType as string) &&
    typeof obj.informationUrl === "string" &&
    validateOfficialUrl(obj.informationUrl) &&
    (obj.applicationUrl === undefined ||
      (typeof obj.applicationUrl === "string" && validateOfficialUrl(obj.applicationUrl))) &&
    (obj.procedureUrl === undefined ||
      (typeof obj.procedureUrl === "string" && validateOfficialUrl(obj.procedureUrl))) &&
    (obj.officialPortalName === undefined || typeof obj.officialPortalName === "string") &&
    typeof obj.lastVerified === "string" &&
    validStatuses.includes(obj.verificationStatus as string)
  );
}

/** Type guard for VerificationMetadata */
export function isVerificationMetadata(val: unknown): val is VerificationMetadata {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validStatuses = [
    "verified",
    "temporarily_closed",
    "information_only",
    "application_route_pending",
  ];
  return (
    typeof obj.lastVerified === "string" &&
    (obj.verifiedBy === undefined || typeof obj.verifiedBy === "string") &&
    validStatuses.includes(obj.status as string)
  );
}

// ============================================================================
// 4. Task & Service Type Guards
// ============================================================================

/** Type guard for TaskStep */
export function isTaskStep(val: unknown): val is TaskStep {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validStatuses = ["completed", "current", "upcoming"];
  return (
    typeof obj.id === "string" &&
    obj.id.trim().length > 0 &&
    isLocalizedText(obj.title) &&
    isLocalizedText(obj.description) &&
    validStatuses.includes(obj.status as string)
  );
}

/** Type guard for Service */
export function isService(val: unknown): val is Service {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    obj.id.trim().length > 0 &&
    isLocalizedText(obj.name) &&
    isLocalizedText(obj.description) &&
    typeof obj.category === "string" &&
    obj.state === "Maharashtra" &&
    Array.isArray(obj.documents) &&
    obj.documents.every((d) => typeof d === "string") &&
    Array.isArray(obj.steps) &&
    obj.steps.length > 0 &&
    obj.steps.every(isTaskStep) &&
    isOfficialSource(obj.officialSource)
  );
}

/** Type guard for CurrentTask */
export function isCurrentTask(val: unknown): val is CurrentTask {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.serviceId === "string" &&
    typeof obj.currentStepId === "string" &&
    Array.isArray(obj.completedStepIds) &&
    obj.completedStepIds.every((id) => typeof id === "string")
  );
}

// ============================================================================
// 5. Scheme Type Guards
// ============================================================================

/** Type guard for Scheme */
export function isScheme(val: unknown): val is Scheme {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    obj.id.trim().length > 0 &&
    isLocalizedText(obj.name) &&
    obj.state === "Maharashtra" &&
    typeof obj.category === "string" &&
    Array.isArray(obj.eligibility) &&
    obj.eligibility.length > 0 &&
    obj.eligibility.every((e) => typeof e === "string") &&
    Array.isArray(obj.benefits) &&
    obj.benefits.length > 0 &&
    obj.benefits.every((b) => typeof b === "string") &&
    Array.isArray(obj.documents) &&
    obj.documents.every((d) => typeof d === "string") &&
    isOfficialSource(obj.officialSource) &&
    (obj.lastVerified === undefined || typeof obj.lastVerified === "string")
  );
}

// ============================================================================
// 6. Portal & Form Guide Type Guards
// ============================================================================

/** Type guard for Portal */
export function isPortal(val: unknown): val is Portal {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    obj.id.trim().length > 0 &&
    typeof obj.name === "string" &&
    typeof obj.domain === "string" &&
    obj.state === "Maharashtra" &&
    typeof obj.supported === "boolean"
  );
}

/** Type guard for PortalMatch */
export function isPortalMatch(val: unknown): val is PortalMatch {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validConfidence = ["high", "medium", "low"];
  const validMatchedBy = ["domain", "url", "path", "page_text", "dom_marker"];
  return (
    typeof obj.portalId === "string" &&
    validConfidence.includes(obj.confidence as string) &&
    validMatchedBy.includes(obj.matchedBy as string)
  );
}

/** Type guard for FormField */
export function isFormField(val: unknown): val is FormField {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validTypes = [
    "text",
    "number",
    "date",
    "select",
    "radio",
    "checkbox",
    "file",
    "unknown",
  ];
  return (
    typeof obj.id === "string" &&
    (obj.selector === undefined || typeof obj.selector === "string") &&
    isLocalizedText(obj.label) &&
    isLocalizedText(obj.help) &&
    typeof obj.required === "boolean" &&
    (obj.inputType === undefined || validTypes.includes(obj.inputType as string))
  );
}

/** Type guard for FormPage */
export function isFormPage(val: unknown): val is FormPage {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    isLocalizedText(obj.title) &&
    typeof obj.match === "object" &&
    obj.match !== null &&
    Array.isArray(obj.fields) &&
    obj.fields.every(isFormField) &&
    (obj.next === undefined || typeof obj.next === "string") &&
    (obj.previous === undefined || typeof obj.previous === "string")
  );
}

/** Type guard for FormGuide */
export function isFormGuide(val: unknown): val is FormGuide {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.formId === "string" &&
    typeof obj.portalId === "string" &&
    isLocalizedText(obj.name) &&
    Array.isArray(obj.pages) &&
    obj.pages.length > 0 &&
    obj.pages.every(isFormPage)
  );
}

// ============================================================================
// 7. Assistant & AI Type Guards
// ============================================================================

/** Valid intent identifiers */
export const VALID_INTENTS: Intent[] = [
  "service_discovery",
  "service_guidance",
  "scheme_discovery",
  "explain_screen",
  "explain_field",
  "current_page_help",
  "next_step",
  "required_documents",
  "general_information",
  "unknown",
];

/** Type guard for Intent */
export function isIntent(val: unknown): val is Intent {
  return typeof val === "string" && VALID_INTENTS.includes(val as Intent);
}

/** Type guard for PageContext */
export function isPageContext(val: unknown): val is PageContext {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    (obj.url === undefined || typeof obj.url === "string") &&
    (obj.title === undefined || typeof obj.title === "string") &&
    (obj.domain === undefined || typeof obj.domain === "string") &&
    (obj.portalId === undefined || typeof obj.portalId === "string") &&
    (obj.pageId === undefined || typeof obj.pageId === "string") &&
    (obj.visibleText === undefined || typeof obj.visibleText === "string") &&
    (obj.selectedText === undefined || typeof obj.selectedText === "string") &&
    (obj.detectedFormId === undefined || typeof obj.detectedFormId === "string") &&
    (obj.detectedFieldId === undefined || typeof obj.detectedFieldId === "string")
  );
}

/** Type guard for AssistantRequest */
export function isAssistantRequest(val: unknown): val is AssistantRequest {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.message === "string" &&
    isLanguage(obj.language) &&
    (obj.pageContext === undefined || isPageContext(obj.pageContext))
  );
}

/** Type guard for SahayakResponse */
export function isSahayakResponse(val: unknown): val is SahayakResponse {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const hasValidMessage = typeof obj.message === "string";
  const hasValidLanguage = isLanguage(obj.language);
  const hasValidIntent = obj.intent === undefined || isIntent(obj.intent);
  const hasValidService =
    obj.service === undefined ||
    (typeof obj.service === "object" &&
      obj.service !== null &&
      typeof (obj.service as Record<string, unknown>).id === "string" &&
      typeof (obj.service as Record<string, unknown>).name === "string");
  const hasValidSchemes =
    obj.schemes === undefined ||
    (Array.isArray(obj.schemes) && obj.schemes.every(isScheme));
  const hasValidSteps =
    obj.steps === undefined ||
    (Array.isArray(obj.steps) && obj.steps.every(isTaskStep));
  const hasValidExplanation =
    obj.screenExplanation === undefined || typeof obj.screenExplanation === "string";
  const hasValidSource =
    obj.officialSource === undefined || isOfficialSource(obj.officialSource);
  const hasValidSafetyNote =
    obj.safetyNote === undefined || typeof obj.safetyNote === "string";

  return (
    hasValidMessage &&
    hasValidLanguage &&
    hasValidIntent &&
    hasValidService &&
    hasValidSchemes &&
    hasValidSteps &&
    hasValidExplanation &&
    hasValidSource &&
    hasValidSafetyNote
  );
}

// ============================================================================
// 8. Screen Explanation Type Guards
// ============================================================================

/** Type guard for ScreenElement */
export function isScreenElement(val: unknown): val is ScreenElement {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validTypes = ["field", "button", "heading", "label", "message", "section", "unknown"];
  const validImportance = ["high", "medium", "low"];
  return (
    validTypes.includes(obj.type as string) &&
    typeof obj.name === "string" &&
    typeof obj.explanation === "string" &&
    (obj.importance === undefined || validImportance.includes(obj.importance as string))
  );
}

/** Type guard for ScreenExplanation */
export function isScreenExplanation(val: unknown): val is ScreenExplanation {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.summary === "string" &&
    Array.isArray(obj.elements) &&
    obj.elements.every(isScreenElement) &&
    (obj.nextAction === undefined || typeof obj.nextAction === "string") &&
    (obj.warnings === undefined ||
      (Array.isArray(obj.warnings) && obj.warnings.every((w) => typeof w === "string")))
  );
}

// ============================================================================
// 9. Accessibility & Settings Type Guards
// ============================================================================

/** Type guard for AccessibilityPreferences */
export function isAccessibilityPreferences(val: unknown): val is AccessibilityPreferences {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validScales = ["normal", "large", "extra-large"];
  return (
    validScales.includes(obj.textScale as string) &&
    typeof obj.highContrast === "boolean" &&
    typeof obj.reducedMotion === "boolean" &&
    typeof obj.readAloud === "boolean" &&
    isLanguage(obj.language)
  );
}

/** Type guard for GuidanceMode */
export function isGuidanceMode(val: unknown): val is GuidanceMode {
  return val === "standard" || val === "simplified" || val === "voice";
}

// ============================================================================
// 10. Extension Message Type Guards
// ============================================================================

/** Type guard for ExtensionError */
export function isExtensionError(val: unknown): val is ExtensionError {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validCodes = [
    "PAGE_CONTEXT_UNAVAILABLE",
    "PORTAL_NOT_SUPPORTED",
    "FORM_NOT_DETECTED",
    "FIELD_NOT_FOUND",
    "PERMISSION_DENIED",
    "UNKNOWN",
  ];
  return validCodes.includes(obj.code as string) && typeof obj.message === "string";
}

/** Type guard for ExtensionMessage */
export function isExtensionMessage(val: unknown): val is ExtensionMessage {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  switch (obj.type) {
    case "GET_PAGE_CONTEXT":
    case "GET_CURRENT_FORM":
      return true;
    case "HIGHLIGHT_FIELD":
      return typeof obj.fieldId === "string" && obj.fieldId.trim().length > 0;
    case "CLEAR_HIGHLIGHT":
      return obj.fieldId === undefined || typeof obj.fieldId === "string";
    default:
      return false;
  }
}

/** Type guard for ExtensionResponse */
export function isExtensionResponse(val: unknown): val is ExtensionResponse {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  if (obj.success === true) {
    return true;
  }
  if (obj.success === false) {
    return isExtensionError(obj.error);
  }
  return false;
}

// ============================================================================
// 11. API Envelope & Result Type Guards
// ============================================================================

/** Type guard for ApiError */
export function isApiError(val: unknown): val is ApiError {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.code === "string" &&
    typeof obj.message === "string" &&
    (obj.retryable === undefined || typeof obj.retryable === "boolean")
  );
}

/** Type guard for ApiResponse envelope */
export function isApiResponse<T>(
  val: unknown,
  dataGuard?: (data: unknown) => data is T
): val is ApiResponse<T> {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  if (typeof obj.success !== "boolean") return false;
  if (obj.success) {
    if (dataGuard && obj.data !== undefined) {
      return dataGuard(obj.data);
    }
    return true;
  }
  return obj.error === undefined || isApiError(obj.error);
}

/** Type guard for ServiceDiscoveryResult */
export function isServiceDiscoveryResult(val: unknown): val is ServiceDiscoveryResult {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    Array.isArray(obj.services) &&
    obj.services.every(isService) &&
    typeof obj.query === "string" &&
    isLanguage(obj.language)
  );
}

/** Type guard for SchemeDiscoveryResult */
export function isSchemeDiscoveryResult(val: unknown): val is SchemeDiscoveryResult {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    Array.isArray(obj.schemes) &&
    obj.schemes.every(isScheme) &&
    typeof obj.query === "string" &&
    isLanguage(obj.language)
  );
}

/** Type guard for FormGuidanceResult */
export function isFormGuidanceResult(val: unknown): val is FormGuidanceResult {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.formId === "string" &&
    typeof obj.pageId === "string" &&
    (obj.currentFieldId === undefined || typeof obj.currentFieldId === "string") &&
    (obj.nextFieldId === undefined || typeof obj.nextFieldId === "string") &&
    (obj.explanation === undefined || isLocalizedText(obj.explanation))
  );
}

/** Type guard for PageDetectionResult */
export function isPageDetectionResult(val: unknown): val is PageDetectionResult {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  const validStatus = ["known", "unknown"];
  const validConfidence = ["high", "medium", "low"];
  return (
    (obj.portalId === undefined || typeof obj.portalId === "string") &&
    (obj.formId === undefined || typeof obj.formId === "string") &&
    (obj.pageId === undefined || typeof obj.pageId === "string") &&
    validStatus.includes(obj.status as string) &&
    validConfidence.includes(obj.confidence as string)
  );
}
