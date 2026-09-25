# SAHAYAK AI — OFFICIAL SOURCES
## Source-of-Truth Document

**Status:** FROZEN FOR MVP  
**Scope:** Maharashtra, India  
**Languages:** English, Marathi, Hindi  
**Product:** Sahayak AI  
**Document Role:** Defines which government sources Sahayak may trust, display, link to, and use as authoritative context.

---

## 1. Purpose

This document defines the official-source policy for Sahayak AI.

Sahayak helps citizens understand and navigate digital public services. It must therefore clearly distinguish:

- official government information
- official application routes
- Sahayak-generated explanations
- AI-generated explanations
- user-provided information

The system must never make AI-generated information appear to be an official government statement.

### Core rule

> Sahayak explains government services. It does not become the government source.

For current requirements, deadlines, eligibility, fees, procedures, and application routes, users must be able to reach the relevant official source.

---

# 2. Source Hierarchy

Sahayak uses the following source hierarchy.

## Level 1 — Direct Government Authority

Highest authority for the relevant service or scheme.

Examples:

- Government of Maharashtra departments
- Government of India ministries/departments
- official government application portals
- official statutory/constitutional authorities

Use these sources for authoritative service and scheme information whenever available.

---

## Level 2 — Official Government Service Portals

Examples:

- Aaple Sarkar
- MahaDBT
- National Scholarship Portal
- UDID
- ECI Voters' Services
- Maharashtra RCMS

These may provide:

- application workflows
- service requirements
- application status
- forms
- official notices
- service links

---

## Level 3 — Official Government Discovery Portals

Examples:

- myScheme
- India.gov.in

These are useful for discovering schemes and services and for directing users toward the responsible authority.

They should not automatically replace the responsible department's official page when a more specific authoritative source is available.

---

## Level 4 — Sahayak Structured Registry

Sahayak may maintain a local structured registry containing verified information from official sources.

The registry exists to make retrieval fast and deterministic.

It does **not** become a new authority.

Every registry record should retain its official source and verification metadata.

---

## Level 5 — AI Explanation

AI may:

- simplify terminology
- translate explanations
- summarize verified information
- explain a page
- answer natural-language questions using verified context

AI must not invent:

- government schemes
- eligibility requirements
- application URLs
- fees
- deadlines
- official contact details
- government notices

If verified context is unavailable, Sahayak must say so.

---

# 3. Maharashtra Official Sources

The MVP is Maharashtra-first.

The following sources are approved for the initial source registry.

| Source | Purpose | Official URL |
|---|---|---|
| Government of Maharashtra | State government information | https://www.maharashtra.gov.in/ |
| Aaple Sarkar | Maharashtra citizen services | https://aaplesarkar.mahaonline.gov.in/en/ |
| MahaDBT | Direct benefit transfer and scholarship services | https://mahadbt.maharashtra.gov.in/ |
| Maharashtra DEPwD | Disability empowerment information and schemes | https://depwd.maharashtra.gov.in/ |
| Divyang Sahayak | Maharashtra disability-related services | https://divyangsahayak.maharashtra.gov.in/ |
| Maharashtra Rural Development | Rural development services/schemes | https://rdd.maharashtra.gov.in/ |
| Maharashtra Urban Development | Urban development information | https://urban.maharashtra.gov.in/ |
| Maharashtra Social Welfare | Social welfare information | https://sjsa.maharashtra.gov.in/ |
| Maharashtra Public Health | Public health information/services | https://phd.maharashtra.gov.in/ |
| Maharashtra Co-operation | Cooperation/agriculture-related department information | https://sahakarayukta.maharashtra.gov.in/ |
| Maharashtra Textiles | Textile-related government information | https://www.mahatextile.gov.in/ |
| Maharashtra Food/Civil Supplies RCMS | Ration-card related services | https://rcms.mahafood.gov.in/ |

### Important

The registry must treat URLs as data, not generated text.

If a source URL is not present in the registry, the AI must not invent one.

---

# 4. Government of India Sources

The MVP may support Maharashtra citizens accessing central-government services and schemes.

Approved central sources include:

| Source | Purpose | Official URL |
|---|---|---|
| myScheme | Government scheme discovery | https://www.myscheme.gov.in/ |
| India.gov.in | National government information/service discovery | https://www.india.gov.in/ |
| National Scholarship Portal | Scholarship discovery/application | https://scholarships.gov.in/ |
| Election Commission of India Voters' Services | Voter services | https://voters.eci.gov.in/ |
| UDID | Disability identity/card services | https://www.swavlambancard.gov.in/ |
| PM-KISAN | Farmer income-support service | https://pmkisan.gov.in/ |

Additional central-government sources may be added only after verification.

---

# 5. Official Source Data Model

Every source record should follow the shared data contracts.

Conceptual structure:

