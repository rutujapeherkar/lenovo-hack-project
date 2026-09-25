# Phase P02 — Implementation Plan: Project Scaffold & Application Shell

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/ARCHITECTURE.md` Section 48.
2. [CREATE] `package.json` with project scripts (`dev`, `build`, `lint`, `test`) and minimal dependencies.
3. [CREATE] `tsconfig.json` with strict mode enabled and path aliases.
4. [CREATE] `.env.example` with demo defaults.
5. [CREATE] `.gitignore` ensuring `.env`, `.env.local`, `node_modules`, and `.DS_Store` are excluded.
6. [CREATE] Directory tree: `components/layout/`, `components/ui/`, `core/`, `data/maharashtra/`, `public/`.
7. [CREATE] `components/layout/Header.tsx`, `Footer.tsx`, and `PageContainer.tsx`.
8. [CREATE] Route shells: `app/page.tsx`, `app/services/page.tsx`, `app/schemes/page.tsx`, `app/explain-screen/page.tsx`, `app/extension/page.tsx`, `app/help/page.tsx`, `app/settings/page.tsx`.
9. [VERIFY] Run `npm run build` / `tsc --noEmit` and launch dev server.

## 2. Files to Create & Modify
- [CREATE] `package.json`
- [CREATE] `tsconfig.json`
- [CREATE] `.env.example`
- [CREATE] `.gitignore`
- [CREATE] `components/layout/Header.tsx`
- [CREATE] `components/layout/Footer.tsx`
- [CREATE] `components/layout/PageContainer.tsx`
- [CREATE] Route page shells in `app/` (or `src/pages/`)
- [REFERENCE] `src/styles/index.css` (from P01)
- [REFERENCE] `docs/source-of-truth/UI.md`

## 3. Module Responsibilities
- `Header`: Desktop and mobile navigation bar, branding, accessibility trigger.
- `Footer`: Mandatory civic disclaimer and official links.
- `PageContainer`: Constrains content width to 1280px with centered margin and fluid padding.

## 4. Integration Points
- Imports `tokens.css` from P01 into the root layout.
- Provides base route structure for P04, P05, P06, and P07.

## 5. Data Flow
- Router manages active URL state, rendering corresponding page shell wrapped in `PageContainer`.

## 6. Testing Points
- TypeScript compile validation (`tsc --noEmit`).
- Route navigation testing across all primary links.
