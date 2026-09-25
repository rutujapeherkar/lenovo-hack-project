# Phase P09 — Context: Accessibility & Voice Interaction

## 1. Purpose
The purpose of Phase P09 is to build the centralized accessibility engine and the browser-native voice interaction pipeline (Speech-to-Text and Text-to-Speech read-aloud) across both the web application and the browser extension.

## 2. Why Phase Exists
Accessibility is Sahayak's primary differentiator, not an afterthought. Senior citizens, citizens with visual/motor challenges, and users with lower digital literacy rely on large legible fonts, high contrast, audio read-aloud, and hands-free microphone voice input in Marathi, Hindi, and English. P09 centralizes accessibility state so preferences persist across all views.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/PRODUCT.md`: Section 8.2 (Voice-First Interaction), Section 16 (Accessibility Goals), Section 17 (Accessibility Design Principle).
- `docs/source-of-truth/ARCHITECTURE.md`: Section 23 (Accessibility Module), Section 25 (Voice Architecture), Section 46 (Data Flow — Accessibility).
- `docs/source-of-truth/DATA-CONTRACTS.md`: Section 28 (`AccessibilityPreferences`), Section 29 (`GuidanceMode`).
- `docs/source-of-truth/UI.md`: Section 32 (Accessibility Panel), Section 35 (Microphone Button), Section 44 (Accessibility Requirements).
- `docs/source-of-truth/SECURITY.md`: Section 18 (Voice Input Security), Section 19 (Text-to-Speech), Section 35 (Accessibility and Security).

## 4. PRD Dependencies
- `docs/PRD.md`: Section 20 (Accessibility), Section 21 (Voice), Section 22 (Multilingual Requirements).

## 5. Previous Phase Dependency
- **Phase P01 (Design System):** High-contrast and font-scale CSS tokens are controlled by this phase.
- **Phase P02 & P04:** Integrated into layout and conversational input.

## 6. Next Phase Dependency
- **Phase P10 (Trust, Safety & Fallback):** Trust safeguards and graceful degradation hooks into voice fallback.

## 7. Architectural Constraints
- Use native browser Web Speech API (`SpeechRecognition` / `speechSynthesis`).
- Zero reliance on heavyweight, paid third-party speech SDKs or server-side audio models.
- Graceful degradation: If speech recognition is unsupported or blocked, display "Voice unavailable", never crash, and keep text input 100% active.
- TTS must NEVER read out sensitive secrets aloud.

## 8. Out-of-Scope
- Voice biometrics or speaker identification.
- Automatic offline neural ASR engines (e.g., Whisper on WebGPU).
