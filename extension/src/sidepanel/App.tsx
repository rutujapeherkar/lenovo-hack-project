/**
 * Sahayak AI Extension — Side Panel App Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 28-29 & ARCHITECTURE.md Section 27
 * Phase: P08 — Browser Extension
 * 
 * Contextual companion UI for active browser tabs:
 * - Detects active tab URL & portal
 * - 🟢 Known page vs ⚪ Unknown page indicator
 * - 4 contextual action buttons in English, Marathi, Hindi
 * - Step-by-step form guidance with non-destructive DOM highlighting
 * - Sensitive credential warning & official disclaimer
 */

import React, { useState, useEffect, useCallback } from "react";
import type {
  PageContext,
  FormGuide,
  FormField,
  Language,
  Portal,
  SahayakResponse,
} from "../shared/types";
import { sendTabMessage } from "../shared/messaging";
import { PortalDetector } from "../../../src/core/portals/portal-detector";
import { FormGuideRepository } from "../../../src/core/form-guides/form-guide-repository";

// Trilingual side panel dictionary
export const SIDEPANEL_STRINGS = {
  appName: {
    en: "Sahayak AI",
    mr: "सहायक एआय",
    hi: "सहायक एआई",
  },
  youAreOn: {
    en: "You're on:",
    mr: "तुम्ही येथे आहात:",
    hi: "आप यहां हैं:",
  },
  unknownPortal: {
    en: "External Digital Service",
    mr: "इतर डिजिटल सेवा",
    hi: "अन्य डिजिटल सेवा",
  },
  understoodStatus: {
    en: "Sahayak understands this page",
    mr: "सहायक हे पान ओळखतो",
    hi: "सहायक यह पृष्ठ पहचानता है",
  },
  aiStatus: {
    en: "Sahayak can explain this page using AI",
    mr: "सहायक एआय द्वारे हे पान समजावून सांगू शकतो",
    hi: "सहायक एआई से यह पृष्ठ समझा सकता है",
  },
  howCanIHelp: {
    en: "How can I help you today?",
    mr: "मी तुम्हाला कशी मदत करू?",
    hi: "मैं आपकी क्या सहायता कर सकता हूँ?",
  },
  explainPage: {
    en: "Explain this page",
    mr: "हे पान समजावून सांगा",
    hi: "यह पृष्ठ समझें",
  },
  whatNext: {
    en: "What should I do next?",
    mr: "मी पुढे काय करावे?",
    hi: "मुझे आगे क्या करना चाहिए?",
  },
  fillForm: {
    en: "Help me fill this form",
    mr: "फॉर्म भरण्यास मदत करा",
    hi: "फॉर्म भरने में सहायता",
  },
  reqDocs: {
    en: "Required documents",
    mr: "आवश्यक कागदपत्रे",
    hi: "आवश्यक दस्तावेज़",
  },
  step: {
    en: "Step",
    mr: "टप्पा",
    hi: "चरण",
  },
  of: {
    en: "of",
    mr: "पैकी",
    hi: "का",
  },
  prevStep: {
    en: "Previous",
    mr: "मागे",
    hi: "पिछला",
  },
  nextStep: {
    en: "Next",
    mr: "पुढे",
    hi: "अगला",
  },
  clearHighlight: {
    en: "Clear Highlight / Close Guide",
    mr: "हायलाइट काढा / मार्गदर्शक बंद करा",
    hi: "हाइलाइट हटाएं / गाइड बंद करें",
  },
  fieldNotFound: {
    en: "Field not found on current page.",
    mr: "हे रकाना चालू पृष्ठावर सापडले नाही.",
    hi: "यह फ़ील्ड वर्तमान पृष्ठ पर नहीं मिला।",
  },
  disclaimer: {
    en: "Sahayak AI provides guidance and does not represent a government department. Never enter passwords or OTPs.",
    mr: "सहायक एआय केवळ मार्गदर्शनासाठी आहे आणि कोणत्याही शासकीय विभागाचे प्रतिनिधित्व करत नाही. पासवर्ड किंवा ओटीपी कधीही कोणालाही सांगू नका.",
    hi: "सहायक एआई केवल मार्गदर्शन के लिए है और किसी सरकारी विभाग का प्रतिनिधित्व नहीं करता है। पासवर्ड या ओटीपी कभी साझा न करें।",
  },
  loading: {
    en: "Analyzing page context...",
    mr: "पानाचे विश्लेषण सुरू आहे...",
    hi: "पृष्ठ का विश्लेषण हो रहा है...",
  },
  backToActions: {
    en: "Back to Options",
    mr: "पर्यायांकडे परत",
    hi: "विकल्पों पर वापस",
  },
};

