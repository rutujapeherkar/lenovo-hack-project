/**
 * Sahayak AI — Accessible Fallback View Component
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 35 & UI.md Section 46
 * Phase: P10 — Trust, Safety & Fallback
 * 
 * Handles graceful degradation across:
 * 1. ai_failure: External AI provider timeout, rate limit, or model crash.
 * 2. network_failure: Browser offline or API network drop.
 * 3. unknown_service: Service requested is not present in verified registry.
 * 4. unknown_scheme: No verified scheme matches criteria.
 * 5. unknown_page: Extension encounters unsupported external domain.
 * 6. unsupported_voice: Web Speech API missing or permission blocked.
 */

import React from "react";
import { Card, CardHeader, CardTitle, CardBody, Button } from "../ui";
import { Link } from "../../router";
import type { Language } from "../../core/shared/types";

export type FallbackReason =
  | "ai_failure"
  | "network_failure"
  | "unknown_service"
  | "unknown_scheme"
  | "unknown_page"
  | "unsupported_voice";

export interface FallbackViewProps {
  reason: FallbackReason;
  language?: Language;
  onRetry?: () => void;
  customTitle?: string;
  customMessage?: string;
  className?: string;
}

const FALLBACK_CONTENT: Record<
  FallbackReason,
  Record<Language, { title: string; message: string; hint: string }>
> = {
  ai_failure: {
    en: {
      title: "Service Assistance Temporarily Unavailable",
      message: "Sahayak could not process that request right now.",
      hint: "You can try again or continue with verified deterministic service guides.",
    },
    mr: {
      title: "सहायता सेवा तात्पुरती अनुपलब्ध",
      message: "साहायक या वेळी आपल्या विनंतीवर प्रक्रिया करू शकला नाही.",
      hint: "आपण पुन्हा प्रयत्न करू शकता किंवा उपलब्ध अधिकृत सेवा मार्गदर्शन पाहू शकता.",
    },
    hi: {
      title: "सहायता सेवा अस्थायी रूप से अनुपलब्ध",
      message: "साहायक इस समय आपके अनुरोध पर कार्रवाई नहीं कर सका।",
      hint: "आप पुनः प्रयास कर सकते हैं या उपलब्ध आधिकारिक सेवा मार्गदर्शन देख सकते हैं।",
    },
  },
  network_failure: {
    en: {
      title: "Network Connection Issue",
      message: "Unable to connect to Sahayak services. Please check your internet connection.",
      hint: "Cached verified service guidance may still be accessible offline.",
    },
    mr: {
      title: "इंटरनेट कनेक्शन समस्या",
      message: "साहायक सेवांशी संपर्क होऊ शकला नाही. कृपया आपले इंटरनेट तपासा.",
      hint: "पूर्वी पाहिलेली शासकीय सेवा माहिती ऑफलाइन उपलब्ध असू शकते.",
    },
    hi: {
      title: "नेटवर्क कनेक्शन समस्या",
      message: "साहायक सेवाओं से कनेक्ट नहीं हो सका। कृपया अपना इंटरनेट जांचें।",
      hint: "पहले देखी गई सेवा जानकारी ऑफ़लाइन उपलब्ध हो सकती है।",
    },
  },
  unknown_service: {
    en: {
      title: "No Verified Service Match",
      message: "I couldn't find a verified Sahayak service matching your request.",
      hint: "Sahayak strictly uses verified Maharashtra government services to prevent misinformation.",
    },
    mr: {
      title: "कोणतीही पडताळलेली सेवा सापडली नाही",
      message: "आपल्या विनंतीशी जुळणारी अधिकृत पडताळलेली सेवा सापडली नाही.",
      hint: "चुकीची माहिती टाळण्यासाठी साहायक केवळ अधिकृत पडताळलेल्या सेवांचे मार्गदर्शन करतो.",
    },
    hi: {
      title: "कोई सत्यापित सेवा नहीं मिली",
      message: "आपके अनुरोध से मेल खाने वाली कोई सत्यापित सेवा नहीं मिली।",
      hint: "गलत जानकारी से बचने के लिए साहायक केवल सत्यापित सेवाओं का मार्गदर्शन करता है।",
    },
  },
  unknown_scheme: {
    en: {
      title: "No Verified Schemes Found",
      message: "No verified scheme matched the information provided.",
      hint: "Try broadening your category filter or explore the full registry.",
    },
    mr: {
      title: "कोणतीही पडताळलेली योजना सापडली नाही",
      message: "दिलेल्या निकषांनुसार कोणतीही पडताळलेली कल्याणकारी योजना आढळली नाही.",
      hint: "कृपया वर्गवारी किंवा कीवर्ड बदलून पुन्हा शोध घ्या.",
    },
    hi: {
      title: "कोई सत्यापित योजना नहीं मिली",
      message: "दी गई जानकारी से मेल खाने वाली कोई योजना नहीं मिली।",
      hint: "कृपया श्रेणी या कीवर्ड बदलकर पुनः खोजें।",
    },
  },
  unknown_page: {
    en: {
      title: "Unverified Page",
      message: "Sahayak does not have a verified guide for this page.",
      hint: "You can ask Sahayak to explain the visible screen content instead.",
    },
    mr: {
      title: "अनोळखी वेब पृष्ठ",
      message: "साहायककडे या पृष्ठासाठी पडताळलेले मार्गदर्शक उपलब्ध नाही.",
      hint: "आपण साहायकला या स्क्रीनवरील दृश्य माहिती समजावून सांगण्यास विचारू शकता.",
    },
    hi: {
      title: "अज्ञात वेब पृष्ठ",
      message: "साहायक के पास इस पृष्ठ के लिए कोई सत्यापित गाइड नहीं है।",
      hint: "आप साहायक से इस स्क्रीन की दृश्य सामग्री समझाने का अनुरोध कर सकते हैं।",
    },
  },
  unsupported_voice: {
    en: {
      title: "Voice Input Unavailable",
      message: "Voice input is not supported in this browser.",
      hint: "Please type your request in the search or chat box instead.",
    },
    mr: {
      title: "व्हॉइस इनपुट अनुपलब्ध",
      message: "या ब्राउझरमध्ये आवाज ओळख समर्थित नाही.",
      hint: "कृपया आपला प्रश्न टाइप करून विचारा.",
    },
    hi: {
      title: "वॉयस इनपुट अनुपलब्ध",
      message: "इस ब्राउज़र में आवाज़ इनपुट समर्थित नहीं है।",
      hint: "कृपया अपना प्रश्न लिखकर पूछें।",
    },
  },
};

