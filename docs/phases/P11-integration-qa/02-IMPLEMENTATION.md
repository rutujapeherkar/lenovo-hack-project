# Phase P11 — Implementation Plan: Full Integration & Quality Assurance

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/UI.md` Section 57 and `docs/source-of-truth/SECURITY.md` Section 37.
2. [CREATE] `tests/e2e/core-journeys.test.ts` implementing end-to-end integration tests for all 5 journeys.
3. [CREATE] `tests/a11y/accessibility.test.ts` running axe-core / automated accessibility audits.
4. [CREATE] `tests/security/security-audit.test.ts` checking bundle chunks, API secrets, and sensitive input stripping.
5. [MODIFY] Fix any CSS overflow or text-truncation issues uncovered during Marathi/Hindi testing.
6. [MODIFY] Fix any routing or state retention defects uncovered during cross-page transitions.
7. [VERIFY] Run `npm run test` and `npm run build`; confirm 100% green status.

## 2. Files to Create & Modify
- [CREATE] `tests/e2e/core-journeys.test.ts`
- [CREATE] `tests/a11y/accessibility.test.ts`
- [CREATE] `tests/security/security-audit.test.ts`
- [MODIFY] Components requiring CSS / layout adjustments for Devanagari text
- [REFERENCE] `docs/PRD.md`
- [REFERENCE] `docs/source-of-truth/UI.md`

## 3. Module Responsibilities
- `core-journeys.test.ts`: Automates full user flow verification.
- `accessibility.test.ts`: Automates contrast, ARIA landmarks, and focus checks.
- `security-audit.test.ts`: Enforces secret-free client builds and credential rejection.

## 4. Integration Points
- Exercises complete system stack: UI -> Components -> Application Services -> Core -> Providers -> Extension.

## 5. Data Flow
- E2E test harness simulates user interaction across all routes and checks DOM states.

## 6. Testing Points
- 100% test pass rate across all test files.
- Manual verification on Chrome, Edge, and Safari mobile viewports.
