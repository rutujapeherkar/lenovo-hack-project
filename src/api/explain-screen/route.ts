/**
 * Sahayak AI — Server-Side Explain Screen API Route Handler
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 21 & DATA-CONTRACTS.md Section 26
 * Phase: P07 — Explain Screen
 * Endpoint: POST /api/explain-screen
 * 
 * Handles screenshot visual analysis, invokes server-side AI provider (Demo or Gemini),
 * and enforces:
 * - In-memory ephemeral processing (zero disk or persistent storage)
 * - Cache-Control: no-store
 * - Response envelope: ApiResponse<ScreenExplanation>
 * - Input validation (MIME, base64 size, language)
 * - Output validation via canonical isScreenExplanation type guard
 */

import type { ApiResponse, ScreenExplanation, Language } from "../../core/shared/types";
import { isLanguage, isScreenExplanation, hasNoSensitiveKeys } from "../../core/shared/validators";
import { getAIProvider } from "../../core/ai/factory";

export interface ApiRouteResponse {
  status: number;
  headers: Record<string, string>;
  body: ApiResponse<ScreenExplanation>;
}

export interface ExplainScreenRequestBody {
  imageBase64: string;
  mimeType: string;
  language: Language;
  fileName?: string;
}

const SUPPORTED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
// Max 5MB binary is approx 6.8MB in base64
const MAX_BASE64_LENGTH = 7 * 1024 * 1024;

/**
 * Core route handler processing screen explanation requests.
 */
export async function handleExplainScreenApi(body: unknown): Promise<ApiRouteResponse> {
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

  const req = body as Partial<ExplainScreenRequestBody>;

  // 3. Language Validation
  if (!req.language || !isLanguage(req.language)) {
    return {
      status: 400,
      headers,
      body: {
        success: false,
        error: {
          code: "INVALID_LANGUAGE",
          message: "Language must be one of: 'en', 'mr', 'hi'.",
        },
      },
    };
  }

  // 4. Image Data Validation
  if (!req.imageBase64 || typeof req.imageBase64 !== "string" || req.imageBase64.trim().length === 0) {
    return {
      status: 400,
      headers,
      body: {
        success: false,
        error: {
          code: "MISSING_IMAGE_DATA",
          message: "Image base64 data is required.",
        },
      },
    };
  }

  if (req.imageBase64.length > MAX_BASE64_LENGTH) {
    return {
      status: 400,
      headers,
      body: {
        success: false,
        error: {
          code: "IMAGE_TOO_LARGE",
          message: "Image size exceeds 5MB limit. Please upload a smaller screenshot.",
        },
      },
    };
  }

  // 5. MIME Type Validation
  if (!req.mimeType || !SUPPORTED_MIME_TYPES.includes(req.mimeType.toLowerCase())) {
    return {
      status: 400,
      headers,
      body: {
        success: false,
        error: {
          code: "UNSUPPORTED_IMAGE_FORMAT",
          message: "Supported image formats are PNG, JPEG, JPG, and WEBP.",
        },
      },
    };
  }

  try {
    const provider = getAIProvider();
    if (!provider.explainImage) {
      return {
        status: 500,
        headers,
        body: {
          success: false,
          error: {
            code: "VISION_UNSUPPORTED",
            message: "Active AI provider does not support image analysis.",
          },
        },
      };
    }

    const explanation = await provider.explainImage({
      base64: req.imageBase64,
      mimeType: req.mimeType,
      language: req.language,
      fileName: req.fileName || "screenshot.png",
    });

    if (!isScreenExplanation(explanation)) {
      return {
        status: 502,
        headers,
        body: {
          success: false,
          error: {
            code: "INVALID_AI_RESPONSE",
            message: "AI provider returned malformed screen explanation.",
            retryable: true,
          },
        },
      };
    }

    return {
      status: 200,
      headers,
      body: {
        success: true,
        data: explanation,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[ExplainScreenApiRoute] Error: ${errorMsg}`);
    return {
      status: 500,
      headers,
      body: {
        success: false,
        error: {
          code: "INTERNAL_VISION_ERROR",
          message: "Failed to analyze screen image. Please try again.",
          retryable: true,
        },
      },
    };
  }
}

/**
 * Node / Connect / Vite server middleware adapter for POST /api/explain-screen.
 */
export async function explainScreenMiddleware(req: any, res: any, next?: any): Promise<void> {
  if (req.url?.startsWith("/api/explain-screen") && req.method === "POST") {
    let rawBody = "";
    req.on("data", (chunk: any) => {
      rawBody += chunk;
    });

    req.on("end", async () => {
      try {
        const parsed = rawBody ? JSON.parse(rawBody) : {};
        const response = await handleExplainScreenApi(parsed);

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
