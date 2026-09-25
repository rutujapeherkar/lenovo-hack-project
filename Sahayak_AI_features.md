# Sahayak AI — Features Specification

## 1. Product Overview

**Sahayak AI** is a Maharashtra-focused digital accessibility and public-service assistance platform designed to make digital services easier to understand and use.

### Core Focus

- **Region:** Maharashtra only
- **Languages:** English, Marathi, Hindi
- **Primary Users:** Citizens who face difficulty understanding or navigating digital public services, including senior citizens, first-time digital-service users, regional-language users, and people with accessibility needs.
- **Primary Experience:** A simple web dashboard with voice/text interaction, service guidance, screen explanation, accessibility settings, and browser-extension support.
- **Core Principle:** Sahayak helps users understand and navigate existing digital services; it does not replace official portals.

## 2. Dashboard / Home Page

The home page provides a simple chatbot-style interface.

### Features

- Conversational chatbot interface
- Text input
- Microphone button
- Voice-to-text conversion
- English, Marathi, and Hindi
- User query/intent understanding
- Suggested actions
- Read-aloud support
- Accessible large controls

### Voice Query Flow

```text
User speaks
      ↓
Speech-to-Text
      ↓
User reviews / sends query
      ↓
Sahayak understands intent
      ↓
Relevant Maharashtra scheme/service
      ↓
Simple information and guidance
```

## 3. Scheme Discovery

When a user asks about a government scheme, Sahayak presents a dedicated static scheme-information page.

### Scheme Information

- Scheme name
- Simple description
- Purpose
- Eligibility criteria
- Benefits
- Required documents
- Application information
- FAQs where applicable
- Official source
- Verification/last-updated information where available
- Language switcher

### Official Application

Every supported scheme should provide an **Apply on Official Website** button that redirects the user to the official application/service portal.

## 4. Services Section

A dedicated **Services** tab provides structured guidance for Maharashtra digital services.

### Initial Services

- Income Certificate
- Domicile/Residence-related services
- Scholarship-related services
- Other selected Maharashtra citizen services after verification

### Service Features

- What the service is
- Who needs it
- Why it is required
- Required documents
- Basic requirements
- Step-by-step process
- Form guidance
- Application instructions
- Official portal link
- Related services/schemes
- Multilingual guidance
- Read-aloud support

## 5. Step-by-Step Service/Form Guidance

For known services and forms, Sahayak uses predefined verified guidance.

```text
Understand service
      ↓
Check requirements
      ↓
Prepare documents
      ↓
Fill form
      ↓
Review
      ↓
Submit on official portal
```

### Features

- Current-step indicator
- Previous/Next navigation
- Required-document checklist
- Simple field instructions
- Difficult-term explanations
- Multilingual instructions
- Official source link
- Known-form guidance without AI inventing requirements

## 6. Explain Screen

The **Explain Screen** feature helps users understand confusing digital forms, pages, fields, buttons, and terminology.

### Input Options

- Upload screenshot
- Upload image
- Capture a screen/image where supported

### It Can Explain

- What the page is about
- What the user should do
- Field meanings
- Labels and buttons
- Unfamiliar terminology
- Glossary terms
- Identifiable required fields
- Next action
- Important visible instructions/warnings

### Flow

```text
Upload / Capture
      ↓
Screen Analysis
      ↓
Page Purpose
      ↓
Field Explanations
      ↓
Glossary
      ↓
Next-Step Guidance
```

## 7. Glossary / Simple Language

Government websites often use formal terminology. Sahayak converts difficult terminology into simple language.

### Features

- Simple definitions
- Field-by-field explanations
- Government terminology glossary
- English explanations
- Marathi explanations
- Hindi explanations
- Context-aware definitions

## 8. Browser Extension

Sahayak provides a browser extension that works alongside supported government/service websites.

### Extension Page

The website provides:

- Extension overview
- Where it can be used
- Why it is useful
- How it works
- Download/Install Extension button
- Simple usage instructions
- Supported languages
- Accessibility information
- Privacy/safety information

### Extension Usage

```text
Install extension
      ↓
Open supported Maharashtra government website
      ↓
Click Sahayak icon
      ↓
Open side panel
      ↓
Choose:
• Explain this page
• What should I do next?
• Help me fill this form
      ↓
Follow Sahayak guidance
```

### Extension Capabilities

- Current-page understanding
- Page explanation
- Selected-text explanation
- Next-step guidance
- Supported form guidance
- Field highlighting for known forms
- Multilingual assistance
- Read-aloud
- Accessibility controls

### Context-Aware Behaviour

**Known page/form:** deterministic form guide.

**Unknown page:** AI-based page explanation.

> **Known forms are guided deterministically. Unknown pages are explained by AI.**

## 9. Multilingual Support

The MVP supports exactly three languages:

| Language | Code |
|---|---|
| English | `en` |
| Marathi | `mr` |
| Hindi | `hi` |

### Features

- Language selector
- Localized navigation
- Localized buttons
- Localized scheme information
- Localized service information
- Localized explanations
- Voice input where browser support is available
- Read-aloud where available

## 10. Accessibility Features

Accessibility is a core part of the system.

### Accessibility Controls

- Adjustable font size
- Text scaling
- High-contrast/background options
- Read-aloud
- Voice input
- Large, clear buttons
- Keyboard navigation
- Reduced visual complexity
- Accessible labels and controls

### Assisted Experience

The interface should prioritize:

- Large clickable areas
- Simple wording
- Short instructions
- Clear navigation
- Visible progress
- Minimal unnecessary information
- Voice interaction
- Read-aloud responses

## 11. Settings

The dashboard includes a **Settings** section.

### Appearance

