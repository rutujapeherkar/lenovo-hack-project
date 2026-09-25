# Sahayak AI — Architecture Specification

> **Version:** 1.0  
> **Status:** Frozen for MVP  
> **Purpose:** Source of truth for system architecture and module boundaries

---

# 1. Purpose

This document defines the technical architecture of Sahayak AI.

It is a **source-of-truth document** for implementation agents and developers.

It defines:

- System boundaries
- Application layers
- Module responsibilities
- Data flow
- AI boundaries
- Deterministic guidance boundaries
- Browser extension architecture
- Scheme and service architecture
- Accessibility architecture
- Security boundaries
- Failure and fallback behavior
- Repository structure
- Module ownership rules

This document does not define phase-specific implementation tasks.

Phase-specific work must be defined in:

```text
docs/phases/
```

---

# 2. Architecture Goals

The architecture must prioritize:

1. Modularity
2. Maintainability
3. Accessibility
4. Trust
5. Deterministic verified workflows
6. AI provider independence
7. Graceful degradation
8. Clear separation of concerns
9. Minimal unnecessary dependencies
10. Safe incremental development

---

# 3. Core Architecture Principle

Sahayak AI follows this rule:

```text
Verified data
      +
Deterministic workflows
      +
AI understanding and explanation
      =
Sahayak AI
```

AI must not become the source of truth for verified government information.

---

# 4. High-Level System Architecture

```text
                         ┌──────────────────────┐
                         │      USER            │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
             Web App          Browser Extension   Voice/Input
                  │                 │                 │
                  └─────────────────┼─────────────────┘
                                    ▼
                         ┌──────────────────────┐
                         │   Sahayak Core       │
                         │                      │
                         │ Intent / Context     │
                         │ Service Discovery    │
                         │ Task Guidance        │
                         │ Scheme Retrieval     │
                         │ Explain Screen       │
                         │ Accessibility        │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
             Verified Data      AI Provider      Browser APIs
                  │                 │                 │
                  ▼                 ▼                 ▼
             Services/Schemes    Gemini/etc.    Speech/DOM/File
```

---

# 5. Architecture Principles

## 5.1 Modular

Each major responsibility must be isolated.

For example:

```text
Intent Detection
       ≠
Knowledge Retrieval
       ≠
Task Planning
       ≠
UI Rendering
```

A UI component must not contain the entire AI workflow.

---

## 5.2 Provider Independent

The application must not be tightly coupled to one AI provider.

The UI and application services should communicate with an internal AI interface.

Example:

```ts
interface AIProvider {
  generateResponse(
    request: AssistantRequest
  ): Promise<AssistantResponse>;

  explainImage?(
    image: File
  ): Promise<ScreenExplanation>;
}
```

Possible implementations:

```text
DemoProvider
GeminiProvider
OpenAICompatibleProvider
```

Changing the provider must not require rewriting the UI.

---

## 5.3 Accessibility First

Accessibility is part of the architecture.

The accessibility layer should be able to transform:

```text
Standard UI
     ↓
Large Text
High Contrast
Reduced Motion
Voice Assistance
Simplified Guidance
```

Accessibility preferences should be centralized rather than implemented separately in every component.

---

## 5.4 Trust First

AI-generated guidance and official information must remain distinguishable.

```text
Sahayak Guidance
        ≠
Official Source
```

Official URLs must come from verified structured data.

---

## 5.5 Graceful Degradation

Failure of one external capability must not unnecessarily break the entire application.

Example:

```text
Voice fails
    ↓
Text input remains available
```

not:

```text
Voice fails
    ↓
Entire assistant fails
```

---

# 6. System Boundaries

## Inside Sahayak

- User interaction
- Intent detection
- Service discovery
- Deterministic service guidance
- Scheme retrieval
- Screen explanation
- Accessibility preferences
- Language handling
- Extension page detection
- Form guidance
- AI orchestration
- Official source presentation

## Outside Sahayak

- Government portal submission
- Government authentication
- UPI/payment execution
- OTP verification
- Password authentication
- Government database modification
- Final application submission

Sahayak may guide the user toward these actions but does not perform them automatically.

---

# 7. Application Layers

## Layer 1 — Presentation

Responsible for:

- Pages
- Components
- Navigation
- Visual hierarchy
- Responsive behavior
- Accessibility presentation
- User interactions

Examples:

