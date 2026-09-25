# Sahayak AI — UI Design System & UX Specification

> **Version:** 1.0  
> **Status:** Frozen for MVP  
> **Purpose:** Source of truth for Sahayak AI visual design, interaction design, accessibility, responsive behavior, and UI implementation.

---

# 1. Purpose

This document defines the visual and interaction language of Sahayak AI.

It is intended to prevent inconsistent or generic AI-generated UI across development phases.

All UI implementation should follow this document unless a documented design decision explicitly changes it.

The UI should feel:

- Human-designed
- Trustworthy
- Calm
- Accessible
- Civic-tech oriented
- Information-first
- Modern but not overly trendy
- Simple enough for first-time digital-service users

---

# 2. Design Identity

## 2.1 Product Identity

Sahayak AI is an accessibility and task-navigation layer for digital public services.

The UI should communicate:

> "I can understand this service and help you take the next step."

It should not communicate:

> "This is another generic AI chatbot."

---

# 3. Primary Design Philosophy

## 3.1 Do Not Make the Website Look AI-Generated

The UI should look like a carefully designed civic-tech product created by a human product/design team.

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Neon AI colours
- Glowing borders everywhere
- Random floating blobs
- Excessive rounded cards
- Generic AI-dashboard templates
- Huge chatbot interfaces occupying the entire screen
- Unnecessary animations
- Overly decorative 3D illustrations
- Excessive emojis
- Every section looking like a card
- Generic SaaS landing-page patterns

Prefer:

- Strong visual hierarchy
- White space
- Restrained colour usage
- Clear blue primary actions
- Simple cards
- Subtle borders
- Meaningful icons
- Human-readable typography
- Consistent spacing
- Real content
- Deliberate component hierarchy
- Accessibility-first interaction

---

# 4. UMANG Visual Reference

The supplied UMANG screenshots and the UMANG website are used as **visual references only**.

Reference:

```text
https://web.umang.gov.in/landing/
```

Use the reference to understand:

- Government-service visual language
- Restrained blue palette
- White information surfaces
- Section-based information architecture
- Service/scheme discovery
- Strong primary actions
- Accessibility controls
- Trustworthy public-service presentation

## Important

Do **not** clone UMANG.

Do not copy:

- UMANG logo
- UMANG branding
- Exact navigation
- Exact hero layout
- Exact illustrations
- Exact page structure
- Exact wording
- Government identity elements

Sahayak must have its own identity.

> **Borrow the visual discipline of UMANG, not its identity.**

---

# 5. Visual Principles

## 5.1 Government-Service Visual Language

Use a strong blue as the primary interface colour.

Blue should communicate:

- Trust
- Stability
- Clarity
- Public-service context

---

## 5.2 White Information Surfaces

The majority of the application should use:

- White backgrounds
- Light neutral sections
- Subtle borders
- Restrained shadows

---

## 5.3 Strong Section Headings

Sections should use clear, bold headings rather than decorative labels.

Example:

```text
Popular Services

Find commonly used Maharashtra digital services.
```

---

## 5.4 Card-Based Information Discovery

Use cards for:

- Schemes
- Services
- Categories
- Accessibility tools
- Extension features
- Important information groups

But:

> Do not put every piece of UI inside a card.

Cards should communicate meaningful grouping.

---

## 5.5 Clear Primary Actions

Primary buttons should use Sahayak blue.

Examples:

```text
Ask Sahayak
Apply on Official Portal
Explain Screen
Open Service
Install Extension
Continue
```

---

## 5.6 Official-Source Visibility

Official information must be visually distinguishable from Sahayak guidance.

Example:

```text
SAHAYAK GUIDANCE

Simple explanation...

────────────────────────

OFFICIAL SOURCE

Government of Maharashtra
Verify current requirements
[Open Official Portal ↗]
```

---

# 6. Sahayak Colour Palette

The palette is inspired by the blue/white/neutral visual language visible in the supplied UMANG references.

## Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `--sahayak-blue` | `#00599F` | Primary brand/action colour |
| `--sahayak-blue-dark` | `#003C6D` | Dark sections/footer/strong emphasis |
| `--sahayak-blue-deep` | `#002048` | Deep navy/high-contrast areas |
| `--sahayak-blue-light` | `#E7EEF5` | Light blue surfaces |
| `--sahayak-blue-pale` | `#DBEFFD` | Information/accessibility backgrounds |
| `--surface` | `#FFFFFF` | Main surfaces |
| `--surface-soft` | `#F8FAFC` | Secondary backgrounds |
| `--border` | `#D9E2EC` | Borders/dividers |
| `--text-primary` | `#1F2937` | Main text |
| `--text-secondary` | `#5B6573` | Supporting text |
| `--text-muted` | `#6B7280` | Metadata/helper text |
| `--success` | `#16803C` | Success/verified state |
| `--warning` | `#B7791F` | Warning state |
| `--error` | `#C53030` | Error state |
| `--focus` | `#00599F` | Keyboard focus |

---

# 7. Colour Ratio

Do not use every colour simultaneously.

Recommended visual balance:

```text
70%  White / neutral
20%  Light blue / soft surfaces
8%   Primary blue
2%   Status/accent colours
```

Blue should be a controlled accent rather than a full-page background everywhere.

---

# 8. Colour Usage Rules

## Primary Blue — `#00599F`

Use for:

- Primary buttons
- Active navigation
- Links
- Microphone button
- Selected tabs
- Progress indicators
- Important icons
- Primary official actions

---

## Dark Blue — `#003C6D`

Use for:

- Strong section backgrounds
- Footer
- Important emphasis
- Secondary dark surfaces

Do not use it for ordinary body text on dark backgrounds unless contrast is verified.

---

## Deep Navy — `#002048`

Use sparingly for:

- Very dark sections
- Strong visual emphasis
- High-contrast surfaces

---

## Light Blue — `#E7EEF5`

Use for:

- Secondary information sections
- Service/category backgrounds
- Soft cards
- Contextual guidance

---

## Pale Blue — `#DBEFFD`

Use for:

- Accessibility information
- Informational notices
- Help sections
- Contextual hints

---

# 9. Typography

## Primary Font

Prefer:

```text
Inter
```

with system UI fallback.

For Marathi and Hindi, ensure correct Devanagari rendering with a suitable fallback such as:

```text
Noto Sans Devanagari
```

Suggested stack:

```css
font-family:
  Inter,
  "Noto Sans Devanagari",
  system-ui,
  sans-serif;
```

---

# 10. Typography Hierarchy

Use a restrained hierarchy.

```text
Page Title
    ↓
Section Heading
    ↓
Card Heading
    ↓
Body
    ↓
Supporting text
    ↓
Metadata
```

Avoid excessively large headings that make the interface feel like a marketing landing page.

---

# 11. Spacing System

Use a consistent spacing scale.

Recommended base:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Prefer consistent spacing tokens over arbitrary values.

---

# 12. Border Radius

Use restrained rounding.

Recommended:

```text
Buttons: 8px
Inputs: 8px
Cards: 12px
Large containers: 16px maximum
```

Avoid excessive pill-shaped interfaces unless the component specifically requires it.

---

# 13. Shadows

Use subtle shadows.

Preferred:

```css
box-shadow:
  0 2px 10px rgba(0, 60, 109, 0.08);
```

Avoid:

- Strong glowing shadows
- Neon effects
- Large floating shadows
- Excessive elevation

Borders should often be sufficient.

---

# 14. Design Tokens

Use CSS variables.

Example:

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
  --focus: #00599F;

  --radius-card: 12px;
  --radius-button: 8px;

  --shadow-card:
    0 2px 10px rgba(0, 60, 109, 0.08);
}
```

Do not scatter hardcoded colours throughout components.

---

# 15. Global Layout

Use a maximum content width around:

```text
1200–1280px
```

The layout should provide comfortable whitespace.

Desktop structure:

```text
Header
   ↓
