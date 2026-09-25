# Phase P11 — Context: Full Integration & Quality Assurance

## 1. Purpose
The purpose of Phase P11 is to perform end-to-end integration, cross-module verification, cross-browser compatibility testing, multilingual layout audit (Devanagari text expansion), and automated regression testing across all web and browser extension flows.

## 2. Why Phase Exists
Individual modules may function in isolation but reveal integration seams when connected: route transitions might drop language context, Devanagari text may overflow cards on mobile viewports, or extension messaging might experience race conditions. P11 conducts a rigorous, comprehensive quality gate before hackathon demonstration.

## 3. Source-of-Truth Dependencies
- All six source-of-truth documents in `docs/source-of-truth/`:
  - `PRODUCT.md`: Verification of all core user journeys.
  - `ARCHITECTURE.md`: Module dependency verification and performance check.
  - `DATA-CONTRACTS.md`: End-to-end contract compliance.
  - `UI.md`: Section 57 (UI Validation Checklist), Section 45 (Marathi/Hindi UI Rules).
  - `OFFICIAL-SOURCES.md`: 100% link and authority validation.
  - `SECURITY.md`: Section 37 (Security Testing Checklist).

## 4. PRD Dependencies
- `docs/PRD.md`: Section 12 (Core User Journeys), Section 35 (Success Criteria), Section 36 (Definition of Done).

## 5. Previous Phase Dependency
- **Phases P00–P10:** All feature and governance phases must be completed before entering full QA.

## 6. Next Phase Dependency
- **Phase P12 (Demo & Hackathon Polish):** P12 focuses on presentation polish and demo flow refinement once QA certifies system stability.

## 7. Architectural Constraints
- No new features or architecture changes may be introduced during P11.
- All discovered defects must be fixed with minimal, targeted regression-tested changes.
- TypeScript compiler and linters must pass with zero errors.

## 8. Out-of-Scope
- Building new welfare scheme records or new portal guides.
- Expanding language support beyond `en`, `mr`, and `hi`.
