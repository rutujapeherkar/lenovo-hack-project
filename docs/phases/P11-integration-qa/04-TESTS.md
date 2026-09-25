# Phase P11 — Tests: Full Integration & Quality Assurance

## 1. Automated Integration Tests
- **Test P11-E2E-01 (Journey 1):** Execute voice query flow from Home to Income Certificate roadmap.
- **Test P11-E2E-02 (Journey 2):** Complete step walkthrough with document checklist verification.
- **Test P11-E2E-03 (Journey 3):** Execute scheme faceted search and assert matching results.
- **Test P11-E2E-04 (Journey 4):** Upload screenshot test image and assert vision response structure.
- **Test P11-E2E-05 (Journey 5):** Dispatch simulated extension page detection and assert field highlight trigger.

## 2. Cross-Browser & Responsive Tests
- **Test P11-BRW-01 (Chrome/Chromium):** Verify full support for speech recognition, extension, and UI.
- **Test P11-BRW-02 (Safari/WebKit):** Verify graceful speech fallback and clean Devanagari typography.
- **Test P11-RSP-01 (Mobile 375px):** Verify zero horizontal overflow on small mobile viewports.

## 3. Multilingual Layout Audits
- **Test P11-LANG-01 (Devanagari Expansion):** Render all pages in Marathi; verify card heights adjust fluidly and no buttons wrap into broken 2-line states.

## 4. Accessibility Audits
- **Test P11-A11Y-01 (Automated Axe Check):** Run axe accessibility linter; assert zero critical or serious WCAG 2.1 violations.

## 5. Security Regression Tests
- **Test P11-SEC-01 (Dependency Audit):** Run `npm audit` and ensure zero critical known vulnerabilities.