Page content
   ↓
Sections
   ↓
Footer
```

Do not make every section visually identical.

---

# 16. Header

The header should be simple and trustworthy.

Recommended structure:

```text
┌───────────────────────────────────────────────────────────┐
│ Sahayak AI     Home  Services  Schemes  Explain Screen   │
│                                      Extension  Help  ⚙  │
└───────────────────────────────────────────────────────────┘
```

Include:

- Sahayak identity
- Primary navigation
- Language control
- Accessibility access
- Settings where appropriate

Do not copy UMANG's exact navigation structure.

---

# 17. Home Page

The home page is the primary entry point.

The primary question should be:

> **Tell Sahayak what you need.**

The home experience should provide:

- Natural-language input
- Microphone
- Voice-to-text
- Language selector
- Quick actions
- Popular Maharashtra services
- Accessibility shortcuts
- Clear explanation of what Sahayak does

---

# 18. Home Interaction

Example:

```text
┌─────────────────────────────────────────────┐
│                                             │
│             How can Sahayak help?           │
│                                             │
│  [ Tell me what you need...           🎙 ]  │
│                                             │
│  [ Find a service ] [ Find a scheme ]       │
│  [ Explain a screen ] [ Help me fill form ] │
│                                             │
└─────────────────────────────────────────────┘
```

Do not make the chatbot conversation occupy the entire homepage.

The interface should remain task-oriented.

---

# 19. Services Page

The Services page should allow users to discover supported services.

Each service card may contain:

```text
Service Name
Short explanation
Category

Documents
Estimated process / steps

[Open Service]
```

Use real service data.

Do not use generic placeholder service names in the finished UI.

---

# 20. Service Detail Page

A service detail page should show:

- Service name
- Purpose
- Simple explanation
- Eligibility where verified
- Required documents
- Step-by-step process
- Official source
- Official application action

Example:

```text
Income Certificate

What is it?
A certificate used to provide proof of income.

Documents
✓ Identity proof
✓ Address proof
...

Steps
1. Applicant Details
2. Address
3. Income
4. Documents
5. Review

[Start Guidance]

Official Source
Government of Maharashtra
[Open Official Portal]
```

---

# 21. Task Journey UI

For a deterministic service journey:

```text
Income Certificate

Step 2 of 5

✓ Applicant Details
● Address
○ Income Details
○ Documents
○ Review
```

The current step should be visually clear.

Provide:

- Previous
- Next
- Current-step explanation
- Required documents where relevant

Do not automatically submit the form.

---

# 22. Scheme Page

A scheme result should show:

- Scheme name
- Department/authority where verified
- Simple explanation
- Eligibility
- Benefits
- Documents
- Official source
- Official application route where verified
- Verification information

Example:

```text
Scheme Name

Simple explanation...

Who can apply?
...

Benefits
...

Documents
...

Official Source
Government authority
[View Official Information]

[Apply on Official Portal]
```

Never invent official URLs.

---

# 23. Scheme Cards

Scheme cards should prioritize scanability.

Recommended structure:

```text
┌───────────────────────────────────┐
│ Scheme Name                       │
│ Category                          │
│                                   │
│ Short plain-language explanation  │
│                                   │
│ Eligibility  •  Benefits         │
│                                   │
│ [View Details]                    │
└───────────────────────────────────┘
```

Do not overload cards with the entire scheme record.

---

# 24. Explain Screen

The Explain Screen allows users to upload a screenshot or image.

Recommended structure:

```text
Explain this screen

┌──────────────────────────┐
│                          │
│      Upload screenshot   │
│                          │
│      [Choose Image]      │
│                          │
└──────────────────────────┘

or

[Paste / provide screen image]
```

After upload:

```text
Image Preview
        ↓
Explanation
        ↓
Fields / Terms
        ↓