export const FallbackView: React.FC<FallbackViewProps> = ({
  reason,
  language = "en",
  onRetry,
  customTitle,
  customMessage,
  className = "",
}) => {
  const content = FALLBACK_CONTENT[reason][language] || FALLBACK_CONTENT[reason].en;
  const title = customTitle || content.title;
  const message = customMessage || content.message;

  return (
    <Card
      variant="interactive"
      className={`fallback-view-card ${className}`.trim()}
      style={{
        borderLeft: "4px solid var(--sahayak-blue)",
        maxWidth: "600px",
        margin: "var(--space-4) auto",
      }}
    >
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span style={{ fontSize: "1.375rem" }} aria-hidden="true">
            {reason === "network_failure" ? "📡" : reason === "unsupported_voice" ? "🎙️" : "ℹ️"}
          </span>
          <CardTitle style={{ margin: 0, fontSize: "1.125rem" }}>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        <p style={{ color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 var(--space-2) 0" }}>
          {message}
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 var(--space-6) 0" }}>
          {content.hint}
        </p>

        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry}>
              ↻ {language === "mr" ? "पुन्हा प्रयत्न करा" : language === "hi" ? "पुनः प्रयास करें" : "Try Again"}
            </Button>
          )}

          <Link href="/services">
            <Button variant="outline" size="sm">
              🧭 {language === "mr" ? "सर्व सेवा पहा" : language === "hi" ? "सभी सेवाएं देखें" : "Browse Services"}
            </Button>
          </Link>

          <Link href="/schemes">
            <Button variant="outline" size="sm">
              📜 {language === "mr" ? "योजना शोधा" : language === "hi" ? "योजनाएं खोजें" : "Explore Schemes"}
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};
