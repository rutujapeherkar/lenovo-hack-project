# Sahayak AI — Product Requirements Document (PRD)

> **Document Status:** Active / Authoritative PRD  
> **Version:** 1.0  
> **Date:** September 2026  
> **Foundation Notice:** "The source-of-truth documents in docs/source-of-truth/ are the authoritative foundation for this PRD."

---

## Authoritative Precedence Notice

This Product Requirements Document (PRD) is derived directly from the human-approved, manually created source-of-truth documents located in [docs/source-of-truth/](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/). 

In case of any ambiguity, conflict, or question of intent, the following strict hierarchy of authority applies:
1. [docs/source-of-truth/PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md)
2. [docs/source-of-truth/ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md)
3. [docs/source-of-truth/DATA-CONTRACTS.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/DATA-CONTRACTS.md)
4. [docs/source-of-truth/UI.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/UI.md)
5. [docs/source-of-truth/OFFICIAL-SOURCES.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/OFFICIAL-SOURCES.md)
6. [docs/source-of-truth/SECURITY.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/SECURITY.md)

---

# 1. Product Overview
*Source: docs/source-of-truth/PRODUCT.md (Sections 1.1–1.3)*

**Product Name:** Sahayak AI  
**Tagline:** "Making digital services usable for everyone."  
**One-Line Description:** Sahayak AI is an AI-powered accessibility and task-navigation assistant that helps citizens understand and use digital public services through simple, multilingual, and guided interactions.

Sahayak AI acts as a contextual accessibility and guidance overlay for public services in Maharashtra, India. It operates primarily as a web application supported by a browser extension side panel, providing multimodal assistance (text, voice, image-based screen explanation) to empower citizens navigating complex governmental portals.

---

# 2. Problem Statement
*Source: docs/source-of-truth/PRODUCT.md (Section 1.5)*

Digital public services in India, particularly across Maharashtra (e.g., Aaple Sarkar, MahaDBT, RCMS), are increasingly available online. However, **availability does not guarantee usability**.

Citizens face severe usability barriers, including:
- **Complex government terminology:** Bureaucratic language, legalistic jargon, and unclear form labels create fear and confusion.
- **Multi-step application processes:** Lengthy, opaque workflows with unclear prerequisites and next steps.
- **Unfamiliar website interfaces:** Disorienting navigation hierarchies, inconsistent layouts, and dense visual noise.
- **Language barriers:** Portals often default to complex formal registers or poorly translated text.
- **Low digital literacy:** Citizens struggle with basic form interactions, uploading required file formats, or interpreting error dialogs.
- **Accessibility barriers:** Lack of high-contrast modes, large font scaling, screen-reader friendliness, or speech interaction for senior citizens or individuals with visual/motor impairments.
- **Discovery difficulty:** Citizens cannot easily identify which welfare schemes or civic certificates apply to their personal or household circumstances.
- **Payment anxiety:** Panic during digital payment (e.g., UPI, net banking) gateways due to fear of financial loss or fraud.

---

# 3. Product Vision
*Source: docs/source-of-truth/PRODUCT.md (Sections 1.4, 6, 32)*

The vision of Sahayak AI is an inclusive digital India where every citizen, regardless of age, digital literacy, language preference, or physical ability, can independently exercise their civic rights and access government benefits.

Sahayak AI envisions a bridge over the digital divide:
> "We don't replace digital services. We make them usable."

Sahayak transforms the user journey from apprehension to confident execution by explaining what each requirement means, determining what step must be taken next, and guiding the citizen safely to official government fulfillment channels.

---

# 4. Product Positioning
*Source: docs/source-of-truth/PRODUCT.md (Section 5)*

Sahayak AI is:
- A contextual accessibility layer.
- A task-navigation assistant.
- A plain-language explanation overlay.
- A multilingual public-service guide.
- A safe navigator directing users to verified official portals.

Sahayak AI is **NOT**:
- A replacement for official government portals.
- A government department, ministry, or statutory authority.
- A proxy application filing service or automated form submitter.
- A generic chatbot or ungrounded AI search engine.
- A payment gateway or financial intermediary.

---

# 5. USP (Unique Selling Proposition)
*Source: docs/source-of-truth/PRODUCT.md (Section 6)*

> **"Digital public services provide access. Sahayak provides understanding."**

