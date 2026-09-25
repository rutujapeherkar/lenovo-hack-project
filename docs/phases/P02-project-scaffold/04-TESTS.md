# Phase P02 — Tests: Project Scaffold & Application Shell

## 1. Unit & Build Tests
- **Test P02-BLD-01 (TypeScript Compilation):** Run `tsc --noEmit` and assert return code 0 with zero warnings.
- **Test P02-BLD-02 (Bundle Build):** Run build script and ensure static assets generate without bundle resolution errors.

## 2. Integration Tests
- **Test P02-INT-01 (Routing Resolution):** Verify all 7 routes resolve their respective page component without throwing 404s.
- **Test P02-INT-02 (Layout Injection):** Verify `Header`, `Footer`, and `PageContainer` wrap all page routes.

## 3. Manual Tests
- **Test P02-MAN-01 (Navigation Clickthrough):** Click each header link; verify URL updates and page content reflects active section.
- **Test P02-MAN-02 (Mobile Nav Drawer):** On viewport width < 768px, verify header switches to accessible mobile menu.

## 4. Accessibility Tests
- **Test P02-A11Y-01 (Skip Link):** Verify presence of accessible "Skip to content" keyboard link.
- **Test P02-A11Y-02 (Landmark Roles):** Verify DOM contains `<header>`, `<main>`, and `<footer>` semantic landmarks.

## 5. Security Tests
- **Test P02-SEC-01 (Git Status Check):** Confirm no `.env` or untracked secret files are staged for Git.

## 6. Regression Tests
- Verify design tokens from P01 apply correctly to `Header` and `Footer`.
