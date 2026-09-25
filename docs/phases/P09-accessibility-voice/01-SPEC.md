# Phase P09 — Specification: Accessibility & Voice Interaction

## 1. Goals
- Deliver the centralized `AccessibilityContext` managing text scale, high contrast, reduced motion, and read-aloud state.
- Deliver the modal/drawer `AccessibilityPanel` conforming to `UI.md` Section 32.
- Deliver the accessible `MicButton` with distinct visual states (Idle, Listening, Processing, Unavailable).
- Implement native Web Speech API recognition supporting `mr-IN`, `hi-IN`, and `en-IN`.
- Implement `ReadAloud` TTS service enabling citizens to listen to guidance summaries.

## 2. Requirements

### Functional Requirements
- **FR-P09-01 (Accessibility State Store):** Central React context managing `AccessibilityPreferences` (`textScale: 'normal'|'large'|'extra-large'`, `highContrast: boolean`, `reducedMotion: boolean`, `readAloud: boolean`, `language: Language`). Persists to `localStorage`.
- **FR-P09-02 (DOM Attribute Reflection):** Injects `data-contrast`, `data-text-scale`, and `data-motion` onto document root (`<html>`), activating P01 CSS tokens.
- **FR-P09-03 (Accessibility Panel UI):** Interactive drawer accessible from header allowing users to toggle text sizes, contrast mode, motion, and language with large touch targets.
- **FR-P09-04 (Speech-to-Text Pipeline):** Wraps `SpeechRecognition` / `webkitSpeechRecognition`; maps active language (`mr` -> `mr-IN`, `hi` -> `hi-IN`, `en` -> `en-IN`); emits transcribed text to search/chat input.
- **FR-P09-05 (Microphone Visual States):**
  - *Idle:* Standard blue mic button.
  - *Listening:* Pulsing red/amber indicator with accessible "Listening..." label.
  - *Processing:* Loading spinner indicator.
  - *Unavailable:* Strikethrough mic with "Type instead" guidance.
- **FR-P09-06 (Text-to-Speech Engine):** Uses `window.speechSynthesis` with matching regional language voices; provides Play, Pause, and Stop controls.

### Non-Functional Requirements
- **Resilience:** Graceful fallback when Speech API is missing in Safari or non-Chromium browsers.
- **Safety:** Text-to-speech refuses to speak strings flagged as sensitive or containing credential tokens.

## 3. Inputs & Outputs
- **Inputs:** User microphone audio stream, user preference toggles.
- **Outputs:** Transcribed query string, synthesized audio playback, active DOM style attributes.

## 4. Modules & Contracts
- `core/accessibility/accessibility-context.tsx`
- `core/accessibility/voice-service.ts`
- `components/accessibility/AccessibilityPanel.tsx`
- `components/assistant/MicButton.tsx`
- `components/accessibility/ReadAloud.tsx`

## 5. Constraints & Out-of-Scope
- No continuous passive background listening.
- Audio data must never be saved permanently to disk.
