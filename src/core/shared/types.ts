/**
 * Sahayak AI — Canonical Shared TypeScript Data Contracts
 * 
 * Source of Truth: docs/source-of-truth/DATA-CONTRACTS.md
 * Status: Frozen for MVP
 * 
 * Inviolable Rules:
 * 1. Single source of truth: No duplicate types across feature modules.
 * 2. Language support: strictly 'en' | 'mr' | 'hi'.
 * 3. Security: No secrets, credentials, OTPs, PINs, or passwords in shared contracts.
 * 4. URLs: Official government URLs are verified static data, never AI-generated.
 */

// ============================================================================
// 1. Primitive & Localization Contracts
// ============================================================================

/** Supported languages for Sahayak AI MVP */
export type Language = "en" | "mr" | "hi";

/** Multilingual localized text across English, Marathi, and Hindi */
export type LocalizedText = {
  en: string;
  mr: string;
  hi: string;
};

// ============================================================================
// 2. Official Sources & Verification
// ============================================================================

/** Basic official government source reference */
export type OfficialSource = {
  name: string;
  url: string;
  lastVerified?: string;
};

/** Detailed official source model for welfare schemes */
export type SchemeSource = {
  authority: string;
  sourceType:
    | "maharashtra_state"
    | "government_of_india"
    | "central_state_joint";
  informationUrl: string;
  applicationUrl?: string;
  procedureUrl?: string;
  officialPortalName?: string;
  lastVerified: string;
  verificationStatus:
    | "verified"
    | "temporarily_closed"
    | "information_only"
    | "application_route_pending";
};

/** Verification metadata for time-sensitive public service data */
export type VerificationMetadata = {
  lastVerified: string;
  verifiedBy?: string;
  status:
    | "verified"
    | "temporarily_closed"
    | "information_only"
    | "application_route_pending";
};

/** Classification of information origin to maintain trust */
export type InformationSource =
  | "verified"
  | "ai_generated"
  | "fallback";

/** Support maturity classification for service guidance workflows */
export type SupportStatus =
  | "verified"
  | "experimental"
  | "unsupported";

// ============================================================================
// 3. Services & Task Guidance Contracts
// ============================================================================

/** Individual task step within a public service application journey */
export type TaskStep = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  status:
    | "completed"
    | "current"
    | "upcoming";
};

/** Canonical public service definition */
export type Service = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: string;
  state: "Maharashtra";
  documents: string[];
  steps: TaskStep[];
  officialSource: OfficialSource;
};

/** Active state of a user navigating a service journey */
export type CurrentTask = {
  serviceId: string;
  currentStepId: string;
  completedStepIds: string[];
};

/** Structured result of a service discovery search */
export type ServiceDiscoveryResult = {
  services: Service[];
  query: string;
  language: Language;
};

// ============================================================================
// 4. Welfare Schemes Contracts
// ============================================================================

/** Canonical government welfare scheme definition */
export type Scheme = {
  id: string;
  name: LocalizedText;
  state: "Maharashtra";
  category: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  officialSource: OfficialSource;
  lastVerified?: string;
};

/** Structured result of a scheme discovery search */
export type SchemeDiscoveryResult = {
  schemes: Scheme[];
  query: string;
  language: Language;
};

// ============================================================================
// 5. Portals & Form Guidance Contracts
// ============================================================================

/** Government portal registry entry */
export type Portal = {
  id: string;
  name: string;
  domain: string;
  state: "Maharashtra";
  supported: boolean;
};

/** Match result from portal detection */
export type PortalMatch = {
  portalId: string;
  confidence: "high" | "medium" | "low";
  matchedBy:
    | "domain"
    | "url"
    | "path"
    | "page_text"
    | "dom_marker";
};

/** Page context transmitted to the assistant for guidance */
export type PageContext = {
  url?: string;
  title?: string;
  domain?: string;
  portalId?: string;
  pageId?: string;
  visibleText?: string;
  selectedText?: string;
  detectedFormId?: string;
  detectedFieldId?: string;
};

/** Page detection classification for browser extension */
export type PageDetectionResult = {
  portalId?: string;
  formId?: string;
  pageId?: string;
  status:
    | "known"
    | "unknown";
  confidence:
    | "high"
    | "medium"
    | "low";
};

/** Deterministic form guide for a supported government workflow */
export type FormGuide = {
  formId: string;
  portalId: string;
  name: LocalizedText;
  pages: FormPage[];
};

