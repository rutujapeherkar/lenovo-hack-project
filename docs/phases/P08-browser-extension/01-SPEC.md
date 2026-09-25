# Phase P08 — Specification: Browser Extension & DOM In-Page Guidance

## 1. Goals
- Deliver a complete Chromium Manifest V3 browser extension bundle (`extension/`).
- Implement the Side Panel UI (`extension/src/sidepanel/App.tsx`) with Sahayak visual styling.
- Implement the Content Script (`extension/src/content/content-script.ts`) detecting supported Maharashtra government portals via URL and DOM markers.
- Implement non-destructive DOM field highlighting (`highlighter.ts`) that outlines active fields with an accessible focus indicator.
- Implement typed cross-context message passing adhering to `ExtensionMessage`.

## 2. Requirements

### Functional Requirements
- **FR-P08-01 (Manifest V3 Bundle):** Create `extension/manifest.json` configured with `side_panel`, `service_worker`, content scripts, and host permissions for `*.gov.in/*` and `*.mahaonline.gov.in/*`.
- **FR-P08-02 (Portal Detector):** Content script inspects active tab hostname/pathname; matches against `data/maharashtra/portals.json`.
- **FR-P08-03 (Side Panel State Indicator):**
  - If portal matches: Displays 🟢 *"Sahayak understands this page: [Portal Name]"*.
  - If unknown page: Displays ⚪ *"Sahayak can explain this page using AI"*.
- **FR-P08-04 (Contextual Side Panel Actions):** Provides 4 key buttons:
  - `[ Explain this page ]`
  - `[ What should I do next? ]`
  - `[ Help me fill this form ]`
  - `[ Required documents ]`
- **FR-P08-05 (DOM Field Highlighter):** When "Help me fill this form" is triggered, identifies the current step's field via verified selector, applies `.sahayak-field-highlight` CSS outline, and scrolls into view smoothly.
- **FR-P08-06 (Clear Highlight):** Removes highlight classes when step changes or user closes the guide.

### Non-Functional Requirements
- **Security:** Zero listener injection on `input[type="password"]` or payment frames.
- **Independence:** Extension builds independently into `extension/dist/`.

## 3. Inputs & Outputs
- **Inputs:** Active tab DOM context and `FormGuide` definitions.
- **Outputs:** Manifest V3 extension directory loadable into Chrome via `chrome://extensions`.

## 4. Modules & Contracts
- `extension/manifest.json`
- `extension/src/background/service-worker.ts`
- `extension/src/content/content-script.ts`
- `extension/src/content/highlighter.ts`
- `extension/src/sidepanel/App.tsx`
- `core/shared/types.ts` (`ExtensionMessage`, `ExtensionResponse`)

## 5. Constraints & Out-of-Scope
- No programmatic clicking of submit buttons.
- No reading or harvesting of citizen input values.
