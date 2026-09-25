# Phase P03 — Tests: Shared Contracts & Verified Government Data

## 1. Unit Tests
- **Test P03-TYP-01 (Type Guard Assertions):** Test `isSahayakResponse()` with valid structured objects and invalid objects; verify boolean outputs.
- **Test P03-TYP-02 (Language Type Invariant):** Verify that assigning an unauthorized language string (e.g., `"fr"` or `"gu"`) triggers TypeScript compiler failure.

## 2. Integration Tests
- **Test P03-DAT-01 (JSON Schema Validation):** Load `services.json`, `schemes.json`, and `portals.json` through test suites; validate that every item satisfies `Service`, `Scheme`, and `Portal` interface properties.

## 3. Manual Tests
- **Test P03-MAN-01 (Official Link Inspection):** Spot check 5 random URLs across `services.json` and `schemes.json` in a browser to confirm they resolve to official state or national government pages.

## 4. Multilingual Tests
- **Test P03-LANG-01 (LocalizedText Completeness):** Verify that every service in `services.json` has non-empty strings for `en`, `mr`, and `hi` in both `name` and `description`.

## 5. Security Tests
- **Test P03-SEC-01 (No Secrets in Contracts):** Inspect `core/shared/types.ts` to confirm no fields for `otp`, `pin`, `password`, `cvv`, or `bankCredentials` exist.
- **Test P03-SEC-02 (HTTPS URL Protocol):** Verify that 100% of URLs in data files use the secure `https://` protocol.

## 6. Regression Tests
- Re-run `tsc --noEmit` across all modules to ensure zero breakages.