/** Form page within a multi-step government form */
export type FormPage = {
  id: string;
  title: LocalizedText;
  match: FormPageMatch;
  fields: FormField[];
  next?: string;
  previous?: string;
};

/** Deterministic rules for matching a specific form page */
export type FormPageMatch = {
  urlPattern?: string;
  requiredText?: string[];
  domMarkers?: string[];
  stableSelectors?: string[];
};

/** Individual field definition in a deterministic form guide */
export type FormField = {
  id: string;
  selector?: string;
  label: LocalizedText;
  help: LocalizedText;
  required: boolean;
  inputType?:
    | "text"
    | "number"
    | "date"
    | "select"
    | "radio"
    | "checkbox"
    | "file"
    | "unknown";
  explanation?: LocalizedText;
};

/** Guidance output for the current field/page in a form */
export type FormGuidanceResult = {
  formId: string;
  pageId: string;
  currentFieldId?: string;
  nextFieldId?: string;
  explanation?: LocalizedText;
};

// ============================================================================
// 6. Assistant & AI Contracts
// ============================================================================

/** User intent classification */
export type Intent =
  | "service_discovery"
  | "service_guidance"
  | "scheme_discovery"
  | "explain_screen"
  | "explain_field"
  | "current_page_help"
  | "next_step"
  | "required_documents"
  | "general_information"
  | "unknown";

/** Canonical request payload for the Sahayak assistant */
export interface AssistantRequest {
  message: string;
  language: Language;
  pageContext?: PageContext;
}

/** Canonical response envelope from the Sahayak assistant */
export interface SahayakResponse {
  message: string;
  language: Language;
  intent?: Intent;
  service?: {
    id: string;
    name: string;
  };
  schemes?: Scheme[];
  steps?: TaskStep[];
  screenExplanation?: string;
  officialSource?: OfficialSource;
  safetyNote?: string;
}

/** Provider-agnostic AI engine contract */
export interface AIProvider {
  generateResponse(
    request: AssistantRequest
  ): Promise<SahayakResponse>;

  explainImage?(
    image: File
  ): Promise<ScreenExplanation>;
}

// ============================================================================
// 7. Screen Explanation Contracts
// ============================================================================

/** Multimodal screen explanation result */
export type ScreenExplanation = {
  summary: string;
  elements: ScreenElement[];
  nextAction?: string;
  warnings?: string[];
};

/** Identified UI element within an explained screenshot */
export type ScreenElement = {
  type:
    | "field"
    | "button"
    | "heading"
    | "label"
    | "message"
    | "section"
    | "unknown";
  name: string;
  explanation: string;
  importance?: "high" | "medium" | "low";
};

// ============================================================================
// 8. Accessibility & Interaction Mode Contracts
// ============================================================================

/** User accessibility preferences */
export type AccessibilityPreferences = {
  textScale:
    | "normal"
    | "large"
    | "extra-large";
  highContrast: boolean;
  reducedMotion: boolean;
  readAloud: boolean;
  language: Language;
};

/** User interaction and guidance mode */
export type GuidanceMode =
  | "standard"
  | "simplified"
  | "voice";

// ============================================================================
// 9. Browser Extension Contracts
// ============================================================================

/** Typed message sent to the extension background or content script */
export type ExtensionMessage =
  | {
      type: "GET_PAGE_CONTEXT";
    }
  | {
      type: "GET_CURRENT_FORM";
    }
  | {
      type: "HIGHLIGHT_FIELD";
      fieldId: string;
      selector?: string;
    }
  | {
      type: "CLEAR_HIGHLIGHT";
      fieldId?: string;
    };

/** Standard response envelope from the browser extension */
export type ExtensionResponse =
  | {
      success: true;
      data?: unknown;
    }
  | {
      success: false;
      error: ExtensionError;
    };

/** Error payload from extension operations */
export type ExtensionError = {
  code:
    | "PAGE_CONTEXT_UNAVAILABLE"
    | "PORTAL_NOT_SUPPORTED"
    | "FORM_NOT_DETECTED"
    | "FIELD_NOT_FOUND"
    | "PERMISSION_DENIED"
    | "UNKNOWN";
  message: string;
};

// ============================================================================
// 10. API Layer Contracts
// ============================================================================

/** Standard API envelope for backend endpoints */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ApiError;
};

/** Standard API error contract */
export type ApiError = {
  code: string;
  message: string;
  retryable?: boolean;
};
