# ADR-003 — Isolated Server-Side Secrets & Zero Credential Custody

## Status
Accepted (Source-of-truth decision)

## Date
2026-09-25

## Context
Citizens interacting with public service platforms and welfare portals regularly enter highly sensitive personal and financial data, including Aadhaar numbers, bank account numbers, passwords, OTPs, and UPI PINs. Furthermore, the Sahayak system integrates with cloud AI providers requiring secret API credentials. Inadvertent capture of user authentication secrets or exposure of cloud API keys in browser JavaScript or extension packages represents a catastrophic security vulnerability.

## Decision
We enforce a dual security boundary:
1. **Server-Side Secret Isolation:** All API keys (`AI_API_KEY`) reside exclusively in backend environment variables. Frontend client bundles and browser extension scripts must never contain or bundle API keys. All AI calls from the web client or extension side panel proxy through a lightweight backend endpoint.
2. **Zero Credential Custody:** Sahayak AI explicitly refuses custody of authentication secrets. The application contract, UI inputs, extension content script, and prompt orchestrators are strictly prohibited from soliciting, storing, or logging passwords, OTPs, UPI PINs, ATM PINs, CVVs, or full payment credentials. The citizen must perform all sensitive authentication and payment authorization directly on the official portal interface.

## Alternatives Considered
- *Direct Browser-to-Gemini with Ephemeral Client Tokens:* Rejected because token minting adds architectural complexity and still risks exposure via DevTools.
- *Assisted Form Auto-Submission via Stored Password:* Allowing Sahayak to store citizen credentials to auto-login. Rejected outright due to catastrophic liability, regulatory violations (IT Act & DPDP Act), and breach of civic trust.

## Consequences
- **Positive:** Immune to client-side API key scraping. Zero legal and regulatory liability regarding financial fraud, stolen PINs, or leaked OTPs.
- **Negative:** Requires running a lightweight backend proxy service alongside the static frontend.

## Source-of-Truth Impact
- Aligns directly with [SECURITY.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/SECURITY.md#L54-L86) (Sections 3 & 8) and [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md#L1094-L1108) (Section 38).

## Implementation Impact
- Phase P02 and P04 must implement backend API routing (`/api/assistant`, `/api/explain-screen`).
- Phase P08 must ensure the extension content script cannot attach listeners to password or payment fields.
- Phase P10 must verify input sanitization and secret-stripping filters.

## Reversal Conditions
Non-reversable. Security and privacy of citizen credentials cannot be compromised under any circumstances.
