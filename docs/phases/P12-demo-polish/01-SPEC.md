# Phase P12 — Specification: Demo & Hackathon Polish

## 1. Goals
- Deliver pre-packaged demo scenarios for the 3-minute hackathon pitch:
  1. Marathi Senior Citizen Voice Query (Income Certificate).
  2. Explain Screen with pre-loaded mock government form screenshot.
  3. Browser Extension side-by-side on live Aaple Sarkar page.
  4. Accessibility mode live switch (High Contrast + Large Font + Read Aloud).
- Add Quick Scenario Chips on the Home hero ("I need an income certificate", "Scholarships for college students", "Divyang pension scheme", "Explain a form").
- Provide pre-cached sample screenshots on `/explain-screen` for 1-click vision demonstration without requiring file browsing.
- Polish subtle micro-interactions and transitions in accordance with `UI.md` Section 51.
- Write the `DEMO_WALKTHROUGH.md` script for presenters.

## 2. Requirements

### Functional Requirements
- **FR-P12-01 (Hero Demo Chips):** Clickable pre-set query pills on the Home hero that automatically populate the input and trigger the assistant.
- **FR-P12-02 (Pre-loaded Vision Samples):** In `/explain-screen`, provide 3 sample thumbnail buttons (Aaple Sarkar Form, MahaDBT Error Banner, RCMS Ration Card) allowing judges/users to test screen explanation instantly.
- **FR-P12-03 (Offline Demo Mode Indicator):** A subtle, non-intrusive badge in settings or dev mode indicating whether `DemoProvider` or `GeminiProvider` is active, with instant 1-click toggle.
- **FR-P12-04 (Presenter Walkthrough Script):** Author `docs/DEMO_WALKTHROUGH.md` detailing the minute-by-minute speaking track and visual clicks for the judges.
- **FR-P12-05 (Micro-interaction Tuning):** Ensure smooth 150ms ease-out transitions for buttons, card hovers, and side panel animations respecting `prefers-reduced-motion`.

### Non-Functional Requirements
- **Reliability:** 100% immune to conference Wi-Fi failures via `DemoProvider`.
- **First Impression:** High civic-tech aesthetic quality, calm trustworthy visual tone.

## 3. Inputs & Outputs
- **Inputs:** Fully integrated web application and extension.
- **Outputs:** Polished demo-ready application and `docs/DEMO_WALKTHROUGH.md`.

## 4. Modules & Contracts
- `docs/DEMO_WALKTHROUGH.md`
- `components/assistant/QuickActions.tsx`
- `components/explain/SampleScreenshots.tsx`

## 5. Constraints & Out-of-Scope
- No fake AI claims or deceptive representations.
