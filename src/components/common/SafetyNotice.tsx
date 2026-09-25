/**
 * Sahayak AI — Citizen Safety & Trust Notice Component
 * 
 * Source of Truth: docs/source-of-truth/SECURITY.md Section 3, 20 & OFFICIAL-SOURCES.md
 * Phase: P10 — Trust, Safety & Fallback
 * 
 * Notice Variants:
 * 1. credential: Warning when user accidentally types or mentions OTP, PIN, password.
 * 2. disclaimer: Mandatory civic guidance notice explaining Sahayak is not a government body.
 * 3. payment: Safety guidance during statutory fee payment steps.
 * 4. unverified: Clear indicator that procedure or portal route is pending verification.
 */

import React from "react";
import { Alert } from "../ui";
import type { Language } from "../../core/shared/types";
import { getPaymentSafetyNotice } from "../../core/security/payment-guard";
import { SENSITIVE_WARNING_MESSAGES } from "../../core/security/sanitizer";

export type SafetyNoticeType =
  | "credential"
  | "disclaimer"
  | "payment"
  | "unverified";

export interface SafetyNoticeProps {
  type: SafetyNoticeType;
  language?: Language;
  title?: string;
  customMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DISCLAIMER_TEXTS = {
  en: "Sahayak AI provides guidance and does not represent a government department. Requirements and procedures may change. Verify current information on the official service portal before submitting an application.",
  mr: "साहायक एआय नागरिकांच्या मार्गदर्शनासाठी आहे आणि कोणत्याही शासकीय विभागाचे प्रतिनिधित्व करत नाही. नियम व प्रक्रिया बदलू शकतात. अर्ज सादर करण्यापूर्वी अधिकृत पोर्टलवरील माहितीची खात्री करा.",
  hi: "साहायक एआई नागरिकों के मार्गदर्शन के लिए है और किसी सरकारी विभाग का प्रतिनिधित्व नहीं करता है। नियम व प्रक्रियाएं बदल सकती हैं। आवेदन जमा करने से पहले आधिकारिक पोर्टल पर जानकारी सत्यापित करें।",
};

const UNVERIFIED_TEXTS = {
  en: "Information for this service route is currently pending official verification. Please verify requirements on the official government website.",
  mr: "या सेवेची माहिती सध्या अधिकृत पडताळणी अंतर्गत आहे. कृपया अधिकृत शासकीय संकेतस्थळावरून खात्री करा.",
  hi: "इस सेवा मार्ग की जानकारी वर्तमान में आधिकारिक सत्यापन के अधीन है। कृपया आधिकारिक सरकारी वेबसाइट पर जांच करें।",
};

export const SafetyNotice: React.FC<SafetyNoticeProps> = ({
  type,
  language = "mr",
  title,
  customMessage,
  className = "",
  style,
}) => {
  if (type === "credential") {
    const alertTitle =
      title ||
      (language === "mr"
        ? "गोपनीय माहिती सुरक्षा इशारा"
        : language === "hi"
        ? "गोपनीय क्रेडेंशियल सुरक्षा चेतावनी"
        : "Sensitive Information Alert");

    const message = customMessage || SENSITIVE_WARNING_MESSAGES[language];

    return (
      <Alert
        variant="error"
        title={alertTitle}
        className={className}
        style={{ ...style, borderLeft: "4px solid var(--error, #DC2626)" }}
      >
        <p style={{ margin: 0, fontWeight: 500 }}>{message}</p>
        <p
          style={{
            margin: "var(--space-2) 0 0 0",
            fontSize: "0.8125rem",
            color: "var(--text-secondary)",
          }}
        >
          {language === "mr"
            ? "साहायक कोणत्याही शासकीय किंवा बँक खात्याचे पासवर्ड साठवत नाही."
            : language === "hi"
            ? "साहायक किसी भी सरकारी या बैंक खाते का पासवर्ड संग्रहीत नहीं करता है।"
            : "Sahayak never stores or transmits authentication credentials."}
        </p>
      </Alert>
    );
  }

  if (type === "disclaimer") {
    const alertTitle =
      title ||
      (language === "mr"
        ? "नागरिक सहाय्यक सूचना"
        : language === "hi"
        ? "नागरिक सहायता सूचना"
        : "Civic Guidance Notice");

    const message = customMessage || DISCLAIMER_TEXTS[language];

    return (
      <Alert
        variant="disclaimer"
        title={alertTitle}
        className={className}
        style={style}
      >
        {message}
      </Alert>
    );
  }

  if (type === "payment") {
    const paymentNotice = getPaymentSafetyNotice(language);
    const alertTitle = title || paymentNotice.title;

    return (
      <div
        role="region"
        aria-label={alertTitle}
        className={`payment-safety-card ${className}`.trim()}
        style={{
          backgroundColor: "#FEF3C7", // Soft warm warning amber
          border: "2px solid #D97706",
          borderRadius: "var(--radius-card, 8px)",
          padding: "var(--space-4)",
          marginBottom: "var(--space-4)",
          ...style,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
          <span style={{ fontSize: "1.25rem" }} aria-hidden="true">🛡️</span>
          <strong style={{ fontSize: "1rem", color: "#92400E" }}>
            {alertTitle}
          </strong>
        </div>

        <p style={{ fontSize: "0.9375rem", color: "#78350F", margin: "0 0 var(--space-2) 0", lineHeight: 1.5 }}>
          {paymentNotice.message}
        </p>

        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#B45309", margin: "0 0 var(--space-3) 0" }}>
          ⚠️ {paymentNotice.warning}
        </p>

        <ul style={{ margin: 0, paddingLeft: "var(--space-5)", fontSize: "0.8125rem", color: "#78350F", lineHeight: 1.5 }}>
          {paymentNotice.instructions.map((inst, i) => (
            <li key={i} style={{ marginBottom: "2px" }}>
              {inst}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Unverified notice
  const alertTitle =
    title ||
    (language === "mr"
      ? "पडताळणी प्रलंबित माहिती"
      : language === "hi"
      ? "सत्यापन लंबित सूचना"
      : "Pending Verification");

  const message = customMessage || UNVERIFIED_TEXTS[language];

  return (
    <Alert
      variant="warning"
      title={alertTitle}
      className={className}
      style={style}
    >
      {message}
    </Alert>
  );
};