type ActiveView = "menu" | "explain" | "whatNext" | "formGuide" | "documents";

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>("mr");
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [matchedPortal, setMatchedPortal] = useState<Portal | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("menu");
  const [isLoading, setIsLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Form guidance state
  const [currentGuide, setCurrentGuide] = useState<FormGuide | null>(null);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [fieldHighlightError, setFieldHighlightError] = useState<string | null>(null);

  const t = (key: keyof typeof SIDEPANEL_STRINGS): string => {
    return SIDEPANEL_STRINGS[key][language] || SIDEPANEL_STRINGS[key].en;
  };

  // Get active tab and fetch context
  const refreshContext = useCallback(async () => {
    setIsLoading(true);

    if (typeof chrome !== "undefined" && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id && activeTab.url) {
          const portal = PortalDetector.getPortalForUrl(activeTab.url);
          setMatchedPortal(portal || null);

          // Request context from content script
          const res = await sendTabMessage(activeTab.id, { type: "GET_PAGE_CONTEXT" });
          if (res.success && res.data) {
            setPageContext(res.data as PageContext);
          } else {
            // Local fallback context
            setPageContext({
              url: activeTab.url,
              title: activeTab.title,
              domain: new URL(activeTab.url).hostname,
              portalId: portal?.id,
            });
          }
        }
        setIsLoading(false);
      });
    } else {
      // Development mock context for browser / testbed
      const mockUrl = "https://aaplesarkar.mahaonline.gov.in/en/Login";
      const portal = PortalDetector.getPortalForUrl(mockUrl);
      setMatchedPortal(portal || null);
      setPageContext({
        url: mockUrl,
        title: "Aaple Sarkar Citizen Services Portal",
        domain: "aaplesarkar.mahaonline.gov.in",
        portalId: portal?.id,
      });
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContext();
  }, [refreshContext]);

  // Highlight a field via content script
  const triggerFieldHighlight = useCallback(
    async (field: FormField) => {
      setFieldHighlightError(null);

      if (typeof chrome !== "undefined" && chrome.tabs?.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          const tabId = tabs[0]?.id;
          if (tabId) {
            const res = await sendTabMessage(tabId, {
              type: "HIGHLIGHT_FIELD",
              fieldId: field.id,
              selector: field.selector,
            });

            if (!res.success) {
              setFieldHighlightError(t("fieldNotFound"));
            }
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language]
  );

  // Clear highlight
  const handleClearHighlight = useCallback(() => {
    if (typeof chrome !== "undefined" && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0]?.id;
        if (tabId) {
          sendTabMessage(tabId, { type: "CLEAR_HIGHLIGHT" });
        }
      });
    }
    setActiveView("menu");
  }, []);

  // Action: Help me fill this form
  const handleStartFormGuidance = () => {
    const url = pageContext?.url || "";
    const guide =
      FormGuideRepository.matchGuide(url, pageContext?.visibleText) ||
      FormGuideRepository.getGuideById("aaple-sarkar-login");

    if (guide && guide.pages.length > 0 && guide.pages[0].fields.length > 0) {
      setCurrentGuide(guide);
      setCurrentFieldIndex(0);
      setActiveView("formGuide");
      triggerFieldHighlight(guide.pages[0].fields[0]);
    } else {
      setFieldHighlightError(t("fieldNotFound"));
    }
  };

  // Step navigation in form guidance
  const handleNextStep = () => {
    if (!currentGuide) return;
    const fields = currentGuide.pages[0].fields;
    if (currentFieldIndex < fields.length - 1) {
      const nextIdx = currentFieldIndex + 1;
      setCurrentFieldIndex(nextIdx);
      triggerFieldHighlight(fields[nextIdx]);
    }
  };

  const handlePrevStep = () => {
    if (!currentGuide) return;
    const fields = currentGuide.pages[0].fields;
    if (currentFieldIndex > 0) {
      const prevIdx = currentFieldIndex - 1;
      setCurrentFieldIndex(prevIdx);
      triggerFieldHighlight(fields[prevIdx]);
    }
  };

  // Action: Explain this page
  const handleExplainPage = async () => {
    setActiveView("explain");
    setIsLoading(true);

    const isAapleSarkar = pageContext?.url?.includes("aaplesarkar");

    // Local deterministic response or API call
    if (language === "mr") {
      setAiExplanation(
        isAapleSarkar
          ? "हे महाराष्ट्र शासनाचे अधिकृत 'आपले सरकार' नागरिक सेवा पोर्टल आहे. याद्वारे तुम्ही उत्पन्नाचा दाखला, रहिवासी प्रमाणपत्र आणि इतर शासकीय दाखल्यांसाठी ऑनलाइन अर्ज करू शकता आणि अर्जाची स्थिती तपासू शकता."
          : "हे एक सार्वजनिक वेबपेज आहे. सहायक एआय तुम्हाला या पानावर आवश्यक माहिती भरण्यास आणि मार्गदर्शन करण्यास मदत करतो."
      );
    } else if (language === "hi") {
      setAiExplanation(
        isAapleSarkar
          ? "यह महाराष्ट्र सरकार का आधिकारिक 'आपले सरकार' नागरिक सेवा पोर्टल है। इसके माध्यम से आप आय प्रमाण पत्र, निवास प्रमाण पत्र और अन्य सरकारी सेवाओं के लिए ऑनलाइन आवेदन कर सकते हैं।"
          : "यह एक सार्वजनिक वेबपेज है। सहायक एआई आपको इस पृष्ठ पर आवश्यक विवरण भरने और समझने में सहायता करता है।"
      );
    } else {
      setAiExplanation(
        isAapleSarkar
          ? "This is the official Maharashtra Aaple Sarkar citizen services portal. It allows citizens to apply for certificates (Income, Domicile), track application status, and access state revenue services."
          : "This is a digital web page. Sahayak AI helps you understand its purpose and navigate required form fields."
      );
    }

    setIsLoading(false);
  };

  // Action: What should I do next?
  const handleWhatNext = () => {
    setActiveView("whatNext");
  };

  // Action: Required documents
  const handleRequiredDocuments = () => {
    setActiveView("documents");
  };

  const isKnown = Boolean(matchedPortal);
  const portalName = matchedPortal?.name || pageContext?.domain || t("unknownPortal");

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1e293b",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        padding: "16px",
      }}
    >
      {/* 1. Header & Sahayak Branding */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "12px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.5rem" }} aria-hidden="true">🏛️</span>
          <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#003366", letterSpacing: "-0.01em" }}>
            {t("appName")}
          </span>
        </div>

        {/* Trilingual Language Selector */}
        <div style={{ display: "flex", gap: "4px", backgroundColor: "#f1f5f9", padding: "2px", borderRadius: "6px" }}>
          <button
            type="button"
            onClick={() => setLanguage("mr")}
            style={{
              border: "none",
              backgroundColor: language === "mr" ? "#eb6e27" : "transparent",
              color: language === "mr" ? "#ffffff" : "#475569",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            मराठी
          </button>
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            style={{
              border: "none",
              backgroundColor: language === "hi" ? "#eb6e27" : "transparent",
              color: language === "hi" ? "#ffffff" : "#475569",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            style={{
              border: "none",
              backgroundColor: language === "en" ? "#eb6e27" : "transparent",
              color: language === "en" ? "#ffffff" : "#475569",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            EN
          </button>
        </div>
      </div>

      {/* 2. Portal Context Banner */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
          {t("youAreOn")}
        </div>
        <div style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginTop: "2px" }}>
          {portalName}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "2px" }}>
          Maharashtra, India
        </div>

        {/* Status Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "8px",
            paddingTop: "8px",
            borderTop: "1px dashed #cbd5e1",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: isKnown ? "#15803d" : "#475569",
          }}
        >
          <span aria-hidden="true">{isKnown ? "🟢" : "⚪"}</span>
          <span>{isKnown ? t("understoodStatus") : t("aiStatus")}</span>
        </div>
      </div>

      {/* 3. Main Views */}
      {activeView === "menu" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
            {t("howCanIHelp")}
          </div>

          <button
            type="button"
            onClick={handleExplainPage}
            style={actionButtonStyle}
          >
            <span>📖</span>
            <span style={{ flex: 1, textAlign: "left" }}>{t("explainPage")}</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={handleWhatNext}
            style={actionButtonStyle}
          >
            <span>👉</span>
            <span style={{ flex: 1, textAlign: "left" }}>{t("whatNext")}</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={handleStartFormGuidance}
            style={{
              ...actionButtonStyle,
              borderColor: "#eb6e27",
              backgroundColor: "rgba(235, 110, 39, 0.04)",
              fontWeight: 600,
            }}
          >
            <span>✍️</span>
            <span style={{ flex: 1, textAlign: "left", color: "#c2410c" }}>{t("fillForm")}</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={handleRequiredDocuments}
            style={actionButtonStyle}
          >
            <span>📋</span>
            <span style={{ flex: 1, textAlign: "left" }}>{t("reqDocs")}</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* 4. Form Guidance View */}
      {activeView === "formGuide" && currentGuide && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#eb6e27", textTransform: "uppercase" }}>
              {t("step")} {currentFieldIndex + 1} {t("of")} {currentGuide.pages[0].fields.length}
            </span>
            <button
              type="button"
              onClick={handleClearHighlight}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: "0.8125rem", cursor: "pointer" }}
            >
              ✕ {t("backToActions")}
            </button>
          </div>

          {/* Current Field Card */}
          {(() => {
            const field = currentGuide.pages[0].fields[currentFieldIndex];
            return (
              <div
                style={{
                  border: "2px solid #eb6e27",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#fff7ed",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#9a3412" }}>
                  {field.label[language] || field.label.en}
                </div>

                <div style={{ fontSize: "0.875rem", color: "#431407", marginTop: "6px", lineHeight: 1.5 }}>
                  {field.help[language] || field.help.en}
                </div>

                {field.explanation && (
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "1px dashed #fdba74",
                      fontSize: "0.8125rem",
                      color: "#7c2d12",
                    }}
                  >
                    💡 {field.explanation[language] || field.explanation.en}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Field Not Found Alert */}
          {fieldHighlightError && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.8125rem",
                color: "#b91c1c",
              }}
            >
              ⚠️ {fieldHighlightError}
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentFieldIndex === 0}
              style={{
                ...navButtonStyle,
                opacity: currentFieldIndex === 0 ? 0.4 : 1,
              }}
            >
              ← {t("prevStep")}
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentFieldIndex >= currentGuide.pages[0].fields.length - 1}
              style={{
                ...navButtonStyle,
                backgroundColor: "#eb6e27",
                color: "#ffffff",
                borderColor: "#eb6e27",
                opacity: currentFieldIndex >= currentGuide.pages[0].fields.length - 1 ? 0.4 : 1,
              }}
            >
              {t("nextStep")} →
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearHighlight}
            style={{
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#475569",
              padding: "8px",
              borderRadius: "6px",
              fontSize: "0.8125rem",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            {t("clearHighlight")}
          </button>
        </div>
      )}

      {/* 5. Explain Page View */}
      {activeView === "explain" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#003366" }}>
              📖 {t("explainPage")}
            </span>
            <button
              type="button"
              onClick={() => setActiveView("menu")}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: "0.8125rem", cursor: "pointer" }}
            >
              ✕ {t("backToActions")}
            </button>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: "#1e293b",
            }}
          >
            {isLoading ? t("loading") : aiExplanation}
          </div>
        </div>
      )}

      {/* 6. What Next View */}
      {activeView === "whatNext" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#003366" }}>
              👉 {t("whatNext")}
            </span>
            <button
              type="button"
              onClick={() => setActiveView("menu")}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: "0.8125rem", cursor: "pointer" }}
            >
              ✕ {t("backToActions")}
            </button>
          </div>

          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "0.875rem",
              color: "#166534",
              lineHeight: 1.5,
            }}
          >
            {language === "mr"
              ? "१. आपला नोंदणीकृत मोबाइल नंबर व पासवर्ड भरा.\n२. चित्रातील सुरक्षा कॅप्चा कोड अचूक टाईप करा.\n३. 'लॉगिन' बटणावर क्लिक करा.\n४. लॉगिन झाल्यावर 'उत्पन्न दाखला' किंवा आवश्यक सेवा निवडा."
              : language === "hi"
              ? "1. अपना पंजीकृत मोबाइल नंबर और पासवर्ड भरें।\n2. चित्र में दिखाया गया सुरक्षा कैप्चा कोड टाइप करें।\n3. 'लॉगिन' बटन पर क्लिक करें।\n4. लॉगिन के बाद 'आय प्रमाण पत्र' या आवश्यक सेवा चुनें।"
              : "1. Enter your registered mobile number and password.\n2. Type the security captcha code shown in the image.\n3. Click Login to access your citizen dashboard.\n4. Select your required certificate or service."}
          </div>
        </div>
      )}

      {/* 7. Required Documents View */}
      {activeView === "documents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#003366" }}>
              📋 {t("reqDocs")}
            </span>
            <button
              type="button"
              onClick={() => setActiveView("menu")}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: "0.8125rem", cursor: "pointer" }}
            >
              ✕ {t("backToActions")}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              {
                name: language === "mr" ? "ओळखीचा पुरावा (आधार / मतदार ओळखपत्र)" : language === "hi" ? "पहचान का प्रमाण (आधार / वोटर आईडी)" : "Proof of Identity (Aadhaar / Voter ID)",
                type: "Mandatory",
              },
              {
                name: language === "mr" ? "पत्त्याचा पुरावा (रेशन कार्ड / वीज बिल)" : language === "hi" ? "पते का प्रमाण (राशन कार्ड / बिजली बिल)" : "Proof of Address (Ration Card / Electricity Bill)",
                type: "Mandatory",
              },
              {
                name: language === "mr" ? "उत्पन्नाचा पुरावा (तलाठी अहवाल / वेतन प्रमाणपत्र)" : language === "hi" ? "आय का प्रमाण (तलाठी रिपोर्ट / वेतन पर्ची)" : "Proof of Income (Talathi Report / Salary Certificate)",
                type: "Mandatory",
              },
            ].map((doc, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  fontSize: "0.8125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📄</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{doc.name}</span>
                <span style={{ fontSize: "0.6875rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#fef3c7", color: "#92400e" }}>
                  {doc.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Mandatory Civic Disclaimer & Sensitive Data Warning */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #f1f5f9",
          fontSize: "0.6875rem",
          color: "#94a3b8",
          lineHeight: 1.4,
          textAlign: "center",
        }}
      >
        🔒 {t("disclaimer")}
      </div>
    </div>
  );
};

const actionButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  backgroundColor: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "0.875rem",
  color: "#1e293b",
  cursor: "pointer",
  transition: "all 0.15s ease",
  fontWeight: 500,
};

const navButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px 12px",
  backgroundColor: "#f1f5f9",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#334155",
  cursor: "pointer",
};
