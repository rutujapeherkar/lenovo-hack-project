# Phase P01 — Tests: Design System & Visual Tokens

## 1. Unit & Lint Tests
- **Test P01-CSS-01 (Variable Completeness):** Verify all token names from `UI.md` Table 6 exist in `tokens.css`.
- **Test P01-CSS-02 (Hex Accuracy):** Confirm `#00599F` for `--sahayak-blue`, `#003C6D` for `--sahayak-blue-dark`, and `#FFFFFF` for `--surface`.

## 2. Integration Tests
- **Test P01-INT-01 (CSS Import Structure):** Verify that importing `index.css` successfully resolves `tokens.css`, `typography.css`, `accessibility.css`, and `components.css`.

## 3. Manual Tests
- **Test P01-MAN-01 (Devanagari Font Rendering):** Render sample Marathi ("उत्पन्न प्रमाणपत्र", "महाराष्ट्र शासन") and Hindi ("आय प्रमाण पत्र") text; verify no broken matras or conjunct glyph overlaps.
- **Test P01-MAN-02 (Button State Hover/Focus):** Test mouse hover and keyboard focus tab on primary and secondary buttons; verify visible 2px focus ring.

## 4. Accessibility Tests
- **Test P01-A11Y-01 (Contrast Ratio):** Validate that body text on `--surface` achieves at least 4.5:1 contrast; in high contrast mode, achieve >= 7:1.
- **Test P01-A11Y-02 (Text Scale Zoom):** Test 200% browser zoom; verify responsive reflow with zero horizontal scrollbar.

## 5. Multilingual Tests
- **Test P01-LANG-01:** Test Devanagari text buttons with text 30% longer than English; ensure buttons expand gracefully without label truncation.

## 6. Security Tests
- Confirm no external unverified CDN fonts or tracking stylesheets are loaded.

## 7. Regression Tests
- Verify standard HTML element styles (`h1`-`h6`, `p`, `button`, `input`) render cleanly.
