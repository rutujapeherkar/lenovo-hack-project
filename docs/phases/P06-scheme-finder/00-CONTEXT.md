# Phase P06 — Context: Scheme Finder & Eligibility Engine

## 1. Purpose
The purpose of Phase P06 is to build the Scheme Finder feature: a natural-language query interface, faceted filtering engine, scheme detail views, and verified eligibility breakdown for Maharashtra and national welfare schemes.

## 2. Why Phase Exists
Thousands of welfare schemes exist, but citizens cannot find schemes matching their demographic profile or specific needs (e.g., student scholarships, Divyang assistance, farmer subsidies). P06 empowers citizens to discover applicable schemes using plain language or filters, providing clear eligibility criteria and verified application routes while strictly preventing AI hallucination of non-existent schemes.

## 3. Source-of-Truth Dependencies
- `docs/source-of-truth/PRODUCT.md`: Section 8.4 (Scheme Finder), Section 21 (Schemes Experience).
- `docs/source-of-truth/ARCHITECTURE.md`: Section 14 (Scheme Module), Section 15 (Scheme Data Rule), Section 44 (Data Flow — Scheme Finder).
- `docs/source-of-truth/DATA-CONTRACTS.md`: Section 10 (`Scheme`), Section 40 (`SchemeDiscoveryResult`).
- `docs/source-of-truth/UI.md`: Section 22 (Scheme Page), Section 23 (Scheme Cards).
- `docs/source-of-truth/OFFICIAL-SOURCES.md`: Sections 11, 12, 13 (Scheme Registry Rules & URL Rules).

## 4. PRD Dependencies
- `docs/PRD.md`: Section 18 (Scheme Discovery), Section 23 (Official Source Requirements).

## 5. Previous Phase Dependency
- **Phase P03 (Shared Contracts & Data):** Sourced from `schemes.json`.
- **Phase P04 (AI Assistant Core):** Leverages `AIProvider` for natural language query understanding and text simplification.

## 6. Next Phase Dependency
- **Phase P07 (Explain Screen):** Shares visual card and explanation layout patterns.

## 7. Architectural Constraints
- Scheme records must come from the verified structured dataset (`data/maharashtra/schemes.json`).
- AI may summarize or simplify verified information, but must NEVER invent schemes, eligibility, or URLs.
- If a query finds zero verified matches, present honest links to official discovery portals ([myScheme](https://www.myscheme.gov.in/), [India.gov.in](https://www.india.gov.in/)).

## 8. Out-of-Scope
- Automatically applying or submitting scheme applications on MahaDBT.
- Verifying user uploaded income documents against eligibility thresholds (reserved for future scope).
