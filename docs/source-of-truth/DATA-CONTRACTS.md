# Sahayak AI — Data Contracts Specification

> **Version:** 1.0  
> **Status:** Frozen for MVP  
> **Purpose:** Single source of truth for shared data structures, interfaces, request/response shapes, and cross-module contracts.

---

# 1. Purpose

This document defines the shared contracts used across Sahayak AI.

These contracts exist to prevent different phases, developers, or AI coding agents from creating multiple incompatible representations of the same concept.

For example, the project must have one canonical `Scheme` model rather than separate models such as:

```text
Scheme
GovernmentScheme
SchemeData
SchemeResult
```

unless a documented architecture decision explicitly requires different types.

The contracts in this document are shared boundaries.

Implementation details may change, but the meaning of these contracts must remain stable.

---

# 2. Contract Rules

## 2.1 Canonical Types

Each domain concept should have one canonical shared type.

Examples:

```text
Language
LocalizedText
OfficialSource
Service
Scheme
TaskStep
FormGuide
Portal
PageContext
AssistantRequest
SahayakResponse
```

Do not create duplicate versions of these types in feature folders.

---

## 2.2 Shared Types Location

Shared types should live in a central location such as:

```text
core/shared/types.ts
```

or the repository's equivalent shared-contract location.

The exact file path may be adjusted during project scaffolding, but the contracts must remain centralized.

---

## 2.3 No Feature-Specific Copies

Do not create:

```text
components/services/types.ts
components/schemes/types.ts
extension/types.ts
api/types.ts
```

containing duplicate definitions of shared domain objects.

Feature-specific types are allowed only when they represent genuinely local UI or implementation state.

---

## 2.4 Backward Compatibility

A phase must not silently change an existing shared contract.

If a contract needs to change:

1. Identify the reason.
2. Identify affected modules.
3. Update the architecture decision.
4. Update this document.
5. Update affected tests.
6. Then implement the change.

---

# 3. Primitive Types

## 3.1 Language

```ts
export type Language = "en" | "mr" | "hi";
```

MVP supports exactly:

- `en` — English
- `mr` — Marathi
- `hi` — Hindi

No additional language identifiers should be introduced without an explicit product decision.

---

# 4. Localized Text

```ts
export type LocalizedText = {
  en: string;
  mr: string;
  hi: string;
};
```

Use `LocalizedText` whenever the same user-facing concept needs deterministic English, Marathi, and Hindi values.

Example:

```ts
const text: LocalizedText = {
  en: "Income Certificate",
  mr: "उत्पन्न प्रमाणपत्र",
  hi: "आय प्रमाण पत्र"
};
```

Do not use arbitrary language keys such as:

```text
english
marathi
hindi
```

when a `LocalizedText` contract is expected.

---

# 5. Official Source

```ts
export type OfficialSource = {
  name: string;
  url: string;
  lastVerified?: string;
};
```

## Rules

- `url` must come from verified structured data.
- AI must never invent an official URL.
- `name` identifies the official authority or portal.
- `lastVerified` records when the source was last checked where available.

---

# 6. Scheme Source

For schemes that require more detailed source tracking:

```ts
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
```

## Source Rules

`informationUrl`, `applicationUrl`, and `procedureUrl` must be explicitly stored when known.

Do not generate them dynamically using an AI model.

---

# 7. Task Step

```ts
export type TaskStep = {
  id: string;

  title: LocalizedText;

  description: LocalizedText;

  status:
    | "completed"
    | "current"
    | "upcoming";
};
```

A `TaskStep` represents one user-understandable step in a supported service journey.

---

# 8. Service

```ts
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
```

## Service Rules

A service:

- Must belong to the Maharashtra MVP scope.
- Must have a stable unique `id`.
- Must contain localized name and description.
- Must use verified service information.
- Must have an official source before being presented as an officially supported service.
- Must not contain AI-generated government facts as the authoritative data.

---

# 9. Service Document

For the MVP, documents may initially be represented as strings.

Example:

