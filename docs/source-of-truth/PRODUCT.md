# Sahayak AI — Product Specification

> **Version:** 1.0  
> **Status:** Frozen for MVP  
> **Product:** Sahayak AI  
> **Tagline:** Making digital services usable for everyone.

---

# 1. Product Identity

## 1.1 Product Name

Sahayak AI

## 1.2 Tagline

Making digital services usable for everyone.

## 1.3 One-Line Description

Sahayak AI is an AI-powered accessibility and task-navigation assistant that helps citizens understand and use digital public services through simple, multilingual, and guided interactions.

## 1.4 Core Product Statement

> We don't replace digital services. We make them usable.

## 1.5 Core Problem

Digital public services may be available online, but availability does not guarantee usability.

Citizens can face difficulties because of:

- Complex government terminology
- Multi-step application processes
- Unfamiliar website interfaces
- Language barriers
- Low digital literacy
- Accessibility barriers
- Difficulty understanding form fields
- Difficulty finding relevant schemes
- Confusion during digital payment processes
- Lack of confidence while completing online applications

Sahayak AI addresses these usability barriers without replacing the underlying government service.

---

# 2. Target Users

Sahayak AI primarily targets:

1. Senior citizens
2. First-time digital-service users
3. Citizens who prefer Marathi
4. Citizens who prefer Hindi
5. Citizens who need accessibility assistance
6. Citizens who need help understanding government forms
7. Citizens who need help navigating digital public services

---

# 3. MVP Geographic Scope

## State

Maharashtra, India.

The MVP is Maharashtra-focused.

Do not expand the MVP to other Indian states unless explicitly approved.

---

# 4. MVP Language Scope

Sahayak AI supports exactly three languages in the MVP:

- English (`en`)
- Marathi (`mr`)
- Hindi (`hi`)

The language system must use these identifiers consistently.

Do not introduce additional languages into the MVP without an explicit product decision.

---

# 5. Product Positioning

Sahayak AI is:

- An accessibility layer
- A task-navigation assistant
- A contextual explanation layer
- A multilingual public-service assistant
- A guided interaction layer over existing digital services

Sahayak AI is NOT:

- A replacement for government portals
- A government department
- A government application portal
- A generic chatbot
- A generic AI search engine
- A payment service
- A system that automatically submits government applications

---

# 6. Core USP

## Primary USP

> Digital public services provide access. Sahayak provides understanding.

## Product Differentiation

Sahayak AI understands the user's current task and provides contextual assistance.

The product transforms:

```text
User intent
    ↓
Service understanding
    ↓
Task planning
    ↓
Accessible guidance
    ↓
User action on the official service
```

---

# 7. Core User Questions

The product should help users answer three fundamental questions:

### 1. What is this?

Explain the current page, service, field, or terminology.

### 2. What should I do?

Identify the next useful action or task.

### 3. What happens next?

Explain the next step in the process.

---

# 8. Core Product Capabilities

The MVP consists of the following capabilities.

## 8.1 Natural-Language Service Discovery

Users can describe what they want in natural language.

Example:

> "I need an income certificate."

or:

> "मला उत्पन्न प्रमाणपत्र काढायचे आहे."

Sahayak identifies the relevant service and provides structured guidance.

---

## 8.2 Voice-First Interaction

The home interface provides a microphone-based interaction.

Basic flow:

```text
User
    ↓
Microphone
    ↓
Speech-to-text
    ↓
Sahayak assistant
    ↓
Structured response
    ↓
Text and/or speech response
```

Voice is an accessibility mechanism and should not be treated as a separate chatbot.

---

## 8.3 Service Guidance

For supported services, Sahayak provides deterministic step-by-step guidance.

Example:

```text
Income Certificate

1. Applicant Details
2. Personal Details
3. Address
4. Income Details
5. Documents
6. Review
7. Submit
```

Known workflows must use verified service definitions rather than allowing the AI to invent the workflow.

---

## 8.4 Scheme Finder

Users can ask about government schemes.

Example:

> "What schemes are available for students?"

Sahayak should:

1. Understand the user's requirement
2. Search the verified scheme registry
3. Filter relevant schemes
4. Explain the verified information simply
5. Show eligibility
6. Show benefits
7. Show required documents
8. Provide the verified official source/application route

AI may simplify or explain verified information.

AI must not invent scheme information or official URLs.

---

## 8.5 Explain Screen

Users can provide a screenshot or screen image.

Sahayak explains:

- Fields
- Labels
- Terminology
- Instructions
- Required information
- Visible buttons
- Relevant page sections