Unlike generic AI bots that hallucinate dead links and fabricated procedures, and unlike static government FAQs that remain impenetrable:
1. **Contextual Grounding:** Sahayak knows where the citizen is, understands the specific form or scheme, and guides the citizen field-by-field.
2. **Deterministic-First Reliability:** Official steps, URLs, eligibility rules, and required documents are strictly verified and deterministic. AI is strictly leveraged for comprehension, natural-language query resolution, screen explanation, and conversational assistance.
3. **Multilingual Triad:** Full parity across Marathi (`mr`), Hindi (`hi`), and English (`en`).

---

# 6. Target Users
*Source: docs/source-of-truth/PRODUCT.md (Section 2)*

1. **Senior Citizens:** Requiring high legibility, calm UI, read-aloud capabilities, and step-by-step reassurance.
2. **First-Time Digital-Service Users:** Citizens transitioning from physical citizen service centers (CSC / Setu Kendras) to online portals.
3. **Marathi-First Citizens:** Users residing across rural and urban Maharashtra who interact natively in Marathi and struggle with English or technical terms.
4. **Hindi-Speaking Residents:** Migrant workers and multilingual households in Maharashtra desiring guidance in Hindi.
5. **Persons with Disabilities (Divyangjan):** Citizens needing screen-reader-friendly semantics, keyboard accessibility, high contrast, and voice-assisted input.
6. **Students and Job Aspirants:** Young citizens applying for scholarships, caste validity, or competitive exam subsidies through MahaDBT.
7. **Farmers and Rural Beneficiaries:** Needing straightforward discovery of welfare programs (e.g., PM-KISAN, crop insurance, ration services).

---

# 7. User Problems
*Source: docs/source-of-truth/PRODUCT.md (Sections 1.5, 7)*

When interacting with digital government portals, citizens invariably ask:
1. **"What is this?"** — Citizens do not understand bureaucratic terms (e.g., "Domicile", "Creamy Layer", "Beneficiary", "Affidavit").
2. **"What should I do?"** — Citizens get stuck midway through complex forms, unable to tell which fields are mandatory or what format is expected.
3. **"What happens next?"** — Citizens fear submitting forms without knowing whether a fee is due, what physical verification is required, or how tracking works.
4. **"Is this authentic?"** — Citizens fear phishing portals, fake agents, and unofficial predatory blogs.

---

# 8. User Goals
*Source: docs/source-of-truth/PRODUCT.md (Sections 7, 31)*

- Confidently discover all eligible Maharashtra and Central welfare schemes using natural language or voice.
- Prepare the exact checklist of mandatory documents before beginning an online application.
- Understand every field and instruction on complex multi-page government portals in their preferred language.
- Follow a verified step-by-step roadmap for public services (such as Income Certificates, Domicile Certificates, Ration Card updates).
- Verify current requirements and jump directly to authentic, official government URLs.
- Complete payments independently on official banking interfaces without surrendering credentials.

---

# 9. Product Principles
*Source: docs/source-of-truth/PRODUCT.md (Sections 10, 28, 29)*

1. **Verified Data Over Generated Claims:** Authoritative workflows and official URLs must come from deterministic structured records. AI never invents official portals.
2. **Human in Control:** Sahayak advises, guides, and highlights; the human citizen always enters their data and triggers the final submission.
3. **Civic-Tech Aesthetics:** Professional, calm, trustworthy blue-and-white visual language inspired by the discipline of UMANG, completely devoid of generic "AI hype" artifacts (no glowing borders, neon gradients, or floating blobs).
4. **Resilient & Graceful Degradation:** If voice fails, text works. If AI fails, deterministic fallbacks work. If an online service is offline, clear status is explained.
5. **Absolute Privacy & Zero Credential Custody:** Zero storage or interception of OTPs, PINs, passwords, CVVs, or full identity dossiers.

---

# 10. MVP Scope
*Source: docs/source-of-truth/PRODUCT.md (Sections 3, 4, 8, 26)*

The MVP scope is strictly bounded to:
- **Geographic Scope:** Maharashtra, India (State government portals and Central schemes applicable to Maharashtra residents).
- **Languages:** English (`en`), Marathi (`mr`), Hindi (`hi`).
- **Core Interfaces:** Responsive Web Application (Desktop & Mobile) + Chromium-based Browser Extension (Side Panel).
- **Core Capabilities:**
  1. Multilingual Natural Language & Voice Assistant (Web Dashboard).
  2. Deterministic Public Service Guidance (e.g., Income Certificate, Domicile Certificate).
  3. Verified Scheme Discovery Engine with category & eligibility filtering.
  4. "Explain Screen" Vision Assistant for screenshot and form explanation.
  5. Browser Extension Side Panel providing context-aware guidance and DOM element highlighting on recognized portals (e.g., MahaDBT, Aaple Sarkar).
  6. Accessibility Controls (Font scaling, high contrast, reduced motion, read-aloud toggle).
  7. Official Source Attribution and verified outbound routing.
  8. AI fallback mechanism for unknown/unsupported portals.

