# Sahayak AI — Antigravity Engineering & Governance Rules

> **Status:** Mandatory Operating Guidelines for All AI Coding Agents & Engineers  
> **Authority:** Derived from [docs/source-of-truth/](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/) and [docs/PRD.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/PRD.md)

---

## 1. Twenty-Four Inviolable Rules

Every future development session, tool invocation, and AI coding agent must strictly obey these twenty-four rules:

1. **Read `PROJECT_STATE.md` first:** Check the current active phase and exact development progress before doing anything else.
2. **Read `PRD.md`:** Ground all decisions in the consolidated product requirements.
3. **Read relevant source-of-truth documents:** Review the primary documents in [docs/source-of-truth/](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/) before implementing related code.
4. **Read current phase documentation:** Study `00-CONTEXT.md`, `01-SPEC.md`, `02-IMPLEMENTATION.md`, `03-ACCEPTANCE.md`, and `04-TESTS.md` for the active phase.
5. **Implement only the current phase:** Restrict all changes exclusively to the work defined for the current active phase.
6. **Never implement future phases:** Do not scaffold, draft, or implement components belonging to subsequent phases ahead of time.
7. **Never modify frozen source-of-truth documents silently:** Files inside `docs/source-of-truth/` are human-approved and frozen. Never edit or overwrite them without explicit human approval.
8. **Never invent government information:** Welfare schemes, eligibility limits, fee structures, and document requirements must come from verified records.
9. **Never invent official URLs:** Application and information URLs must come from verified structured registries. AI must never hallucinate a link.
10. **Never invent DOM selectors:** Browser extension field matching must use verified selectors confirmed against actual portal DOMs.
11. **Never request or capture sensitive credentials:** Absolutely no solicitation, interception, or storage of OTPs, UPI PINs, ATM PINs, passwords, CVVs, or full payment credentials.
12. **Keep API keys server-side:** Cloud AI credentials (`AI_API_KEY`) must never be bundled into client-side JavaScript or extension code.
13. **Follow `SECURITY.md`:** Uphold data minimization, untrusted input sanitation, least-privilege extension permissions, and payment safety rules.
14. **Follow `UI.md`:** Adhere strictly to the civic-tech blue-and-white visual language, design tokens, typography, and spacing scale.
15. **Follow `DATA-CONTRACTS.md`:** Use the canonical shared TypeScript types. Never duplicate or alter core schemas across feature folders.
16. **Preserve modular architecture:** Respect the strict separation of Presentation, Application Services, Core Domain, and External Providers.
17. **Avoid duplicate components, types, or services:** Always inspect existing shared code and reuse before creating new files.
18. **Avoid unnecessary dependencies:** Solve problems using native web platform capabilities. Never add third-party libraries without documented justification.
19. **Run tests:** Execute unit, integration, and contract tests before declaring any phase milestone complete.
20. **Run lint and build verification:** Ensure zero TypeScript errors (`tsc --noEmit`) and successful build compilation.
21. **Never claim success without testing:** Verifying that code compiles or "looks good" is insufficient; every acceptance checkbox requires concrete test verification.
22. **Update `PROJECT_STATE.md` and phase changelogs:** Keep project tracking documents synchronized with ground truth.
23. **Create an ADR for meaningful architectural decisions:** Log all substantial design shifts in `docs/decisions/` and index them in `docs/DECISIONS.md`.
24. **STOP when information is missing instead of guessing:** If requirements, URLs, or contracts are absent, halt immediately and request guidance.

---

## 2. Hard Stop Conditions

Antigravity must immediately **HALT** implementation and report to the user instead of guessing or improvising when:

- A conflict is discovered between two source-of-truth documents.
- A requirement in `PRD.md` conflicts with `docs/source-of-truth/`.
- System architecture or module ownership is ambiguous.
- A required canonical data contract is missing from `DATA-CONTRACTS.md`.
- An official government URL or authoritative department name cannot be verified.
- A DOM selector for an extension form guide is unverified or speculative.
- A feature requires opening a new security boundary (e.g., asking for user credentials).
- An unexpected external npm dependency is required.
- A frozen requirement must be altered to proceed.
- A phase dependency has not been completed or has broken.

### Mandatory Stop Report Format

When halting, the agent must output a structured diagnostic report:

```markdown
### 🛑 ANTIGRAVITY STOP CONDITION TRIGGERED

1. **Problem:** [Clear, concise description of the blocker or ambiguity]
2. **Evidence:** [Exact line numbers, code snippets, or quotes showing the conflict/gap]
3. **Affected Document:** [Path to the relevant specification or source-of-truth file]
4. **Affected Phase:** [Phase ID, e.g., P04, P08]
5. **Required Decision:** [Specific decision or verification required from the user]
6. **Files Not Modified:** [List of files left untouched to preserve system integrity]
```

---

## 3. Standard Implementation Workflow

All future engineering work across all phases must follow this disciplined 14-step loop:

```text
READ (PROJECT_STATE, PRD, Phase Spec, Source-of-Truth)
  ↓
UNDERSTAND (Analyze constraints, edge cases, multilingual impact)
  ↓
PLAN (Enumerate exact files to [CREATE], [MODIFY], [REFERENCE])
  ↓
IMPLEMENT (Write clean, modular, typed code adhering to UI.md & contracts)
  ↓
RUN (Launch dev server / build tool)
  ↓
TEST (Execute unit tests, integration tests, contract tests)
  ↓
INSPECT (Verify visual rendering, Devanagari text, keyboard focus, mobile layout)
  ↓
FIX (Resolve any regressions, lint warnings, or visual clipping)
  ↓
DOCUMENT (Update phase documentation and relevant ADRs)
  ↓
COMMIT (Stage and commit granular, descriptive changes)
  ↓
UPDATE PROJECT_STATE (Record completed items and transition phase status)
  ↓
NEXT PHASE (Advance only after meeting Definition of Done)
```

---

## 4. No "Vibe-Coding" & Aesthetic Discipline

Sahayak AI is a high-trust civic accessibility system for public welfare. It must never devolve into generic, flashy, AI-generated software.

### Strictly Avoid:
- Generic AI dashboards and full-screen chatbot bubbles.
- Purple, pink, or neon AI gradients.
- Heavy glassmorphism, floating blur effects, or glowing borders.
- Floating random background blobs or decorative 3D illustrations.
- Excessive pill-shaped buttons or endless nested card containers.
- Fake government crests, Ashoka Lion emblems, or misleading official seals.
- Fabricated government schemes or synthesized portal links.
- Speculative architectural patterns or unneeded abstractions.

### Strictly Adhere To:
- The curated Sahayak blue palette (`--sahayak-blue: #00599F`, `--sahayak-blue-dark: #003C6D`, `--surface: #FFFFFF`).
- The visual discipline of UMANG (calm, structured, information-first, strong contrast) without cloning UMANG branding.
- Real content, real scheme records, and verified public service pathways.
- Crisp typography (`Inter` + `Noto Sans Devanagari`) with complete Devanagari text expansion tolerance.
