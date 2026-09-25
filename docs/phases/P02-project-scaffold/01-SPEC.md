# Phase P02 — Specification: Project Scaffold & Application Shell

## 1. Goals
- Initialize the web application repository structure with TypeScript and build tooling (Next.js / Vite).
- Implement standard layout components: `Header`, `Footer`, and `PageContainer`.
- Set up declarative routing for the core pages: `/`, `/services`, `/schemes`, `/explain-screen`, `/extension`, `/help`, and `/settings`.
- Implement responsive shell behavior (desktop max-width 1280px, mobile 100%).
- Provide `.env.example` template with server-side AI placeholders.

## 2. Requirements

### Functional Requirements
- **FR-P02-01 (Directory Structure):** Create directories conforming to `ARCHITECTURE.md` Section 48 (`components/layout/`, `components/ui/`, `core/`, `data/maharashtra/`, `api/`, `extension/`).
- **FR-P02-02 (Tooling & Config):** Configure `tsconfig.json` with strict typing and path aliases (`@/components/*`, `@/core/*`, `@/data/*`).
- **FR-P02-03 (Header Component):** Render Sahayak logo, navigation links, placeholder language toggle (`en`, `mr`, `hi`), and accessibility shortcut icon.
- **FR-P02-04 (Footer Component):** Render civic-tech disclaimer ("Sahayak AI provides guidance and does not represent a government department"), source attribution links, and navigation mirrors.
- **FR-P02-05 (Page Shells):** Scaffold route placeholders for Home, Services, Schemes, Explain Screen, Extension, Help, and Settings with basic metadata and page title.
- **FR-P02-06 (Environment Config):** Generate `.env.example` with `AI_PROVIDER=demo`, `AI_API_KEY=`, `AI_MODEL=`.

### Non-Functional Requirements
- **Performance:** Dev server startup < 3s, production build succeeds cleanly.
- **Quality:** Strict typing with zero TypeScript compiler errors.

## 3. Inputs & Outputs
- **Inputs:** `tokens.css` from Phase P01.
- **Outputs:** Runnable web application shell with navigation and layout structure.

## 4. Modules & Contracts
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/PageContainer.tsx`

## 5. Constraints & Out-of-Scope
- No service data loading or scheme searching.
- No AI calls or microphone voice logic yet.