---

# 11. Explicitly Out of Scope
*Source: docs/source-of-truth/PRODUCT.md (Section 27); ARCHITECTURE.md (Section 6)*

The following features are strictly prohibited from the MVP:
- Expansion to Indian states other than Maharashtra.
- Broad coverage of every existing government scheme/service in India without verified catalog records.
- Automated form autofill, robotic process automation (RPA), or autonomous application submission.
- Automated payment execution, UPI transaction triggering, or bank transfers.
- Collection, logging, or interception of OTP, UPI PIN, ATM PIN, passwords, CVV, or banking credentials.
- Autonomous browser control (clicking submit buttons or completing CAPTCHAs).
- Generating official URLs or government contact information using LLM hallucination.
- Storing permanent copies of uploaded user screenshots or personal citizen identity dossiers.
- Self-hosted local 7B+ LLM inference or offline heavyweight neural speech engines.

---

# 12. Core User Journeys
*Source: docs/source-of-truth/PRODUCT.md (Sections 8, 19–25); ARCHITECTURE.md (Sections 41–47)*

### Journey 1: Voice-Guided Service Discovery
1. Citizen lands on Sahayak Home, taps the prominent microphone button, and speaks in Marathi: *"मला उत्पन्न प्रमाणपत्र कसे काढायचे ते सांगा."*
2. Speech-to-text converts speech to text; the Assistant classifies intent as `service_discovery` / `service_guidance`.
3. Sahayak retrieves the verified Income Certificate service record.
4. Assistant renders a structured response: overview, required documents checklist, step breakdown, and official Aaple Sarkar link.
5. Citizen can listen via read-aloud (TTS) or switch between Marathi, Hindi, and English seamlessly.

### Journey 2: Step-by-Step Task Journey
1. Citizen selects "Income Certificate" and starts "Guided Task Journey".
2. Step 1 (Applicant Details) is presented in plain language with document prerequisites.
3. Citizen marks step completed or reviews next steps (Address Details → Income Calculation → Document Upload → Final Review).
4. Sahayak displays the official Aaple Sarkar portal URL with verified metadata and warns the citizen about official fee structures.

### Journey 3: Scheme Discovery & Eligibility Filtering
1. Citizen inputs: *"What scholarships are available for post-matric students in Maharashtra?"*
2. Sahayak queries the verified scheme catalogue matching `category: "education"`, `state: "Maharashtra"`.
3. Displays scannable Scheme Cards with eligibility criteria, key benefits, document checklists, and verified application routes (e.g., MahaDBT portal).
4. Clearly indicates verification status (`verified`, `lastVerified: "2026-09-25"`).

### Journey 4: Explain Screen (Visual Assistance)
1. Citizen encounters an ambiguous government form error or confusing field on a desktop/mobile browser.
2. Citizen takes a screenshot, visits Sahayak "Explain Screen", and uploads the image (validated <= 5MB, image MIME type).
3. Vision AI analyzes the visible form fields, headings, and buttons without storing credentials.
4. Sahayak outputs a structured explanation: field breakdown, plain-language translation of terms (Glossary), and actionable advice on what to enter.

### Journey 5: Browser Extension Contextual Guidance
1. Citizen navigates directly to MahaDBT or Aaple Sarkar with the Sahayak Extension installed.
2. Content script detects the portal via stable domain/URL markers.
3. Extension side panel displays: *"🟢 Sahayak understands this page: MahaDBT"*.
4. Side panel offers contextual actions: `[ Explain this page ]`, `[ What should I do next? ]`, `[ Help me fill this form ]`, `[ Required documents ]`.
5. When the user requests form guidance, the active field on the government page is highlighted via a subtle DOM highlight overlay, while the side panel provides plain-language instructions in Marathi/Hindi/English.

---

# 13. Feature Requirements
*Source: docs/source-of-truth/PRODUCT.md (Sections 8, 18–25)*

