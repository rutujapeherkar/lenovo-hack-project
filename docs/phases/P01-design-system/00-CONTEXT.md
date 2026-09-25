# Phase P01 — Context: Design System & Visual Tokens

## 1. Purpose
The purpose of Phase P01 is to translate the visual identity, tokens, and design specifications defined in `docs/source-of-truth/UI.md` into concrete, reusable CSS design tokens, typography styles, utility classes, and base UI primitives.

## 2. Why Phase Exists
Without an isolated design system phase, frontend development often creates ad-hoc CSS, inconsistent hex values, divergent border radii, and generic purple/pink AI gradients. P01 ensures all subsequent UI phases build on a strictly governed, accessible civic-tech visual system inspired by UMANG's discipline.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/UI.md`: Primary authority for colors, spacing, typography (`Inter` + `Noto Sans Devanagari`), border radii, shadows, and responsive breakpoints.
- `docs/source-of-truth/PRODUCT.md`: Establishes the requirement for high readability and low cognitive load.
- `docs/source-of-truth/SECURITY.md`: Establishes visual clarity rules preventing impersonation or misleading official claims.

## 4. PRD Dependencies
- `docs/PRD.md`: Section 14 (Website Requirements), Section 20 (Accessibility), and Section 22 (Multilingual Requirements).

## 5. Previous Phase Dependency
- **Phase P00 (Foundation):** Must be complete and verified before P01 begins.

## 6. Next Phase Dependency
- **Phase P02 (Project Scaffold):** P02 imports and applies the design system tokens created in P01 to establish the application layout shell.

## 7. Architectural Constraints
- Vanilla CSS / CSS Variables must be used as primary design tokens (`--sahayak-blue`, `--surface`, etc.).
- Avoid TailwindCSS unless explicitly approved; maintain centralized variables in `index.css` / `tokens.css`.
- Must accommodate Devanagari font rendering without vertical or horizontal text clipping.

## 8. Out-of-Scope
- Building full feature pages or application routing.
- Implementing AI provider logic.
- Connecting to backend services or APIs.
