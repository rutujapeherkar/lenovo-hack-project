/**
 * Sahayak AI Extension — Content Script Entry Point
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 28 & DATA-CONTRACTS.md Section 31
 * Phase: P08 — Browser Extension
 * 
 * Injected into matching government web pages.
 * Listens for ExtensionMessage events from the side panel and orchestrates:
 * - Safe page context extraction
 * - Form guide detection
 * - Non-destructive field highlighting
 */

import type { ExtensionMessage, ExtensionResponse } from "../shared/types";
import { isExtensionMessage } from "../../../src/core/shared/validators";
import { ContentDetector } from "./detector";
import { highlightField, clearHighlight, ensureHighlightStylesInjected } from "./highlighter";

// Ensure highlight CSS is available in DOM
if (typeof document !== "undefined") {
  ensureHighlightStylesInjected();
}

/**
 * Handles incoming ExtensionMessage and generates strongly typed ExtensionResponse.
 */
export function handleContentScriptMessage(
  message: unknown,
  doc: Document = document,
  win: Window = window
): ExtensionResponse {
  if (!isExtensionMessage(message)) {
    return {
      success: false,
      error: {
        code: "UNKNOWN",
        message: "Invalid extension message structure.",
      },
    };
  }

  const typedMsg = message as ExtensionMessage;

  switch (typedMsg.type) {
    case "GET_PAGE_CONTEXT": {
      const context = ContentDetector.extractPageContext(doc, win);
      return {
        success: true,
        data: context,
      };
    }

    case "GET_CURRENT_FORM": {
      const guide = ContentDetector.getCurrentFormGuide(doc, win);
      if (!guide) {
        return {
          success: false,
          error: {
            code: "FORM_NOT_DETECTED",
            message: "No verified form guide matches the current page.",
          },
        };
      }
      return {
        success: true,
        data: guide,
      };
    }

    case "HIGHLIGHT_FIELD": {
      const res = highlightField(typedMsg.fieldId, typedMsg.selector, doc);
      if (!res.success) {
        return {
          success: false,
          error: {
            code: res.error === "SECURITY_REJECTION_PASSWORD_FIELD" ? "PERMISSION_DENIED" : "FIELD_NOT_FOUND",
            message:
              res.error === "SECURITY_REJECTION_PASSWORD_FIELD"
                ? "Password and security credential fields cannot be highlighted or assisted."
                : `Field "${typedMsg.fieldId}" could not be located on the current page.`,
          },
        };
      }
      return {
        success: true,
      };
    }

    case "CLEAR_HIGHLIGHT": {
      clearHighlight(typedMsg.fieldId, doc);
      return {
        success: true,
      };
    }

    default:
      return {
        success: false,
        error: {
          code: "UNKNOWN",
          message: "Unhandled extension message type.",
        },
      };
  }
}

// Register Chrome runtime message listener in browser extension runtime
if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener(
    (message: unknown, _sender: chrome.runtime.MessageSender, sendResponse: (res: ExtensionResponse) => void) => {
      const response = handleContentScriptMessage(message);
      sendResponse(response);
      return true; // Keep message channel open for async response
    }
  );
}
