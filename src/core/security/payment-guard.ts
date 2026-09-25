/**
 * Sahayak AI — Payment Safety & Financial Transaction Guard
 * 
 * Source of Truth: docs/source-of-truth/SECURITY.md Section 20 & PRODUCT.md Section 15
 * Phase: P10 — Trust, Safety & Fallback
 * 
 * Invariants:
 * 1. Sahayak NEVER collects UPI PINs, ATM PINs, CVVs, or card credentials.
 * 2. Sahayak NEVER performs or authorizes financial transactions.
 * 3. During statutory fee steps (e.g., Aaple Sarkar ₹33.60), auto-guidance pauses
 *    and clear instructions direct the citizen to authorize payment in their banking app.
 */

import type { Language, TaskStep } from "../shared/types";

export interface PaymentSafetyNotice {
  title: string;
  message: string;
  warning: string;
  instructions: string[];
}

export const PAYMENT_SAFETY_NOTICES: Record<Language, PaymentSafetyNotice> = {
  en: {
    title: "Official Payment Safety Notice",
    message: "This step requires paying official government statutory fees.",
    warning: "Never enter your UPI PIN, banking password, or card CVV inside Sahayak. Sahayak will NEVER ask you for financial credentials.",
    instructions: [
      "Select your preferred official payment method (UPI, Net Banking, or Debit Card) on the government portal.",
      "Authorize the payment strictly inside your bank's official app or on the verified gateway.",
      "Save the official GRAS / MahaOnline receipt number upon successful payment.",
    ],
  },
  mr: {
    title: "अधिकृत शासकीय पेमेंट सुरक्षा सूचना",
    message: "या पायरीवर अधिकृत शासकीय सेवा शुल्क भरणे आवश्यक आहे.",
    warning: "आपला यूपीआय पिन (UPI PIN), बँक पासवर्ड किंवा कार्ड CVV कधीही साहायकमध्ये प्रविष्ट करू नका. साहायक कधीही गोपनीय बँक माहिती विचारत नाही.",
    instructions: [
      "शासकीय पोर्टलवर आपली पसंतीची पेमेंट पद्धत (UPI, नेट बँकिंग किंवा डेबिट कार्ड) निवडा.",
      "पेमेंट केवळ आपल्या बँकेच्या अधिकृत ॲपमध्ये किंवा अधिकृत गेटवेवरच अधिकृत (Authorize) करा.",
      "पेमेंट यशस्वी झाल्यानंतर अधिकृत GRAS / महाऑनलाइन पावती क्रमांक (Receipt) जपून ठेवा.",
    ],
  },
  hi: {
    title: "आधिकारिक सरकारी भुगतान सुरक्षा सूचना",
    message: "इस चरण में आधिकारिक सरकारी सेवा शुल्क का भुगतान आवश्यक है।",
    warning: "अपना यूपीआई पिन (UPI PIN), बैंक पासवर्ड या कार्ड CVV कभी भी साहायक में दर्ज न करें। साहायक कभी भी गोपनीय बैंकिंग क्रेडेंशियल नहीं मांगता है।",
    instructions: [
      "सरकारी पोर्टल पर अपनी पसंदीदा भुगतान विधि (UPI, नेट बैंकिंग या डेबिट कार्ड) चुनें।",
      "भुगतान केवल अपने बैंक के आधिकारिक ऐप या सत्यापित गेटवे पर ही अधिकृत करें।",
      "भुगतान सफल होने के बाद आधिकारिक GRAS / महाऑनलाइन रसीद संख्या सुरक्षित रखें।",
    ],
  },
};

// Simple substring keywords (no false-positive risk)
const PAYMENT_KEYWORDS = [
  "fee",
  "payment",
  "charges",
  "statutory fee",
  "₹",
  "gras",
  "challan",
  "शुल्क",
  "फी",
  "पैसे",
  "पेमेंट",
  "चलन",
  "भुगतान",
];

// Regex patterns for keywords that need word-boundary checks to avoid false positives
// e.g. "rs." must not match inside "years." or "hours."
const PAYMENT_KEYWORD_PATTERNS = [
  /\brs\.\s*\d/i,           // "Rs. 33" or "rs.33" — currency amount
  /rupee/i,                  // "rupees"
];

/**
 * Determines if a task step or description represents a payment/fee interaction
 */
export function isPaymentStep(stepOrText: TaskStep | string | null | undefined): boolean {
  if (!stepOrText) return false;

  let textToAnalyze = "";

  if (typeof stepOrText === "string") {
    textToAnalyze = stepOrText;
  } else if (typeof stepOrText === "object") {
    const titleText = `${stepOrText.title?.en || ""} ${stepOrText.title?.mr || ""} ${stepOrText.title?.hi || ""}`;
    const descText = `${stepOrText.description?.en || ""} ${stepOrText.description?.mr || ""} ${stepOrText.description?.hi || ""}`;
    textToAnalyze = `${titleText} ${descText}`;
  }

  const lower = textToAnalyze.toLowerCase();
  if (PAYMENT_KEYWORDS.some((kw) => lower.includes(kw))) return true;
  if (PAYMENT_KEYWORD_PATTERNS.some((pattern) => pattern.test(textToAnalyze))) return true;
  return false;
}

/**
 * Returns localized payment safety notice and instructions
 */
export function getPaymentSafetyNotice(language: Language = "mr"): PaymentSafetyNotice {
  return PAYMENT_SAFETY_NOTICES[language] || PAYMENT_SAFETY_NOTICES.en;
}