```ts
documents: [
  "Identity proof",
  "Address proof",
  "Income-related document"
]
```

If the product later requires richer document guidance, introduce a dedicated `DocumentRequirement` contract through an architecture decision rather than changing the existing structure silently.

---

# 10. Scheme

```ts
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
```

Where detailed source tracking is required, the implementation may use `SchemeSource` as an extension of the source model after an explicit contract decision.

---

# 11. Scheme Rules

A scheme record is a verified knowledge record.

AI may:

- Explain it
- Simplify it
- Translate/summarize it
- Help the user understand it

AI must not:

- Create an unverified scheme record
- Invent eligibility
- Invent benefits
- Invent documents
- Invent application URLs

---

# 12. Portal

```ts
export type Portal = {
  id: string;

  name: string;

  domain: string;

  state: "Maharashtra";

  supported: boolean;
};
```

A portal identifies a government website or supported service platform.

The portal registry is separate from AI logic.

---

# 13. Portal Match

A portal detector may return:

```ts
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
```

A low-confidence match must not automatically activate a deterministic form guide.

---

# 14. Page Context

The extension and web application may provide contextual information about the current page.

```ts
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
```

## Privacy Rule

Only the minimum information required for the current task should be sent to the AI provider.

Do not automatically transmit the entire webpage.

Do not transmit passwords, OTPs, PINs, payment credentials, or unnecessary sensitive information.

---

# 15. Form Guide

```ts
export type FormGuide = {
  formId: string;

  portalId: string;

  name: LocalizedText;

  pages: FormPage[];
};
```

---

# 16. Form Page

```ts
export type FormPage = {
  id: string;

  title: LocalizedText;

  match: FormPageMatch;

  fields: FormField[];

  next?: string;

  previous?: string;
};
```

---

# 17. Form Page Match

```ts
export type FormPageMatch = {
  urlPattern?: string;

  requiredText?: string[];

  domMarkers?: string[];

  stableSelectors?: string[];
};
```

Matching information must be based on verified characteristics of the target portal.

Never invent selectors.

---

# 18. Form Field

```ts
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
};
```

---

# 19. Form Field Rules

For supported deterministic forms:

- `id` must be stable.
- `label` must be localized.
- `help` must be understandable.
- `required` must be based on verified form behavior.
- `selector` must be verified against the actual page when provided.

The system must never automatically enter sensitive authentication information.

The system must never automatically submit the form.

---

# 20. Assistant Request

The assistant request is the canonical input contract for the Sahayak assistant.

```ts
export interface AssistantRequest {
  message: string;

  language: Language;

  pageContext?: PageContext;
}
```

---

# 21. Assistant Request Rules

The assistant request may contain:

- User's natural-language message
- Selected language
- Relevant page context

It should not contain unnecessary private data.

The request should be as small as possible while still providing the context needed for the current task.

---

# 22. Intent

```ts
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
```

Intent identifiers must remain stable across phases.

---

# 23. Sahayak Response

```ts
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
```

---

# 24. Response Rules

The response must be structured enough for the UI to render without parsing arbitrary natural-language text.

For example, the UI should not have to determine:

```text
"Is this a service?"
"Is this a scheme?"
"Is this an error?"
```

by searching the AI-generated message.

The structured fields should provide this information.

---

# 25. AI Provider

```ts
export interface AIProvider {
  generateResponse(
    request: AssistantRequest
  ): Promise<SahayakResponse>;

  explainImage?(
    image: File
  ): Promise<ScreenExplanation>;
}
```

The exact implementation may use Gemini or another provider.

The provider interface must remain independent from React components.

---

# 26. Screen Explanation

```ts
export type ScreenExplanation = {
  summary: string;

  elements: ScreenElement[];

  nextAction?: string;

  warnings?: string[];
};
```

---

# 27. Screen Element

```ts
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
```

The screen explanation describes what is visible.

It must not claim information that cannot reasonably be determined from the provided screen/context.

---

# 28. Accessibility Preferences

```ts
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
```

The exact implementation may expand this contract only through an explicit architecture decision.

