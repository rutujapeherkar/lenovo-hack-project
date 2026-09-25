# Phase P05 — Context: Public Services & Deterministic Task Guidance

## 1. Purpose
The purpose of Phase P05 is to implement the public services discovery experience, the service details view, and the deterministic step-by-step task guidance journey UI.

## 2. Why Phase Exists
Citizens get overwhelmed when applying for certificates or services because government procedures are multi-step and opaque. P05 provides a clear, comforting step-by-step roadmap for verified services (e.g., Income Certificate, Domicile Certificate). Crucially, the step sequences are deterministic and verified, ensuring the AI does not fabricate steps or instructions.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/PRODUCT.md`: Section 8.3 (Service Guidance), Section 20 (Services Experience), Section 25 (Form Guidance Principle).
- `docs/source-of-truth/ARCHITECTURE.md`: Section 11 (Service Module), Section 12 (Deterministic Service Guidance), Section 13 (Task Module), Section 43 (Data Flow — Task Journey).
- `docs/source-of-truth/DATA-CONTRACTS.md`: Section 7 (`TaskStep`), Section 8 (`Service`), Section 30 (`CurrentTask`).
- `docs/source-of-truth/UI.md`: Section 19 (Services Page), Section 20 (Service Detail Page), Section 21 (Task Journey UI).
- `docs/source-of-truth/OFFICIAL-SOURCES.md`: Level 2 & 4 verified service workflows and URLs.

## 4. PRD Dependencies
- `docs/PRD.md`: Section 13 (FR-02 Service Catalog & Roadmap), Section 17 (Deterministic Form Guidance).

## 5. Previous Phase Dependency
- **Phase P03 (Shared Contracts & Data):** Sourced from `services.json`.
- **Phase P04 (AI Assistant Core):** Sourced from intent routing.

## 6. Next Phase Dependency
- **Phase P06 (Scheme Finder):** Builds upon the card and filter components established in P05.

## 7. Architectural Constraints
- Guidance workflows must be deterministic and pull directly from `core/services/` and `services.json`.
- AI may provide conversational explanation of a step, but cannot alter the step sequence.
- Sahayak must NEVER automatically submit the application.

## 8. Out-of-Scope
- Browser extension in-page DOM injection (P08).
- Scheme discovery (P06).
