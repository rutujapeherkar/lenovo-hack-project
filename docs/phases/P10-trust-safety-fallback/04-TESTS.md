# Phase P10 — Tests: Trust, Safety & Fallback Architecture

## 1. Unit Tests
- **Test P10-SEC-01 (Regex Sanitizer):** Test `containsSensitiveData("Here is my OTP: 948210")`; assert returns `true` and redacts digits to `[REDACTED]`.
- **Test P10-SEC-02 (PIN Sanitizer):** Test `containsSensitiveData("Enter UPI PIN 4821")`; assert returns `true`.

## 2. Integration Tests
- **Test P10-INT-01 (Error Boundary Fallback):** Mount a test component that throws an error; verify `ErrorBoundary` catches it and renders `FallbackView` without white-screening.

## 3. Manual Tests
- **Test P10-MAN-01 (Payment Journey Walkthrough):** Navigate to Income Certificate payment step; verify prominent alert informs user to enter PIN only in official banking interface.

## 4. Multilingual Tests
- **Test P10-LANG-01:** Test security warning in Marathi: `"कृपया आपला ओटीपी, पिन, पासवर्ड किंवा बँक तपशील साहायक सोबत शेअर करू नका."`

## 5. Security Tests
- **Test P10-SEC-03 (Console Log Audit):** Trigger assistant query with sensitive input; inspect console output; verify zero sensitive values are printed.

## 6. Regression Tests
- Re-run test suites from P02 through P09.
