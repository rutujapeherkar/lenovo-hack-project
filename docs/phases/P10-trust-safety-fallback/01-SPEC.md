# Phase P10 — Specification: Trust, Safety & Fallback Architecture

## 1. Goals
- Implement input sanitation intercepting OTP, UPI PIN, password, and CVV inputs, showing clear citizen warnings.
- Implement the mandatory government disclaimer banner on all pages and outbound external links.
- Implement the Payment Safety Guidance component explaining UPI/GRAS payments without collecting credentials.
- Implement systemic error boundaries and fallback views for AI outages, voice failures, and network drops.

## 2. Requirements

### Functional Requirements
- **FR-P10-01 (Credential Interception Guard):** Client-side and server-side regex filter detecting sensitive patterns (6-digit OTPs, UPI PIN keywords, card CVV patterns). If detected:
  - Text is stripped/redacted immediately.
  - Warning banner displays: *"Please do not share your OTP, PIN, password, or banking credentials with Sahayak."*
  - Payload is blocked from being sent to external AI providers.
- **FR-P10-02 (Mandatory Trust Disclaimers):** Render prominent disclaimer across all official source components:
  > *"Sahayak AI provides guidance and does not represent a government department. Requirements and procedures may change. Verify current information on the official service portal before submitting an application."*
- **FR-P10-03 (Payment Safety Module):** When a guided task step involves fee payment (e.g., Aaple Sarkar ₹33.60 statutory fee):
  - In-page form highlighting pauses.
  - Clear guidance displays instructing the citizen to authorize payment in their private banking app.
  - Explicit warning: *"Never enter your UPI PIN or banking password inside Sahayak."*
- **FR-P10-04 (Fallback & Error Boundaries):**
  - React Error Boundaries preventing full app crashes.
  - AI Failure Fallback: Automatically shifts to deterministic `DemoProvider` or displays calm, actionable message: *"Sahayak could not process that request right now. You can try again or continue with the available service guidance."*
  - Official Portal Outage Fallback: Informs citizen of last known verification date without fabricating live status.

### Non-Functional Requirements
- **Zero Hallucination:** Under fallback conditions, system never fabricates alternative contact numbers, links, or scheme criteria.

## 3. Inputs & Outputs
- **Inputs:** User text inputs, payment step contexts, API error responses.
- **Outputs:** Sanitized payloads, safety notices, actionable fallback UI.

## 4. Modules & Contracts
- `core/security/sanitizer.ts`
- `core/security/payment-guard.ts`
- `components/common/ErrorBoundary.tsx`
- `components/common/SafetyNotice.tsx`
- `components/common/FallbackView.tsx`

## 5. Constraints & Out-of-Scope
- No intercepting OS-level keyloggers.
- No processing real credit card transactions.
