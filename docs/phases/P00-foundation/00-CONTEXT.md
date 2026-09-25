# Phase P00 — Context: Foundation & Governance

## 1. Purpose
Phase P00 is the documentation, governance, and architectural alignment phase for Sahayak AI. Its purpose is to establish an unshakeable engineering foundation derived directly from the human-approved source-of-truth documents before any application code is written.

## 2. Why Phase Exists
Without explicit project governance, phase roadmaps, and architectural non-negotiables, AI coding agents and developers tend to drift into "vibe-coding", inventing non-existent APIs, hallucinating government URLs, mixing client/server concerns, and generating generic chatbot interfaces. P00 guarantees strict adherence to product principles and technical boundaries from day zero.

## 3. Source-of-Truth Dependencies
This phase depends directly on all six primary frozen source-of-truth documents in `docs/source-of-truth/`:
- `PRODUCT.md`: Establishes product identity, scope, user problems, and non-negotiables.
- `ARCHITECTURE.md`: Establishes system layers, module ownership, AI boundaries, and extension design.
- `DATA-CONTRACTS.md`: Establishes canonical domain types and frozen schemas.
- `UI.md`: Establishes civic-tech visual discipline, color tokens, and layout guidelines.
- `OFFICIAL-SOURCES.md`: Establishes government source hierarchy and URL verification policies.
- `SECURITY.md`: Establishes zero-credential custody, server-side secrets, and extension limits.

## 4. PRD Dependencies
- `docs/PRD.md`: The consolidated, implementation-facing product requirements document derived from the source-of-truth files.

## 5. Previous Phase Dependency
None (Phase P00 is the initial phase of the repository).

## 6. Next Phase Dependency
- **Phase P01 (Design System):** P01 depends directly on P00's governance rules and visual specifications in `UI.md`.

## 7. Architectural Constraints
- P00 must NOT implement any application code (no React, Next.js, APIs, or database scripts).
- P00 must NOT install npm dependencies.
- P00 must preserve all six files in `docs/source-of-truth/` without modification.

## 8. Out-of-Scope
- Building UI components or wireframes.
- Installing runtime packages.
- Connecting to external AI providers.
- Authoring live browser extension scripts.