| Feature ID | Feature Name | Description | Delivery Surface |
|---|---|---|---|
| FR-01 | Multilingual Intent Engine | Parses natural language/voice input into deterministic intents (`service_discovery`, `scheme_discovery`, etc.). | Web & Extension Core |
| FR-02 | Service Catalog & Roadmap | Displays structured information and step sequences for verified Maharashtra public services. | Web App |
| FR-03 | Scheme Registry & Filter | Search and multi-criteria filtering for verified Maharashtra & Central welfare schemes. | Web App |
| FR-04 | Explain Screen Vision Core | Validated screenshot analysis delivering element breakdown and terminology explanations. | Web App |
| FR-05 | Browser Extension Side Panel | Manifest V3 contextual side panel reacting to active tab URL and DOM markers. | Browser Extension |
| FR-06 | DOM Field Highlighter | Non-destructive DOM highlighter focusing the user's attention on the active guided form field. | Extension Content Script |
| FR-07 | Central Accessibility Engine | Manages font scale (`normal`, `large`, `extra-large`), high-contrast mode, reduced motion, and read-aloud. | Web & Extension |
| FR-08 | Multilingual Language Engine | Live hot-swapping between English, Marathi, and Hindi across all UI copy and structured content. | Web & Extension |
| FR-09 | Official Source Attribution | Dedicated component presenting official authorities, verified links, and verification status. | Web & Extension |
| FR-10 | Fallback & Safety Engine | Intercepts credentials, handles provider outages, and disclaims government authority. | All Modules |

---

# 14. Website Requirements
*Source: docs/source-of-truth/UI.md (Sections 15–20, 30–33); PRODUCT.md (Section 18)*

The primary Sahayak web application must provide a responsive multi-page layout:
1. **Header:** Clean top bar with Sahayak logo, primary navigation links (Home, Services, Schemes, Explain Screen, Extension, Help, Settings), language switcher, and accessibility quick-toggle.
2. **Home Page (`/`):**
   - Hero task query card: *"How can Sahayak help?"* with text input, prominent mic button, quick task pills.
   - Popular Maharashtra Services section (e.g., Income Certificate, Domicile Certificate, Ration Card).
   - Value proposition cards (Contextual understanding, official accuracy, accessibility).
   - Civic footer with official disclaimer and source attributions.
3. **Services (`/services` & `/services/:id`):**
   - Searchable, categorized catalog of verified Maharashtra public services.
   - Detail view with purpose, eligibility, document checklist, step-by-step roadmap, and official application button.
4. **Schemes (`/schemes` & `/schemes/:id`):**
   - Filterable catalog (Education, Agriculture, Social Welfare, Disability/Divyang).
   - Scannable scheme cards with verified benefits, criteria, and official portal links.
5. **Explain Screen (`/explain-screen`):**
   - Drag-and-drop upload zone, client-side validation, preview display, structured results panel, and civic terminology glossary.
6. **Extension Showcase (`/extension`):**
   - Installation guide, feature walkthrough, supported portals list, and Chrome Web Store / sideload link.
7. **Help & FAQ (`/help`):**
   - Frequently asked questions across services, payments, voice, safety, and language.
8. **Settings (`/settings`):**
   - Accessibility preferences, language defaults, privacy policy, and system diagnostics.

---

# 15. Browser Extension Requirements
*Source: docs/source-of-truth/ARCHITECTURE.md (Sections 26–30); UI.md (Sections 28, 29); SECURITY.md (Sections 10–15)*

- **Manifest Architecture:** Chrome Extension Manifest V3.
- **Side Panel (`sidepanel` API):** Primary UI surface ensuring persistent, non-intrusive guidance alongside target government websites.
- **Content Script:** Injected strictly into approved host patterns or tab contexts on demand; inspects visible labels and structural IDs; injects non-destructive CSS highlight classes.
- **Background Service Worker:** Coordinates tab lifecycle events, message passing between side panel and content script, and connects to the Sahayak backend.
- **Known vs. Unknown Portal Handling:**
  - *Known Portal:* Shows green indicator (🟢 *"Sahayak understands this page"*), activates deterministic form guides, highlights fields, guides sequentially.
  - *Unknown Portal:* Shows neutral indicator (⚪ *"Sahayak can explain this page using AI"*), offers general explanation fallback, strictly avoids automatic field assumptions.
- **Security Constraints:** The extension must never read password inputs, never inject keystrokes into payment or credential fields, and never auto-submit forms.

---

# 16. AI Assistant Requirements
*Source: docs/source-of-truth/ARCHITECTURE.md (Sections 31–34); DATA-CONTRACTS.md (Sections 20–25)*

- **Internal AI Provider Abstraction:** All AI calls go through a strictly typed `AIProvider` interface (`generateResponse(request)`, `explainImage(image)`).
- **Decoupled Architecture:** Presentation components must never import or know about specific LLM SDKs (e.g., Google Gen AI SDK).
- **Supported Providers:**
  1. `DemoProvider` (Default for local development and offline testing; returns deterministic mock responses).
  2. `GeminiProvider` (Production provider leveraging Gemini 1.5/2.0 multimodal models).
