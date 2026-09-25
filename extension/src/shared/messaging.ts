/**
 * Sahayak AI Extension — Typed Messaging Utilities
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 30 & DATA-CONTRACTS.md Section 31
 * Phase: P08 — Browser Extension
 * 
 * Provides type-safe wrappers for chrome.tabs.sendMessage and chrome.runtime.sendMessage.
 */

import type { ExtensionMessage, ExtensionResponse } from "./types";

/**
 * Sends a typed ExtensionMessage to the active tab's content script.
 */
export async function sendTabMessage(
  tabId: number,
  message: ExtensionMessage
): Promise<ExtensionResponse> {
  if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.sendMessage) {
    return {
      success: false,
      error: {
        code: "PERMISSION_DENIED",
        message: "Chrome extension messaging API unavailable in this environment.",
      },
    };
  }

  try {
    const response = await chrome.tabs.sendMessage(tabId, message);
    if (response && typeof response === "object" && "success" in response) {
      return response as ExtensionResponse;
    }
    return {
      success: true,
      data: response,
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "PAGE_CONTEXT_UNAVAILABLE",
        message: err?.message || "Failed to communicate with tab content script.",
      },
    };
  }
}

/**
 * Sends a typed ExtensionMessage across extension runtime (e.g., side panel to service worker).
 */
export async function sendRuntimeMessage(
  message: ExtensionMessage
): Promise<ExtensionResponse> {
  if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
    return {
      success: false,
      error: {
        code: "PERMISSION_DENIED",
        message: "Chrome extension runtime messaging API unavailable in this environment.",
      },
    };
  }

  try {
    const response = await chrome.runtime.sendMessage(message);
    if (response && typeof response === "object" && "success" in response) {
      return response as ExtensionResponse;
    }
    return {
      success: true,
      data: response,
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "UNKNOWN",
        message: err?.message || "Failed to communicate with extension runtime.",
      },
    };
  }
}
