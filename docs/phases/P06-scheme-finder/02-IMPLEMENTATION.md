# Phase P06 — Implementation Plan: Scheme Finder & Eligibility Engine

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/UI.md` Sections 22–23 and `docs/source-of-truth/OFFICIAL-SOURCES.md` Section 12.
2. [CREATE] `core/schemes/scheme-repository.ts` providing query and filter methods against `schemes.json`.
3. [CREATE] `core/schemes/scheme-service.ts` combining structured query filtering with optional AI simplification.
4. [CREATE] `components/schemes/SchemeCard.tsx` with scannable layout.
5. [CREATE] `components/schemes/EligibilityList.tsx` for structured requirements rendering.
6. [CREATE] `components/schemes/OfficialSourceBox.tsx` rendering verified authority, timestamp, and outbound button.
7. [CREATE] `components/schemes/SchemeDetails.tsx` aggregating full profile.
8. [MODIFY] `app/schemes/page.tsx` rendering search input, category tabs, and scheme grid.
9. [CREATE] `app/schemes/[id]/page.tsx` rendering detail view.
10. [VERIFY] Test queries in English, Marathi, and Hindi.

## 2. Files to Create & Modify
- [CREATE] `core/schemes/scheme-repository.ts`
- [CREATE] `core/schemes/scheme-service.ts`
- [CREATE] `components/schemes/SchemeCard.tsx`
- [CREATE] `components/schemes/EligibilityList.tsx`
- [CREATE] `components/schemes/OfficialSourceBox.tsx`
- [CREATE] `components/schemes/SchemeDetails.tsx`
- [MODIFY] `app/schemes/page.tsx`
- [CREATE] `app/schemes/[id]/page.tsx`
- [REFERENCE] `data/maharashtra/schemes.json`
- [REFERENCE] `core/shared/types.ts`

## 3. Module Responsibilities
- `scheme-repository.ts`: Owns schema lookups and multi-facet filtering.
- `scheme-service.ts`: Bridges `AIProvider` to format summaries into concise bullet points.
- `OfficialSourceBox.tsx`: Distinct visual box rendering official source metadata.

## 4. Integration Points
- Consumed by Home page quick actions ("Find a scheme").
- Links directly to verified government portals (MahaDBT, NSP, etc.).

## 5. Data Flow
- `schemes.json -> SchemeRepository -> SchemeService -> SchemePage -> SchemeDetails`.

## 6. Testing Points
- Test category filtering (e.g., clicking "Education" returns only education schemes).
- Test natural language query handling.
