# Phase P04 — Context: AI Assistant Core & Provider Abstraction

## 1. Purpose
The purpose of Phase P04 is to build the core AI orchestration layer, the provider-agnostic interface (`AIProvider`), the deterministic `DemoProvider`, the `GeminiProvider` adapter, the intent classification engine, and the server-side backend proxy route (`/api/assistant`).

## 2. Why Phase Exists
Sahayak AI requires natural language intent understanding and contextual plain-language explanation without vendor lock-in or client-side secret exposure. P04 establishes the isolated AI layer defined in `ARCHITECTURE.md` Section 31 and ADR-001, ensuring that the web UI communicates strictly via standardized `AssistantRequest` and `SahayakResponse` shapes.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/ARCHITECTURE.md`: Section 31 (AI Provider Architecture), Section 32 (Environment Configuration), Section 33 (AI Request Flow), Section 34 (AI Responsibility Boundary), Section 38.1 (Secrets).
- `docs/source-of-truth/DATA-CONTRACTS.md`: Sections 20–25 (`AssistantRequest`, `Intent`, `SahayakResponse`, `AIProvider`).
- `docs/source-of-truth/SECURITY.md`: Sections 7, 8, 23, 24, 25 (AI Provider Security, API Key Server-Side, Prompt Injection Defense).

## 4. PRD Dependencies
- `docs/PRD.md`: Section 16 (AI Assistant Requirements), Section 33 (AI Boundaries).

## 5. Previous Phase Dependency
- **Phase P03 (Shared Contracts & Data):** P04 relies on canonical types (`AssistantRequest`, `SahayakResponse`, `AIProvider`, `Intent`) and verified JSON registries.

## 6. Next Phase Dependency
- **Phase P05 (Services & Task Guidance):** P05 hooks into intent detection and conversational navigation built in P04.

## 7. Architectural Constraints
- Presentation code must NEVER call Google Gen AI SDK directly.
- `AI_API_KEY` must remain strictly server-side.
- The `DemoProvider` must be the default when no API key is supplied, enabling 100% offline development.

## 8. Out-of-Scope
- Building full frontend UI chat components (only the core orchestration service and API route).
- Form guide DOM element highlighting.
- Screen screenshot vision analysis (handled in P07).
