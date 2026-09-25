# Sahayak AI — Architectural & Product Decision Log

> **Status:** Active Decision Register  
> **Source-of-Truth Authority:** All decisions indexed here must adhere to the frozen source-of-truth documents in [docs/source-of-truth/](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/).

---

## 1. Decision Governance Principles

1. **No Silent Decisions:** No developer or AI coding agent may introduce a major architectural pattern, external dependency, or data contract mutation without recording an ADR.
2. **Source-of-Truth Primacy:** An ADR cannot overturn a frozen requirement in [docs/source-of-truth/](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/) without explicit human approval and documented conflict resolution.
3. **Traceability:** Every decision must reference its date, context, consequences, and affected implementation phases.

---

## 2. Decision Index

| Decision ID | Title | Date | Category | Status | Direct Reference |
|---|---|---|---|---|---|
| **ADR-001** | [Provider-Agnostic AI Interface with Local Demo Fallback](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/decisions/ADR-001-provider-agnostic-ai-interface.md) | 2026-09-25 | Architecture / AI | Accepted (Source-of-truth decision) | [ARCHITECTURE.md (Sec 5.2, 31)](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md#L134-L164) |
| **ADR-002** | [Deterministic-First Task Guidance with Verified Registry Authority](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/decisions/ADR-002-deterministic-first-task-guidance.md) | 2026-09-25 | Product / Data | Accepted (Source-of-truth decision) | [PRODUCT.md (Sec 10)](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md#L327-L356), [OFFICIAL-SOURCES.md (Sec 1)](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/OFFICIAL-SOURCES.md#L26-L32) |
| **ADR-003** | [Isolated Server-Side Secrets & Zero Credential Custody](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/decisions/ADR-003-isolated-secrets-zero-credentials.md) | 2026-09-25 | Security / Architecture | Accepted (Source-of-truth decision) | [SECURITY.md (Sec 3, 8)](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/SECURITY.md#L54-L86), [ARCHITECTURE.md (Sec 38)](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md#L1094-L1108) |

---

## 3. Frozen Source-of-Truth Foundation Decisions

The following foundational decisions were established during project formulation and are frozen into the primary documentation:

- **STD-01: Scope Limitation to Maharashtra State:** MVP focuses strictly on Maharashtra citizens, services, and applicable central schemes. *(Source: PRODUCT.md Sec 3)*
- **STD-02: Multilingual Triad (en, mr, hi):** Exactly three supported languages for MVP, maintaining strict Devanagari script typography parity. *(Source: PRODUCT.md Sec 4, UI.md Sec 9)*
- **STD-03: Visual Inspiration from UMANG without Cloning:** Restrained civic-tech visual discipline, blue-and-white palette, zero AI-hype gimmicks. *(Source: UI.md Sec 4)*
- **STD-04: Non-Autonomous Form Assistance:** Sahayak explains and highlights, but never autofills or submits government forms automatically. *(Source: PRODUCT.md Sec 25, SECURITY.md Sec 13)*
- **STD-05: Non-Intermediary Payment Safety:** Educational payment guidance only; absolute prohibition on processing UPI or collecting PINs. *(Source: PRODUCT.md Sec 15, SECURITY.md Sec 20)*
- **STD-06: Chromium Manifest V3 Side Panel Architecture:** Non-intrusive persistent extension sidebar with contextual tab hooks. *(Source: ARCHITECTURE.md Sec 26)*
