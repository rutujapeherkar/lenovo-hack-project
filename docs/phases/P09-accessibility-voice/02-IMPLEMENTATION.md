# Phase P09 — Implementation Plan: Accessibility & Voice Interaction

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/UI.md` Sections 32, 35, 44 and `docs/source-of-truth/SECURITY.md` Sections 18–19.
2. [CREATE] `core/accessibility/accessibility-context.tsx` providing provider and hook `useAccessibility()`.
3. [CREATE] `core/accessibility/voice-service.ts` wrapping Web Speech API primitives safely.
4. [CREATE] `components/accessibility/AccessibilityPanel.tsx` with high-contrast, text-size, and language toggles.
5. [CREATE] `components/assistant/MicButton.tsx` with 4 explicit visual states.
6. [CREATE] `components/accessibility/ReadAloud.tsx` with accessible speech playback controls.
7. [MODIFY] `components/layout/Header.tsx` connecting the accessibility panel toggle.
8. [MODIFY] `app/page.tsx` integrating `MicButton` into the hero search input.
9. [VERIFY] Test voice recognition and text scale overrides.

## 2. Files to Create & Modify
- [CREATE] `core/accessibility/accessibility-context.tsx`
- [CREATE] `core/accessibility/voice-service.ts`
- [CREATE] `components/accessibility/AccessibilityPanel.tsx`
- [CREATE] `components/assistant/MicButton.tsx`
- [CREATE] `components/accessibility/ReadAloud.tsx`
- [MODIFY] `components/layout/Header.tsx`
- [MODIFY] `app/page.tsx`
- [REFERENCE] `core/shared/types.ts`
- [REFERENCE] `src/styles/tokens.css`

## 3. Module Responsibilities
- `accessibility-context.tsx`: Manages and synchronizes accessibility preferences across the DOM.
- `voice-service.ts`: Safe browser API adapter with capability detection.
- `MicButton.tsx`: Audio capture trigger with accessible states.

## 4. Integration Points
- Embedded into the home query box, service guidance, and browser extension side panel.

## 5. Data Flow
- `User Audio -> Web Speech API -> VoiceService -> Input Field / Assistant -> Response -> TTS ReadAloud`.

## 6. Testing Points
- Test browser compatibility detection when `webkitSpeechRecognition` is undefined.
- Test that toggling "High Contrast" applies `data-contrast="high"` to `<html>`.
