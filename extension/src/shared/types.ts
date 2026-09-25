/**
 * Sahayak AI Extension — Shared Types
 * 
 * Re-exports canonical contracts from the shared core to ensure zero divergence.
 * Source of Truth: docs/source-of-truth/DATA-CONTRACTS.md Section 31-33
 */

export type {
  ExtensionMessage,
  ExtensionResponse,
  ExtensionError,
  Portal,
  PortalMatch,
  PageContext,
  PageDetectionResult,
  FormGuide,
  FormPage,
  FormField,
  Language,
  LocalizedText,
  OfficialSource,
  ApiResponse,
  SahayakResponse,
} from "../../../src/core/shared/types";
