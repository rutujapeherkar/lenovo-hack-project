# Phase P05 — Tests: Public Services & Deterministic Task Guidance

## 1. Unit Tests
- **Test P05-SRV-01 (Repository Filtering):** Call `ServiceRepository.searchServices("income")` and assert "Income Certificate" is returned.
- **Test P05-TSK-01 (Step Transition State):** Initialize a `CurrentTask` with 5 steps; call `advanceStep()`; verify `currentStepId` advances to step 2 and step 1 is added to `completedStepIds`.

## 2. Integration Tests
- **Test P05-UI-01 (Catalog to Detail Flow):** Mount `/services`, click on "Income Certificate", assert router navigates to `/services/income-certificate` and step journey mounts.

## 3. Manual Tests
- **Test P05-MAN-01 (Multilingual Journey Walkthrough):** Switch language to Marathi (`mr`), walk through all steps of Income Certificate; verify step titles ("अर्जदाराचा तपशील", "पत्ता", "उत्पन्नाचा तपशील") display cleanly.

## 4. Accessibility Tests
- **Test P05-A11Y-01 (Step Wizard ARIA):** Verify the active step element contains `aria-current="step"` and document checkboxes have accessible labels.

## 5. Security Tests
- **Test P05-SEC-01 (Rel Attribute):** Verify that the "Apply on Official Portal" external link includes `rel="noopener noreferrer"` and `target="_blank"`.

## 6. Regression Tests
- Re-run test suites from P02, P03, and P04.
