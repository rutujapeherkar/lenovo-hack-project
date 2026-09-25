/**
 * Sahayak AI — AI Provider Factory
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 31 & ADR-001
 * Phase: P04 — AI Assistant Core
 * 
 * Instantiates and resolves the configured AIProvider based on environment configuration.
 * Automatically and safely degrades to DemoProvider if credentials are missing.
 */

import type { AIProvider } from "./provider";
import { DemoProvider } from "./demo-provider";
import { GeminiProvider } from "./gemini-provider";

let cachedProvider: AIProvider | null = null;

/**
 * Returns an instance of the configured AI provider.
 * Reads AI_PROVIDER from environment ('demo' | 'gemini'). Defaults to 'demo'.
 * If 'gemini' is requested without AI_API_KEY, gracefully falls back to DemoProvider.
 */
export function getAIProvider(overrideProvider?: string): AIProvider {
  const providerType = (
    overrideProvider ||
    process.env.AI_PROVIDER ||
    "demo"
  ).toLowerCase();

  if (providerType === "gemini") {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      console.warn(
        "[AIProviderFactory] AI_PROVIDER is set to 'gemini' but AI_API_KEY is missing. Falling back to DemoProvider."
      );
      return new DemoProvider();
    }
    return new GeminiProvider({ apiKey });
  }

  // Default to DemoProvider for local development, tests, and offline resilience
  return new DemoProvider();
}

/**
 * Returns or creates a singleton instance of the default AIProvider.
 */
export function getDefaultAIProvider(): AIProvider {
  if (!cachedProvider) {
    cachedProvider = getAIProvider();
  }
  return cachedProvider;
}

/**
 * Resets cached singleton (primarily for unit test isolation).
 */
export function resetCachedAIProvider(): void {
  cachedProvider = null;
}
