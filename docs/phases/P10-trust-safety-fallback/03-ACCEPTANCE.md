# Phase P10 — Acceptance Criteria: Trust, Safety & Fallback Architecture

## Acceptance Checklist

- [ ] **AC-P10-01:** Entering an OTP pattern in the search/chat input triggers an immediate warning: *"Please do not share your OTP, PIN, password, or banking credentials with Sahayak."*
- [ ] **AC-P10-02:** Intercepted credential values are redacted from client state and never forwarded to `/api/assistant`.
- [ ] **AC-P10-03:** The mandatory disclaimer *"Sahayak AI provides guidance and does not represent a government department..."* is visible in the footer and on all external routing dialogs.
- [ ] **AC-P10-04:** On task steps marked as payment/fee, Sahayak renders a payment safety alert instructing the user to complete payment directly in their banking interface.
- [ ] **AC-P10-05:** Under no circumstances does any UI component provide input fields asking for UPI PINs, ATM PINs, or CVVs.
- [ ] **AC-P10-06:** Simulating an external AI service failure (HTTP 500 / timeout) displays the graceful fallback card rather than an unhandled exception or white screen.
- [ ] **AC-P10-07:** If an official government link cannot be verified, the button shows "View Official Information" instead of "Apply Now", or clearly explains pending verification status.
- [ ] **AC-P10-08:** React `ErrorBoundary` successfully catches rendering exceptions and provides a "Reload view" or "Return Home" button.
- [ ] **AC-P10-09:** Application logs verify that no user passwords, OTPs, or API keys are written to console or network payloads.
- [ ] **AC-P10-10:** All safety disclaimers and error messages render natively in English, Marathi, and Hindi.
