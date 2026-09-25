/**
 * Sahayak AI — Screenshot File Validator
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 22 & SECURITY.md Section 34
 * Phase: P07 — Explain Screen
 * 
 * Enforces client and server image validation invariants:
 * 1. Allowed MIME types: image/png, image/jpeg, image/jpg, image/webp.
 * 2. Maximum file size: 5 MB (5,242,880 bytes).
 * 3. Graceful human-readable rejection of unsupported or empty payloads.
 */

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileLike {
  size: number;
  type: string;
  name?: string;
}

/**
 * Validates an image file object or file-like metadata against security constraints.
 */
export function validateImageFile(file: FileLike | null | undefined): ImageValidationResult {
  if (!file) {
    return {
      valid: false,
      error: "No image file provided. Please select or drop a screenshot.",
    };
  }

  // 1. Check empty file
  if (file.size <= 0) {
    return {
      valid: false,
      error: "Image file is empty.",
    };
  }

  // 2. Check maximum size constraint (5 MB)
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Image size exceeds 5 MB limit.",
    };
  }

  // 3. Check allowed MIME types
  const normalizedType = (file.type || "").trim().toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(normalizedType)) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload a PNG, JPG, JPEG, or WebP image.",
    };
  }

  return {
    valid: true,
  };
}

/**
 * Formats byte count to human-readable string (e.g., "1.4 MB", "350 KB").
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

