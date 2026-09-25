# Phase P03 — Acceptance Criteria: Shared Contracts & Verified Government Data

## Acceptance Checklist

- [ ] **AC-P03-01:** `core/shared/types.ts` contains exact definitions for all 23 frozen contracts in `DATA-CONTRACTS.md`.
- [ ] **AC-P03-02:** Language is strictly typed as `export type Language = "en" | "mr" | "hi";`.
- [ ] **AC-P03-03:** `LocalizedText` interface enforces `{ en: string; mr: string; hi: string; }`.
- [ ] **AC-P03-04:** `OfficialSource` contains `name`, `url`, and optional `lastVerified`.
- [ ] **AC-P03-05:** `data/maharashtra/portals.json` defines Aaple Sarkar, MahaDBT, RCMS, and Divyang Sahayak.
- [ ] **AC-P03-06:** `data/maharashtra/services.json` contains structured entries for Income Certificate and Domicile Certificate with localized names and verified steps.
- [ ] **AC-P03-07:** `data/maharashtra/schemes.json` contains structured entries with eligibility, benefits, and verified official URLs.
- [ ] **AC-P03-08:** Every URL in `services.json` and `schemes.json` starts with an authentic government domain (`https://...gov.in` or `https://...mahaonline.gov.in`).
- [ ] **AC-P03-09:** Zero duplicate copies of `Service`, `Scheme`, or `TaskStep` types exist in feature folders.
- [ ] **AC-P03-10:** TypeScript compiler verifies 100% compliance of JSON datasets with exported types.
