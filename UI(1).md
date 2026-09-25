# Sahayak AI — UI Design Specification

## 0. Purpose

This document is the **visual and interaction source of truth** for the Sahayak AI web application.

Sahayak should take **visual inspiration from the provided UMANG screenshots and the official UMANG website**:

https://web.umang.gov.in/landing/

The goal is **NOT to clone UMANG**.

The goal is to learn from the visual language that makes a government-service platform feel:

- trustworthy
- official
- accessible
- structured
- easy to navigate
- human-designed
- information-rich without looking cluttered

Sahayak must have its **own identity, content, illustrations, icons, copy, layout decisions and component styling**.

> **Design direction: UMANG-inspired visual system + Sahayak-specific UX.**

---

# 1. Source References

The following screenshots are the visual references supplied for this project.

![UMANG Home Hero](./ui-references/umang/umang-home-hero.png)

![UMANG What's New and Popular Services](./ui-references/umang/umang-whats-new-popular.png)

![UMANG Services by State](./ui-references/umang/umang-services-by-state.png)

![UMANG Benefits](./ui-references/umang/umang-benefits.png)

![UMANG Categories and Help](./ui-references/umang/umang-categories-help.png)

![UMANG Footer and Access](./ui-references/umang/umang-footer-access.png)

![UMANG Login and Language Selector](./ui-references/umang/umang-login-language.png)

The live UMANG website currently presents government services/schemes through navigation such as Home, Services, Schemes, DigiLocker, Dashboard and Jobs, and emphasizes government-service discovery, categories, state services and multiple accessibility/access channels. citeturn0search0

---

# 2. Design Philosophy

## Primary principle

**Do not make the website look AI-generated.**

The UI should look like a carefully designed civic-tech product created by a human product/design team.

Avoid:

- excessive gradients
- excessive glassmorphism
- neon AI colours
- glowing borders everywhere
- random floating blobs
- excessive rounded cards
- generic "AI dashboard" templates
- huge chatbot occupying the entire screen
- unnecessary animations
- overly decorative 3D illustrations
- excessive emojis
- every section looking like a card
- generic SaaS landing-page patterns

Prefer:

- strong visual hierarchy
- white space
- restrained colour usage
- clear blue primary actions
- simple cards
- subtle borders
- meaningful icons
- human-readable typography
- consistent spacing
- real content
- deliberate component hierarchy
- accessibility-first interaction

---

# 3. UMANG Visual Principles to Borrow

From the supplied references, preserve these **principles**, not the exact design.

### 3.1 Government-service visual language

Use a strong blue as the primary interface colour.

Blue should communicate:

- trust
- government/public-service context
- stability
- clarity

### 3.2 White information surfaces

The majority of the application should use:

- white backgrounds
- light neutral sections
- subtle borders
- restrained shadows

### 3.3 Strong section headings

Sections should use clear, bold headings rather than decorative labels.

Example:

```text
Popular Services

Find commonly used Maharashtra digital services.
```

### 3.4 Card-based information discovery

Use cards for:

- schemes
- services
- categories
- accessibility tools
- extension features

But **do not put every piece of UI inside a card**.

### 3.5 Clear primary actions

Primary buttons should use the Sahayak blue.

Examples:

```text
Ask Sahayak
Apply on Official Portal
Explain Screen
Open Service
Install Extension
Continue
```

### 3.6 Government-source visibility

Official information should be visually distinct from Sahayak-generated explanation.

---

# 4. Sahayak Colour Palette

The palette is inspired by the blue/white/neutral visual language visible in the supplied UMANG screenshots.

The sampled screenshots contain a strong blue close to **RGB 0, 89, 159**, a deeper navy/blue used in dark sections, pale blue backgrounds, white surfaces and neutral greys.

## Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `--sahayak-blue` | `#00599F` | Primary brand/action colour |
| `--sahayak-blue-dark` | `#003C6D` | Dark hero sections, footer, strong emphasis |
| `--sahayak-blue-deep` | `#002048` | Very dark navy for selected/high-contrast areas |
| `--sahayak-blue-light` | `#E7EEF5` | Light blue cards/section backgrounds |
| `--sahayak-blue-pale` | `#DBEFFD` | Accessibility/info backgrounds |
| `--surface` | `#FFFFFF` | Main surfaces |
| `--surface-soft` | `#F8FAFC` | Secondary page backgrounds |
| `--border` | `#D9E2EC` | Borders/dividers |
| `--text-primary` | `#1F2937` | Main text |
| `--text-secondary` | `#5B6573` | Supporting text |
| `--text-muted` | `#6B7280` | Metadata/helper text |
| `--success` | `#16803C` | Verified/success |
| `--warning` | `#B7791F` | Warning |
| `--error` | `#C53030` | Errors |
| `--focus` | `#00599F` | Keyboard focus |

### Important colour rule

Do **not** use every colour at the same time.

Recommended ratio:

```text
70%  White / neutral
20%  Light blue / soft surfaces
8%   Primary blue
2%   Accent/status colours
```

The blue should be a **controlled accent**, not a full-page background everywhere.

---

# 5. Colour Usage Rules

## Primary Blue

Use `#00599F` for:

- primary buttons
- active navigation
- links
- microphone button
- selected tabs
- progress indicators
- important icons
- official action buttons

## Dark Blue

Use `#003C6D` for:

- hero sections
- footer
- extension feature banner
- high-level information sections

## Light Blue

Use `#E7EEF5` for:

- information cards
- contextual panels
- selected backgrounds
- accessibility explanations

## White

Use white for:

- cards
- chatbot area
- forms
- scheme information
- service details
- navigation

---

# 6. Typography

The interface should prioritize readability over visual novelty.

## Font

Preferred:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

For Marathi/Hindi text, use a Unicode-capable font stack:

```css
font-family:
  Inter,
  "Noto Sans Devanagari",
  "Noto Sans",
  system-ui,
  sans-serif;
```

## Typography Scale

```text
Display:      40–48px
Page title:   32–40px
Section title: 24–30px
Card title:   18–22px
Body:         16px
Small:        14px
Caption:      12–13px
```

Default body text should be **16px or larger**.

Do not use tiny text for important instructions.

---

# 7. Border Radius

Use restrained rounding.

```text
Large containers: 16px
Cards:            12px
Buttons:          8px
Inputs:           8px
Chips:            999px
```

Avoid making every component extremely rounded.

---

# 8. Shadows

Use subtle shadows only.

Preferred:

```css
box-shadow:
  0 2px 10px rgba(0, 60, 109, 0.08);
```

Avoid:

- large floating shadows
- glowing shadows
- colourful shadows

---

# 9. Spacing System

Use an 8px base spacing system.

```text
4px   micro
8px   xs
16px  sm
24px  md
32px  lg
48px  xl
64px  2xl
80px  section
```

Maintain generous whitespace.

---

# 10. Header

The header should be inspired by UMANG's clean government-service navigation but redesigned for Sahayak.

## Desktop

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Sahayak AI     Home   Schemes   Services   Explain   Extension     │
│                Help   Settings                         EN ▾  🎙     │
└─────────────────────────────────────────────────────────────────────┘
```

### Header rules

- White background
- Thin bottom border
- Sahayak logo/wordmark on left
- Simple navigation
- Language selector on right
- Accessibility control visible
- No excessive icons
- Sticky header on desktop if useful

---

# 11. Home Page

The Home page is the most important screen.

It should immediately communicate:

> **Tell Sahayak what you need.**

Do NOT make it look like a generic AI chat application.

## Hero

```text
Helping you use Maharashtra's digital services

Ask in English, मराठी or हिंदी.
Sahayak explains what you need and guides you to the official service.

┌──────────────────────────────────────────────────────┐
│ What do you need help with?                         │
│                                                      │
│ "मला उत्पन्न प्रमाणपत्र काढायचे आहे..."             │
│                                                      │
│                                   🎙  Send           │
└──────────────────────────────────────────────────────┘
```

### Microphone interaction

The microphone should be visually prominent.

States:

```text
Idle
🎙 Speak

Listening
🔴 Listening...

Processing
○ Understanding...

Result
Text appears in input
```

### Accessibility

The user should be able to:

- click microphone
- speak
- review transcribed text
- edit it
- submit it
- hear the answer

---

# 12. Home Page Content

Below the main assistant:

## Quick Actions

```text
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Find a Scheme  │ │ Find a Service │ │ Explain Screen │
└────────────────┘ └────────────────┘ └────────────────┘
```

## Popular Maharashtra Services

Examples:

- Income Certificate
- Caste Certificate
- Domicile Certificate
- Non-Creamy Layer Certificate
- Senior Citizen Certificate
- Birth Certificate

These should be real supported services only.

## Accessibility

```text
Need a more accessible experience?

🎙 Voice
🔊 Read aloud
Aa Larger text
◐ High contrast
```

---

# 13. Scheme Result Page

When the user asks:

> "What scholarship can I get?"

Sahayak should not simply return a chatbot message.

It should generate a structured scheme result.

```text
┌────────────────────────────────────────────────────────────┐
│ Scholarship for Students with Disabilities                 │
│ Government of India                                       │
│                                                            │
│ What is it?                                               │
│ Simple explanation...                                     │
│                                                            │
│ Eligibility                                               │
│ • ...                                                      │
│ • ...                                                      │
│                                                            │
│ Benefits                                                  │
│ • ...                                                      │
│                                                            │
│ Documents                                                 │
│ • ...                                                      │
│                                                            │
│ ───────────────────────────────────────────────────────── │
│ Official Government Source                                │
│ Government of India                                       │
│                                                            │
│ [View Official Details]  [Apply on Official Portal]       │
└────────────────────────────────────────────────────────────┘
```

### Critical

The official URL must come from the verified scheme registry.

AI must never invent it.

---

# 14. Services Page

The Services page should resemble a civic-service directory rather than a generic dashboard.

## Layout

```text
Services

Find the Maharashtra government service you need.

[ Search services... ]

Popular
Certificates
Education
Health
Agriculture
Disability
Social Welfare
Employment
```

Then:

```text
┌──────────────────────┐
│ Income Certificate   │
│ Revenue Department   │
│                      │
│ Required documents   │
│ Step-by-step guide   │
│                      │
│ [Open Service]       │
└──────────────────────┘
```

---

# 15. Service Detail Page

```text
Income Certificate

Government of Maharashtra
Revenue Department

What is this?
...

Who needs it?
...

Documents required
☐ Identity proof
☐ Address proof
☐ Income-related documents

Application steps

01 Create/login
02 Select Revenue Department
03 Select Income Certificate
04 Fill details
05 Upload documents
06 Review
07 Submit

[Open Official Portal]
```

---

# 16. Explain Screen Page

This is a major Sahayak feature.

## Upload state

```text
Explain any government website or form

Upload a screenshot or image

┌────────────────────────────────────────┐
│                                        │
│       Drag & drop screenshot           │
│                                        │
│             Upload Image               │
│                                        │
│        or capture your screen          │
│                                        │
└────────────────────────────────────────┘
```

## Result

```text
What you're seeing

This page is asking you to provide
your applicant details.

Field explanations

Applicant Name
→ Enter the name of the person applying.

Date of Birth
→ Enter your date of birth.

Glossary

Beneficiary
→ The person receiving the benefit.

Next step

Continue to the Applicant Details section.
```

### Visual behaviour

Highlight important fields using a thin blue outline.

Do not use glowing AI effects.

---

# 17. Extension Page

The Extension page explains the browser extension in a very simple manner.

## Hero

```text
Sahayak in your browser

Get help while using Maharashtra
government websites.

[ Install Extension ]
```

## How it works

```text
01
Open a supported government website

↓

02
Click the Sahayak extension

↓

03
Ask "What should I do next?"

↓

04
Sahayak explains the page

↓

05
Continue on the official website
```

## Feature cards

- Explain this page
- What should I do next?
- Help me fill this form
- Marathi / Hindi / English
- Read aloud
- Accessible interface

---

# 18. Extension Download Section

Do not create a fake Chrome Web Store button if the extension is not published.

For prototype:

```text
[Download Extension]
```

may point to the provided local/demo installation instructions.

When published:

```text
[Add to Chrome]
```

should link to the real official Chrome Web Store listing.

---

# 19. Help Page

Use a simple FAQ layout.

```text
How do I ask Sahayak a question?
⌄

How do I use voice input?
⌄

How do I change the language?
⌄

How do I explain a screenshot?
⌄

How do I use the browser extension?
⌄

Where does Sahayak get government information?
⌄
```

---

# 20. Settings Page

Settings should be simple and accessible.

```text
Settings

Language
○ English
○ मराठी
○ हिंदी

Appearance
Font size       [ A−   A   A+ ]
Contrast        [ Normal | High ]

Voice
Read answers aloud     [ ON ]
Voice input            [ ON ]

Permissions
Microphone             [ Manage ]
Extension permissions  [ Manage ]
```

---

# 21. Official Source Component

This is a critical Sahayak component.

Use:

```text
┌─────────────────────────────────────┐
│ ✓ Official Government Source        │
│                                     │
│ Government of Maharashtra           │
│ Aaple Sarkar                        │
│                                     │
│ [View Official Details]             │
│ [Apply on Official Portal]          │
└─────────────────────────────────────┘
```

Use a **small verified/check icon**, not a fake government seal.

Never imitate the Ashoka emblem or government department branding unless legally/officially permitted.

---

# 22. Accessibility Panel

Provide a persistent accessibility entry.

```text
Accessibility

Text size
[−] [Normal] [+]

Contrast
[Normal] [High]

Read aloud
[▶ Read]

Voice input
[🎙 Speak]
```

The accessibility UI itself must be keyboard accessible.

---

# 23. Language Selector

Only three languages are supported by the Sahayak MVP:

```text
English
मराठी
हिंदी
```

Do NOT copy UMANG's 23-language selector.

Sahayak's product scope is Maharashtra + English/Marathi/Hindi.

The selector should be simple:

```text
EN ▾

English
मराठी
हिंदी
```

---

# 24. Icons

Use a consistent icon library such as:

```text
Lucide React
```

Preferred icon style:

- outline
- 1.5–2px stroke
- simple
- accessible
- consistent size

Examples:

```text
Mic
Volume2
Languages
Accessibility
Search
FileText
ExternalLink
CircleHelp
Settings
Chrome
Upload
Camera
ChevronRight
```

Do not mix five different icon styles.

---

# 25. Illustrations

Use illustrations selectively.

Good places:

- Home hero
- Explain Screen empty state
- Extension page
- Help page
- Accessibility section

Avoid illustrations:

- inside every card
- next to every heading
- on every form field

The visual language should feel like a civic-tech product, not a children's application.

---

# 26. Images and Assets

The supplied UMANG screenshots are **reference material only**.

Do NOT:

- copy UMANG logos
- copy UMANG illustrations
- copy UMANG screenshots into the actual Sahayak UI
- copy UMANG government branding
- reuse UMANG's exact hero artwork
- make Sahayak look like an official UMANG product

Instead create original Sahayak assets using the same broad visual principles.

Suggested Sahayak imagery:

### Home

Original illustration of:

```text
Citizen → Voice → Sahayak → Government Service
```

### Explain Screen

Original illustration of:

```text
Screenshot → highlighted form → explanation
```

### Extension

Original browser illustration with Sahayak side panel.

---

# 27. Responsive Design

## Desktop

Optimized for:

```text
1440 × 900
1280 × 800
```

Use a maximum content width:

```text
1200–1280px
```

## Tablet

Use:

```text
2-column cards
```

## Mobile

Use:

```text
1-column cards
bottom-friendly actions
large microphone
large touch targets
```

The chatbot must remain usable without horizontal scrolling.

---

# 28. Component Architecture

Suggested components:

```text
components/
├── layout/
│   ├── Header
│   ├── Footer
│   └── PageContainer
│
├── assistant/
│   ├── VoiceAssistant
│   ├── ChatInput
│   ├── MicButton
│   ├── AssistantResponse
│   └── QuickActions
│
├── schemes/
│   ├── SchemeCard
│   ├── SchemeDetails
│   ├── Eligibility
│   ├── Documents
│   └── OfficialSource
│
├── services/
│   ├── ServiceCard
│   ├── ServiceDetails
│   ├── ServiceSteps
│   └── DocumentChecklist
│
├── explain/
│   ├── UploadArea
│   ├── ImagePreview
│   ├── FieldExplanation
│   └── Glossary
│
├── extension/
│   ├── ExtensionHero
│   ├── HowItWorks
│   └── ExtensionFeatures
│
├── accessibility/
│   ├── AccessibilityPanel
│   ├── FontSizeControl
│   ├── ContrastControl
│   └── ReadAloud
│
└── common/
    ├── Button
    ├── Card
    ├── Badge
    ├── Modal
    ├── Tabs
    └── EmptyState
```

---

# 29. Design Tokens

Use CSS variables instead of scattering colours throughout components.

```css
:root {
  --sahayak-blue: #00599F;
  --sahayak-blue-dark: #003C6D;
  --sahayak-blue-deep: #002048;

  --sahayak-blue-light: #E7EEF5;
  --sahayak-blue-pale: #DBEFFD;

  --surface: #FFFFFF;
  --surface-soft: #F8FAFC;

  --border: #D9E2EC;

  --text-primary: #1F2937;
  --text-secondary: #5B6573;
  --text-muted: #6B7280;

  --success: #16803C;
  --warning: #B7791F;
  --error: #C53030;

  --radius-card: 12px;
  --radius-button: 8px;

  --shadow-card:
    0 2px 10px rgba(0, 60, 109, 0.08);
}
```

---

# 30. Important "Human-Designed" Rules for Antigravity

These rules are mandatory.

### DO

- Read this UI.md before touching UI code.
- Inspect existing components before creating new ones.
- Reuse components.
- Keep spacing consistent.
- Use the defined colour tokens.
- Use real product content.
- Make deliberate layout decisions.
- Keep visual hierarchy strong.
- Test Marathi and Hindi text.
- Test keyboard navigation.
- Test 1280px and mobile layouts.
- Keep animation subtle.
- Explain design decisions when making substantial UI changes.

### DO NOT

- Generate a generic SaaS dashboard.
- Generate a generic AI chatbot template.
- Use purple/pink AI gradients.
- Use glassmorphism by default.
- Add glowing borders.
- Add random blobs.
- Add unnecessary 3D elements.
- Use ten different card styles.
- Use random colours.
- Add huge headings with little information.
- Put every section inside a rounded rectangle.
- Copy UMANG's exact layout.
- Copy UMANG branding.
- Make the website look like an unofficial clone of UMANG.

---

# 31. AI Coding Quality Gate

After every major UI implementation, Antigravity must answer:

```text
1. Which UMANG design principle was used?
2. Which Sahayak-specific decision was made?
3. Which colour tokens were used?
4. Why is this layout appropriate for accessibility?
5. Does the UI still look like Sahayak rather than UMANG?
6. Does it look human-designed rather than AI-generated?
7. Are there unnecessary cards, gradients or decorative elements?
8. Is the primary user action obvious?
```

---

# 32. Final Visual Direction

The final Sahayak interface should feel like:

```text
Government-service trust
        +
Modern accessibility
        +
Simple civic-tech UX
        +
Voice-first assistance
        +
Sahayak's own identity
```

Not:

```text
Generic AI dashboard
```

and not:

```text
UMANG clone
```

---

# 33. Master Antigravity UI Prompt

Use the following prompt when asking Antigravity to implement the UI:

```text
You are implementing the Sahayak AI user interface.

FIRST:
Read:
- docs/UI.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/FEATURES.md
- docs/SCHEME-DATA-SPEC.md

Also inspect all supplied UMANG reference screenshots in:
docs/ui-references/umang/

Reference website:
https://web.umang.gov.in/landing/

IMPORTANT:
UMANG is a VISUAL REFERENCE ONLY.
Do not clone UMANG.
Do not copy its logo, illustrations, government branding, exact layout,
hero artwork, or navigation structure.

Use the screenshots to understand:
- government-service visual hierarchy
- restrained blue palette
- white information surfaces
- section-based information architecture
- service/scheme cards
- strong primary actions
- accessibility-first controls
- trustworthy civic-tech presentation

Sahayak must have its own identity.

COLOUR SYSTEM:
Primary: #00599F
Dark Blue: #003C6D
Deep Navy: #002048
Light Blue: #E7EEF5
Pale Blue: #DBEFFD
White: #FFFFFF
Soft Background: #F8FAFC
Border: #D9E2EC
Primary Text: #1F2937
Secondary Text: #5B6573

Do not introduce another primary colour system.

DESIGN:
- human-designed
- calm
- trustworthy
- accessible
- civic-tech
- restrained
- information-first
- no excessive gradients
- no glassmorphism
- no glowing effects
- no random blobs
- no generic AI-dashboard styling
- no excessive rounded cards
- no unnecessary animations

TYPOGRAPHY:
Use Inter/system UI with Noto Sans Devanagari fallback.
Support English, Marathi and Hindi correctly.

CORE PAGES:
1. Home
2. Schemes
3. Services
4. Explain Screen
5. Extension
6. Help
7. Settings

HOME:
The primary action is voice/text assistance.
The user should immediately understand:
"Tell Sahayak what you need."

Provide:
- text input
- microphone
- speech-to-text
- quick actions
- popular Maharashtra services
- accessibility shortcuts

SCHEME PAGE:
Show:
- scheme name
- department
- simple explanation
- eligibility
- benefits
- documents
- official source
- exact official application URL
- verified date

Never invent official URLs.

SERVICE PAGE:
Show:
- purpose
- eligibility
- documents
- step-by-step process
- official source
- official application action

EXPLAIN SCREEN:
Provide:
- screenshot upload
- image preview
- field explanations
- glossary
- next-step guidance

EXTENSION:
Explain:
- what the extension does
- where it works
- how to install it
- how to use it
- contextual guidance

ACCESSIBILITY:
Provide:
- font size
- high contrast
- read aloud
- voice input
- keyboard accessibility
- large touch targets

IMPLEMENTATION RULES:
- Create reusable components.
- Use design tokens.
- Do not hardcode colours in individual components.
- Do not duplicate components.
- Do not add unnecessary dependencies.
- Preserve existing functionality.
- Do not modify backend logic unless required for UI integration.
- Use real data structures from the project.
- Use loading, empty and error states.
- Ensure Marathi/Hindi do not overflow.
- Test keyboard navigation.
- Test responsive layouts.

BEFORE FINISHING:
Run lint/build/tests.
Inspect the rendered UI.
Compare visually against the supplied reference screenshots.
Do NOT make it visually identical to UMANG.
Instead verify that it has the same level of visual clarity and government-service usability.

Then report:
1. files changed
2. components created
3. colour tokens used
4. accessibility improvements
5. responsive behaviour
6. tests performed
7. remaining issues
```

---

# 34. Final Design Principle

> **Borrow the visual discipline of UMANG, not its identity.**

Sahayak should feel like a **new, human-designed accessibility layer for government services**, with UMANG's strengths in clarity, trust, structure and public-service usability informing the visual system.
