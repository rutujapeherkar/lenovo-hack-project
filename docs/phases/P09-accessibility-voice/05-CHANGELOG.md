# Phase P09 — Changelog: Accessibility & Voice Interaction

## Phase Status
**Status:** Completed  
**Date:** 2026-09-25  
**Verification:** 18/18 Automated Checks Passed, Visual & A11y Inspection Complete

---

## 1. Summary of Changes

Phase P09 delivered end-to-end accessibility and voice input/output layers across the Sahayak AI platform:
- Implemented a centralized **`AccessibilityContext`** (`src/core/accessibility/accessibility-context.tsx`) managing `AccessibilityPreferences` (`textScale`, `highContrast`, `reducedMotion`, `readAloud`, `language`) with `localStorage` persistence.
- Implemented DOM attribute synchronization injecting `data-contrast="high"`, `data-text-scale="large"|"extra-large"`, `data-motion="reduced"`, and `lang` directly onto `<html>` to trigger WCAG AAA style tokens.
- Created the **`AccessibilityPanel`** modal drawer (`src/components/accessibility/AccessibilityPanel.tsx`) conforming to `UI.md` Section 32 with focus trap, ESC dismissal, and touch targets ≥ 44×44px.
- Built a provider-independent Web Speech API abstraction **`VoiceService`** (`src/core/accessibility/voice-service.ts`) supporting speech recognition (`SpeechRecognition` / `webkitSpeechRecognition`) and speech synthesis (`speechSynthesis`) with BCP-47 locale mapping (`mr-IN`, `hi-IN`, `en-IN`).
- Built the **`MicButton`** component (`src/components/assistant/MicButton.tsx`) supporting 4 visual states (Idle, Listening, Processing, Unavailable) with screen reader `aria-live="polite"` feedback.
- Built the **`ReadAloud`** component (`src/components/accessibility/ReadAloud.tsx`) for synthesizing speech on assistant messages, service task steps, and scheme details with immediate stop on user action or unmount.
- Enforced zero auto-submission on voice input; transcribed text is cleanly placed into editable input fields for citizen review.
- Integrated voice and accessibility controls into the Web Application (`HomePage`, `Header`, `AppShell`, `SettingsPage`, `TaskJourney`, `SchemeDetails`) and the Browser Extension side panel (`extension/src/sidepanel/App.tsx`).

---

## 2. Browser APIs & Fallback Behavior

| Browser Capability | Native API Used | Target Languages | Fallback Behavior When Unsupported |
| :--- | :--- | :--- | :--- |
| **Speech-to-Text (STT)** | `SpeechRecognition` / `webkitSpeechRecognition` | `mr-IN`, `hi-IN`, `en-IN` | Gracefully indicates "Voice input unavailable" without crashing; retains standard text input with 100% functionality. |
| **Text-to-Speech (TTS)** | `window.speechSynthesis` (`SpeechSynthesisUtterance`) | `mr-IN`, `hi-IN`, `en-IN` | Hides TTS controls if API is missing; selects regional Indian voice if present, falling back to default synthesized voice. |
| **Microphone Permissions** | Handled via `recognition.onerror` (`not-allowed`, `no-speech`) | Multilingual | Friendly localized notifications in Marathi, Hindi, English directing users to browser settings; no raw exceptions exposed. |

---

## 3. Security & Safety Invariants

- **Test P09-SEC-01 (TTS Secret Filter):** `VoiceService.speakText()` and `containsSensitiveCredentials()` inspect all strings prior to audio synthesis. Any text containing OTPs, PINs, passwords, CVV codes, or bank card credentials immediately aborts playback with a security warning.
- **Zero Form Auto-Submit:** Voice transcription strictly populates text inputs. Citizens must explicitly review and trigger searches or navigation.
- **Ephemeral Audio Processing:** Zero voice audio or speech transcripts are saved to persistent disk or transmitted to third-party analytics trackers.

---

## 4. Tests Performed & Results

- **Unit Tests:**
  - `Test P09-A11Y-01`: Verified `accessibilityReducer` state transitions for `SET_TEXT_SCALE`, `CYCLE_TEXT_SCALE`, `TOGGLE_HIGH_CONTRAST`, `TOGGLE_REDUCED_MOTION`, and `RESET_PREFERENCES`.
  - `Test P09-VOI-01`: Verified clean capability detection when Web Speech API is absent or present.
- **Integration Tests:**
  - `Test P09-INT-01`: Verified `applyAccessibilityToDom` dynamically modifies `data-contrast`, `data-text-scale`, and `data-motion` on `<html>`.
- **Accessibility Tests:**
  - `Test P09-A11Y-02`: Verified `MicButton` contains an `aria-live="polite"` live region with role="status".
  - `AC-P09-01`: Verified Header includes the accessible `♿` button opening the `AccessibilityPanel`.
- **Security Tests:**
  - `Test P09-SEC-01`: Verified strict blocking of OTP, PIN, password, and CVV patterns in English, Marathi (उदा. गुप्त शब्द), and Hindi.
- **Acceptance Checklist:** AC-P09-01 through AC-P09-10 all verified (18/18 automated checks passed).
- **Regression Tests:** P02 through P08 regression suites executed with 100% pass rate.
- **Visual Inspection:** Captured screenshots of High Contrast Mode, Large Font Scale, Read Aloud on Income Certificate step journey, and Settings capability reporting.

---

## 5. Bugs Found & Fixed During Implementation

1. **Devanagari Credential Pattern Regex (`\b` Boundary Issue):**
   - *Issue:* Standard ASCII word boundary `\b` failed on Devanagari characters (e.g. `\bगुपित शब्द\b`).
   - *Fix:* Separated ASCII keyword regexes from Unicode Devanagari keyword regexes, ensuring Devanagari phrases (`गुप्त शब्द`, `पासवर्ड`, `ओटीपी`, `पिन`) match reliably.
2. **TypeScript Compilation Lints:**
   - *Issue:* Unused imports in `AccessibilityPanel.tsx` and `MicButton.tsx`; `Scheme` contract lacked `.description`.
   - *Fix:* Cleared unused variables and mapped `SchemeDetails` Read Aloud text to `${scheme.name}. ${scheme.category}. ${scheme.benefits}`.
