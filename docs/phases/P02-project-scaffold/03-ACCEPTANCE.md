# Phase P02 — Acceptance Criteria: Project Scaffold & Application Shell

## Acceptance Checklist

- [ ] **AC-P02-01:** `package.json` exists with required scripts (`dev`, `build`, `lint`, `test`) and clean dependency boundaries.
- [ ] **AC-P02-02:** `tsconfig.json` enforces `"strict": true` and resolves `@/*` path aliases.
- [ ] **AC-P02-03:** `.gitignore` blocks `.env`, `.env.local`, `node_modules`, `dist`, `.next`, and `.DS_Store`.
- [ ] **AC-P02-04:** `.env.example` contains placeholders only (`AI_PROVIDER=demo`, `AI_API_KEY=`). No active keys are committed.
- [ ] **AC-P02-05:** Directory tree mirrors `docs/source-of-truth/ARCHITECTURE.md` Section 48.
- [ ] **AC-P02-06:** `Header` renders Sahayak brand, primary navigation, language dropdown trigger, and accessibility shortcut.
- [ ] **AC-P02-07:** `Footer` prominently renders: *"Sahayak AI provides guidance and does not represent a government department."*
- [ ] **AC-P02-08:** Navigation links successfully navigate to `/`, `/services`, `/schemes`, `/explain-screen`, `/extension`, `/help`, and `/settings`.
- [ ] **AC-P02-09:** `PageContainer` enforces responsive layout: 1280px max-width on desktop, full-width on mobile.
- [ ] **AC-P02-10:** TypeScript compiles cleanly (`tsc --noEmit`) with zero errors.
