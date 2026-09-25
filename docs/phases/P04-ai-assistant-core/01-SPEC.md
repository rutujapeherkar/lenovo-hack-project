# Phase P04 — Specification: AI Assistant Core & Provider Abstraction

## 1. Goals
- Implement the `AIProvider` contract interface in `core/ai/provider.ts`.
- Author the offline `DemoProvider` returning structured mock responses for common intents in `en`, `mr`, and `hi`.
- Author the `GeminiProvider` adapter translating prompts and enforcing JSON output schemas.
- Implement the `IntentEngine` performing keyword/regex matching first, falling back to LLM intent detection.
- Implement the `/api/assistant` server-side HTTP route to protect `AI_API_KEY`.

## 2. Requirements

### Functional Requirements
- **FR-P04-01 (Provider Factory):** `getAIProvider()` reads `process.env.AI_PROVIDER` (`demo` | `gemini`) and returns an active `AIProvider` instance.
- **FR-P04-02 (DemoProvider):** Offline provider supporting key queries (e.g., "income certificate", "scholarship", "help", "marathi queries") returning fully populated `SahayakResponse` objects.
- **FR-P04-03 (GeminiProvider):** Server-side adapter connecting to Gemini model; injects verified system prompt enforcing civic-tech persona and forbidding URL hallucination; validates model JSON into `SahayakResponse`.
- **FR-P04-04 (Intent Engine):** Classifies user messages into one of the 10 canonical intents: `service_discovery`, `service_guidance`, `scheme_discovery`, `explain_screen`, `explain_field`, `current_page_help`, `next_step`, `required_documents`, `general_information`, `unknown`.
- **FR-P04-05 (Backend Proxy Route):** `/api/assistant` receives `AssistantRequest`, coordinates intent + provider, sanitizes sensitive tokens, and returns `ApiResponse<SahayakResponse>`.

### Non-Functional Requirements
- **Security:** Zero client-side API key leakage.
- **Resilience:** If Gemini call times out (> 6s) or fails, gracefully falls back to `DemoProvider` / deterministic guidance.

## 3. Inputs & Outputs
- **Inputs:** `AssistantRequest` (`{ message: string; language: Language; pageContext?: PageContext }`).
- **Outputs:** `ApiResponse<SahayakResponse>`.

## 4. Modules & Contracts
- `core/ai/provider.ts`
- `core/ai/demo-provider.ts`
- `core/ai/gemini-provider.ts`
- `core/assistant/intent-engine.ts`
- `core/assistant/assistant-service.ts`
- `api/assistant/route.ts`

## 5. Constraints & Out-of-Scope
- No direct database storage of user queries.
- No direct DOM manipulation.
