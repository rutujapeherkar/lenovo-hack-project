/**
 * Sahayak AI — Server-Side Assistant API Route Handler
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 8, 38 & DATA-CONTRACTS.md Section 37
 * Phase: P04 — AI Assistant Core
 * Endpoint: POST /api/assistant
 * 
 * Handles assistant queries, preserves AI_API_KEY server-side, and enforces:
 * - Cache-Control: no-store
 * - Response envelope: ApiResponse<SahayakResponse>
 * - Input validation & security sanitization
 */

import type { ApiResponse, SahayakResponse } from "../../core/shared/types";
import { isAssistantRequest, hasNoSensitiveKeys } from "../../core/shared/validators";
import { AssistantService } from "../../core/assistant/assistant-service";

export interface ApiRouteResponse {
  status: number;
  headers: Record<string, string>;
  body: ApiResponse<SahayakResponse>;
}

/**
 * Core route handler processing assistant requests and returning standardized ApiResponse envelope.
 */
export async function handleAssistantApi(body: unknown): Promise<ApiRouteResponse> {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
  };

  // 1. Validate payload structure
  if (!body || typeof body !== "object") {
    return {
      status: 400,
      headers,
      body: {
        success: false,
        error: {
          code: "INVALID_REQUEST_BODY",
          message: "Request body must be a valid JSON object.",
        },
      },
    };
  }

  // 2. Sensitive Keys Guard
  if (!hasNoSensitiveKeys(body)) {
    return {
      status: 400,
      headers,
      body: {
        success: false,
        error: {
          code: "SENSITIVE_CREDENTIALS_REJECTED",
          message: "Requests containing security credentials, passwords, or PINs are prohibited.",
        },
      },
    };
  }

  // 3. Contract Validation
  if (!isAssistantRequest(body)) {
    return {
      status: 400,
      headers,
      body: {
        success: false,
        error: {
          code: "VALIDATION_FAILED",
          message: "Request must include 'message' (string) and supported 'language' ('en' | 'mr' | 'hi').",
        },
      },
    };
  }

  try {
    const sahayakResponse = await AssistantService.processRequest(body);
    return {
      status: 200,
      headers,
      body: {
        success: true,
        data: sahayakResponse,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[AssistantApiRoute] Uncaught error: ${errorMsg}`);
    return {
      status: 500,
      headers,
      body: {
        success: false,
        error: {
          code: "INTERNAL_ASSISTANT_ERROR",
          message: "An internal error occurred while generating guidance. Please try again later.",
          retryable: true,
        },
      },
    };
  }
}

/**
 * Node / Connect / Vite server middleware adapter for POST /api/assistant.
 */
export async function assistantMiddleware(req: any, res: any, next?: any): Promise<void> {
  if (req.url?.startsWith("/api/assistant") && req.method === "POST") {
    let rawBody = "";
    req.on("data", (chunk: any) => {
      rawBody += chunk;
    });

    req.on("end", async () => {
      try {
        const parsed = rawBody ? JSON.parse(rawBody) : {};
        const response = await handleAssistantApi(parsed);

        for (const [key, val] of Object.entries(response.headers)) {
          res.setHeader(key, val);
        }
        res.statusCode = response.status;
        res.end(JSON.stringify(response.body));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        res.end(
          JSON.stringify({
            success: false,
            error: { code: "MALFORMED_JSON", message: "Invalid JSON in request body" },
          })
        );
      }
    });
    return;
  }

  if (next) {
    next();
  }
}
