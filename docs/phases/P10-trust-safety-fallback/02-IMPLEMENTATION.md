# Phase P10 — Implementation Plan: Trust, Safety & Fallback Architecture

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/SECURITY.md` and `docs/source-of-truth/OFFICIAL-SOURCES.md`.
2. [CREATE] `core/security/sanitizer.ts` with regex filters detecting OTP, PIN, and password patterns.
3. [CREATE] `core/security/payment-guard.ts` identifying payment gateway URLs/steps and suspending auto-guidance.
4. [CREATE] `components/common/SafetyNotice.tsx` rendering localized warning callouts.
5. [CREATE] `components/common/ErrorBoundary.tsx` catching runtime React exceptions.
6. [CREATE] `components/common/FallbackView.tsx` rendering calm, actionable recovery states.
7. [MODIFY] `core/assistant/assistant-service.ts` injecting sanitizer filter before AI dispatch.
8. [MODIFY] `components/services/TaskJourney.tsx` rendering payment safety notice during payment steps.
9. [VERIFY] Test that typing an OTP string triggers the safety warning and strips the value.

## 2. Files to Create & Modify
- [CREATE] `core/security/sanitizer.ts`
- [CREATE] `core/security/payment-guard.ts`
- [CREATE] `components/common/SafetyNotice.tsx`
- [CREATE] `components/common/ErrorBoundary.tsx`
- [CREATE] `components/common/FallbackView.tsx`
- [MODIFY] `core/assistant/assistant-service.ts`
- [MODIFY] `components/services/TaskJourney.tsx`
- [REFERENCE] `docs/source-of-truth/SECURITY.md`
- [REFERENCE] `docs/source-of-truth/OFFICIAL-SOURCES.md`

## 3. Module Responsibilities
- `sanitizer.ts`: Client/server token redaction and sensitive input interception.
- `payment-guard.ts`: Enforces read-only guidance on financial transactions.
- `ErrorBoundary.tsx`: Isolates component crashes, keeping navigation accessible.

## 4. Integration Points
- Intercepts all inputs in search boxes, chat messages, and extension prompts.
- Wraps all major page views to prevent full-app white screens.

## 5. Data Flow
- `User Input -> Sanitizer -> If Sensitive: Alert & Redact -> Safe Pipeline`.

## 6. Testing Points
- Test with synthetic credential strings (`"My OTP is 492810"`, `"UPI PIN 1234"`).
- Test intentional component error throw and verify `ErrorBoundary` renders clean fallback.