- **Server-Side API Key Isolation:** AI provider keys are held strictly in backend server environment variables (`AI_API_KEY`), never exposed to browser client bundles or extension scripts.
- **Structured Response Generation:** AI output must conform to `SahayakResponse`, containing typed slots for `intent`, `service`, `schemes`, `steps`, `screenExplanation`, and `officialSource`.

---

# 17. Deterministic Form Guidance
*Source: docs/source-of-truth/ARCHITECTURE.md (Sections 16–18); DATA-CONTRACTS.md (Sections 15–19)*

- Supported government forms must be modeled as verified `FormGuide` data structures containing `FormPage` arrays and `FormField` specifications.
- **Matching Strategies:** Matching pages and fields must use stable selectors verified against actual live pages:
  - Stable IDs, names, ARIA labels, or text anchors.
  - No synthetic or guessed selectors (e.g., `#name`, `#submit`).
- **Sequential Field Flow:** Provides plain-language explanations of what each field asks for, what documents are required to fill it, and what happens upon clicking next.
- **Final Action Principle:** Form guidance never clicks the submit button. The user always reviews and clicks submit independently.

---

# 18. Scheme Discovery
*Source: docs/source-of-truth/PRODUCT.md (Section 8.4); OFFICIAL-SOURCES.md (Sections 11, 12)*

