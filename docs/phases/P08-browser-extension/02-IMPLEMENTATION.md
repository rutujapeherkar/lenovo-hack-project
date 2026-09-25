# Phase P08 — Implementation Plan: Browser Extension & DOM In-Page Guidance

## 1. Implementation Order
1. [REFERENCE] Read `docs/source-of-truth/ARCHITECTURE.md` Sections 26–30 and `docs/source-of-truth/SECURITY.md` Sections 10–15.
2. [CREATE] `extension/manifest.json` configured for Manifest V3.
3. [CREATE] `extension/src/background/service-worker.ts` managing tab updates and side panel behavior.
4. [CREATE] `extension/src/content/detector.ts` implementing portal matching logic.
5. [CREATE] `extension/src/content/highlighter.ts` implementing highlight overlay.
6. [CREATE] `extension/src/content/content-script.ts` handling tab lifecycle and DOM messaging.
7. [CREATE] `extension/src/sidepanel/App.tsx` rendering header, state badge, and contextual actions.
8. [CREATE] `extension/src/shared/messaging.ts` with strongly typed wrappers for `chrome.runtime.sendMessage`.
9. [CREATE] Extension build script in `package.json` compiling extension code into `extension/dist/`.
10. [VERIFY] Load unpacked extension in Chromium browser on a simulated test page.

## 2. Files to Create & Modify
- [CREATE] `extension/manifest.json`
- [CREATE] `extension/src/background/service-worker.ts`
- [CREATE] `extension/src/content/detector.ts`
- [CREATE] `extension/src/content/highlighter.ts`
- [CREATE] `extension/src/content/content-script.ts`
- [CREATE] `extension/src/sidepanel/App.tsx`
- [CREATE] `extension/src/shared/messaging.ts`
- [REFERENCE] `core/shared/types.ts`
- [REFERENCE] `data/maharashtra/portals.json`

## 3. Module Responsibilities
- `manifest.json`: Defines permissions, icons, and entrypoints.
- `service-worker.ts`: Listens to `chrome.tabs.onUpdated` and enables side panel on matched tabs.
- `detector.ts`: Compares active window URL to portal registry.
- `highlighter.ts`: Safely injects/removes `.sahayak-highlight` CSS styling on target input elements.
- `sidepanel/App.tsx`: Renders side panel UI matching Sahayak visual tokens.

## 4. Integration Points
- Content script communicates with side panel via `chrome.runtime.sendMessage()`.
- Side panel connects to Sahayak backend API (`http://localhost:3000/api/assistant`) for AI explanations.

## 5. Data Flow
- `Webpage DOM -> ContentScript -> Detector -> Message -> ServiceWorker -> SidePanel UI`.

## 6. Testing Points
- Test message passing between content script and side panel.
- Test highlight injection on a sample mock HTML form.
