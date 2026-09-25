# Phase P08 — Acceptance Criteria: Browser Extension & DOM In-Page Guidance

## Acceptance Checklist

- [x] **AC-P08-01:** `extension/manifest.json` conforms to Manifest V3 specifications and specifies `"side_panel": { "default_path": "sidepanel.html" }`.
- [x] **AC-P08-02:** Host permissions are strictly restricted to government patterns (`*.gov.in/*`, `*.mahaonline.gov.in/*`).
- [x] **AC-P08-03:** Extension builds cleanly without bundling errors into `extension/dist/`.
- [x] **AC-P08-04:** Opening the side panel on a supported URL (e.g., `aaplesarkar.mahaonline.gov.in`) shows 🟢 *"Sahayak understands this page"*.
- [x] **AC-P08-05:** Opening the side panel on an unrecognized domain shows ⚪ *"Sahayak can explain this page using AI"*.
- [x] **AC-P08-06:** Clicking "Explain this page" in the side panel fetches an understandable page summary in the selected language.
- [x] **AC-P08-07:** Clicking "Help me fill this form" triggers field highlight on the active verified input element.
- [x] **AC-P08-08:** Highlighting a field applies a high-contrast focus outline and scrolls the element into visible view.
- [x] **AC-P08-09:** The extension content script does NOT touch, highlight, or read values from password fields or payment iframes.
- [x] **AC-P08-10:** No automatic form submit button clicks occur under any circumstance.