The explanation should be available in the selected language.

---

## 8.6 Browser Extension

Sahayak includes a browser extension that provides contextual assistance while the user is on supported websites.

The extension can:

- Detect the current supported portal
- Identify supported forms/pages
- Explain the current page
- Explain fields
- Guide the user through known forms
- Provide multilingual assistance
- Highlight the relevant field
- Explain what to do next

---

# 9. Known vs Unknown Page Behavior

This is a fundamental product rule.

## Known Page

If Sahayak recognizes a supported portal, form, or service:

```text
Current page
    ↓
Page detection
    ↓
Known form/service
    ↓
Deterministic guidance
    ↓
Accessible explanation
```

The guidance should come from verified configuration/data.

AI may explain the guidance but should not replace the deterministic workflow.

---

## Unknown Page

If the page is not part of the supported deterministic registry:

```text
Current page
    ↓
Page detection
    ↓
Unknown page
    ↓
AI explanation fallback
    ↓
Accessible explanation
```

The system must clearly distinguish AI-generated explanations from verified deterministic guidance.

---

# 10. Product Architecture Principle

Sahayak AI follows this high-level principle:

> Verified data and deterministic workflows control factual public-service guidance. AI provides natural-language understanding, explanation, and fallback assistance.

Therefore:

### Deterministic

- Supported service workflows
- Supported form steps
- Official URLs
- Scheme records
- Required documents where verified
- Language UI translations
- Safety rules

### AI-assisted

- Natural-language understanding
- Intent detection
- Query interpretation
- Explanation
- Screen explanation
- Simplification
- Unknown-page assistance
- Conversational interaction

---

# 11. Official Information Principle

Sahayak AI must distinguish between:

### Sahayak Guidance

Information generated or presented by Sahayak to help the user understand a task.

### Official Source

The government website or officially verified source containing the authoritative service information.

The interface should make this distinction visible.

Example:

```text
Sahayak guidance

Official source
Government of Maharashtra
[View official website]
```

---

# 12. Official URL Rule

Sahayak AI must never allow an AI model to invent an official government URL.

Official URLs must come from verified structured data.

Each supported service or scheme should maintain its official source information.

Example:

```ts
type OfficialSource = {
  name: string;
  url: string;
  lastVerified?: string;
};
```

Where applicable, information and application URLs should be stored separately.

---

# 13. Trust & Safety

Sahayak AI provides guidance.

It does not represent a government department.

The product must display an appropriate disclaimer such as:

> Sahayak AI provides guidance and does not represent a government department.

And:

> Requirements and procedures may change. Verify current information on the official service portal before submitting an application.

---

# 14. Sensitive Information Rule

Sahayak AI must never request or store unnecessary sensitive authentication information.

The product must never request:

- OTP
- UPI PIN
- ATM PIN
- Passwords
- CVV
- Bank credentials
- Payment authentication secrets

Sahayak may explain how a user can complete a payment or authentication step, but the user must perform the sensitive action themselves.

---

# 15. Payment Guidance

Payment assistance is educational and navigational.

Example:

> Open your UPI application and complete the payment using your own credentials.

Sahayak must not:

- Ask for a UPI PIN
- Ask for an OTP
- Perform a payment
- Automatically submit a payment
- Store payment credentials

---

# 16. Accessibility Goals

Accessibility is a core product requirement, not an optional enhancement.

The MVP should support:

- Large text
- High contrast
- Keyboard navigation
- Clear focus states
- Accessible labels
- Screen-reader-friendly controls
- Read-aloud assistance
- Voice interaction
- Simple language
- Multilingual interaction
- Reduced visual complexity

---

# 17. Accessibility Design Principle

The interface should minimize cognitive load.

Information should generally follow:

```text
Complex government information
        ↓
Simple explanation
        ↓
Current action
        ↓
Next action
```

Avoid presenting unnecessary technical or bureaucratic terminology.

---

# 18. Primary Website Experience

The main website/dashboard contains:

1. Home
2. Services
3. Schemes
4. Explain Screen
5. Extension
6. Help
7. Settings

---

# 19. Home Experience

The home page is centered around the user's task.

Primary interaction:

> "How can I help you?"

with:

- Text input
- Microphone interaction
- Language selection
- Suggested tasks

Example:

> "I need an income certificate."

Sahayak should identify the relevant service and present a structured service explanation.

Where an official application route exists, the user can be directed to the official website.

---

# 20. Services Experience

The Services section contains supported public services.

