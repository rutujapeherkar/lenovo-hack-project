# Phase P03 — Implementation Plan: Shared Contracts & Verified Government Data

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/DATA-CONTRACTS.md` and `docs/source-of-truth/OFFICIAL-SOURCES.md`.
2. [CREATE] `core/shared/types.ts` with all 23 frozen TypeScript interfaces.
3. [CREATE] `core/shared/validators.ts` with runtime type-guards.
4. [CREATE] `data/maharashtra/portals.json` with verified portal entries.
5. [CREATE] `data/maharashtra/services.json` with verified public service records.
6. [CREATE] `data/maharashtra/schemes.json` with verified state & central schemes.
7. [CREATE] `core/shared/data-loader.ts` to export typed accessors for JSON registries.
8. [VERIFY] Write schema test validating that JSON files conform strictly to TypeScript interfaces.

## 2. Files to Create & Modify
- [CREATE] `core/shared/types.ts`
- [CREATE] `core/shared/validators.ts`
- [CREATE] `core/shared/data-loader.ts`
- [CREATE] `data/maharashtra/portals.json`
- [CREATE] `data/maharashtra/services.json`
- [CREATE] `data/maharashtra/schemes.json`
- [REFERENCE] `docs/source-of-truth/DATA-CONTRACTS.md`
- [REFERENCE] `docs/source-of-truth/OFFICIAL-SOURCES.md`

## 3. Module Responsibilities
- `core/shared/types.ts`: Single authoritative home for canonical domain types.
- `core/shared/validators.ts`: Runtime assertions guarding boundaries against malformed payloads.
- `data/maharashtra/*.json`: Authoritative, verified civic data sets.

## 4. Integration Points
- Consumed by `core/assistant/` (P04), `core/services/` (P05), `core/schemes/` (P06), and `extension/` (P08).

## 5. Data Flow
- JSON files are imported statically via `data-loader.ts` and validated via TypeScript type assertion.

## 6. Testing Points
- Automated unit test verifying JSON schema validity against exported TypeScript interfaces.
- Test verifying all URLs in JSON datasets conform to valid government domain formats.
