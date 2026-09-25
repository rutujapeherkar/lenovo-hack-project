# ADR-001 — Provider-Agnostic AI Interface with Local Demo Fallback

## Status
Accepted (Source-of-truth decision)

## Date
2026-09-25

## Context
The Sahayak AI platform requires artificial intelligence capabilities for natural language understanding, intent detection, screenshot explanation, and accessible text simplification. However, tightly coupling frontend components to a specific external AI provider (such as Google Gemini, OpenAI, or Anthropic) introduces serious architectural risks:
1. Vendor lock-in where UI components must be refactored if models change.
2. Inability to run, test, or develop locally without active external internet access and funded API credentials.
3. Hackathon presentation fragility if rate limits or cloud outages occur during live judging.

## Decision
We establish an internal provider-agnostic interface (`AIProvider` in [docs/source-of-truth/DATA-CONTRACTS.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/DATA-CONTRACTS.md#L615-L626)). Presentation components communicate strictly via this contract. 
We mandate two initial provider implementations:
1. `DemoProvider`: An offline, deterministic provider that fulfills requests using pre-curated responses matching the canonical `SahayakResponse` schema. This is the default in local development and offline environments.
2. `GeminiProvider`: An adapter interfacing with Google Gemini 1.5/2.0 multimodal models via a server-side proxy.

## Alternatives Considered
- *Direct Client-Side SDK Integration:* Calling the Gemini API directly from React components. Rejected due to catastrophic security violations (API key exposure in browser client) and tight UI coupling.
- *Framework-Specific Orchestration (LangChain/LlamaIndex):* Rejected due to excessive bundle size, hidden complexity, and unnecessary third-party dependencies violating our performance principles.

## Consequences
- **Positive:** UI components remain 100% pure and independent of AI vendor changes. Local development works out-of-the-box with zero environment configuration. Hackathon demos can run reliably on the demo provider if network issues arise.
- **Negative:** Requires maintaining mock responses in `DemoProvider` that stay aligned with `SahayakResponse`.

## Source-of-Truth Impact
- Aligns directly with [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md#L134-L164) (Section 5.2 Provider Independent) and [ARCHITECTURE.md](file:///Users/rutuja/Documents/Hackathons%202026/lenovo-hack-project/docs/source-of-truth/ARCHITECTURE.md#L908-L933) (Section 31 AI Provider Architecture).

## Implementation Impact
- Phase P04 (AI Assistant Core) must implement the `AIProvider` interface, `DemoProvider`, and `GeminiProvider` adapter.
- Server-side API proxy must keep `AI_API_KEY` hidden from the browser.

## Reversal Conditions
This decision would be reconsidered only if the platform required purely local on-device neural model inference running entirely via WebAssembly/WebGPU, which is explicitly out of scope for the MVP.
