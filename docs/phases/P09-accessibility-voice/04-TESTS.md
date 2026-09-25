# Phase P09 — Tests: Accessibility & Voice Interaction

## 1. Unit Tests
- **Test P09-A11Y-01 (Context Reducer):** Verify `accessibilityReducer` updates `textScale`, `highContrast`, and `reducedMotion` correctly in state.
- **Test P09-VOI-01 (Voice Capability Detection):** Mock `window.SpeechRecognition = undefined`; verify `isVoiceSupported()` returns false cleanly.

## 2. Integration Tests
- **Test P09-INT-01 (DOM Attribute Reflection):** Trigger `setHighContrast(true)`; verify document root (`document.documentElement`) has `data-contrast="high"`.

## 3. Manual Tests
- **Test P09-MAN-01 (Microphone Interaction):** In Chrome, click mic; grant permission; speak "Income certificate"; verify search input populates and triggers search.

## 4. Accessibility Tests
- **Test P09-A11Y-02 (Screen Reader Live Region):** Verify voice listening state updates an `aria-live="polite"` container.

## 5. Security Tests
- **Test P09-SEC-01 (TTS Secret Filter):** Verify `speakText()` sanitizes and aborts playback if string matches OTP or PIN patterns.

## 6. Regression Tests
- Re-run test suites from P02 through P08.
