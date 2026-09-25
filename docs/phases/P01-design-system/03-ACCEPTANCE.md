# Phase P01 — Acceptance Criteria: Design System & Visual Tokens

## Acceptance Checklist

- [ ] **AC-P01-01:** CSS custom properties match exact token names and hex values in `docs/source-of-truth/UI.md` Section 6.
- [ ] **AC-P01-02:** Typography stack includes `Inter` followed by `"Noto Sans Devanagari"` and standard system fallbacks.
- [ ] **AC-P01-03:** Base spacing scale (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px) is defined.
- [ ] **AC-P01-04:** Button border radius is exactly 8px; card border radius is 12px; container max-width is capped at 1280px.
- [ ] **AC-P01-05:** Card shadow matches `0 2px 10px rgba(0, 60, 109, 0.08)` without neon/glowing effects.
- [ ] **AC-P01-06:** High-contrast overrides (`[data-contrast="high"]`) elevate text contrast to at least 7:1 ratio.
- [ ] **AC-P01-07:** Text scaling overrides (`[data-text-scale="large"]` and `[data-text-scale="extra-large"]`) cleanly scale root font sizes without causing horizontal layout overflow.
- [ ] **AC-P01-08:** Reduced motion media query (`prefers-reduced-motion`) and manual class zero out transitions and animations.
- [ ] **AC-P01-09:** Focus outline token (`--focus: #00599F`) is distinctly visible across all interactive states.
- [ ] **AC-P01-10:** No Tailwind or third-party CSS framework dependencies are introduced unless explicitly approved.
