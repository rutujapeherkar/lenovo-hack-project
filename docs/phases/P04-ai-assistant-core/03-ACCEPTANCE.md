# Phase P04 — Acceptance Criteria: AI Assistant Core & Provider Abstraction

## Acceptance Checklist

- [ ] **AC-P04-01:** `core/ai/provider.ts` declares `generateResponse(request: AssistantRequest): Promise<SahayakResponse>` matching `DATA-CONTRACTS.md`.
- [ ] **AC-P04-02:** `DemoProvider` fulfills queries in English, Marathi, and Hindi without internet or API keys.
- [ ] **AC-P04-03:** `GeminiProvider` exists as an isolated backend adapter; no Gemini client libraries are imported in frontend components.
- [ ] **AC-P04-04:** Setting `AI_PROVIDER=demo` in `.env` activates `DemoProvider`; setting `AI_PROVIDER=gemini` activates `GeminiProvider`.
- [ ] **AC-P04-05:** If `AI_PROVIDER=gemini` but `AI_API_KEY` is missing or invalid, the factory automatically degrades to `DemoProvider` with an alert logged.
- [ ] **AC-P04-06:** `IntentEngine` maps "income certificate" and "उत्पन्न दाखला" to `service_discovery` or `service_guidance`.
- [ ] **AC-P04-07:** `IntentEngine` maps "scholarship" and "योजना" to `scheme_discovery`.
- [ ] **AC-P04-08:** `api/assistant/route.ts` handles POST requests, returns `ApiResponse<SahayakResponse>`, and sets `Cache-Control: no-store`.
- [ ] **AC-P04-09:** Cloud API keys (`AI_API_KEY`) are verified absent from client bundles (checked via bundle analysis or grep).
- [ ] **AC-P04-10:** TypeScript compiler confirms zero type errors across `core/ai/` and `core/assistant/`.