- Citizens query schemes via natural language (e.g., *"Divyang financial assistance"* or *"मुलींच्या शिक्षणासाठी योजना"*).
- The system executes deterministic keyword, category, and eligibility filtering against the verified `schemes.json` database.
- AI simplifies, summarizes, and formats the output into understandable bullet points.
- Every scheme card links to the official government source (information URL) and, if officially verified, the official application route (application URL).
- If no verified scheme matches the query, Sahayak displays an honest empty state with links to official discovery portals ([myScheme](https://www.myscheme.gov.in/) or [India.gov.in](https://www.india.gov.in/)), refusing to fabricate schemes.

---

# 19. Explain Screen
*Source: docs/source-of-truth/PRODUCT.md (Section 8.5); ARCHITECTURE.md (Sections 21, 22); UI.md (Sections 24–26)*

- **Input Ingestion:** Accepts screenshot files via file chooser, drag-and-drop, or clipboard paste.
- **Strict Validation:** Supported formats: `image/png`, `image/jpeg`, `image/webp`. File size cap: **5 MB**. Unsupported or oversized files are rejected immediately with user-friendly notices.
- **Privacy Warning:** Prominently warns: *"Avoid uploading screenshots containing passwords, OTPs, PINs, or banking credentials."*
- **Multimodal AI Analysis:** Evaluates layout, identifies interactive elements (`field`, `button`, `heading`, `message`), explains confusing terminology, and suggests the immediate next logical action.
- **Glossary Integration:** Plain-language definitions for recurring bureaucratic words found on screens.

---

# 20. Accessibility
*Source: docs/source-of-truth/UI.md (Sections 44, 47); ARCHITECTURE.md (Section 23); SECURITY.md (Section 35)*

Accessibility is a non-negotiable core architecture foundation:
- **Text Scaling:** Normal (100%), Large (115%), Extra-Large (130%) without text clipping or layout destruction.
- **High-Contrast Mode:** Enhanced contrast ratio exceeding WCAG AAA standards for text readability against neutral backgrounds.
- **Reduced Motion:** Respects `prefers-reduced-motion` media query and explicit user setting, disabling non-essential transitions.
- **Keyboard Navigation:** Full tab navigation, logical DOM tab indexes, and high-visibility focus rings (`--focus: #00599F`).
- **Touch Target Sizing:** Minimum 44×44px interactive target areas on mobile and touch devices.
- **Semantic HTML:** Strict usage of `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<button>`, `<input>`, and ARIA landmarks.

---

# 21. Voice
*Source: docs/source-of-truth/PRODUCT.md (Section 8.2); ARCHITECTURE.md (Section 25); UI.md (Section 35)*

- **Web Speech API:** Leverages native browser `webkitSpeechRecognition` / `SpeechRecognition` for speech-to-text.
- **Multilingual Recognition:** Sets recognition language to `mr-IN` (Marathi), `hi-IN` (Hindi), or `en-IN` (English) matching active language state.
- **Speech Synthesis (TTS):** Browser `speechSynthesis` used to read explanations aloud in the selected language.
- **Graceful Voice Fallback:** If the browser or operating system lacks speech recognition or the user denies microphone permissions:
  - Microphone button displays "Voice unavailable".
  - Text input remains 100% functional.
  - The application never blocks or crashes.

---

# 22. Multilingual Requirements
*Source: docs/source-of-truth/PRODUCT.md (Section 4); DATA-CONTRACTS.md (Sections 3, 4); UI.md (Section 45)*

- **Language Triad:** Strictly English (`en`), Marathi (`mr`), Hindi (`hi`).
- **Deterministic UI Translations:** All static labels, placeholders, buttons, and navigation elements utilize typed `LocalizedText` dictionaries.
- **Devanagari Typography:** Font stack includes `Noto Sans Devanagari` to prevent broken conjuncts or clipping in Marathi and Hindi.
- **Text Expansion Accommodation:** Devanagari script strings are typically 20–35% longer than English equivalents. UI containers must dynamically expand without truncation or horizontal scrollbars.

---

# 23. Official Source Requirements
*Source: docs/source-of-truth/OFFICIAL-SOURCES.md (All Sections)*

- **Level 1 Authorities:** Maharashtra State Departments, Government of India Ministries.
- **Verified Portals:** Aaple Sarkar, MahaDBT, RCMS Maharashtra, National Scholarship Portal, UDID Swavlamban, PM-KISAN, ECI Voters Portal.
- **Source Separation:** Every service or scheme card must distinctly delineate:
  - *Sahayak Guidance:* Plain-language summary and checklist.
  - *Official Source:* Official authority name, verification date, and direct external link.
- **Separation of URLs:** `informationUrl` (rules, guidelines) is kept strictly separate from `applicationUrl` (actual citizen login/apply portal).
- **Prohibition on Generated URLs:** AI is strictly forbidden from synthesizing or predicting government URLs.

---

# 24. Trust & Safety
*Source: docs/source-of-truth/PRODUCT.md (Section 13); OFFICIAL-SOURCES.md (Section 14); SECURITY.md (Section 42)*

- **Mandatory Disclaimer Display:**
  > "Sahayak AI provides guidance and does not represent a government department. Requirements and procedures may change. Verify current information on the official service portal before submitting an application."
- **No Impersonation:** Sahayak never uses official government crests, Ashoka Lion emblems, fake ministerial seals, or misleading titles that imply official department status.
- **Independent Verification:** When official portals disagree or policies change, Sahayak openly states the ambiguity rather than asserting an ungrounded fact.

---

# 25. Security & Privacy
*Source: docs/source-of-truth/SECURITY.md (Sections 1–9, 23–29)*

- **Zero Secret Custody:** Under no circumstances does Sahayak ask for or store passwords, OTPs, UPI PINs, ATM PINs, CVVs, or biometric data.
- **Data Minimization:** Processes only ephemeral form labels and visible text necessary to guide the user. No long-term storage of user conversations or personal form entries.
- **Prompt Injection Defense:** Webpage text and screenshot OCR are treated as untrusted data inputs, never as system instructions.
- **Safe Logging:** Logs contain only diagnostic telemetry (`requestId`, `intent`, `latency`, `errorCode`). Full user messages, personal names, or identity numbers are never written to logs.

---

# 26. Payment Safety
*Source: docs/source-of-truth/PRODUCT.md (Section 15); SECURITY.md (Section 20); UI.md (Section 53)*

- Sahayak is **never** a financial payment intermediary.
- It never initiates, processes, or facilitates UPI transactions, debit card payments, or net-banking transfers.
- **Guidance-Only Stance:** Explains payment steps purely educationally (e.g., *"You will now be redirected to the official government treasury gateway (GRAS). Open your UPI app and authorize the exact fee of ₹33.60 using your PIN. Never enter your PIN inside Sahayak."*).
- Form guides on payment steps automatically pause automated field detection and remind the user to complete the step privately.

---

# 27. Error Handling & Fallback
*Source: docs/source-of-truth/ARCHITECTURE.md (Sections 35, 36); UI.md (Section 38)*

- **Graceful Degradation Layers:**
  1. *AI Offline:* Reverts to `DemoProvider` or deterministic keyword matching for verified services and schemes.
  2. *Speech Recognition Unavailable:* Silently degrades to text chat; displays informative tooltip.
  3. *Government Portal Unreachable:* Advises citizen that the government server is experiencing downtime and displays previous verification timestamp.
  4. *DOM Selector Mismatch:* Extension gracefully disengages field highlighting and alerts user: *"The form structure has changed; displaying general page guidance."*
- **Actionable Error Messages:** Errors clearly explain what happened and what the citizen should do, avoiding raw HTTP status codes or technical stack traces.

---

# 28. Non-Functional Requirements
*Source: docs/source-of-truth/ARCHITECTURE.md (Sections 2, 5)*

- **Modularity:** Core business logic, knowledge retrieval, and AI providers must reside in `core/`, completely decoupled from presentation components.
- **Maintainability:** 100% TypeScript typed contracts across all boundaries without `any` escapes.
- **Testability:** All intent detection, filtering, and contract validation functions must be unit testable in isolation.
- **Code Cleanliness:** Zero dead code, zero speculative dependencies, zero duplicate type definitions.

---

# 29. Performance
*Source: docs/source-of-truth/ARCHITECTURE.md (Section 54); UI.md (Section 55)*

- **Page Load:** Initial web application First Contentful Paint (FCP) < 1.5s on 4G broadband connections.
- **Lightweight Footprint:** Total web bundle size optimized with minimal external client libraries.
- **Image Compression:** Uploaded screenshots are pre-processed and validated client-side before transmission.
- **AI Latency:** Target assistant response latency < 2.5s for text; graceful loading indicators displayed during vision analysis.

---

# 30. Responsive Design
*Source: docs/source-of-truth/UI.md (Section 43)*

- **Desktop (1280px – 1440px):** Multi-column grid, max-width 1280px, generous whitespace, dual-pane view for Explain Screen and Services.
- **Tablet (768px – 1024px):** Adaptive 2-column layout with collapsable drawer navigation.
- **Mobile (320px – 480px):** Single-column layout, sticky bottom-accessible voice button, full-width touch-friendly cards, zero horizontal scrolling.

---

# 31. Browser Compatibility
*Source: docs/source-of-truth/UI.md (Section 43); ARCHITECTURE.md (Section 26)*

- **Web Application:** Compatible with modern Chromium browsers (Chrome, Edge, Brave), Safari, and Firefox.
- **Browser Extension:** Compatible with Chromium Manifest V3 browser engines (Chrome version 116+ supporting Side Panel API).
- **Speech Capabilities:** Optimally supported in Chromium browsers; gracefully falls back to text in browsers lacking SpeechRecognition.

---

# 32. Data Requirements
*Source: docs/source-of-truth/DATA-CONTRACTS.md (Sections 1–19, 44)*

- Static data files residing in `data/maharashtra/`:
  - `portals.json`: Verified Maharashtra government portals.
  - `services.json`: Canonical public services with localized metadata, document checklists, and task step lists.
  - `schemes.json`: Verified Maharashtra state and central schemes with eligibility criteria, benefits, and verified URLs.
  - `form-guides/*.json`: Deterministic form step definitions and field maps.
- Strict conformance to canonical schemas: `Service`, `Scheme`, `TaskStep`, `FormGuide`, `Portal`, `OfficialSource`.

---

# 33. AI Boundaries
*Source: docs/source-of-truth/ARCHITECTURE.md (Section 34); SECURITY.md (Section 25)*

- **What AI May Do:**
  - Parse natural language queries and map them to recognized intents.
  - Simplify complex legalistic or bureaucratic wording into 6th-grade reading level.
  - Translate guidance contextually between English, Marathi, and Hindi.
  - Analyze screenshots to describe visible form elements and explain error notices.
  - Offer conversational reassurance and general public-service navigation advice.
- **What AI Must NEVER Do:**
  - Invent government schemes, welfare benefits, quotas, or subsidies.
  - Synthesize official government URLs or department contact information.
  - Override verified deterministic form guidance.
  - Solicit or process authentication secrets.

---

# 34. Extension Permissions
*Source: docs/source-of-truth/ARCHITECTURE.md (Section 26); SECURITY.md (Section 31)*

The extension manifest must enforce strict least privilege:
- `sidePanel`: Required to render the contextual guidance sidebar.
- `activeTab`: Required to inspect the current active government webpage upon user invocation.
- `storage`: Required to store user accessibility preferences and language selection locally.
- `host_permissions`: Narrowly scoped strictly to verified government domains (`*.gov.in/*`, `*.nic.in/*`, `*.mahaonline.gov.in/*`, etc.).
- Prohibited: `<all_urls>`, `webRequest`, `cookies`, `debugger`.

---

# 35. Success Criteria
*Source: docs/source-of-truth/PRODUCT.md (Section 31)*

The Sahayak AI project is successful when:
1. A Marathi-speaking citizen can successfully ask for a service via voice, understand the requirements, and be guided to the exact official portal.
2. A user can upload an image of a complex government form and receive an accurate plain-language explanation of each field in their chosen language.
3. The browser extension correctly identifies a supported portal (MahaDBT / Aaple Sarkar) and highlights form fields in sequence.
4. 100% of outbound external links lead to authentic, verified `.gov.in` or official state portals.
5. Zero security breaches, zero client-exposed API keys, and zero requests for sensitive credentials.

---

# 36. Definition of Done
*Source: docs/source-of-truth/PRODUCT.md (Section 31); ARCHITECTURE.md (Section 60); SECURITY.md (Section 38)*

A development phase or feature is marked "Done" only when:
- TypeScript compilation passes with zero type errors (`tsc --noEmit`).
- Code adheres to design tokens and principles in [docs/source-of-truth/UI.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/UI.md).
- Canonical contracts in [docs/source-of-truth/DATA-CONTRACTS.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/DATA-CONTRACTS.md) are strictly reused without duplication.
- Unit and integration tests for the module are passing.
- Manual verification across English, Marathi, and Hindi confirms zero text clipping.
- Accessibility audit confirms keyboard navigation, focus indicators, and screen-reader semantics.
- Security audit verifies no client-side secret exposure and no credential capture.
- `docs/PROJECT_STATE.md` and phase changelogs are updated to reflect the new state.

---

# 37. Future Scope (Post-MVP)
*Source: docs/source-of-truth/PRODUCT.md (Section 27)*

The following capabilities are reserved for future major releases:
- Expansion to other Indian states (e.g., Karnataka, Gujarat, Tamil Nadu) with additional regional languages.
- Automated document readiness verification via client-side OCR (checking if an Aadhaar card or income slip is legible before visiting the portal).
- Integration with DigiLocker API for user-consented document sharing directly to official portals.
- Community volunteer assistance mode for remote human-in-the-loop elder care.
- WhatsApp / Telegram bot integration for low-bandwidth rural access.

---

# 38. Traceability to Source-of-Truth
*Source: All docs/source-of-truth/ files*

Every requirement in this PRD traces directly back to the frozen source-of-truth documents.

| PRD Section | Major Subject Area | Authoritative Source-of-Truth Document |
|---|---|---|
| Sections 1–5 | Product Overview, Vision, Positioning, USP | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md) |
| Sections 6–8 | Target Users, Problems & Goals | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md) |
| Sections 9–11 | Product Principles, MVP Scope & Out-of-Scope | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md) |
| Section 12 | Core User Journeys | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md), [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md) |
| Section 13 | Feature Requirements | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md) |
| Section 14 | Website Requirements | [UI.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/UI.md), [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md) |
| Section 15 | Browser Extension Requirements | [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md), [SECURITY.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/SECURITY.md) |
| Section 16 | AI Assistant Requirements | [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md), [DATA-CONTRACTS.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/DATA-CONTRACTS.md) |
| Section 17 | Deterministic Form Guidance | [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md), [DATA-CONTRACTS.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/DATA-CONTRACTS.md) |
| Section 18 | Scheme Discovery | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md), [OFFICIAL-SOURCES.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/OFFICIAL-SOURCES.md) |
| Section 19 | Explain Screen | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md), [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md) |
| Section 20 | Accessibility | [UI.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/UI.md), [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md) |
| Section 21 | Voice Architecture | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md), [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md) |
| Section 22 | Multilingual Requirements | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md), [DATA-CONTRACTS.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/DATA-CONTRACTS.md), [UI.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/UI.md) |
| Section 23 | Official Sources & URL Policy | [OFFICIAL-SOURCES.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/OFFICIAL-SOURCES.md) |
| Section 24 | Trust & Safety | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md), [OFFICIAL-SOURCES.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/OFFICIAL-SOURCES.md) |
| Section 25 | Security & Privacy | [SECURITY.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/SECURITY.md) |
| Section 26 | Payment Safety | [SECURITY.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/SECURITY.md), [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md) |
| Section 27 | Error Handling & Fallback | [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md), [UI.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/UI.md) |
| Sections 28–31 | Non-Functional, Performance, Responsive, Browser | [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md), [UI.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/UI.md) |
| Section 32 | Data Requirements & Contracts | [DATA-CONTRACTS.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/DATA-CONTRACTS.md) |
| Section 33 | AI Boundaries & Prohibitions | [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md), [SECURITY.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/SECURITY.md) |
| Section 34 | Extension Permissions | [SECURITY.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/SECURITY.md), [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md) |
| Sections 35–37 | Success Criteria, DoD, Future Scope | [PRODUCT.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/PRODUCT.md), [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md) |