```text
web/
extension/sidepanel/
components/
```

Presentation code must not contain provider-specific AI logic.

---

## Layer 2 — Interaction

Responsible for:

- User input
- Conversation state
- Task state
- Current page context
- Language selection
- Accessibility preferences
- Screen upload state

---

## Layer 3 — Application Services

Responsible for coordinating business operations.

Examples:

```text
AssistantService
ServiceDiscoveryService
TaskService
SchemeService
ScreenExplanationService
FormGuideService
AccessibilityService
```

Application services coordinate modules; they should not duplicate their internal logic.

---

## Layer 4 — AI Orchestration

Responsible for:

```text
Intent Detection
       ↓
Context Preparation
       ↓
Verified Retrieval
       ↓
Prompt Construction
       ↓
AI Provider
       ↓
Structured Response
```

The orchestration layer must not directly render UI.

---

## Layer 5 — Knowledge / Verified Data

Contains structured information such as:

- Services
- Service steps
- Schemes
- Eligibility
- Benefits
- Required documents
- Official sources
- Portal definitions
- Form guides
- Supported languages

This layer is the source of truth for supported deterministic workflows.

---

## Layer 6 — External Services

Potential dependencies:

- AI provider
- Browser speech APIs
- Browser DOM APIs
- Official websites
- Image processing APIs

External dependencies must be isolated behind adapters where practical.

---

# 8. Core Modules

The system consists of the following major modules:

```text
core/
├── assistant/
├── ai/
├── services/
├── schemes/
├── form-guides/
├── portals/
├── explain-screen/
├── language/
├── accessibility/
├── official-sources/
└── shared/
```

Each module has one primary responsibility.

---

# 9. Assistant Module

## Responsibility

Coordinates user requests.

Input:

```text
AssistantRequest
```

Output:

```text
SahayakResponse
```

The assistant module may call:

- Intent detection
- Service retrieval
- Scheme retrieval
- Task planning
- AI explanation

It must not directly access the DOM.

---

# 10. Intent Module

## Responsibility

Determine what the user is trying to accomplish.

Example intents:

```text
service_discovery
service_guidance
scheme_discovery
explain_screen
explain_field
current_page_help
next_step
required_documents
general_information
unknown
```

Intent detection can use deterministic matching first and AI assistance when necessary.

Intent detection does not itself retrieve government data.

---

# 11. Service Module

## Responsibility

Manage supported public-service definitions.

Example:

```ts
type Service = {
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

Service data must be stored separately from UI components.

---

# 12. Deterministic Service Guidance

Known services must use deterministic guidance.

```text
User request
     ↓
Service identified
     ↓
Service registry
     ↓
Verified service definition
     ↓
Task journey
```

AI may explain a step but must not silently replace the verified step sequence.

---

# 13. Task Module

## Responsibility

Represent and manage a user's current journey through a service.

Example:

```text
Service
   ↓
Task
   ↓
Current Step
   ↓
User Action
   ↓
Next Step
```

Task progress may be stored in session/local state for the MVP.

Sensitive user information must not be persisted as task state.

---

# 14. Scheme Module

## Responsibility

Retrieve verified scheme information.

Flow:

```text
User request
      ↓
Intent
      ↓
Scheme retrieval
      ↓
Eligibility/category filtering
      ↓
Verified scheme records
      ↓
AI simplification where required
      ↓
