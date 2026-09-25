# Phase P07 — Implementation Plan: Explain Screen & Vision Assistance

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/UI.md` Sections 24–26 and `docs/source-of-truth/SECURITY.md` Sections 16–17.
2. [CREATE] `components/explain/UploadArea.tsx` with drag-and-drop and validation logic.
3. [CREATE] `components/explain/ImagePreview.tsx` rendering selected thumbnail.
4. [CREATE] `components/explain/ExplanationPanel.tsx` rendering structured element cards.
5. [CREATE] `components/explain/Glossary.tsx` rendering civic terms.
6. [CREATE] `core/explain-screen/screen-service.ts` managing API request state and glossary lookup.
7. [CREATE] `api/explain-screen/route.ts` handling server multipart processing.
8. [MODIFY] `app/explain-screen/page.tsx` integrating upload, preview, and explanation panel.
9. [VERIFY] Test image upload validation (valid PNG, valid JPEG, oversized file).

## 2. Files to Create & Modify
- [CREATE] `components/explain/UploadArea.tsx`
- [CREATE] `components/explain/ImagePreview.tsx`
- [CREATE] `components/explain/ExplanationPanel.tsx`
- [CREATE] `components/explain/Glossary.tsx`
- [CREATE] `core/explain-screen/screen-service.ts`
- [CREATE] `api/explain-screen/route.ts`
- [MODIFY] `app/explain-screen/page.tsx`
- [REFERENCE] `core/shared/types.ts`
- [REFERENCE] `docs/source-of-truth/SECURITY.md`

## 3. Module Responsibilities
- `UploadArea.tsx`: Drag/drop, file selector, size/format validation.
- `api/explain-screen/route.ts`: Ephemeral vision pipeline proxying to `AIProvider.explainImage()`.
- `ExplanationPanel.tsx`: Visual layout of analyzed screen elements.

## 4. Integration Points
- Consumed by `/explain-screen` page and linked from home page quick actions.

## 5. Data Flow
- `User File -> Client Validation -> Base64/Multipart POST /api/explain-screen -> AIProvider -> ScreenExplanation -> UI`.

## 6. Testing Points
- Test that uploading a 6 MB file triggers immediate client-side error without hitting network.
- Test `DemoProvider` returns realistic mock screen elements when running offline.
