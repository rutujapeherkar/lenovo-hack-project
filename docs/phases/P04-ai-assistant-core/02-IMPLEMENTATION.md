# Phase P04 — Implementation Plan: AI Assistant Core & Provider Abstraction

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/ARCHITECTURE.md` Sections 31–34 and ADR-001.
2. [CREATE] `core/ai/provider.ts` exporting `AIProvider` interface.
3. [CREATE] `core/ai/demo-provider.ts` implementing `DemoProvider` with static fixture responses.
4. [CREATE] `core/ai/gemini-provider.ts` implementing `GeminiProvider` using server-side Gemini SDK.
5. [CREATE] `core/ai/factory.ts` resolving provider by environment config.
6. [CREATE] `core/assistant/intent-engine.ts` with deterministic dictionary rules and intent classifiers.
7. [CREATE] `core/assistant/assistant-service.ts` coordinating intent, retrieval, and provider.
8. [CREATE] `api/assistant/route.ts` implementing Next.js/Vite server endpoint.
9. [VERIFY] Write unit tests for `DemoProvider` and `IntentEngine`.

## 2. Files to Create & Modify
- [CREATE] `core/ai/provider.ts`
- [CREATE] `core/ai/demo-provider.ts`
- [CREATE] `core/ai/gemini-provider.ts`
- [CREATE] `core/ai/factory.ts`
- [CREATE] `core/assistant/intent-engine.ts`
- [CREATE] `core/assistant/assistant-service.ts`
- [CREATE] `api/assistant/route.ts`
- [REFERENCE] `core/shared/types.ts`
- [REFERENCE] `docs/source-of-truth/SECURITY.md`

## 3. Module Responsibilities
- `provider.ts`: Declares canonical method signatures.
- `demo-provider.ts`: Returns deterministic fallback and test data.
- `gemini-provider.ts`: Encapsulates model prompt engineering and response JSON validation.
- `intent-engine.ts`: Maps raw multilingual queries to structured `Intent` enums.
- `assistant-service.ts`: Core orchestrator.

## 4. Integration Points
- Consumed by frontend UI in P05, P06, and P08 via HTTP POST `/api/assistant`.

## 5. Data Flow
- `Client -> HTTP POST /api/assistant -> AssistantService -> IntentEngine -> AIProvider -> Client`.

## 6. Testing Points
- Test `DemoProvider` returns expected intents for English, Marathi, and Hindi prompts.
- Test that missing API key automatically falls back to `DemoProvider` without throwing fatal errors.
