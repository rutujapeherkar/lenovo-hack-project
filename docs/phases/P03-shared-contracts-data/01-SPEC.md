# Phase P03 — Specification: Shared Contracts & Verified Government Data

## 1. Goals
- Author the canonical `core/shared/types.ts` containing all 23 frozen contracts from `DATA-CONTRACTS.md`.
- Populate `data/maharashtra/portals.json` with verified Maharashtra portal definitions.
- Populate `data/maharashtra/services.json` with core verified civic services (e.g., Income Certificate, Domicile Certificate).
- Populate `data/maharashtra/schemes.json` with verified state and central welfare schemes.
- Implement runtime validation helpers to parse and guard external payloads against contract schemas.

## 2. Requirements

### Functional Requirements
- **FR-P03-01 (Canonical Types):** Export `Language`, `LocalizedText`, `OfficialSource`, `SchemeSource`, `TaskStep`, `Service`, `Scheme`, `Portal`, `PortalMatch`, `PageContext`, `FormGuide`, `FormPage`, `FormField`, `AssistantRequest`, `Intent`, `SahayakResponse`, `AIProvider`, `ScreenExplanation`, `ScreenElement`, `AccessibilityPreferences`, `GuidanceMode`, `CurrentTask`, `ExtensionMessage`, `ExtensionResponse`, and `ExtensionError`.
- **FR-P03-02 (Verified Portals Data):** Populate `portals.json` covering Aaple Sarkar, MahaDBT, RCMS Maharashtra, Divyang Sahayak, and ECI Voters.
- **FR-P03-03 (Verified Services Data):** Populate `services.json` covering at minimum:
  - Income Certificate (Aaple Sarkar / Revenue Dept)
  - Domicile / Age & Nationality Certificate (Aaple Sarkar)
  - Ration Card Member Addition (RCMS Maharashtra)
  Each service must have localized `name`, `description`, `documents`, `steps`, and verified `officialSource`.
- **FR-P03-04 (Verified Schemes Data):** Populate `schemes.json` covering major welfare schemes:
  - Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (MahaDBT)
  - Divyang Swavlamban Pension / Sanjay Gandhi Niradhar Yojna
  - PM-KISAN (Maharashtra Implementation)
  - Mukhyamantri Majhi Ladki Bahin Yojna (Women & Child Welfare)
- **FR-P03-05 (Contract Validation Helpers):** Provide type guards (e.g., `isSahayakResponse`, `isAssistantRequest`, `isScheme`) for runtime safety.

### Non-Functional Requirements
- **Data Integrity:** All official URLs must use real, valid government domains (`.gov.in`, `.nic.in`, `.mahaonline.gov.in`).
- **Typing Strictness:** 100% type safety with zero `any` types.

## 3. Inputs & Outputs
- **Inputs:** `docs/source-of-truth/DATA-CONTRACTS.md` and `docs/source-of-truth/OFFICIAL-SOURCES.md`.
- **Outputs:** `core/shared/types.ts`, `data/maharashtra/*.json`.

## 4. Modules & Contracts
- `core/shared/types.ts`
- `core/shared/validators.ts`

## 5. Constraints & Out-of-Scope
- No database connections or dynamic scrapers. Data must be statically bundled for high availability.
- No editing or altering frozen contracts without an ADR.
