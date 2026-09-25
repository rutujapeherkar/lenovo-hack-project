# Phase P08 — Tests: Browser Extension & DOM In-Page Guidance

## 1. Unit Tests
- **Test P08-MSG-01 (Message Contract Validation):** Verify that messages sent through `messaging.ts` conform strictly to `ExtensionMessage` discriminated union types.
- **Test P08-DET-01 (Domain Detection):** Test `matchPortal("https://aaplesarkar.mahaonline.gov.in/en/Login")`; verify returns `{ portalId: "aaple-sarkar", confidence: "high" }`.

## 2. Integration Tests
- **Test P08-DOM-01 (Highlight Lifecycle):** Inject mock DOM fixture with `<input id="applicant_name">`; invoke `highlightField("applicant_name")`; assert `.sahayak-field-highlight` class is added. Invoke `clearHighlight()`; assert class is removed.

## 3. Manual Tests
- **Test P08-MAN-01 (Side Panel Tab Sync):** Load extension in Chrome; navigate across tabs; verify side panel updates active portal state dynamically.

## 4. Multilingual Tests
- **Test P08-LANG-01:** Switch side panel to Marathi (`mr`); verify action buttons render: `"हे पान समजावून सांगा"`, `"मी पुढे काय करावे?"`, `"फॉर्म भरण्यास मदत करा"`.

## 5. Security Tests
- **Test P08-SEC-01 (Zero Password Touch):** In mock DOM with `<input type="password">`, verify that highlighter rejects highlighting or reading values from password inputs.
- **Test P08-SEC-02 (Manifest Permissions Check):** Verify `manifest.json` does NOT contain `<all_urls>`, `webRequest`, `cookies`, or `debugger`.

## 6. Regression Tests
- Re-run test suites from P02 through P07.