Scheme result
```

AI must not be the primary database of government schemes.

---

# 15. Scheme Data Rule

A scheme record should contain structured information such as:

```ts
type Scheme = {
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

Where required, the source model may distinguish:

```text
informationUrl
applicationUrl
procedureUrl
```

The AI provider must never invent these URLs.

---

# 16. Form Guide Module

## Responsibility

Provide deterministic guidance for supported government forms.

A form guide contains:

- Portal
- Form
- Page
- Field
- Selector/DOM matching strategy
- Localized label
- Localized explanation
- Required status
- Next transition
- Document requirements

Example:

```ts
type FormGuide = {
  formId: string;
  portalId: string;
  pages: FormPage[];
};
```

---

# 17. Form Guide Matching

Supported forms should be identified using stable page information such as:

- Domain
- URL path
- Stable IDs
- Input names
- Labels
- ARIA attributes
- Visible text anchors
- Other verified DOM characteristics

Never assume that a selector exists.

Selectors must be verified against the actual target page before being treated as supported.

---

# 18. Form Guide Behavior

For a known form:

```text
Current page
     ↓
Form detector
     ↓
Known form
     ↓
Current page/field
     ↓
Form guide registry
     ↓
Highlight field
     ↓
Explain field
     ↓
Show next step
```

Sahayak must never automatically submit the form.

---

# 19. Portal Registry

The portal registry identifies supported government websites.

Example:

```ts
type Portal = {
  id: string;
  name: string;
  domain: string;
  state: "Maharashtra";
  supported: boolean;
};
```

The registry must be separate from AI logic.

---

# 20. Known vs Unknown Portal Architecture

```text
Current website
      ↓
Portal detector
      ↓
Is portal supported?
     / \
   YES  NO
    │    │
    ▼    ▼
Known   AI explanation
workflow fallback
```

Known portal/form workflows use deterministic data.

Unknown pages use AI explanation fallback.

---

# 21. Explain Screen Module

## Responsibility

Explain screenshots or visible screen content.

Flow:

```text
User selects image
       ↓
File validation
       ↓
Image preview
       ↓
Vision AI
       ↓
Structured explanation
       ↓
Explanation panel
```

The original image should not be permanently stored for the MVP unless explicitly required.

---

# 22. Image Validation

At minimum validate:

- MIME type
- File extension
- File size

Recommended MVP maximum:

```text
5 MB
```

Unsupported formats must be rejected gracefully.

---

# 23. Accessibility Module

Accessibility settings should be centralized.

Example:

```text
Accessibility Context
       │
       ├── Text scale
       ├── Contrast
       ├── Motion
       ├── Voice
       └── Language
       │
       ▼
Application UI
```

The same accessibility preferences should apply consistently across the web application and extension where technically possible.

---

# 24. Language Module

Supported languages:

```ts
type Language = "en" | "mr" | "hi";
```

Localized UI content should use deterministic translations.

Example:

```ts
type LocalizedText = {
  en: string;
  mr: string;
  hi: string;
};
```

AI-generated responses should respect the selected language.

---

# 25. Voice Architecture

Preferred MVP browser capabilities:

```text
Speech Recognition
        ↓
Text
        ↓
Assistant
        ↓
Response
        ↓
Speech Synthesis
```

Voice must be an optional interaction method.

If speech recognition is unavailable:

```text
Voice unavailable
       ↓
Text input remains available
```

Do not make the entire product dependent on voice APIs.

---

# 26. Browser Extension Architecture

The browser extension uses Manifest V3.

High-level structure:

```text
Browser
   │
   ├── Side Panel
   │
   ├── Content Script
   │
   └── Background Service Worker
             │
             ▼
        Sahayak Core
```

---

# 27. Extension Side Panel

The side panel is the primary user interface for the extension.

It should provide contextual actions such as:

```text
Explain this page
What should I do next?
Help me fill this form
Required documents
```

The extension should prioritize current-page context instead of behaving like a generic chatbot.

---

# 28. Content Script

The content script is responsible for reading relevant page context and interacting with visible page elements where permitted.

Responsibilities:

- Detect page structure
- Read relevant visible labels
- Identify form fields
- Highlight supported fields
- Communicate with the side panel/background layer

It must not perform unauthorized transactions or submit government forms automatically.

---

# 29. Background Service Worker

The background layer handles extension-level coordination such as:

- Extension lifecycle
- Messaging
- Side panel coordination
- Communication between extension components

It should not contain large business rules that belong in `core/`.

---

# 30. Shared Extension Messaging

Use explicit typed messages.

Example:

```ts
type ExtensionMessage =
  | {
      type: "GET_PAGE_CONTEXT";
    }
  | {
      type: "HIGHLIGHT_FIELD";
      fieldId: string;
    }
  | {
      type: "GET_CURRENT_FORM";
    };
```

Do not create ad-hoc message formats in individual components.

---

# 31. AI Provider Architecture

Use an internal provider abstraction.

```ts
interface AIProvider {
  generateResponse(
    request: AssistantRequest
  ): Promise<AssistantResponse>;

  explainImage?(
    image: File
  ): Promise<ScreenExplanation>;
}
```

Possible providers:

```text
DemoProvider
GeminiProvider
OpenAICompatibleProvider
```

The provider must be replaceable without changing presentation components.

---

# 32. Environment Configuration

Example:

```env
AI_PROVIDER=demo
AI_API_KEY=
AI_MODEL=
```

Possible provider values:

```text
demo
gemini
openai
```

The default development mode should work without an external AI credential.

API keys must never be embedded in browser-side source code.

---

# 33. AI Request Flow

```text
User Request
     ↓
Assistant Controller
     ↓
Language / Intent
     ↓
Relevant verified retrieval
     ↓
Prompt construction
     ↓
AI Provider
     ↓
Structured response
     ↓
UI
```

The AI should receive only the context necessary for the current task.

---

# 34. AI Responsibility Boundary

## AI may:

- Understand natural-language requests
- Detect intent
- Simplify verified information
- Explain terminology
- Explain screenshots
- Explain unknown pages
- Generate conversational responses
- Help interpret ambiguous user language

## AI must not:

- Invent official URLs
- Invent government schemes
- Invent verified eligibility rules
- Replace known deterministic workflows
- Submit forms
- Perform payments
- Request OTP/PIN/passwords
- Modify government records
- Pretend AI-generated information is official

---

# 35. Fallback Architecture

```text
                    AI Request
                        │
                        ▼
               External AI available?
                  /             \
                YES              NO
                 │                │
                 ▼                ▼
            AI Provider      Deterministic/
                              Demo fallback
                 │                │
                 └───────┬────────┘
                         ▼
                  Structured result
```

The fallback should preserve the user journey whenever possible.

---

# 36. Error Isolation

Expected failure domains:

- AI request
- Voice
- Image processing
- Service retrieval
- Scheme retrieval
- External links
- Browser extension communication

Each should degrade independently.

Example:

```text
AI unavailable
     ↓
Known service?
   /      \
 YES       NO
  │         │
  ▼         ▼
Guide    Safe fallback
```

---

# 37. Official Source Architecture

Official sources are represented separately from AI-generated guidance.

Example:

```ts
type OfficialSource = {
  name: string;
  url: string;
  lastVerified?: string;
};
```

UI pattern:

```text
SAHAYAK GUIDANCE

Simple explanation
provided by Sahayak

        ↓

OFFICIAL SOURCE

Verify current requirements
[Open Official Portal]
```

---

# 38. Security Architecture

## 38.1 Secrets

API keys must be stored server-side.

Never expose:

```text
AI_API_KEY
```

to browser-side JavaScript.

---

## 38.2 Input Security

Treat user-provided and AI-generated content as untrusted.

Prefer:

- Plain text
- Structured components
- Sanitized content

Avoid unsafe HTML rendering.

---

## 38.3 Upload Security

Validate:

- File type
- File extension
- File size

Reject unsupported or oversized uploads.

---

# 39. Privacy Architecture

The MVP intentionally minimizes stored user data.

May store locally:

```text
Accessibility preferences
Selected language
Saved service IDs
Demo/task state
```

Must not store:

```text
Passwords
OTP
UPI PIN
Bank credentials
CVV
Unnecessary sensitive identity numbers
```

Private conversation history should not be permanently stored unless explicitly required and documented.

---

# 40. State Management

Use local React state/context for MVP.

Global state candidates:

- Accessibility settings
- Selected language
- Current task
- Guidance mode

Local component state:

- Chat input
- Loading state
- Upload state
- Search query
- Filters
- Temporary UI state

Possible localStorage values:

```text
accessibilitySettings
language
savedServices
guidanceMode
```

Sensitive data must not be persisted.

---

# 41. Data Flow — Assistant

```text
User input
    ↓
Assistant Controller
    ↓
Language handling
    ↓
Intent Engine
    ↓
Retrieval Engine
    ↓
Task Planner
    ↓
AI Response Generator
    ↓
Structured Response
    ↓
UI
```

---

# 42. Data Flow — Service Discovery

```text
Search / Natural Language
          ↓
Intent Engine
          ↓
Service Retrieval
          ↓
Relevant Service Results
          ↓
Service Cards
```

MVP ranking may use simple keyword/category relevance before introducing more complex ranking.

---

# 43. Data Flow — Task Journey

```text
Service Selected
       ↓
Task Planner
       ↓
Task Object
       ↓
Task Journey UI
       ↓
Current Step
       ↓
User Action
       ↓
Next Step
```

Task progress may be stored in session/local state.

---

# 44. Data Flow — Scheme Finder

```text
User Query
    ↓
Intent Detection
    ↓
Scheme Registry
    ↓
Eligibility / Category Filtering
    ↓
Verified Scheme
    ↓
AI Simplification
    ↓
Scheme Result
    ↓
Official Source
```

---

# 45. Data Flow — Explain Screen

```text
User selects image
       ↓
File validation
       ↓
Image preview
       ↓
Vision AI
       ↓
Structured explanation
       ↓
Explanation panel
```

The original image should not be permanently stored for the MVP.

---

# 46. Data Flow — Accessibility

```text
Accessibility Panel
       ↓
Accessibility Context
       │
       ├── Text scale
       ├── Contrast
       ├── Motion
       ├── Voice
       └── Language
       ↓
Application UI
```

---

# 47. Data Flow — Extension

```text
Government Website
       ↓
Content Script
       ↓
Page / Form Detection
       ↓
Portal Registry
       ↓
Known?
   /       \
 YES       NO
  │         │
  ▼         ▼
Form Guide  AI Explanation
  │         │
  └────┬────┘
       ▼
Side Panel
       ↓
User Guidance
```

---

# 48. Repository Structure

Recommended MVP repository:

```text
sahayak/
│
├── app/
│   ├── page.tsx
│   ├── services/
│   ├── schemes/
│   ├── explain-screen/
│   ├── extension/
│   ├── help/
│   └── settings/
│
├── components/
│   ├── layout/
│   ├── assistant/
│   ├── services/
│   ├── schemes/
│   ├── explain-screen/
│   ├── accessibility/
│   └── ui/
│
├── extension/
│   ├── manifest.json
│   └── src/
│       ├── background/
│       │   └── service-worker.ts
│       ├── content/
│       │   ├── content-script.ts
│       │   ├── detector.ts
│       │   ├── highlighter.ts
│       │   └── dom-utils.ts
│       ├── sidepanel/
│       │   ├── App.tsx
│       │   ├── components/
│       │   └── styles/
│       └── shared/
│
├── core/
│   ├── assistant/
│   ├── ai/
│   ├── services/
│   ├── schemes/
│   ├── form-guides/
│   ├── portals/
│   ├── explain-screen/
│   ├── language/
│   ├── accessibility/
│   └── official-sources/
│
├── api/
│   ├── assistant/
│   ├── schemes/
│   └── explain-screen/
│
├── data/
│   └── maharashtra/
│       ├── portals.json
│       ├── services.json
│       ├── schemes.json
│       └── form-guides/
│
├── public/
│
├── docs/
│   ├── source-of-truth/
│   ├── phases/
│   └── decisions/
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# 49. Module Dependency Rules

The following dependency direction should be maintained:

```text
Presentation
      ↓
Application Services
      ↓
Core Domain / Knowledge
      ↓
Adapters / External Providers
```

Avoid reverse dependencies.

For example:

```text
core/services/
```

must not import UI components.

And:

```text
core/ai/
```

must not import React components.

---

# 50. Module Ownership Rules

## `components/`

Owns:

- UI rendering
- UI interaction

Does not own:

- Government data
- AI provider implementation
- DOM extension logic

---

## `core/ai/`

Owns:

- AI provider interface
- AI provider implementations
- AI request/response mapping

Does not own:

- UI
- Government scheme truth
- Browser DOM manipulation

---

## `core/schemes/`

Owns:

- Scheme retrieval
- Scheme filtering
- Scheme validation

Does not own:

- AI provider implementation
- UI rendering

---

## `core/services/`

Owns:

- Supported service definitions
- Service retrieval
- Service task definitions

---

## `core/form-guides/`

Owns:

- Deterministic form definitions
- Field guidance
- Page transitions

Does not own:

- Generic AI chat behavior

---

## `core/portals/`

Owns:

- Portal registry
- Portal identification rules

---

## `extension/content/`

Owns:

- Current webpage DOM interaction
- Field detection
- Field highlighting
- Page context extraction

Does not own:

- Scheme database
- AI provider implementation

---

## `extension/sidepanel/`

Owns:

- Extension user interface
- Current-page contextual actions
- Displaying guidance

Business rules should remain in `core/`.

---

# 51. Dependency Restrictions

Do not introduce a new dependency merely to solve a problem that can be solved with existing project capabilities.

Before adding a dependency:

1. Check whether an existing dependency already provides the capability.
2. Check whether browser/native APIs are sufficient.
3. Consider bundle size and complexity.
4. Document the reason if the dependency is necessary.

---

# 52. Architecture Change Rule

An implementation agent must not silently change architecture.

If a requested feature requires:

- A new major module
- A change to shared contracts
- A change to the AI boundary
- A change to data ownership
- A new external service
- A change to authentication
- A change to the extension architecture

the agent must stop and report the architectural conflict.

The change should be documented as an architecture decision before implementation.

---

# 53. Browser Extension Safety Boundary

The extension must not:

- Automatically submit government forms
- Automatically click payment confirmation
- Capture sensitive credentials
- Capture OTPs
- Read unnecessary private page content
- Send unnecessary page data to the AI provider

The extension should collect only the minimum page context required for the current assistance task.

---

# 54. Performance Architecture

Prioritize:

- Minimal dependencies
- Lightweight local data
- Lazy loading where useful
- Efficient image handling
- Minimal API calls
- Client-side code only where interaction requires it
- Avoiding unnecessary AI requests
- Avoiding unnecessary page-context transmission

Do not send unnecessary user or page context to an AI provider.

---

# 55. Observability

For development, the system should provide enough information to diagnose failures without logging sensitive data.

Useful development events:

```text
assistant_request_started
intent_detected
service_matched
scheme_matched
ai_request_started
ai_request_failed
fallback_used
form_detected
form_field_detected
screen_explanation_started
screen_explanation_failed
```

Do not log:

```text
OTP
Password
UPI PIN
Bank credentials
Sensitive identity numbers
Full private conversation content
```

---

# 56. Testing Architecture

Every major module should be testable independently.

Examples:

```text
Intent Engine
    ↓
unit tests

Scheme Retrieval
    ↓
unit tests

Service Guidance
    ↓
unit tests

Form Detection
    ↓
integration tests

Extension
    ↓
browser/manual tests

UI
    ↓
rendered UI tests/manual verification
```

A feature is not complete only because its source code compiles.

---

# 57. Regression Principle

When implementing a new phase:

```text
New feature
    ↓
Build
    ↓
Feature tests
    ↓
Regression tests
    ↓
Existing functionality verified
```

Existing working functionality must not be removed or silently redesigned.

---

# 58. Development Mode

The application should support a demo/development mode that works without external AI credentials.

Example:

```env
AI_PROVIDER=demo
```

This allows:

- UI development
- deterministic service demonstrations
- testing
- hackathon demo reliability

The demo provider must return structured responses matching the same contract as a real AI provider.

---

# 59. Architecture Non-Negotiables

1. Keep UI separate from business logic.
2. Keep AI provider logic separate from UI.
3. Keep verified government data separate from AI-generated content.
4. Use deterministic guidance for known supported workflows.
5. Use AI as explanation/fallback where appropriate.
6. Never let AI invent official URLs.
7. Never automatically submit government forms.
8. Never perform payments.
9. Never request OTPs, PINs, passwords, or bank credentials.
10. Keep API secrets server-side.
11. Keep the browser extension modular.
12. Keep extension DOM logic separate from core business logic.
13. Use typed shared contracts.
14. Avoid duplicate data models.
15. Do not silently change architecture.
16. Preserve backward compatibility when adding features.
17. Prefer small, isolated changes.
18. Test before declaring a module complete.
19. Do not introduce unnecessary dependencies.
20. If an architectural assumption is invalid, stop and report it rather than inventing a solution.

---

# 60. Definition of Architectural Completion

The architecture is considered correctly implemented when:

- The web application builds independently.
- The extension builds independently.
- Core modules do not depend on UI modules.
- AI providers can be swapped without changing UI code.
- Verified service and scheme data are independent of AI.
- Known forms use deterministic form guides.
- Unknown pages can use AI fallback.
- Accessibility preferences are centralized.
- Official sources are represented separately.
- API keys are not exposed to browser code.
- Sensitive information is not logged or persisted.
- New features can be added without rewriting unrelated modules.

---

# 61. Final Architecture Principle

> Build Sahayak as a modular accessibility and task-navigation layer, not as a monolithic AI chatbot.

The architecture should make it possible to change:

```text
AI provider
UI implementation
Scheme data
Supported portals
Form guides
Voice implementation
```

without rewriting the rest of the system.

The system should remain:

```text
Modular
   +
Verifiable
   +
Accessible
   +
Provider-independent
   +
Safe
   +
Incrementally extensible
```
