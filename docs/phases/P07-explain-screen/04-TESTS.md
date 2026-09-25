# Phase P07 — Tests: Explain Screen & Vision Assistance

## 1. Unit Tests
- **Test P07-VAL-01 (MIME Validation):** Pass dummy File objects with MIME types `application/pdf`, `image/gif`, `image/png` into validator; verify rejection of PDF and acceptance of PNG.
- **Test P07-VAL-02 (Size Validation):** Pass synthetic 6 MB ArrayBuffer; verify validation returns false with size error.

## 2. Integration Tests
- **Test P07-API-01 (Vision Endpoint):** POST a sample test screenshot to `/api/explain-screen`; assert HTTP 200 and valid `ScreenExplanation` JSON structure.

## 3. Manual Tests
- **Test P07-MAN-01 (Screenshot Walkthrough):** Upload a sample screenshot of an Aaple Sarkar login page; verify that elements (Username, Password, Captcha, Login button) are identified, and prompt warns user not to share credentials.

## 4. Multilingual Tests
- **Test P07-LANG-01:** Select Marathi language, upload screen; verify returned summary and glossary definitions are returned in Marathi script.

## 5. Security Tests
- **Test P07-SEC-01 (Privacy Disclaimer Visibility):** Confirm that warning notice *"Avoid uploading screenshots containing passwords, OTPs, PINs, or banking credentials"* is rendered above the upload dropzone.

## 6. Regression Tests
- Re-run test suites from P02 through P06.
