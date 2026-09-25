# Phase P12 — Tests: Demo & Hackathon Polish

## 1. Demo Flow Tests
- **Test P12-DEMO-01 (Offline Wi-Fi Cut):** Disconnect network connection; click "Income Certificate" scenario chip; verify `DemoProvider` fulfills query cleanly within 500ms.
- **Test P12-DEMO-02 (Sample Screen 1-Click):** Click sample screenshot thumbnail; verify vision analysis completes and displays element cards without requiring manual file upload.

## 2. Timing Tests
- **Test P12-TIM-01 (Pitch Timing):** Execute the full 5-step judge script in `docs/DEMO_WALKTHROUGH.md`; verify entire flow takes between 2.5 and 3.5 minutes.

## 3. Manual Polish Checks
- **Test P12-MAN-01 (Judge Walkthrough Dry Run):** Presenters execute speaking points; verify zero unexpected dialogs, zero console red errors, and clean transitions.

## 4. Multilingual Live Switch Test
- **Test P12-LANG-01:** On Home page, switch from English -> Marathi -> Hindi while viewing a service roadmap; verify instant text swap with zero layout jump.

## 5. Security Sanity Check
- Verify that live demo does not expose `.env` or API credentials on screen or in browser DevTools Network tab.

## 6. Regression Tests
- Final regression verification across all test suites P01 through P11.