What should I do next?
```

---

# 25. Screen Explanation UI

Example:

```text
Annual Income

What does this mean?

Enter your total yearly income as requested by the form.

What should I enter?
Use the amount requested by the official form instructions.

Next
Continue to the next required field.
```

Keep explanations simple.

---

# 26. Glossary

The Explain Screen may provide a glossary for difficult terminology.

Example:

```text
Term:
Beneficiary

Simple meaning:
The person who receives the benefit of a scheme.
```

Glossary content should avoid unnecessary bureaucratic language.

---

# 27. Browser Extension Page

The website should explain:

- What Sahayak Extension does
- Supported use cases
- How to install
- How to open it
- How to use it on supported government websites
- How page guidance works
- Privacy/safety expectations

---

# 28. Extension Visual Language

The extension side panel should feel like a compact version of Sahayak, not a separate product.

Example:

```text
┌───────────────────────────────┐
│ Sahayak                    ⚙  │
├───────────────────────────────┤
│ You're on                     │
│ MahaDBT                       │
│ Maharashtra                   │
│                               │
│ How can I help?               │
│                               │
│ [ Explain this page ]         │
│ [ What should I do next? ]    │
│ [ Help me fill this form ]    │
│ [ Required documents ]        │
│                               │
│ Marathi | हिंदी | English     │
└───────────────────────────────┘
```

---

# 29. Known vs Unknown Extension State

Known page:

```text
🟢 Sahayak understands this page
```

Unknown page:

```text
⚪ Sahayak can explain this page using AI
```

Do not imply deterministic understanding when the page is not in the verified registry.

---

# 30. Help Page

The Help page should provide simple answers to common questions.

Potential categories:

```text
Using Sahayak
Services
Schemes
Extension
Voice
Accessibility
Safety
Payments
```

Use short, direct answers.

---

# 31. Settings

Settings should provide:

- Language
- Font size
- Contrast
- Reduced motion
- Read aloud
- Voice preferences
- Permission-related information
- Privacy/safety information

Settings should not expose unnecessary technical configuration.

---

# 32. Accessibility Panel

The accessibility panel should provide clear controls.

Example:

```text
Accessibility

Text Size
[ Normal ] [ Large ] [ Extra Large ]

Contrast
[ Standard ] [ High Contrast ]

Motion
[ Standard ] [ Reduced ]

Read Aloud
[ On / Off ]

Language
[ English ] [ मराठी ] [ हिंदी ]
```

---

# 33. Language Selector

Only MVP languages should be shown:

```text
English
मराठी
हिंदी
```

Language switching should not reset the user's current task unnecessarily.

---

# 34. Buttons

Primary button:

```text
background: #00599F
text: white
radius: 8px
```

Secondary button:

```text
background: white
border: #D9E2EC
text: #1F2937
```

Text/link action:

```text
text: #00599F
```

Buttons should have:

- Visible focus
- Hover state
- Active state
- Disabled state
- Accessible name

---

# 35. Microphone Button

The microphone is a major accessibility interaction.

It should:

- Be visually prominent
- Have a clear accessible label
- Show recording state
- Show processing state
- Handle permission denial gracefully
- Provide text input as fallback

Example states:

```text
Idle
🎙 Speak

Listening
● Listening...

Processing
Processing...

Unavailable
Voice unavailable
[Type instead]
```

---

# 36. Loading States

Do not leave blank screens during processing.

Use simple contextual loading states.

Examples:

```text
Understanding your request...
```

```text
Explaining this screen...
```

```text
Finding relevant services...
```

Avoid overly decorative skeleton animations.

---

# 37. Empty States

Empty states should explain what the user can do next.

Bad:

```text
No data.
```

Better:

```text
No matching schemes found.

Try describing what you need in simpler terms.
```

---

# 38. Error States

Errors should be understandable and actionable.

Bad:

```text
500 Internal Server Error
```

Better:

```text
Sahayak could not process that request right now.

