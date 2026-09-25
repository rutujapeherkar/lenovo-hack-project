# Phase P12 — Implementation Plan: Demo & Hackathon Polish

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/PRODUCT.md` Section 31 and `docs/source-of-truth/ARCHITECTURE.md` Section 58.
2. [CREATE] `public/demo-assets/` containing 3 sample government screenshots (Aaple Sarkar, MahaDBT, RCMS).
3. [CREATE] `components/explain/SampleScreenshots.tsx` offering 1-click test images.
4. [CREATE] `components/assistant/QuickActions.tsx` rendering quick scenario pills on the home page.
5. [MODIFY] `app/page.tsx` integrating `QuickActions`.
6. [MODIFY] `app/explain-screen/page.tsx` integrating `SampleScreenshots`.
7. [CREATE] `docs/DEMO_WALKTHROUGH.md` with complete presenter script and contingency instructions.
8. [VERIFY] Perform dry run of the full 3-minute demo script using both `GeminiProvider` and `DemoProvider`.

## 2. Files to Create & Modify
- [CREATE] `public/demo-assets/sample-aaplesarkar.png`
- [CREATE] `public/demo-assets/sample-mahadbt.png`
- [CREATE] `public/demo-assets/sample-rcms.png`
- [CREATE] `components/explain/SampleScreenshots.tsx`
- [CREATE] `components/assistant/QuickActions.tsx`
- [CREATE] `docs/DEMO_WALKTHROUGH.md`
- [MODIFY] `app/page.tsx`
- [MODIFY] `app/explain-screen/page.tsx`
- [REFERENCE] `docs/PRD.md`

## 3. Module Responsibilities
- `SampleScreenshots.tsx`: Provides pre-loaded demo images so presenters do not need to hunt through local finder folders.
- `QuickActions.tsx`: Immediate click-to-ask prompts showcasing core user queries.
- `DEMO_WALKTHROUGH.md`: Presentation guide for the team.

## 4. Integration Points
- Enhances Home page and Explain Screen views.

## 5. Data Flow
- Clicking a sample image feeds into the established `screen-service.ts` pipeline.

## 6. Testing Points
- Dry run presentation timed with stopwatch (target: 3 minutes).
- Offline test: Disconnect Wi-Fi, verify full walkthrough completes using `DemoProvider`.
