# Phase P08 — Changelog: Browser Extension & DOM In-Page Guidance

## Phase Status
**Status:** Completed

## Record of Changes

### 1. Extension Structure & Files Created
- `extension/manifest.json`: Manifest V3 configuration with `side_panel` (`sidepanel.html`), `background` (`service_worker: background.js`), content script (`content.js`), least-privilege permissions (`sidePanel`, `activeTab`, `storage`), and government-restricted host permissions (`*://*.gov.in/*`, `*://*.mahaonline.gov.in/*`, `*://localhost/*`, `*://127.0.0.1/*`).
- `extension/src/shared/types.ts`: Re-exports canonical contracts (`ExtensionMessage`, `ExtensionResponse`, `ExtensionError`, `PortalMatch`, `PageContext`, `FormGuide`, `FormField`, `Language`).
- `extension/src/shared/messaging.ts`: Strongly typed wrappers for `chrome.tabs.sendMessage` and `chrome.runtime.sendMessage`.
- `extension/src/background/service-worker.ts`: Background service worker managing side panel activation (`openPanelOnActionClick`), extension lifecycle, and tab navigation listeners for government domains.
- `extension/src/content/highlighter.ts`: Non-destructive DOM field highlighter injecting `.sahayak-field-highlight` outline with smooth scrolling into view; strictly enforces zero touch on password, hidden, or CVV/PIN inputs.
- `extension/src/content/detector.ts`: Safe page context extraction (URL, domain, title, safe visible headings) and deterministic portal/form identification.
- `extension/src/content/content-script.ts`: Content script entry point listening to `ExtensionMessage` (`GET_PAGE_CONTEXT`, `GET_CURRENT_FORM`, `HIGHLIGHT_FIELD`, `CLEAR_HIGHLIGHT`) and executing safe DOM actions.
- `extension/src/sidepanel/App.tsx`: React side panel companion UI featuring portal context banner, 🟢 known vs ⚪ unknown status indicator, 4 trilingual action buttons, form step guidance with field highlighting, plain-language page explanations, document checklists, and mandatory security disclaimers.
- `extension/src/sidepanel/index.tsx`: ReactDOM root mount for side panel.
- `extension/sidepanel.html`: HTML shell for side panel.
- `src/core/portals/portal-detector.ts`: Deterministic portal matcher and domain verifier (`PortalDetector`).
- `src/core/portals/index.ts`: Barrel export for portal detection.
- `src/core/form-guides/form-guide-repository.ts`: Deterministic form guide repository with verified guides for Aaple Sarkar authentication (`aaple-sarkar-login`) and income certificate application (`income-certificate-form`).
- `src/core/form-guides/index.ts`: Barrel export for form guides.
- `scripts/build-extension.mjs`: Automated extension compilation script building `background.js`, `content.js`, `sidepanel.js`, and copying assets into `extension/dist/`.
- `scripts/test-p08.mjs`: Automated verification test suite covering 16 criteria across manifest permissions, messaging, detection, DOM highlighting, password rejection, and multilingual action labels.

### 2. Files Modified
- `src/core/shared/types.ts`: Added optional `selector?: string` to `HIGHLIGHT_FIELD` and `explanation?: LocalizedText` to `FormField`.
- `package.json`: Registered `"build:extension": "node scripts/build-extension.mjs"` and added `test-p08.mjs` to `npm test` pipeline.
- `docs/phases/P08-browser-extension/03-ACCEPTANCE.md`: Checked off all criteria AC-P08-01 through AC-P08-10.

### 3. Tests Executed & Verification
- **Automated Test Suite (`scripts/test-p08.mjs`):** 16/16 checks passed.
  - Manifest V3 & least-privilege permissions verification (zero `<all_urls>`, zero `webRequest`, zero `cookies`).
  - Bundle integrity check (`extension/dist/` contains all 5 required compiled artifacts).
  - Test P08-MSG-01: Extension message contract and discriminated union validation.
  - Test P08-DET-01: Deterministic portal detection for Aaple Sarkar, MahaDBT, and RCMS portals.
  - Test P08-DOM-01: Non-destructive highlight injection, smooth scroll, and highlight clearing.
  - Test P08-SEC-01 & AC-P08-09: Password and payment field touch prevention verified with mock DOM fixtures.
  - Test P08-LANG-01: Verified Devanagari text for Marathi and Hindi action buttons.
  - AC-P08-10: Verified zero automated form submit or click triggers in extension source code.
- **Full Test Suite (`npm test`):** **97/97 checks passed** across P02, P03, P04, P05, P06, P07, and P08.
- **Type Checking (`npx tsc --noEmit`):** 0 errors.
- **Production Build (`npm run build:extension && npm run build`):** Both clean pass.
- **Browser Visual Inspection:** Conducted via browser subagent on `http://localhost:3000/extension/dist/sidepanel.html` verifying Marathi/Hindi/English toggles, portal context, 🟢 recognized status, form guidance navigation (Step 1 -> Step 2), page explanation, and disclaimer. Recording saved as artifact `extension_sidepanel_inspection_1790343936057.webp`.

### 4. Known Limitations
- Voice input/readout within the side panel is scheduled for Phase P09 (Accessibility & Voice).
- External network requests to live government portals require the user to have installed the extension locally into Chromium via `chrome://extensions` ("Load unpacked" pointing to `extension/dist/`).