You can try again or continue with the available service guidance.
```

Do not expose stack traces or technical implementation details.

---

# 39. Official Source Component

Use a consistent component for official sources.

Example:

```text
┌─────────────────────────────────────┐
│ OFFICIAL SOURCE                     │
│                                     │
│ Government of Maharashtra           │
│ Verify current requirements         │
│                                     │
│ [Open Official Portal ↗]            │
└─────────────────────────────────────┘
```

The source should look authoritative without using fake government seals or pretending Sahayak is a government department.

---

# 40. Status Indicators

Use status colours sparingly.

```text
Success / verified → #16803C
Warning            → #B7791F
Error              → #C53030
```

Do not rely on colour alone.

Pair status with:

- Icon
- Label
- Text

---

# 41. Icons

Use a consistent icon library such as Lucide React if already present or approved.

Icons should:

- Have clear meaning
- Support text labels
- Not replace important text
- Have accessible labels where interactive

Avoid excessive icon decoration.

---

# 42. Illustrations

Use original Sahayak illustrations.

Do not copy UMANG illustrations or government branding.

Suggested concepts:

### Home

```text
Citizen → Voice → Sahayak → Government Service
```

### Explain Screen

```text
Screenshot → Highlighted form → Explanation
```

### Extension

```text
Browser page + Sahayak side panel
```

Illustrations should support understanding rather than decorate empty space.

---

# 43. Responsive Design

## Desktop

Optimize for:

```text
1440 × 900
1280 × 800
```

Use a maximum content width around:

```text
1200–1280px
```

---

## Tablet

Use:

```text
2-column layouts where appropriate
```

---

## Mobile

Use:

```text
1-column layouts
Large touch targets
Bottom-friendly actions
Large microphone interaction
Readable text
```

No horizontal scrolling should be required for normal usage.

---

# 44. Accessibility Requirements

The UI must support:

- Keyboard navigation
- Visible focus
- Large text
- High contrast
- Reduced motion
- Screen-reader-friendly labels
- Sufficient touch target size
- Clear error messages
- Read aloud
- Voice input
- Marathi rendering
- Hindi rendering

Accessibility must be tested with the actual rendered UI.

---

# 45. Marathi and Hindi UI Rules

The UI must be tested using real Marathi and Hindi text.

Do not assume English text dimensions.

Check for:

- Text overflow
- Button wrapping
- Card height changes
- Navigation overflow
- Line-height
- Modal sizing
- Side-panel width
- Mobile layouts

Do not solve overflow by silently shrinking text below readable sizes.

---

# 46. Content Rules

Use:

- Short sentences
- Familiar words
- Action-oriented labels
- Plain-language explanations
- Real service names
- Verified government terminology where required

Avoid:

- Unnecessary technical language
- Marketing-heavy copy
- Long paragraphs
- Generic AI phrases
- Repeated "AI-powered" labels

---

# 47. Human-Designed Rules

## DO

- Reuse existing components.
- Use design tokens.
- Maintain consistent spacing.
- Use real content.
- Use deliberate hierarchy.
- Keep the interface calm.
- Make important actions obvious.
- Test Marathi and Hindi.
- Test keyboard navigation.
- Test responsive layouts.
- Provide meaningful empty/error/loading states.
- Explain design decisions when introducing unusual UI.

## DO NOT

- Create generic AI dashboards.
- Use purple/pink AI gradients.
- Use glassmorphism everywhere.
- Add glowing effects.
- Add random blobs.
- Add excessive rounded cards.
- Add random colours.
- Use giant meaningless headings.
- Clone UMANG.
- Copy UMANG branding.
- Make every section a card.
- Add animations merely because they look impressive.

---

# 48. Component Architecture

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

Reuse components before creating new equivalents.

---

# 49. UI/Data Separation

UI components should consume structured project data.

Preferred:

```tsx
<ServiceCard service={service} />
```

Not:

```tsx
<ServiceCard rawAiText={response.message} />
```

when structured service data already exists.

Similarly:

```tsx
<SchemeCard scheme={scheme} />
```

should receive a canonical `Scheme`.

---

# 50. UI and Business Logic Separation

UI components should not contain:

- AI provider implementation
- Scheme retrieval logic
- Government URL generation
- Form registry logic
- Portal detection logic

Those belong in the appropriate core/application modules.

---

# 51. Animation Rules

Animations should be:

- Subtle
- Functional
- Short
- Accessible

Examples:

- Button state transition
- Side panel opening
- Progress transition
- Loading indicator

Respect reduced-motion preferences.

Avoid:

- Floating decorative elements
- Large entrance animations
- Constant motion
- Parallax effects
- Glowing animations

---

# 52. Trust & Safety UI

The UI should clearly distinguish:

```text
Sahayak Guidance
```

from:

```text
Official Source
```

When relevant, show:

> Sahayak AI provides guidance and does not represent a government department.

And:

> Requirements and procedures may change. Verify current information on the official service portal before submitting an application.

---

# 53. Payment UI

Payment guidance must never request sensitive credentials.

The UI must never include fields asking for:

```text
UPI PIN
OTP
Password
CVV
Bank credentials
```

Payment guidance should direct the user to complete the sensitive action themselves.

---

# 54. Privacy UI

Where relevant, communicate clearly:

- What Sahayak needs
- Why it needs it
- What is processed
- What is not stored
- When the user is leaving Sahayak for an official portal

Avoid unnecessary permission requests.

---

# 55. UI Performance

Prioritize:

- Minimal dependencies
- Optimized images
- Lazy loading where useful
- Lightweight components
- Minimal unnecessary re-renders
- Minimal API calls
- Efficient screen-image handling

Do not add large UI libraries if existing components can satisfy the requirement.

---

# 56. UI Implementation Rules for Antigravity

Before modifying UI:

1. Read `docs/source-of-truth/PRODUCT.md`.
2. Read `docs/source-of-truth/ARCHITECTURE.md`.
3. Read `docs/source-of-truth/DATA-CONTRACTS.md`.
4. Read this `docs/source-of-truth/UI.md`.
5. Read the current phase specification.
6. Inspect existing components.
7. Reuse existing components where possible.

Do not implement future phases.

Do not modify backend/business logic unless explicitly required for UI integration.

Do not introduce another colour system.

Do not duplicate existing components.

Do not invent data.

Do not invent official URLs.

Do not use fake government branding.

---

# 57. UI Validation Checklist

Before considering a UI feature complete:

## Visual

- [ ] Correct colour tokens
- [ ] Correct typography
- [ ] Consistent spacing
- [ ] No unnecessary gradients
- [ ] No generic AI-dashboard appearance
- [ ] No accidental UMANG clone
- [ ] Clear hierarchy

## Accessibility

- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Accessible labels
- [ ] Large enough touch targets
- [ ] High contrast option
- [ ] Font scaling
- [ ] Reduced motion
- [ ] Read aloud where applicable

## Language

- [ ] English tested
- [ ] Marathi tested
- [ ] Hindi tested
- [ ] No text overflow
- [ ] Buttons remain usable

## Responsive

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile
- [ ] No horizontal scrolling

## States

- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Success
- [ ] Disabled
- [ ] Voice unavailable where applicable

## Regression

- [ ] Existing pages still work
- [ ] Existing components still work
- [ ] Existing navigation still works
- [ ] Existing data contracts unchanged unless approved

---

# 58. Final Design Principle

> **Borrow the visual discipline of UMANG, not its identity.**

Sahayak should feel like a new, human-designed accessibility layer for government services, using a restrained blue-and-white civic-tech visual language with strong hierarchy, accessibility, clarity, and trustworthy information presentation.

The UI should always serve the user's task:

```text
Understand
   ↓
Decide what to do
   ↓
Take the next action
```