---

# 29. Guidance Mode

```ts
export type GuidanceMode =
  | "standard"
  | "simplified"
  | "voice";
```

This represents the user's preferred interaction mode.

It does not change the underlying verified service data.

---

# 30. Current Task

```ts
export type CurrentTask = {
  serviceId: string;

  currentStepId: string;

  completedStepIds: string[];
};
```

Sensitive user-entered information must not be stored inside `CurrentTask`.

---

# 31. Extension Message Contract

Extension components must communicate through typed messages.

```ts
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
    }
  | {
      type: "CLEAR_HIGHLIGHT";
      fieldId?: string;
    };
```

New message types should be added to this central contract rather than invented locally.

---

# 32. Extension Response

```ts
export type ExtensionResponse =
  | {
      success: true;
      data?: unknown;
    }
  | {
      success: false;
      error: ExtensionError;
    };
```

---

# 33. Extension Error

```ts
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
```

Error messages shown to users should be localized where appropriate.

---

# 34. AI Result Source

To distinguish verified information from AI explanation:

```ts
export type InformationSource =
  | "verified"
  | "ai_generated"
  | "fallback";
```

Where appropriate, response structures should indicate the nature of the information being displayed.

The UI must not present AI-generated content as if it were official government information.

---

# 35. Service Support Status

```ts
export type SupportStatus =
  | "verified"
  | "experimental"
  | "unsupported";
```

For the MVP, deterministic workflows should normally use:

```text
verified
```

Experimental functionality must not be presented as fully verified.

---

# 36. Verification Metadata

For data that can change over time:

```ts
export type VerificationMetadata = {
  lastVerified: string;

  verifiedBy?: string;

  status:
    | "verified"
    | "temporarily_closed"
    | "information_only"
    | "application_route_pending";
};
```

This metadata is especially relevant to government service and scheme information.

---

# 37. API Response Envelope

Where backend API endpoints are used, responses should follow a predictable envelope.

```ts
export type ApiResponse<T> = {
  success: boolean;

  data?: T;

  error?: ApiError;
};
```

---

# 38. API Error

```ts
export type ApiError = {
  code: string;

  message: string;

  retryable?: boolean;
};
```

Do not expose internal stack traces or secrets to users.

---

# 39. Service Discovery Result

```ts
export type ServiceDiscoveryResult = {
  services: Service[];

  query: string;

  language: Language;
};
```

The UI should render the structured service results rather than extracting service information from free-form AI text.

---

# 40. Scheme Discovery Result

```ts
export type SchemeDiscoveryResult = {
  schemes: Scheme[];

  query: string;

  language: Language;
};
```

Only verified scheme records should be returned as scheme results.

---

# 41. Form Guidance Result

```ts
export type FormGuidanceResult = {
  formId: string;

  pageId: string;

  currentFieldId?: string;

  nextFieldId?: string;

  explanation?: LocalizedText;
};
```

This contract represents deterministic form guidance.

---

# 42. Page Detection Result

```ts
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
```

Only sufficiently verified matches should activate deterministic guidance.

---

# 43. Contract Relationship

The major contracts relate as follows:

```text
Language
   │
   ├──────────────┐
   ▼              ▼
LocalizedText   AssistantRequest
   │              │
   ▼              ▼
Service       Intent
   │              │
   ▼              ▼
TaskStep      Retrieval
   │              │
   └──────┬───────┘
          ▼
   SahayakResponse
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
 Service Scheme Screen
         Result Explanation
```

Extension:

```text
PageContext
     ↓
PageDetectionResult
     ↓
FormGuide
     ↓
FormGuidanceResult
     ↓
SahayakResponse / Side Panel
```

---

# 44. Data Ownership

## `core/services`

Owns:

```text
Service
TaskStep
Service discovery logic
```

## `core/schemes`

Owns:

```text
Scheme
Scheme retrieval
Scheme filtering
```

## `core/form-guides`

Owns:

```text
FormGuide
FormPage
FormField
Form matching
```

