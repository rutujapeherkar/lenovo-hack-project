# Phase P12 — Context: Demo & Hackathon Polish

## 1. Purpose
The purpose of Phase P12 is to prepare the Sahayak AI platform for live hackathon judging, investor demos, and demonstration readiness: curating compelling demonstration scenarios (seed data, pre-cached vision examples, clear demo workflows), refining micro-interactions, optimizing performance, and preparing judge walkthrough documentation.

## 2. Why Phase Exists
Hackathon presentations have tight time limits (typically 3–5 minutes) and live audience unpredictability (noisy environments, potential convention Wi-Fi drops). P12 guarantees that Sahayak has an impeccable, rock-solid demo flow with instant offline demo fallback (`DemoProvider`), pre-packaged screenshot samples for Explain Screen, and quick-action scenario chips that demonstrate the full value proposition in seconds.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/PRODUCT.md`: Section 6 (Core USP), Section 19 (Home Experience), Section 31 (Definition of the MVP).
- `docs/source-of-truth/ARCHITECTURE.md`: Section 58 (Development Mode & Demo Provider).
- `docs/source-of-truth/UI.md`: Section 47 (Human-Designed Rules), Section 51 (Animation Rules).
- `docs/source-of-truth/OFFICIAL-SOURCES.md`: Level 1 & 2 verified presentation paths.

## 4. PRD Dependencies
- `docs/PRD.md`: Section 35 (Success Criteria), Section 36 (Definition of Done).

## 5. Previous Phase Dependency
- **Phase P11 (Full Integration & QA):** The system must be certified stable and defect-free before final demo tuning.

## 6. Next Phase Dependency
- None (Phase P12 is the final phase of the MVP roadmap). Post-hackathon development transitions into Post-MVP roadmap.

## 7. Architectural Constraints
- Demo enhancements must NOT bypass security rules or hardcode fake success screens.
- `DemoProvider` must be instantly selectable via simple toggle or keyboard shortcut (`Ctrl+Shift+D` / query param `?demo=true`).
- No fake government seals or deceptive UI.

## 8. Out-of-Scope
- Building speculative future features (e.g., OCR of physical Aadhaar cards).
- Altering core data contracts.
