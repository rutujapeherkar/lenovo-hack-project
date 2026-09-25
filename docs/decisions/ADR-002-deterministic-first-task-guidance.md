# ADR-002 — Deterministic-First Task Guidance with Verified Registry Authority

## Status
Accepted (Source-of-truth decision)

## Date
2026-09-25

## Context
When assisting citizens with government public services and welfare schemes, providing accurate, trustworthy information is life-critical. LLMs are probabilistic models prone to hallucination, path invention, and outdated factual claims. If an AI hallucinates a non-existent eligibility rule, an invalid document requirement, or a fake application URL, citizens may face financial exploitation, rejected applications, or missed statutory deadlines.

## Decision
We enforce a strict **Deterministic-First Architecture**:
1. All public services, task journeys, form steps, and scheme criteria must be sourced from a verified, structured JSON registry (`data/maharashtra/`).
2. Official URLs (`informationUrl`, `applicationUrl`) must be treated as immutable structured data, NEVER generated or guessed by AI.
3. AI is restricted to comprehension, intent classification, plain-language simplification, translation, and unknown-page fallback explanation.
4. If a requested scheme or service is not present in the verified registry, the system must openly state that verified information is unavailable rather than synthesizing ungrounded facts.

## Alternatives Considered
- *Fully Generative RAG (Retrieval-Augmented Generation) on Arbitrary Web Crawls:* Allowing the LLM to scrape the web dynamically and synthesize steps on the fly. Rejected because scrapers ingest outdated government PDFs, unverified blog posts, and phishing links.
- *Static FAQ System without AI:* Completely deterministic with no AI layer. Rejected because citizens use diverse natural language and dialects (Marathi/Hindi) that keyword matching alone cannot gracefully handle.

## Consequences
- **Positive:** Guarantees zero URL hallucinations and zero fabricated scheme requirements for supported services. Maximizes civic trust and regulatory defensibility.
- **Negative:** Supported deterministic catalog requires human verification and explicit updates when government portals change.

## Source-of-Truth Impact
- Aligns directly with [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md#L327-L356) (Section 10), [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md#L58-L74) (Section 3), [OFFICIAL-SOURCES.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/OFFICIAL-SOURCES.md#L26-L32) (Section 1), and [DATA-CONTRACTS.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/DATA-CONTRACTS.md#L167-L173) (Section 5).

## Implementation Impact
- Phase P03 must construct the typed schema and verified dataset in `data/maharashtra/`.
- Phase P05 and P06 must enforce deterministic lookups before engaging AI explanation.

## Reversal Conditions
Non-reversable for MVP. Preserving verified official truth over generative hallucination is a foundational project axiom.
