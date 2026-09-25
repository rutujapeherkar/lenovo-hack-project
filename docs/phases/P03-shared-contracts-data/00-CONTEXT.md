# Phase P03 — Context: Shared Contracts & Verified Government Data

## 1. Purpose
The purpose of Phase P03 is to codify the canonical TypeScript interfaces defined in `docs/source-of-truth/DATA-CONTRACTS.md` into centralized source files and populate the verified Maharashtra portal, service, and scheme datasets (`data/maharashtra/`).

## 2. Why Phase Exists
Without centralized, frozen TypeScript contracts and authoritative verified JSON datasets, downstream features (AI Assistant, Scheme Finder, Extension) will create duplicate, conflicting representations of `Service`, `Scheme`, or `OfficialSource`. P03 guarantees a single source of truth in code for all data structures and verified government facts.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/DATA-CONTRACTS.md`: Primary authority for all TypeScript interfaces, primitive types, request/response models, and contract rules.
- `docs/source-of-truth/OFFICIAL-SOURCES.md`: Primary authority for verified Maharashtra department URLs, central government portals, and verification metadata.
- `docs/source-of-truth/PRODUCT.md`: Establishes the rule that verified structured data controls factual guidance.

## 4. PRD Dependencies
- `docs/PRD.md`: Section 23 (Official Source Requirements), Section 32 (Data Requirements).

## 5. Previous Phase Dependency
- **Phase P02 (Project Scaffold):** P03 places files within the directory structure (`core/shared/`, `data/maharashtra/`) created in P02.

## 6. Next Phase Dependency
- **Phase P04 (AI Assistant Core):** P04 consumes `AssistantRequest`, `SahayakResponse`, and `AIProvider` contracts defined in P03.
- **Phase P05 & P06:** Consume `Service` and `Scheme` models and JSON registries populated in P03.

## 7. Architectural Constraints
- All shared contracts must live in `core/shared/types.ts`. Feature folders must never create duplicate copies.
- Government URLs must be stored as verified static strings with `lastVerified` timestamps.
- Zero AI-generated scheme records or synthetic URLs.

## 8. Out-of-Scope
- Building UI components or API handlers.
- Connecting to external databases or live scrapers.
- Modifying frozen contracts without an ADR.