```ts
type OfficialSource = {
  name: string;
  url: string;
  lastVerified?: string;
};

type SchemeSource = {
  authority: string;
  sourceType:
    | "maharashtra_state"
    | "government_of_india"
    | "central_state_joint";

  informationUrl: string;
  applicationUrl?: string;
  procedureUrl?: string;
  officialPortalName?: string;

  lastVerified: string;

  verificationStatus:
    | "verified"
    | "temporarily_closed"
    | "information_only"
    | "application_route_pending";
};
```

The exact implementation must remain consistent with `DATA-CONTRACTS.md`.

---

# 6. Information URL vs Application URL

These are different concepts and must remain separate.

## Information URL

The page explaining:

- scheme
- service
- eligibility
- benefits
- documents
- rules
- department information

## Application URL

The actual official route where the citizen can:

- apply
- register
- submit
- access the relevant service

### Rule

Never assume that an information page is also the application page.

Do not create an application button unless the application route has been verified.

---

# 7. Source Verification Metadata

Every important source record should include:

```text
lastVerified
verificationStatus
authority
sourceType
```

Example:

```json
{
  "authority": "Government of Maharashtra",
  "sourceType": "maharashtra_state",
  "informationUrl": "https://example.gov.in/service",
  "applicationUrl": "https://example.gov.in/apply",
  "lastVerified": "2026-09-25",
  "verificationStatus": "verified"
}
```

The date must represent the actual verification date.

Do not fabricate a verification date.

---

# 8. Verification Status

## verified

The source was checked and the route/information is currently usable for the intended purpose.

## temporarily_closed

The official source indicates that the service/application route is temporarily unavailable or closed.

Sahayak should explain this clearly rather than redirecting the user to a dead or misleading route.

## information_only

The official source provides information but no verified application route.

UI should show:

> View Official Information

instead of:

> Apply Now

## application_route_pending

The scheme/service is known, but the application route has not been verified.

Do not expose an unverified application button.

---

# 9. Source Selection Rules

When multiple official sources exist:

1. Prefer the responsible department/authority.
2. Prefer a direct official service/application portal for application actions.
3. Use official government discovery portals for discovery and cross-checking.
4. Use Sahayak's verified registry for deterministic retrieval.
5. Use AI only to explain retrieved information.

### Example

If a scholarship is listed on myScheme and the responsible department has an official scholarship page:

- myScheme can help discover the scheme.
- the responsible department's official source should be retained as the authoritative source when appropriate.
- the application route should point to the verified official application portal.

---

# 10. Conflicting Information

Government information can change across portals.

If two official sources appear to conflict:

1. Prefer the source belonging to the responsible authority.
2. Check whether one source is a discovery page and the other is the operational service portal.
3. Check publication/update information where available.
4. Do not silently choose a value when the conflict cannot be resolved.
5. Mark the record for verification.

Sahayak should say:

> “The available official sources show different information. Please verify the latest requirement on the responsible department's official portal.”

Do not allow the AI model to resolve factual government conflicts by guessing.

---

# 11. Dynamic Government Catalogues

Government scheme and service catalogues are dynamic.

Therefore:

- the local registry is not a permanent copy of every government scheme
- dates, eligibility, application windows, and procedures can change
- official catalogues remain the source of truth
- Sahayak must expose verification dates where practical
- the product must not claim that its static dataset contains every current government scheme

For discovery, official catalogues such as myScheme, India.gov.in, and NSP may be used where relevant.

---

# 12. Scheme Registry Rules

Each supported scheme should contain enough information for deterministic display.

Minimum recommended fields:

```text
id
name
state
category
eligibility
benefits
documents
officialSource
lastVerified
verificationStatus
```

Recommended source fields:

```text
authority
informationUrl
applicationUrl
procedureUrl
officialPortalName
```

### AI boundary

AI may explain the registry record.

AI must not replace missing registry fields with invented government facts.

---

# 13. Official URL Rules

## MUST

- Use exact URLs stored in the verified registry.
- Keep information and application URLs separate.
- Display the official authority name.
- Preserve source verification metadata.
- Open official government routes directly when the user chooses to proceed.

## MUST NOT

- Generate URLs using AI.
- Guess URL paths.
- Construct application URLs from domain names.
- Replace official URLs with unofficial blogs.
- Present search-engine results as official sources.
- Use shortened URLs for government destinations.
- Create fake government-looking links.

---

# 14. Government Branding Rules

Sahayak may communicate that a destination is an official government source.

However:

- Sahayak must not pretend to be a government department.
- Do not create fake government seals.
- Do not reproduce government login screens as if they were official.
- Do not use official logos in a way that implies endorsement.
- Do not label Sahayak itself as a government service.

Required product disclaimer:

> Sahayak AI provides guidance and does not represent a government department.

---

# 15. Official Source UI

Whenever government information is shown, the UI should make the distinction clear.

Recommended component:

```text
┌─────────────────────────────────────────┐
│ OFFICIAL SOURCE                         │
│ Government of Maharashtra               │
│                                         │
│ Information verified: 25 Sep 2026       │
│                                         │
│ [View Official Information]             │
└─────────────────────────────────────────┘
```

For an application route:

