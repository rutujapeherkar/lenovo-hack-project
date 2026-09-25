# Phase P06 — Tests: Scheme Finder & Eligibility Engine

## 1. Unit Tests
- **Test P06-SCH-01 (Category Filter):** Call `SchemeRepository.filterByCategory("education")`; verify all returned records have `category: "education"`.
- **Test P06-SCH-02 (Keyword Search):** Search `"divyang"` and `"अपंग"`; verify disability pension schemes are returned.

## 2. Integration Tests
- **Test P06-UI-01 (Scheme Navigation):** Mount `/schemes`, click on first scheme card; verify router transitions to detail page.

## 3. Manual Tests
- **Test P06-MAN-01 (Outbound Application Link):** Click "Apply on Official Portal" on MahaDBT scholarship scheme; confirm target URL opens official `mahadbt.maharashtra.gov.in` domain.

## 4. Multilingual Tests
- **Test P06-LANG-01 (Marathi Content Rendering):** Verify that scheme title "राजे छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना" renders cleanly without layout break.

## 5. Security Tests
- **Test P06-SEC-01 (No Unverified URLs):** Verify that every URL rendered in the scheme details matches an entry in `OfficialSource` and uses HTTPS.

## 6. Regression Tests
- Re-run test suites from P02 through P05.