## `core/portals`

Owns:

```text
Portal
PortalMatch
PageDetectionResult
```

## `core/ai`

Owns:

```text
AIProvider
AI provider adapters
AI request execution
```

## `core/accessibility`

Owns:

```text
AccessibilityPreferences
GuidanceMode
```

## `extension`

Owns:

```text
ExtensionMessage
ExtensionResponse
DOM-specific context
```

---

# 45. Data Ownership Rules

A module may own and modify its own domain data.

A module must not silently modify another module's data model.

For example:

```text
Scheme module
    ↓
may modify Scheme retrieval

Scheme module
    ✕
must not modify FormGuide definitions
```

---

# 46. UI Contract Rules

UI components should consume structured contracts.

For example:

```tsx
<ServiceCard service={service} />
```

is preferred over:

```tsx
<ServiceCard rawAiText={response.message} />
```

when structured service data is available.

Similarly:

```tsx
<SchemeCard scheme={scheme} />
```

should receive a `Scheme`.

---

# 47. AI Output Rules

AI output should be mapped into canonical contracts before reaching the UI.

Preferred:

```text
AI Provider
     ↓
Validation / Mapping
     ↓
SahayakResponse
     ↓
UI
```

Avoid:

```text
AI Provider
     ↓
Raw model JSON
     ↓
UI directly
```

The UI should not depend on provider-specific response formats.

---

# 48. Contract Validation

When practical, runtime validation should be used at external boundaries.

External boundaries include:

- AI provider responses
- API responses
- Uploaded data
- Extension messages
- External configuration

Invalid data should be rejected or converted into a safe fallback.

---

# 49. Sensitive Data Rules

No canonical contract should require:

```text
OTP
UPI PIN
ATM PIN
Password
CVV
Bank credentials
```

Sensitive information should never be added to shared request/response types merely for convenience.

If a future feature requires sensitive information, it requires an explicit security and architecture review before implementation.

---

# 50. Contract Change Procedure

If a developer or AI agent believes a contract must change:

```text
Identify required change
        ↓
Identify affected modules
        ↓
Stop current implementation if necessary
        ↓
Create architecture decision
        ↓
Update DATA-CONTRACTS.md
        ↓
Update affected tests
        ↓
Implement
        ↓
Run regression tests
```

Do not silently introduce a second incompatible contract.

---

# 51. Non-Negotiable Contract Rules

1. Use one canonical type for each shared domain concept.
2. Keep shared types centralized.
3. Do not duplicate `Service`, `Scheme`, `TaskStep`, or similar core types.
4. Use `Language = "en" | "mr" | "hi"` for the MVP.
5. Use `LocalizedText` for deterministic multilingual content.
6. Keep official URLs in verified source data.
7. Never generate official URLs using AI.
8. Keep AI provider interfaces independent from UI.
9. Validate external AI responses before using them.
10. Keep extension messages typed.
11. Do not place sensitive credentials in shared contracts.
12. Do not silently change frozen contracts.
13. Do not make UI components responsible for data retrieval.
14. Do not make AI output the source of truth for government data.
15. Preserve backward compatibility when extending contracts.

---

# 52. Contract Freeze

The following contracts are considered frozen for the MVP:

```text
Language
LocalizedText
OfficialSource
Service
TaskStep
Scheme
Portal
PageContext
FormGuide
FormPage
FormField
AssistantRequest
Intent
SahayakResponse
AIProvider
ScreenExplanation
ScreenElement
AccessibilityPreferences
GuidanceMode
CurrentTask
ExtensionMessage
ExtensionResponse
ExtensionError
```

Any structural change to these contracts requires an explicit architecture decision and regression testing.

---

# 53. Final Principle

> Shared contracts are the communication language of Sahayak AI.

Every phase, developer, frontend component, backend service, browser-extension component, and AI provider must communicate through these contracts rather than creating private incompatible representations.

When in doubt:

```text
Reuse the existing contract
        ↓
Do not duplicate it
        ↓
If it truly must change
        ↓
Document the change first
```
