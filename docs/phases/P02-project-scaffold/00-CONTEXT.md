# Phase P02 — Context: Project Scaffold & Application Shell

## 1. Purpose
The purpose of Phase P02 is to initialize the project directory structure, tooling configuration (TypeScript, build system/dev server, linting), application shell, primary navigation routing, and foundational layout components (Header, Footer, PageContainer).

## 2. Why Phase Exists
A structured project scaffold provides a clean, modular foundation for all subsequent feature modules. It ensures that TypeScript configuration, directory structures, and layout wrappers conform strictly to `ARCHITECTURE.md` Section 48, preventing haphazard file placement and messy monolithic code.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/ARCHITECTURE.md`: Sections 48 (Repository Structure), 49 (Module Dependency Rules), 50 (Module Ownership Rules).
- `docs/source-of-truth/UI.md`: Section 15 (Global Layout), Section 16 (Header), Section 48 (Component Architecture).
- `docs/source-of-truth/SECURITY.md`: Section 9 (Environment Variables), Section 38 (Security Architecture).

## 4. PRD Dependencies
- `docs/PRD.md`: Section 14 (Website Requirements), Section 28 (Non-Functional Requirements), Section 30 (Responsive Design).

## 5. Previous Phase Dependency
- **Phase P01 (Design System):** P02 links P01's CSS design tokens into the application shell.

## 6. Next Phase Dependency
- **Phase P03 (Shared Contracts & Data):** P03 defines canonical TypeScript models that will be consumed across the project structure created in P02.

## 7. Architectural Constraints
- Repository structure must mirror `ARCHITECTURE.md` Section 48 (`app/` or `src/`, `components/`, `core/`, `api/`, `data/`, `docs/`, `extension/`).
- TypeScript must be configured in strict mode (`"strict": true`, `"noImplicitAny": true`).
- No business logic or feature data should be implemented in this phase.

## 8. Out-of-Scope
- Implementing specific service or scheme pages.
- Integrating AI models or backend controllers.
- Implementing extension content scripts.
