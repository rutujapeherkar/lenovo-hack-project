# Phase P05 — Specification: Public Services & Deterministic Task Guidance

## 1. Goals
- Deliver the Services discovery catalog view (`/services`) with category filters.
- Deliver the Service Detail view (`/services/:id`) showing purpose, eligibility, document checklist, and official outbound link.
- Deliver the interactive Task Journey UI guiding the citizen sequentially through verified steps (`Step 1 of N`).
- Support multilingual switching across `en`, `mr`, and `hi` without losing task progress.

## 2. Requirements

### Functional Requirements
- **FR-P05-01 (Service Catalog View):** Render verified service cards (Income Certificate, Domicile Certificate, Ration Card update); search by keyword and filter by category (Certificates, Social Welfare, Revenue).
- **FR-P05-02 (Service Card Component):** Display localized name, category badge, document count, estimated time/steps, and "View Guidance" button.
- **FR-P05-03 (Service Detail View):** Render comprehensive service breakdown:
  - What is it? (Plain-language explanation)
  - Who is eligible?
  - Mandatory Document Checklist with checkboxes.
  - Step Roadmap preview.
  - Official Source Box with direct button to official portal (e.g., Aaple Sarkar).
- **FR-P05-04 (Interactive Task Journey UI):** Step-by-step wizard interface:
  - Step progress indicator (e.g., Step 2 of 5).
  - Current step title, explanation, and action required.
  - "Previous" and "Next Step" buttons.
  - Task state saved in React state / session storage (`CurrentTask`).
- **FR-P05-05 (Official Outbound Action):** "Apply on Official Portal" button opening verified portal URL in a new tab with `rel="noopener noreferrer"`.

### Non-Functional Requirements
- **Accessibility:** Step numbers announced to screen readers (`aria-current="step"`); full keyboard navigation.
- **Visual Discipline:** Follows `UI.md` (no unnecessary cards, subtle borders, Sahayak blue accents).

## 3. Inputs & Outputs
- **Inputs:** `Service` objects from `data/maharashtra/services.json`.
- **Outputs:** Interactive UI on `/services` and `/services/:id`.

## 4. Modules & Contracts
- `core/services/service-repository.ts`
- `core/services/task-service.ts`
- `components/services/ServiceCard.tsx`
- `components/services/ServiceDetails.tsx`
- `components/services/TaskJourney.tsx`
- `components/services/DocumentChecklist.tsx`

## 5. Constraints & Out-of-Scope
- No form autofilling or submission on third-party portals.
