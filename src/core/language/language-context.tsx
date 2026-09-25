/**
 * Sahayak AI — Global Language Context & Localized Strings Dictionary
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 24 & DATA-CONTRACTS.md Section 1
 * Phase: P05 — Services & Deterministic Task Guidance
 * 
 * Provides reactive language state across the entire application,
 * guaranteeing seamless language switching without breaking active task journeys.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Language } from "../shared/types";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export type TranslationKey =
  | "servicesTitle"
  | "servicesSubtitle"
  | "searchPlaceholder"
  | "allCategories"
  | "noServicesFound"
  | "viewGuidance"
  | "requiredDocsCount"
  | "stepsCount"
  | "backToServices"
  | "whatIsIt"
  | "requiredDocuments"
  | "documentsGuidance"
  | "docsPrepared"
  | "stepRoadmap"
  | "stepOf"
  | "of"
  | "prevStep"
  | "nextStep"
  | "taskCompleted"
  | "taskCompletedDesc"
  | "officialSource"
  | "officialSourceVerified"
  | "applyOnPortal"
  | "viewOfficialInfo"
  | "unverifiedApplicationRoute"
  | "disclaimer"
  | "completedStatus"
  | "currentStatus"
  | "upcomingStatus"
  | "browseAllServices"
  | "filterByCategory";

export const UI_TRANSLATIONS: Record<TranslationKey, Record<Language, string>> = {
  servicesTitle: {
    en: "Government Services & Certificates",
    mr: "महाराष्ट्र शासकीय सेवा व प्रमाणपत्रे",
    hi: "महाराष्ट्र सरकारी सेवाएं और प्रमाण पत्र",
  },
  servicesSubtitle: {
    en: "Verified step-by-step guidance and document checklists for Maharashtra public services",
    mr: "महाराष्ट्र शासकीय सेवांसाठी पडताळलेले टप्प्याटप्प्याने मार्गदर्शन आणि आवश्यक कागदपत्रे",
    hi: "महाराष्ट्र सरकारी सेवाओं के लिए सत्यापित चरण-दर-चरण मार्गदर्शन और आवश्यक दस्तावेज",
  },
  searchPlaceholder: {
    en: "Search by service or certificate (e.g., Income Certificate, Domicile)...",
    mr: "सेवा किंवा दाखल्याचे नाव शोधा (उदा. उत्पन्न प्रमाणपत्र, रहिवासी दाखला)...",
    hi: "सेवा या प्रमाण पत्र का नाम खोजें (उदा. आय प्रमाण पत्र, निवास प्रमाण पत्र)...",
  },
  allCategories: {
    en: "All Categories",
    mr: "सर्व वर्गवारी",
    hi: "सभी श्रेणियां",
  },
  noServicesFound: {
    en: "I couldn't find a verified Maharashtra service matching your request.",
    mr: "आपल्या शोधाशी जुळणारी पडताळलेली महाराष्ट्र शासकीय सेवा आढळली नाही.",
    hi: "आपके अनुरोध से मेल खाती कोई सत्यापित महाराष्ट्र सरकारी सेवा नहीं मिली।",
  },
  viewGuidance: {
    en: "View Guidance",
    mr: "मार्गदर्शन पहा",
    hi: "मार्गदर्शन देखें",
  },
  requiredDocsCount: {
    en: "Required Documents",
    mr: "आवश्यक कागदपत्रे",
    hi: "आवश्यक दस्तावेज",
  },
  stepsCount: {
    en: "Guided Steps",
    mr: "मार्गदर्शित पायऱ्या",
    hi: "मार्गदर्शित चरण",
  },
  backToServices: {
    en: "Back to All Services",
    mr: "सर्व सेवांकडे परत",
    hi: "सभी सेवाओं पर वापस",
  },
  whatIsIt: {
    en: "What is this service?",
    mr: "ही सेवा काय आहे?",
    hi: "यह सेवा क्या है?",
  },
  requiredDocuments: {
    en: "Mandatory Document Checklist",
    mr: "आवश्यक कागदपत्रांची यादी",
    hi: "आवश्यक दस्तावेजों की चेकलिस्ट",
  },
  documentsGuidance: {
    en: "Verify and check off documents as you prepare them before visiting the official portal.",
    mr: "अधिकृत पोर्टलवर जाण्यापूर्वी ही कागदपत्रे तयार ठेवा आणि खूण करा.",
    hi: "आधिकारिक पोर्टल पर जाने से पहले इन दस्तावेजों को तैयार रखें और चेक करें।",
  },
  docsPrepared: {
    en: "documents prepared",
    mr: "कागदपत्रे तयार",
    hi: "दस्तावेज तैयार",
  },
  stepRoadmap: {
    en: "Step-by-Step Task Guidance",
    mr: "टप्प्याटप्प्याने कार्य मार्गदर्शन",
    hi: "चरण-दर-चरण कार्य मार्गदर्शन",
  },
  stepOf: {
    en: "Step",
    mr: "पायरी",
    hi: "चरण",
  },
  of: {
    en: "of",
    mr: "पैकी",
    hi: "का",
  },
  prevStep: {
    en: "Previous Step",
    mr: "मागील पायरी",
    hi: "पिछला चरण",
  },
  nextStep: {
    en: "Next Step",
    mr: "पुढील पायरी",
    hi: "अगला चरण",
  },
  taskCompleted: {
    en: "Workflow Guidance Completed",
    mr: "कार्यप्रणाली मार्गदर्शन पूर्ण झाले",
    hi: "कार्यप्रणाली मार्गदर्शन पूरा हुआ",
  },
  taskCompletedDesc: {
    en: "You have reviewed all official procedural steps. You can now access the verified government portal to proceed with your application.",
    mr: "तुम्ही सर्व अधिकृत प्रशासकीय पायऱ्या तपासल्या आहेत. आता तुम्ही अर्जाची प्रक्रिया सुरू करण्यासाठी अधिकृत सरकारी पोर्टलवर जाऊ शकता.",
    hi: "आपने सभी आधिकारिक प्रक्रियात्मक चरणों की समीक्षा कर ली है। अब आप अपने आवेदन को आगे बढ़ाने के लिए आधिकारिक सरकारी पोर्टल पर जा सकते हैं।",
  },
  officialSource: {
    en: "Official Government Source",
    mr: "अधिकृत शासकीय स्रोत",
    hi: "आधिकारिक सरकारी स्रोत",
  },
  officialSourceVerified: {
    en: "Verified Government of Maharashtra Portal",
    mr: "पडताळणीकृत महाराष्ट्र शासन पोर्टल",
    hi: "सत्यापित महाराष्ट्र सरकार पोर्टल",
  },
  applyOnPortal: {
    en: "Apply on Official Portal",
    mr: "अधिकृत पोर्टलवर अर्ज करा",
    hi: "आधिकारिक पोर्टल पर आवेदन करें",
  },
  viewOfficialInfo: {
    en: "View Official Information",
    mr: "अधिकृत माहिती पहा",
    hi: "आधिकारिक जानकारी देखें",
  },
  unverifiedApplicationRoute: {
    en: "Official application route is not currently verified online.",
    mr: "अधिकृत थेट अर्ज मार्ग सध्या ऑनलाइन पडताळलेला नाही.",
    hi: "आधिकारिक प्रत्यक्ष आवेदन मार्ग वर्तमान में ऑनलाइन सत्यापित नहीं है।",
  },
  disclaimer: {
    en: "Sahayak AI provides procedural and documentary guidance only. Sahayak does not automatically submit forms, collect fees, or handle OTPs.",
    mr: "सहायक एआय केवळ प्रशासकीय आणि कागदपत्रांचे मार्गदर्शन करते. सहायक आपोआप अर्ज सादर करत नाही, शुल्क गोळा करत नाही किंवा ओटीपी मागत नाही.",
    hi: "सहायक एआई केवल प्रक्रियात्मक और दस्तावेजी मार्गदर्शन प्रदान करता है। सहायक स्वचालित रूप से फॉर्म जमा नहीं करता, शुल्क एकत्र नहीं करता या ओटीपी नहीं मांगता।",
  },
  completedStatus: {
    en: "Completed",
    mr: "पूर्ण",
    hi: "पूर्ण",
  },
  currentStatus: {
    en: "Current Step",
    mr: "सध्याची पायरी",
    hi: "वर्तमान चरण",
  },
  upcomingStatus: {
    en: "Upcoming Step",
    mr: "पुढील पायरी",
    hi: "आगामी चरण",
  },
  browseAllServices: {
    en: "Browse All Available Services",
    mr: "सर्व उपलब्ध सेवा पहा",
    hi: "सभी उपलब्ध सेवाएं देखें",
  },
  filterByCategory: {
    en: "Filter by Category",
    mr: "वर्गवारीनुसार निवडा",
    hi: "श्रेणी के अनुसार चुनें",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "mr",
  setLanguage: () => {},
  t: (key) => UI_TRANSLATIONS[key]?.mr || "",
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage?.getItem("sahayak_language") as Language | null;
      if (saved === "en" || saved === "mr" || saved === "hi") {
        return saved;
      }
    }
    return "mr";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        window.localStorage?.setItem("sahayak_language", lang);
      } catch (_e) {
        // Ignore quota/privacy error
      }
      document.documentElement.setAttribute("lang", lang);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", language);
    }
  }, [language]);

  const t = (key: TranslationKey): string => {
    const entry = UI_TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
