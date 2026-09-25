# Phase P05 — Implementation Plan: Public Services & Deterministic Task Guidance

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/UI.md` Sections 19–21 and `docs/source-of-truth/PRODUCT.md` Section 8.3.
2. [CREATE] `core/services/service-repository.ts` providing methods to query and filter `services.json`.
3. [CREATE] `core/services/task-service.ts` managing `CurrentTask` state transitions.
4. [CREATE] `components/services/ServiceCard.tsx` rendering scannable card layout.
5. [CREATE] `components/services/DocumentChecklist.tsx` rendering interactive document prerequisites.
6. [CREATE] `components/services/TaskJourney.tsx` rendering step progression and next-action guidance.
7. [CREATE] `components/services/ServiceDetails.tsx` aggregating detail sections.
8. [MODIFY] `app/services/page.tsx` rendering searchable catalog.
9. [CREATE] `app/services/[id]/page.tsx` rendering detail and guided task journey.
10. [VERIFY] Test step progression in English, Marathi, and Hindi.

## 2. Files to Create & Modify
- [CREATE] `core/services/service-repository.ts`
- [CREATE] `core/services/task-service.ts`
- [CREATE] `components/services/ServiceCard.tsx`
- [CREATE] `components/services/DocumentChecklist.tsx`
- [CREATE] `components/services/TaskJourney.tsx`
- [CREATE] `components/services/ServiceDetails.tsx`
- [MODIFY] `app/services/page.tsx`
- [CREATE] `app/services/[id]/page.tsx`
- [REFERENCE] `data/maharashtra/services.json`
- [REFERENCE] `core/shared/types.ts`

## 3. Module Responsibilities
- `service-repository.ts`: Owns retrieval, search filtering, and ID lookups for verified services.
- `task-service.ts`: Owns session-level task state transitions (`completedStepIds`, `currentStepId`).
- `TaskJourney.tsx`: Owns step presentation UI.

## 4. Integration Points
- Consumed by Home page search box (linking directly to service details).
- Links out to official government portals verified in `OfficialSource`.

## 5. Data Flow
- `services.json -> ServiceRepository -> ServicePage / TaskJourney -> User Action`.

## 6. Testing Points
- Test step navigation forward and backward.
- Test that document checklist checkboxes persist during current browser session.
