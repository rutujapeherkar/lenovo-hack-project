# Phase P07 — Specification: Explain Screen & Vision Assistance

## 1. Goals
- Deliver the Explain Screen interface (`/explain-screen`) with drag-and-drop file upload and clipboard paste.
- Enforce strict client and server image validation (MIME check, 5 MB cap).
- Implement backend vision route (`/api/explain-screen`) connecting to `AIProvider.explainImage()`.
- Render structured `ScreenExplanation` output: summary, element breakdown, next-action recommendation, and glossary.
- Integrate sensitive-credential warning disclaimers.

## 2. Requirements

### Functional Requirements
- **FR-P07-01 (Upload Zone & Preview):** Accessible drop zone accepting `image/png`, `image/jpeg`, `image/webp`. Shows immediate thumbnail preview and "Change Image" button.
- **FR-P07-02 (Client-Side Validation):** Checks file size <= 5 MB and valid image MIME; displays friendly error if invalid.
- **FR-P07-03 (Sensitive Credential Warning):** Prominently displays: *"Avoid uploading screenshots containing passwords, OTPs, PINs, or banking credentials."*
- **FR-P07-04 (Backend Vision Pipeline):** `/api/explain-screen` accepts multipart form-data, converts to buffer, invokes provider, and returns `ApiResponse<ScreenExplanation>`.
- **FR-P07-05 (Structured Explanation Panel):** Renders:
  - Plain-language summary of what the screen is.
  - List of detected elements (`ScreenElement`) categorized as field, button, heading, or message.
  - "What should I do next?" highlighted box.
- **FR-P07-06 (Civic Glossary Component):** Displays contextual definitions for confusing terms identified on the screen (e.g., "Beneficiary", "Domicile", "Gazette").

### Non-Functional Requirements
- **Privacy:** In-memory image processing only; temporary files deleted immediately after model inference.
- **Multilingual:** Summary and element explanations generated in the active language (`en`, `mr`, `hi`).

## 3. Inputs & Outputs
- **Inputs:** Screenshot image file (File object) and target `Language`.
- **Outputs:** `ScreenExplanation` object.

## 4. Modules & Contracts
- `core/explain-screen/screen-service.ts`
- `components/explain/UploadArea.tsx`
- `components/explain/ImagePreview.tsx`
- `components/explain/ExplanationPanel.tsx`
- `components/explain/Glossary.tsx`
- `api/explain-screen/route.ts`

## 5. Constraints & Out-of-Scope
- No permanent image storage in S3/cloud buckets.
- No automated clicking or interaction on the user's behalf.