Each service should provide:

- Service name
- Simple description
- Eligibility information where verified
- Required documents
- Step-by-step guidance
- Official source
- Application route where verified

---

# 21. Schemes Experience

The Schemes section provides access to verified scheme information.

A scheme result should include, where available:

- Scheme name
- Category
- Eligibility
- Benefits
- Required documents
- Official source
- Application route
- Verification date/status

---

# 22. Explain Screen Experience

The Explain Screen feature allows users to:

- Upload a screenshot
- Provide a screen image
- Ask what a field means
- Ask what they should do on the screen

The feature should provide simple explanations and identify visible interface elements where possible.

---

# 23. Extension Experience

The extension should provide a contextual side panel.

Example:

```text
Sahayak

You're on:
MahaDBT
Maharashtra

How can I help?

[ Explain this page ]

[ What should I do next? ]

[ Help me fill this form ]

[ Required documents ]

Marathi | हिंदी | English
```

The extension should prioritize contextual actions over a generic chatbot interface.

---

# 24. Supported Extension Behavior

For a recognized supported page:

> Sahayak understands this page.

For an unrecognized page:

> Sahayak can explain this page using AI.

This distinction must be visible to the user.

---

# 25. Form Guidance Principle

Sahayak should never automatically submit a government form.

For known forms, Sahayak can:

- Identify the current field
- Highlight the field
- Explain the field
- Tell the user what type of information is required
- Show the next step
- Show required documents
- Allow previous/next navigation

The user remains responsible for entering and submitting information.

---

# 26. MVP Scope

The MVP includes:

- Maharashtra-focused services
- English
- Marathi
- Hindi
- Natural-language interaction
- Voice interaction
- Service discovery
- Deterministic service guidance
- Verified scheme information
- Explain Screen
- Browser extension
- Accessibility controls
- Official source links
- AI fallback for unknown pages
- Trust and safety controls

---

# 27. Explicitly Out of Scope for MVP

The following are not part of the MVP unless explicitly approved:

- All Indian states
- Every possible government service
- Every possible government scheme
- Automatic government form submission
- Automatic payment
- Automatic UPI transactions
- Collection of OTP/PIN/passwords
- Fully autonomous browser control
- AI-generated official URLs
- AI-generated unverified government scheme records
- Local 7B+ LLM deployment
- Large offline speech models
- Replacing government portals

---

# 28. MVP Reliability Principle

The product should prefer:

```text
Smaller verified scope
        over
Larger unreliable scope
```

A service should only be presented as a deterministic supported workflow when its information and workflow have been verified.

Unknown services should use the appropriate fallback behavior rather than fabricated information.

---

# 29. Product Quality Principles

Every implementation should prioritize:

1. Correctness
2. Trust
3. Accessibility
4. Simplicity
5. Modularity
6. Clear source attribution
7. Graceful failure
8. Multilingual usability
9. Human control
10. Maintainability

---

# 30. Product Non-Negotiables

The following rules must not be silently changed by implementation agents:

1. Sahayak is not a government portal.
2. Sahayak does not replace government services.
3. Sahayak does not automatically submit forms.
4. Sahayak does not perform payments.
5. Sahayak does not request OTPs, PINs, passwords, or bank credentials.
6. AI must not invent official URLs.
7. AI must not invent verified government scheme information.
8. Known workflows should use deterministic guidance.
9. Unknown pages may use AI explanation fallback.
10. MVP language scope is English, Marathi, and Hindi.
11. MVP geographic scope is Maharashtra.
12. Official sources must remain clearly distinguishable from Sahayak guidance.
13. Accessibility is a core requirement.
14. Existing functionality must not be removed when implementing a new feature.
15. Product requirements must not be changed silently.

---

# 31. Definition of the MVP

Sahayak AI MVP is complete when a citizen can:

1. Ask what they need in natural language or voice.
2. Receive an understandable explanation.
3. Discover a supported Maharashtra public service or scheme.
4. Understand eligibility, benefits, documents, and steps where verified.
5. Navigate a supported service through deterministic guidance.
6. Use the assistance in English, Marathi, or Hindi.
7. Ask Sahayak to explain a screen or form.
8. Use Sahayak through the browser extension on supported pages.
9. Receive AI assistance on unknown pages without the system pretending that the information is verified.
10. Access the official source before taking the final action.

---

# 32. Final Product Principle

> Sahayak AI does not replace digital public services.

> It makes existing digital services understandable, accessible, and easier to use.

The system should always preserve the user's control over the final action.
