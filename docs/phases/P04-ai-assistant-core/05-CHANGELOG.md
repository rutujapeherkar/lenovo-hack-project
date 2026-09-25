# Phase P04 — Changelog: AI Assistant Core & Provider Abstraction

## Phase Status
**Status:** Completed  
**Completed Date:** 2026-09-25  
**Sign-off:** Antigravity AI Pair Programmer

---

## Record of Changes

### 1. Provider Abstraction Interface (`src/core/ai/provider.ts`)
- Defined canonical `AIProvider` interface matching `DATA-CONTRACTS.md` and `ARCHITECTURE.md` Section 31.
- Implemented `generateResponse(request: AssistantRequest): Promise<SahayakResponse>` signature with zero vendor lock-in.

### 2. Offline Deterministic Provider (`src/core/ai/demo-provider.ts`)
- Implemented zero-dependency `DemoProvider` running 100% offline without external internet or API credentials.
- Handles multilingual queries in English (`en`), Marathi (`mr`), and Hindi (`hi`).
- Integrates with verified P03 static registries (`income-certificate`, `domicile-certificate`, `ration-card-member-addition`, `rcsms-shikshan-shulkh-shishyavrutti`, `majhi-ladki-bahin-yojna`, `sanjay-gandhi-niradhar-yojna`).
- Active defense against sensitive credential requests (refuses OTP, PIN, password, bank credentials).
- Active neutralization of prompt injection attacks (refuses fake link creation or instruction override).
- Graceful handling of unverified/unknown schemes (explicitly refuses to hallucinate).

### 3. Server-Side Gemini Adapter (`src/core/ai/gemini-provider.ts`)
- Built isolated server-side `GeminiProvider` using native `fetch` with zero external npm dependencies.
- Enforces strict structured JSON output format via Gemini `generationConfig: { responseMimeType: "application/json" }`.
- System instructions enforce public civic-tech persona, zero URL hallucination, and sensitive data prohibitions.
- URL safety sanitizer strips any unverified links that do not match the approved `.gov.in`/`.nic.in`/`.mahaonline.gov.in` domain whitelist.
- Implemented automatic 6-second timeout and graceful degradation to `DemoProvider`.

### 4. Provider Factory & Automatic Degradation (`src/core/ai/factory.ts`)
- Implemented `getAIProvider()` resolving provider from environment (`AI_PROVIDER=demo` | `gemini`).
- Automatically degrades from `gemini` to `DemoProvider` if `AI_API_KEY` is missing or unconfigured.

### 5. Multilingual Intent Engine (`src/core/assistant/intent-engine.ts`)
- Built deterministic regex and dictionary classification engine covering all 10 canonical intents:
  `service_discovery`, `service_guidance`, `scheme_discovery`, `explain_screen`, `explain_field`, `current_page_help`, `next_step`, `required_documents`, `general_information`, `unknown`.
- Tested across 20+ English, Marathi, and Hindi prompt variations.

### 6. Assistant Orchestration Service (`src/core/assistant/assistant-service.ts`)
- Orchestrates canonical pipeline: `Request Validation -> Sanitization -> Intent Detection -> Retrieval Boundary -> AI Generation -> Response Validation -> SahayakResponse`.
- Enforces `hasNoSensitiveKeys` security sanitization on all incoming requests.

### 7. Server-Side Proxy Endpoint (`src/api/assistant/route.ts` & `vite.config.ts`)
- Implemented `POST /api/assistant` returning standardized `ApiResponse<SahayakResponse>`.
- Enforces `Cache-Control: no-store, no-cache, must-revalidate`.
- Integrated as dev server middleware in `vite.config.ts` via `server.ssrLoadModule`.
- Confirmed zero leakage of `AI_API_KEY` into frontend client bundles.

### 8. Interactive Verification UI (`src/pages/HomePage.tsx`)
- Connected civic hero search input to `/api/assistant` with interactive response display (Intent badge, localized message, guidance steps, official source links, and civic disclaimers).

### 9. Automated Verification Suite (`scripts/test-p04.mjs`)
- Created 13-point automated verification runner covering AC-P04-01 through AC-P04-10.
- Updated `package.json` test runner to execute P02, P03, and P04 test suites.

---

## Test Execution Results

| Test Category | Test Description | Result |
|---|---|---|
| **AC-P04-01** | `core/ai/provider.ts` exports `AIProvider` contract | **PASS** |
| **AC-P04-02** | `DemoProvider` fulfills queries in en, mr, and hi offline | **PASS** |
| **AC-P04-03** | `GeminiProvider` isolated server-side with zero client imports | **PASS** |
| **AC-P04-04** | `AI_PROVIDER=demo` activates `DemoProvider` | **PASS** |
| **AC-P04-05** | Missing `AI_API_KEY` degrades gracefully to `DemoProvider` | **PASS** |
| **AC-P04-06** | Intent maps "income certificate" and "उत्पन्न दाखला" to service guidance | **PASS** |
| **AC-P04-07** | Intent maps "scholarship" and "योजना" to scheme discovery | **PASS** |
| **AC-P04-08** | `/api/assistant` handles POST and sets `Cache-Control: no-store` | **PASS** |
| **AC-P04-09** | Zero occurrences of `AI_API_KEY` in `dist/` client chunks | **PASS** |
| **AC-P04-10** | TypeScript compiles cleanly with 0 errors (`tsc --noEmit`) | **PASS** |
| **P04-SEC-01** | Prompt injection neutralized; cannot override rules | **PASS** |
| **P04-SEC-03** | Sensitive credential requests (OTP, PIN, passwords) actively refused | **PASS** |
| **P04-SEC-04** | Unknown schemes return safe notice without hallucinating | **PASS** |

---

## Known Limitations
- P04 establishes the assistant core, provider abstraction, intent classifier, and API route; full service step execution (P05) and searchable scheme filters (P06) will be implemented in subsequent phases per the roadmap.

