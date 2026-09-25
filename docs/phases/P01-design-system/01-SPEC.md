# Phase P01 — Specification: Design System & Visual Tokens

## 1. Goals
- Define complete CSS variables for the Sahayak color palette, spacing, typography, radii, and shadows in accordance with `UI.md`.
- Implement responsive layout foundation tokens (desktop: 1200–1280px max-width, mobile: 100%).
- Provide accessible high-contrast and font-scaling overrides via CSS custom properties.
- Establish foundational button, card, input, and badge styles.

## 2. Requirements

### Functional Requirements
- **FR-P01-01 (Color Tokens):** Define `--sahayak-blue` (`#00599F`), `--sahayak-blue-dark` (`#003C6D`), `--sahayak-blue-deep` (`#002048`), `--sahayak-blue-light` (`#E7EEF5`), `--sahayak-blue-pale` (`#DBEFFD`), `--surface` (`#FFFFFF`), `--surface-soft` (`#F8FAFC`), `--border` (`#D9E2EC`), `--text-primary` (`#1F2937`), `--text-secondary` (`#5B6573`), `--text-muted` (`#6B7280`), `--success` (`#16803C`), `--warning` (`#B7791F`), `--error` (`#C53030`), and `--focus` (`#00599F`).
- **FR-P01-02 (Typography Scale):** Define font family stack with `Inter`, `"Noto Sans Devanagari"`, `system-ui`, and `sans-serif`. Establish rem-based scale for page titles, section headings, card headings, body, and captions.
- **FR-P01-03 (Spacing & Layout Tokens):** Base-4 spacing scale (`4px` to `64px`), card border-radius (`12px`), button border-radius (`8px`), and container max-width (`1280px`).
- **FR-P01-04 (Accessibility Overrides):** CSS classes or `data-contrast="high"` and `data-text-scale="large|extra-large"` adjusting font root and contrast variables.
- **FR-P01-05 (Base Component Primitives):** Base styling for primary/secondary buttons, civic cards, official-source containers, and accessible focus rings.

### Non-Functional Requirements
- **Performance:** Lightweight CSS with zero runtime overhead.
- **Accessibility:** Minimum 4.5:1 text contrast ratio in standard mode; 7:1 in high-contrast mode.

## 3. Inputs & Outputs
- **Inputs:** `docs/source-of-truth/UI.md` specifications.
- **Outputs:** Standardized CSS tokens and base atomic styles.

## 4. Modules & Contracts
- `styles/tokens.css` / `styles/globals.css`.

## 5. Constraints & Out-of-Scope
- No complex component state management or business logic.
- No third-party heavy CSS UI libraries (e.g., Tailwind, Chakra UI, MUI) unless approved.