- Font size
- Text scaling
- Background/contrast preferences
- Display preferences

### Language

- English
- Marathi
- Hindi

### Voice

- Microphone preference
- Read-aloud preference
- Voice permissions

### Accessibility

- High contrast
- Large text
- Keyboard/accessibility preferences

### Permissions

- Microphone permission
- Browser extension permissions
- Clear explanation of why each permission is required

## 12. Help Section

The Help section assists users who are unfamiliar with Sahayak.

### Features

- How to use Sahayak
- How to ask a question
- How to use the microphone
- How to find a scheme
- How to use Services
- How to explain a screenshot
- How to use the browser extension
- How to change language
- How to change accessibility settings
- FAQs
- Troubleshooting

## 13. Dashboard Navigation

```text
Sahayak AI
├── Home
│   └── Voice / Text Chatbot
├── Schemes
│   └── Maharashtra Scheme Discovery
├── Services
│   └── Service Guidance
├── Explain Screen
│   └── Upload / Capture Screenshot
├── Extension
│   └── Download + How to Use
├── Help
│   └── User Assistance
└── Settings
    ├── Language
    ├── Font Size
    ├── Background / Contrast
    ├── Voice
    └── Permissions
```

## 14. User Journeys

### Journey A — Voice Query → Scheme

```text
Open Sahayak
      ↓
Click microphone
      ↓
Speak in Marathi / Hindi / English
      ↓
Speech → Text
      ↓
Confirm / Send
      ↓
Understand request
      ↓
Identify relevant Maharashtra scheme
      ↓
Scheme information page
      ↓
Eligibility + Benefits + Documents
      ↓
Apply on Official Website
```

### Journey B — Service Guidance

```text
Open Services
      ↓
Select Income Certificate
      ↓
Understand service
      ↓
Check requirements
      ↓
View required documents
      ↓
Follow step-by-step process
      ↓
Open official portal
```

### Journey C — Explain Screen

```text
Open Explain Screen
      ↓
Upload / Capture Screenshot
      ↓
Sahayak analyses screen
      ↓
Page purpose explained
      ↓
Fields explained
      ↓
Glossary provided
      ↓
Next action suggested
```

### Journey D — Browser Extension

```text
Install Sahayak Extension
      ↓
Open supported Maharashtra website
      ↓
Click Sahayak extension
      ↓
Open side panel
      ↓
Explain Page / Next Step / Form Help
      ↓
Receive contextual guidance
      ↓
Continue on official website
```

## 15. Official Source & Trust

For supported schemes/services, provide:

- Official source name
- Official website link
- Apply button
- Verification/last-updated information where available
- Clear separation between Sahayak guidance and official information

### Trust Notice

> **Sahayak AI provides guidance and does not represent a government department.**

> **Requirements and procedures may change. Verify current information on the official service portal before submitting an application.**

## 16. Privacy & Safety

The system must not ask users to share:

- OTP
- UPI PIN
- Passwords
- Bank credentials
- Card PIN
- Other private authentication credentials

For screenshots/page explanations:

- Process only information needed for the requested explanation
- Avoid unnecessary screenshot storage
- Do not permanently store sensitive page content
- Clearly communicate relevant permissions

## 17. AI vs Verified Data

### Verified / Static Data

Used for:

- Scheme information
- Eligibility
- Benefits
- Documents
- Official links
- Supported services
- Known form fields
- Deterministic form transitions

### AI

Used for:

- Natural-language understanding
- Explaining complex text
- Explaining screenshots/pages
- Simplifying terminology
- Conversational/contextual guidance

> **AI explains. Verified data decides what official information is presented.**

AI should not invent scheme names, eligibility criteria, official requirements, or application links.

## 18. Fallback Behaviour

If an external AI service is unavailable, supported static information should remain usable.

### AI Available

```text
User Query
      ↓
AI + Verified Data
      ↓
Personalized Explanation
```

### AI Unavailable

```text
User Query
      ↓
Verified Static Data
      ↓
Predefined Guidance
      ↓
Official Website
```

## 19. Feature Priority

### P0 — Core MVP

- Home chatbot
- Voice-to-text
- English/Marathi/Hindi
- Maharashtra-only scheme discovery
- Scheme information page
- Eligibility, benefits, documents
- Official website redirection
- Services section
- Step-by-step service guidance
- Explain Screen
- Screenshot/image upload
- Basic accessibility controls
- Extension download/instructions page

### P1 — Supporting

- Browser extension integration
- Context-aware page explanation
- Known-form guidance
- Field highlighting
- Read-aloud
- Glossary
- Help
- Settings
- High contrast
- Larger text
- Keyboard accessibility
- AI fallback

### P2 — Future Enhancements

- More Maharashtra services
- More verified schemes
- More detailed form guides
- Additional accessibility capabilities
- More advanced browser interaction
- Live verified government-data integrations
- Practical offline/local AI capabilities

## 20. MVP Success Criteria

A user should be able to:

1. Ask a question by voice or text in English, Marathi, or Hindi.
2. Identify the relevant Maharashtra scheme/service.
3. Read simple information about it.
4. Follow supported service/form steps.
5. Upload a screenshot and understand its fields and terminology.
6. Open the official website to continue the application.
7. Use accessibility settings such as larger text, contrast, and voice/read-aloud.
8. Install and use the extension on supported Maharashtra digital-service websites.

## Core Product Statement

> **Sahayak AI makes Maharashtra's digital services easier to understand, navigate, and use through voice, multilingual guidance, accessibility features, screen explanation, service assistance, and browser-based contextual help.**

### Core USP

> **Existing digital services provide access. Sahayak provides understanding.**

### Product Principle

> **We don't replace digital services. We make them usable.**
