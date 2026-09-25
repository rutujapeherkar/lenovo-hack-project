# Phase P09 — Acceptance Criteria: Accessibility & Voice Interaction

## Acceptance Checklist

- [ ] **AC-P09-01:** Accessibility panel opens via the accessibility icon button in the header.
- [ ] **AC-P09-02:** Toggling text scale between "Normal", "Large", and "Extra Large" dynamically scales page typography.
- [ ] **AC-P09-03:** Toggling "High Contrast" applies `data-contrast="high"` and updates colors to high-contrast tokens.
- [ ] **AC-P09-04:** Toggling "Reduced Motion" disables transitions and animations across cards and buttons.
- [ ] **AC-P09-05:** In supported browsers, clicking the microphone activates speech recognition and displays "Listening...".
- [ ] **AC-P09-06:** Speaking in Marathi (`mr-IN`) accurately populates the input field with Devanagari text.
- [ ] **AC-P09-07:** In browsers lacking speech recognition or when permission is denied, the button indicates "Voice unavailable" without crashing.
- [ ] **AC-P09-08:** Clicking "Read Aloud" on service or scheme guidance plays clear synthesized speech in the matching language.
- [ ] **AC-P09-09:** Speech synthesis stops immediately when the user clicks "Stop" or navigates away.
- [ ] **AC-P09-10:** Accessibility settings persist across page reloads via `localStorage`.