```text
┌─────────────────────────────────────────┐
│ OFFICIAL APPLICATION                    │
│ MahaDBT                                 │
│                                         │
│ [Go to Official Application]            │
└─────────────────────────────────────────┘
```

Sahayak guidance should remain visually distinct from official content.

---

# 16. Source Failure Behaviour

If an official source is unavailable:

### Do not

- invent replacement information
- invent a replacement URL
- silently use an unofficial source
- claim the service is available

### Do

Show:

> “We could not verify the official source right now.”

If a previously verified source exists:

> “This information was previously verified on [date]. Please verify it on the official portal before applying.”

---

# 17. AI Retrieval Rules

The AI assistant should receive verified source context whenever possible.

Preferred flow:

```text
User Query
    ↓
Intent Detection
    ↓
Service/Scheme Retrieval
    ↓
Verified Official Context
    ↓
AI Explanation
    ↓
Structured Response
    ↓
Official Source
```

Not:

```text
User Query
    ↓
LLM guesses scheme
    ↓
LLM invents URL
```

---

# 18. Unknown Service or Scheme

If the user asks about something that is not in Sahayak's verified registry:

1. Determine whether the request can be matched to an official discovery source.
2. If verified information is found, return it with source attribution.
3. If it cannot be verified, explain that Sahayak does not currently have verified information.
4. Do not hallucinate.

Example:

> “I couldn't verify this scheme in Sahayak's current official-source registry. Please check the official Maharashtra or Government of India scheme catalogue.”

---

# 19. Adding a New Official Source

Before adding a source:

### Step 1 — Identify authority

Determine the responsible department, ministry, authority, or official service platform.

### Step 2 — Verify domain

Confirm that the source is an official government destination.

### Step 3 — Identify purpose

Record whether the source provides:

- information
- application
- procedure
- status
- discovery
- documents

### Step 4 — Record metadata

Add:

```text
authority
sourceType
informationUrl
applicationUrl
procedureUrl
officialPortalName
lastVerified
verificationStatus
```

### Step 5 — Add to registry

Update the appropriate data file.

### Step 6 — Test UI

Verify that:

- links open correctly
- labels are accurate
- information/application routes are not mixed
- source attribution is visible

### Step 7 — Document the change

Update the relevant changelog/project state.

---

# 20. Source Review Workflow

For a source update:

```text
Identify source
      ↓
Verify official domain
      ↓
Verify information
      ↓
Verify application route
      ↓
Update registry
      ↓
Update verification date
      ↓
Run tests
      ↓
Review UI
      ↓
Commit
```

No source should be updated only because an AI model suggested it.

---

# 21. Source Ownership

### Atharva

Primary responsibility:

- source registry
- scheme records
- retrieval
- source metadata
- AI context
- verification workflow

### Rutuja

Primary responsibility:

- source cards
- official-source UI
- application buttons
- accessibility
- language presentation
- user-facing warnings

### Both

Responsible for:

- integration
- testing
- validating critical official links
- demo readiness

---

# 22. Antigravity Implementation Rules

Antigravity must follow these rules whenever working with official sources.

1. Read `PRODUCT.md`.
2. Read `ARCHITECTURE.md`.
3. Read `DATA-CONTRACTS.md`.
4. Read `OFFICIAL-SOURCES.md`.
5. Inspect the existing source registry before adding anything.
6. Reuse existing source records.
7. Never invent government URLs.
8. Never invent scheme facts.
9. Never create an application route from a guessed path.
10. Never replace official data with AI-generated data.
11. Keep information and application URLs separate.
12. Preserve verification metadata.
13. If an official source is missing, STOP and report it.
14. If a URL cannot be verified, do not add it.
15. Do not modify unrelated modules.
16. Run tests after source changes.
17. Report exactly which source records changed.

### STOP CONDITION

If a required official source cannot be verified:

> STOP. Do not guess. Report the missing source and wait for a verified source.

---

# 23. Source-of-Truth Relationship

The authority chain is:

```text
Official Government Authority
          ↓
Official Government Portal
          ↓
Verified Sahayak Source Registry
          ↓
Sahayak Retrieval
          ↓
AI Explanation
          ↓
Accessible User Guidance
```

The lower layers explain or present information from the higher layers.

They do not replace them.

---

# 24. Final Rules

The following rules are non-negotiable for the MVP:

1. Maharashtra is the primary state scope.
2. Official government sources are the authority.
3. Sahayak's registry is a verified convenience layer.
4. AI explains; it does not invent.
5. Official URLs are stored data, never generated.
6. Information and application URLs are separate.
7. Verification dates must be real.
8. Unknown information must remain unknown.
9. Government branding must not be impersonated.
10. Users must be able to reach the official source.
11. Current requirements should be rechecked before submission.
12. Sahayak must clearly state that it does not represent a government department.

### Required disclaimer

> **Sahayak AI provides guidance and does not represent a government department. Requirements and procedures may change. Verify current information on the official service portal before submitting an application.**

---

## Final Principle

> **Sahayak can simplify government information, but it must never manufacture government information.**
