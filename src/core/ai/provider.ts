/**
 * Sahayak AI — AI Provider Abstraction Interface
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 31 & ADR-001
 * Phase: P04 — AI Assistant Core
 * 
 * Canonical contract for all AI engine implementations (DemoProvider, GeminiProvider).
 * Presentation components and business services interact exclusively via this interface.
 */

import type {
  AssistantRequest,
  SahayakResponse,
  ScreenExplanation,
  Language,
  AIProvider as CanonicalAIProvider,
} from "../shared/types";

export type AIProviderType = "demo" | "gemini";

/**
 * Provider-independent interface for AI operations.
 * Implemented by DemoProvider (offline fallback) and GeminiProvider (Google Gemini).
 */
export interface AIProvider extends CanonicalAIProvider {
  /**
   * Generates a structured SahayakResponse for a citizen's natural language request.
   */
  generateResponse(request: AssistantRequest): Promise<SahayakResponse>;

  /**
   * Multimodal vision explanation for screenshots (Phase P07).
   */
  explainImage?(
    image: File | { base64?: string; mimeType?: string; language?: Language; fileName?: string }
  ): Promise<ScreenExplanation>;

  /**
   * Returns identifier for current active provider implementation.
   */
  readonly providerId: AIProviderType;
}
