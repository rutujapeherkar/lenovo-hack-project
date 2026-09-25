# Phase P01 — Implementation Plan: Design System & Visual Tokens

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/UI.md` sections 6 through 14.
2. [CREATE] `src/styles/tokens.css` (or equivalent style path) defining all custom properties.
3. [CREATE] `src/styles/typography.css` configuring font stacks and heading scales.
4. [CREATE] `src/styles/accessibility.css` with high contrast, text scaling, and reduced motion rules.
5. [CREATE] `src/styles/components.css` with base button, card, and badge classes.
6. [CREATE] `src/styles/index.css` importing the above modules.
7. [VERIFY] Inspect token definitions against `UI.md` tables.

## 2. Files to Create & Modify
- [CREATE] `src/styles/tokens.css`
- [CREATE] `src/styles/typography.css`
- [CREATE] `src/styles/accessibility.css`
- [CREATE] `src/styles/components.css`
- [CREATE] `src/styles/index.css`
- [REFERENCE] `docs/source-of-truth/UI.md`
- [REFERENCE] `docs/ANTIGRAVITY_RULES.md`

## 3. Module Responsibilities
- `tokens.css`: Owns CSS variable declarations for colors, shadows, borders, and spacing.
- `typography.css`: Owns Devanagari and Latin font pairing and fluid heading scales.
- `accessibility.css`: Owns theme override classes for high contrast and font scaling.
- `components.css`: Owns raw atomic element classes without framework coupling.

## 4. Integration Points
- Phase P02 will link `index.css` directly into the web application root shell.

## 5. Data Flow
- CSS Custom Properties cascade from `:root` / `html` down through all DOM subtrees.

## 6. Testing Points
- Visual contrast checker script or manual DevTools inspection verifying WCAG AA/AAA contrast.
- Visual inspection of Devanagari glyph heights.
