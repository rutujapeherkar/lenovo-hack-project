# Phase P07 — Context: Explain Screen & Vision Assistance

## 1. Purpose
The purpose of Phase P07 is to build the "Explain Screen" feature: allowing users to upload a screenshot of an ambiguous government form or webpage, validate the image client-side, analyze it via a multimodal AI pipeline, and output a structured plain-language explanation of visible fields, buttons, and civic terms.

## 2. Why Phase Exists
Citizens frequently get stuck on government web forms due to obscure error banners, cryptic field labels (e.g., "Sub-Division", "Creamy Layer Category"), or disorienting layouts. Explain Screen allows a user to simply take a screenshot, upload it, and receive immediate reassurance and plain-language guidance in Marathi, Hindi, or English.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/PRODUCT.md`: Section 8.5 (Explain Screen), Section 22 (Explain Screen Experience).
- `docs/source-of-truth/ARCHITECTURE.md`: Section 21 (Explain Screen Module), Section 22 (Image Validation), Section 45 (Data Flow — Explain Screen).
- `docs/source-of-truth/DATA-CONTRACTS.md`: Section 26 (`ScreenExplanation`), Section 27 (`ScreenElement`).
- `docs/source-of-truth/UI.md`: Section 24 (Explain Screen UI), Section 25 (Screen Explanation UI), Section 26 (Glossary).
- `docs/source-of-truth/SECURITY.md`: Section 16 (Screenshot Security), Section 17 (Image Processing), Section 34 (File Upload Security).

## 4. PRD Dependencies
- `docs/PRD.md`: Section 19 (Explain Screen), Section 25 (Security & Privacy).

## 5. Previous Phase Dependency
- **Phase P04 (AI Assistant Core):** Sourced from the `explainImage` method on the `AIProvider` interface.

## 6. Next Phase Dependency
- **Phase P08 (Browser Extension):** Extension will leverage the same screen explanation concept for live web pages.

## 7. Architectural Constraints
- File uploads must be strictly validated: MIME type `image/jpeg|png|webp`, size <= 5 MB.
- Images must NOT be permanently stored on the server (ephemeral memory buffer only).
- Clear privacy warning displayed before upload: *"Avoid uploading screenshots containing passwords, OTPs, PINs, or banking credentials."*

## 8. Out-of-Scope
- Optical character recognition (OCR) of sensitive identity cards (Aadhaar, PAN).
- Storing a permanent gallery of user-uploaded images.
