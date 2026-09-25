/**
 * Sahayak AI — Security Sanitizer & Credential Interception Guard
 * 
 * Source of Truth: docs/source-of-truth/SECURITY.md Section 3, 20 & P10 Specification
 * Phase: P10 — Trust, Safety & Fallback
 * 
 * Invariants:
 * 1. Zero storage or transmission of passwords, OTPs, PINs, CVVs, or financial credentials.
 * 2. Client-side and server-side redacting of sensitive tokens to [REDACTED].
 * 3. Never forward sensitive tokens to AI providers or log them to console/disk.
 * 4. Localized citizen safety warnings across Marathi, Hindi, and English.
 */

import type { Language } from "../shared/types";

export const SENSITIVE_WARNING_MESSAGES: Record<Language, string> = {
  en: "Please do not share your OTP, PIN, password, or banking credentials with Sahayak.",
  mr: "कृपया आपला ओटीपी, पिन, पासवर्ड किंवा बँक तपशील साहायक सोबत शेअर करू नका.",
  hi: "कृपया अपना ओटीपी, पिन, पासवर्ड या बैंकिंग विवरण साहायक के साथ साझा न करें।",
};

/**
 * Regex patterns detecting sensitive credentials (OTPs, PINs, passwords, CVVs, card numbers)
 */
export const SENSITIVE_PATTERNS = [
  // 1. OTP patterns (digits near OTP phrases or standalone labeled OTPs)
  /\b(otp|one[- ]time[- ]password|verification[- ]code)\s*[:=]?\s*(\d{4,8})\b/i,
  /(ओटीपी|वन[- ]टाइम[- ]पासवर्ड)\s*[:=]?\s*(\d{4,8})/i,
  /\b(\d{4,8})\s*(is your|आहे आपला|है आपका)?\s*(otp|one[- ]time[- ]password|ओटीपी)\b/i,
  /\b(my|the)?\s*otp\s*(is|:)?\s*(\d{4,8})\b/i,

  // 2. UPI / ATM / Bank PINs
  /\b(upi[- ]pin|atm[- ]pin|mpin|card[- ]pin|secret[- ]pin)\s*[:=]?\s*(\d{4,6})\b/i,
  /(यूपीआय[- ]पिन|एमपिन|एटीएम[- ]पिन|पिन)\s*[:=]?\s*(\d{4,6})/i,
  /\b(pin)\s*[:=]?\s*(\d{4,6})\b/i,

  // 3. Passwords & Passcodes
  /\b(password|passwd|passcode)\s*[:=]?\s*([^\s]{4,})/i,
  /(पासवर्ड|पासकोड|गुप्त शब्द|गुपित शब्द)\s*[:=]?\s*([^\s]{4,})/i,

  // 4. CVV / CVC
  /\b(cvv|cvc|security[- ]code)\s*[:=]?\s*(\d{3,4})\b/i,
  /(सीव्हीव्ही|सीवीवी)\s*[:=]?\s*(\d{3,4})/i,

  // 5. Payment Cards (16-digit card numbers)
  /\b(?:\d{4}[ -]?){3}\d{4}\b/,

  // 6. Generic sensitive credential keywords asking for assistance
  /\b(enter|fill|type|submit|put|auto[- ]?fill)\s+(my\s+)?(otp|pin|password|passcode|cvv)\b/i,
  /\bcan you enter my (otp|pin|password)\b/i,
  /(माझा|माझे|माझी)?\s*(ओटीपी|पिन|पासवर्ड)\s*(भरा|टाका|प्रविष्ट करा)/i,
  /(मेरा|मेरी)?\s*(ओटीपी|पिन|पासवर्ड)\s*(दर्ज करें|डालें|भरें)/i,
];

/**
 * Checks if a given text contains sensitive credentials
 */
export function containsSensitiveData(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Redacts sensitive tokens from user text, replacing numbers/secrets with [REDACTED]
 */
export function redactSensitiveData(text: string): string {
  if (!text || typeof text !== "string") return "";

  let result = text;

  // Redact OTP with labeled numbers: "OTP: 948210" -> "OTP: [REDACTED]"
  result = result.replace(
    /\b(otp|one[- ]time[- ]password|verification[- ]code)\s*([:=]?)\s*\d{4,8}\b/gi,
    "$1$2 [REDACTED]"
  );
  result = result.replace(
    /(ओटीपी|वन[- ]टाइम[- ]पासवर्ड)\s*([:=]?)\s*\d{4,8}/gi,
    "$1$2 [REDACTED]"
  );

  // Redact "is your OTP" / "OTP is": "948210 is your OTP" -> "[REDACTED] is your OTP"
  result = result.replace(
    /\b\d{4,8}(\s+(?:is your|आहे आपला|है आपका)?\s*(?:otp|one[- ]time[- ]password|ओटीपी))\b/gi,
    "[REDACTED]$1"
  );
  result = result.replace(
    /\b((?:my|the)?\s*otp\s*(?:is|:)?\s*)\d{4,8}\b/gi,
    "$1[REDACTED]"
  );

  // Redact PINs: "UPI PIN: 1234" -> "UPI PIN: [REDACTED]"
  result = result.replace(
    /\b(upi[- ]pin|atm[- ]pin|mpin|card[- ]pin|secret[- ]pin|pin)\s*([:=]?)\s*\d{4,6}\b/gi,
    "$1$2 [REDACTED]"
  );
  result = result.replace(
    /(यूपीआय[- ]पिन|एमपिन|एटीएम[- ]पिन|पिन)\s*([:=]?)\s*\d{4,6}/gi,
    "$1$2 [REDACTED]"
  );

  // Redact Passwords: "password: secret123" -> "password: [REDACTED]"
  result = result.replace(
    /\b(password|passwd|passcode)\s*([:=]?)\s*[^\s]{4,}\b/gi,
    "$1$2 [REDACTED]"
  );
  result = result.replace(
    /(पासवर्ड|पासकोड|गुप्त शब्द|गुपित शब्द)\s*([:=]?)\s*[^\s]{4,}/gi,
    "$1$2 [REDACTED]"
  );

  // Redact CVV: "CVV 432" -> "CVV [REDACTED]"
  result = result.replace(
    /\b(cvv|cvc|security[- ]code)\s*([:=]?)\s*\d{3,4}\b/gi,
    "$1$2 [REDACTED]"
  );
  result = result.replace(
    /(सीव्हीव्ही|सीवीवी)\s*([:=]?)\s*\d{3,4}/gi,
    "$1$2 [REDACTED]"
  );

  // Redact 16-digit cards
  result = result.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, "[REDACTED_CARD]");

  return result;
}

export interface SanitizationResult {
  sanitized: string;
  isSensitive: boolean;
  warningMessage: string;
}

/**
 * Full sanitization pipeline for incoming citizen inputs
 */
export function sanitizeUserInput(
  text: string,
  language: Language = "mr"
): SanitizationResult {
  const isSensitive = containsSensitiveData(text);
  const sanitized = isSensitive ? redactSensitiveData(text) : text;
  const warningMessage =
    SENSITIVE_WARNING_MESSAGES[language] || SENSITIVE_WARNING_MESSAGES.en;

  return {
    sanitized,
    isSensitive,
    warningMessage,
  };
}
