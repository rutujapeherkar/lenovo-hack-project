# Phase P00 — Tests: Foundation & Governance

## 1. Unit Tests
*Not applicable for Phase P00 (governance/documentation phase).*

## 2. Integration Tests
*Not applicable for Phase P00.*

## 3. Manual Tests & Document Integrity Verification
- **Test P00-DOC-01 (Source-of-Truth Integrity):** Verify all six files in `docs/source-of-truth/` exist and have not been altered.
- **Test P00-DOC-02 (PRD Section Coverage):** Verify `docs/PRD.md` contains sections 1 through 38 and that headers match exact numbering.
- **Test P00-DOC-03 (Phase File Completeness):** Verify that every directory `docs/phases/P00-*` to `P12-*` contains all 6 required files.
- **Test P00-DOC-04 (Traceability Links):** Verify that markdown links in PRD, ADRs, and Rules point to valid workspace files.

## 4. Accessibility Tests
*Not applicable for Phase P00.*

## 5. Multilingual Tests
- **Test P00-LANG-01:** Verify PRD and governance files accurately define the language triad as English (`en`), Marathi (`mr`), and Hindi (`hi`).

## 6. Security Tests
- **Test P00-SEC-01 (Zero Code / Zero Secrets):** Verify no `.env` files with active keys, client-side secrets, or unverified script tags exist in the repo.

## 7. Error Cases & Stop Condition Verification
- Verify that `ANTIGRAVITY_RULES.md` contains explicit instructions on how to stop and report conflicts.

## 8. Regression Tests
*Not applicable for Phase P00.*
