# Phase P08 — Context: Browser Extension & DOM In-Page Guidance

## 1. Purpose
The purpose of Phase P08 is to implement the Chromium browser extension: Manifest V3 configuration, Side Panel UI, Background Service Worker, Content Script portal detector, and DOM field highlighter.

## 2. Why Phase Exists
While the web app provides portal discovery, citizens actually fill forms on live external government websites (Aaple Sarkar, MahaDBT). The browser extension provides real-time, side-by-side contextual assistance directly inside the user's active browser window, highlighting required fields sequentially and explaining each step without requiring the user to switch tabs.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/ARCHITECTURE.md`: Section 26 (Browser Extension Architecture), Section 27 (Side Panel), Section 28 (Content Script), Section 29 (Background Service Worker), Section 30 (Extension Messaging), Section 53 (Extension Safety Boundary).
- `docs/source-of-truth/DATA-CONTRACTS.md`: Section 15 (`FormGuide`), Section 18 (`FormField`), Section 31 (`ExtensionMessage`), Section 32 (`ExtensionResponse`).
- `docs/source-of-truth/UI.md`: Section 28 (Extension Visual Language), Section 29 (Known vs Unknown Extension State).
- `docs/source-of-truth/SECURITY.md`: Sections 10–15 (Extension Security, Content Script Security, DOM Selector Safety).

## 4. PRD Dependencies
- `docs/PRD.md`: Section 15 (Browser Extension Requirements), Section 34 (Extension Permissions).

## 5. Previous Phase Dependency
- **Phase P03 (Shared Contracts & Data):** Relies on `ExtensionMessage`, `Portal`, and `FormGuide` definitions.
- **Phase P04 (AI Assistant Core):** Extension side panel connects to `/api/assistant` for unknown page AI explanations.

## 6. Next Phase Dependency
- **Phase P09 (Accessibility & Voice):** Shares voice input and accessibility preferences.

## 7. Architectural Constraints
- Manifest V3 with least-privilege permissions (`sidePanel`, `activeTab`, `storage`, and strictly scoped host permissions).
- Content script must treat the government page as untrusted: never read password inputs, never click submit buttons, never inject unauthorized scripts.
- Distinct states: 🟢 *"Sahayak understands this page"* vs ⚪ *"Sahayak can explain this page using AI"*.

## 8. Out-of-Scope
- Automated form autofilling or robotic submission.
- Payment execution or PIN entry.
