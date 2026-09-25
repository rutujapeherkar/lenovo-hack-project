/**
 * Sahayak AI — Explain Screen Page
 *
 * Source of Truth: docs/source-of-truth/UI.md Section 24-26 & ARCHITECTURE.md Section 21
 * Phase: P07 — Explain Screen
 *
 * Citizen page allowing users to upload or paste a screenshot of a government portal,
 * validate client-side, analyze via vision pipeline, and view structured explanations.
 */

import React, { useState } from "react";
import { Badge, Button } from "../components/ui";
import { useLanguage } from "../core/language";
import { ScreenService, type ExplainScreenResult } from "../core/explain-screen";
import type { ScreenExplanation, Language } from "../core/shared/types";
import type { GlossaryEntry } from "../core/explain-screen/glossary";
import { UploadArea, ImagePreview, ExplanationPanel, Glossary } from "../components/explain-screen";
import { CivicGlossary } from "../core/explain-screen/glossary";

// ─── Deterministic Demo Explanations ─────────────────────────────────────────

type DemoKey = "aaple-sarkar" | "mahadbt" | "rcms";

interface DemoSample {
  icon: string;
  labelEn: string;
  labelMr: string;
  labelHi: string;
  imageUrl: string;
  imageName: string;
  key: DemoKey;
}

const DEMO_SAMPLES: DemoSample[] = [
  {
    icon: "🏛️",
    labelEn: "Aaple Sarkar Login Form",
    labelMr: "आपले सरकार लॉगिन फॉर्म",
    labelHi: "आपले सरकार लॉगिन फॉर्म",
    imageUrl: "/demo-forms/aaple-sarkar-login.jpg",
    imageName: "aaple-sarkar-login.jpg",
    key: "aaple-sarkar",
  },
  {
    icon: "💸",
    labelEn: "MahaDBT Scholarship Form",
    labelMr: "MahaDBT शिष्यवृत्ती फॉर्म",
    labelHi: "MahaDBT छात्रवृत्ति फॉर्म",
    imageUrl: "/demo-forms/mahadbt-scholarship.jpg",
    imageName: "mahadbt-scholarship.jpg",
    key: "mahadbt",
  },
  {
    icon: "🍚",
    labelEn: "RCMS Ration Card Page",
    labelMr: "RCMS रेशन कार्ड पृष्ठ",
    labelHi: "RCMS राशन कार्ड पृष्ठ",
    imageUrl: "/demo-forms/rcms-ration-card.jpg",
    imageName: "rcms-ration-card.jpg",
    key: "rcms",
  },
];

function getDemoExplanation(key: DemoKey, language: Language): ScreenExplanation {
  if (key === "aaple-sarkar") {
    if (language === "mr") {
      return {
        summary:
          "ही महाराष्ट्र शासनाच्या 'आपले सरकार' या अधिकृत नागरिक सेवा पोर्टलची लॉगिन स्क्रीन आहे. नोंदणीकृत नागरिक येथून शासकीय सेवा मिळवू शकतात.",
        elements: [
          {
            type: "field",
            name: "वापरकर्ता आयडी / मोबाइल क्रमांक (User ID / Mobile)",
            explanation: "येथे आपला नोंदणीकृत १०-अंकी मोबाइल नंबर किंवा वापरकर्ता नाव टाकावे.",
            importance: "high",
          },
          {
            type: "field",
            name: "पासवर्ड (Password)",
            explanation:
              "नोंदणी करताना तयार केलेला गोपनीय पासवर्ड येथे प्रविष्ट करा. हा कोणाशीही शेअर करू नका.",
            importance: "high",
          },
          {
            type: "field",
            name: "कॅप्चा कोड (Captcha Code)",
            explanation:
              "सुरक्षेसाठी चित्रात दिसणारे अक्षरे आणि अंक अचूकपणे खालील बॉक्समध्ये टाईप करा.",
            importance: "medium",
          },
          {
            type: "button",
            name: "लॉगिन / प्रवेश करा (Login Button)",
            explanation:
              "तपशील भरल्यानंतर पोर्टलवर प्रवेश करण्यासाठी या निळ्या बटणावर क्लिक करा.",
            importance: "high",
          },
          {
            type: "button",
            name: "नवीन वापरकर्ता नोंदणी (New User Registration)",
            explanation:
              "आपले खाते नसल्यास आधार कार्डद्वारे नवीन नोंदणी करण्यासाठी या लिंकवर क्लिक करा.",
            importance: "medium",
          },
        ],
        nextAction:
          "आपला नोंदणीकृत मोबाइल नंबर आणि पासवर्ड भरा, कॅप्चा कोड टाईप करा आणि 'लॉगिन' बटण दाबा.",
        warnings: [
          "सुरक्षा सूचना: आपला पासवर्ड किंवा ओटीपी कधीही कोणालाही सांगू नका. अधिकृत शासकीय पोर्टल नेहमी https:// ने सुरू होते.",
        ],
      };
    }
    if (language === "hi") {
      return {
        summary:
          "यह महाराष्ट्र सरकार के 'आपले सरकार' आधिकारिक नागरिक सेवा पोर्टल की लॉगिन स्क्रीन है। पंजीकृत नागरिक यहां से सरकारी सेवाओं का उपयोग कर सकते हैं।",
        elements: [
          {
            type: "field",
            name: "यूजर आईडी / मोबाइल नंबर (User ID / Mobile)",
            explanation: "यहां अपना पंजीकृत 10-अंकीय मोबाइल नंबर या यूजरनेम दर्ज करें।",
            importance: "high",
          },
          {
            type: "field",
            name: "पासवर्ड (Password)",
            explanation:
              "पंजीकरण के समय बनाया गया गोपनीय पासवर्ड दर्ज करें। इसे किसी के साथ साझा न करें।",
            importance: "high",
          },
          {
            type: "field",
            name: "कैप्चा कोड (Captcha Code)",
            explanation:
              "सुरक्षा चित्र में दिखाए गए अक्षर और अंक नीचे दिए गए बॉक्स में सही टाइप करें।",
            importance: "medium",
          },
          {
            type: "button",
            name: "लॉगिन (Login Button)",
            explanation:
              "विवरण भरने के बाद पोर्टल में प्रवेश करने के लिए इस बटन पर क्लिक करें।",
            importance: "high",
          },
          {
            type: "button",
            name: "नया उपयोगकर्ता पंजीकरण (New User Registration)",
            explanation:
              "यदि आपका खाता नहीं है, तो आधार कार्ड से नया खाता बनाने के लिए यहां क्लिक करें।",
            importance: "medium",
          },
        ],
        nextAction:
          "अपना पंजीकृत मोबाइल नंबर और पासवर्ड दर्ज करें, कैप्चा कोड भरें और 'लॉगिन' बटन पर क्लिक करें।",
        warnings: [
          "सुरक्षा चेतावनी: अपना पासवर्ड या ओटीपी कभी भी किसी के साथ साझा न करें। आधिकारिक पोर्टल हमेशा https:// से शुरू होता है।",
        ],
      };
    }
    return {
      summary:
        "This is the official Aaple Sarkar citizen services portal login page for the Government of Maharashtra. Registered citizens use this form to access government services.",
      elements: [
        {
          type: "field",
          name: "User ID / Mobile Number",
          explanation: "Enter your registered 10-digit mobile phone number or citizen username.",
          importance: "high",
        },
        {
          type: "field",
          name: "Password",
          explanation:
            "Enter the secret password you created during registration. Never share this with anyone.",
          importance: "high",
        },
        {
          type: "field",
          name: "Captcha Code",
          explanation:
            "Type the alphanumeric characters shown in the security image to verify you are human.",
          importance: "medium",
        },
        {
          type: "button",
          name: "Login / लॉगिन",
          explanation:
            "Click this blue button after filling your credentials to access your services dashboard.",
          importance: "high",
        },
        {
          type: "button",
          name: "New User Registration / नवीन वापरकर्ता नोंदणी",
          explanation:
            "If you don't have an Aaple Sarkar account, click this to register using your Aadhaar card.",
          importance: "medium",
        },
      ],
      nextAction:
        "Enter your registered mobile number, fill your password, type the captcha code shown in the image, and click the blue Login button.",
      warnings: [
        "Security Alert: Sahayak AI will never ask for your passwords, OTPs, or PINs. Only enter credentials on verified https:// gov.in domains.",
      ],
    };
  }

  if (key === "mahadbt") {
    if (language === "mr") {
      return {
        summary:
          "हे MahaDBT (महाराष्ट्र थेट लाभ हस्तांतरण) पोर्टलवरील पोस्ट-मॅट्रिक शिष्यवृत्ती अर्जाचे पाऊल १ आहे. विद्यार्थ्यांनी येथे आधार क्रमांक, शैक्षणिक माहिती आणि उत्पन्न प्रमाणपत्र अपलोड करायचे आहे.",
        elements: [
          {
            type: "field",
            name: "आधार क्रमांक (Aadhaar Number)",
            explanation:
              "आपला १२-अंकी आधार क्रमांक येथे प्रविष्ट करा. क्रमांक पडताळणीसाठी 'Verify' बटण दाबा.",
            importance: "high",
          },
          {
            type: "field",
            name: "अर्जदाराचे पूर्ण नाव (Applicant Full Name)",
            explanation: "आधार कार्डावर नमूद असलेले आपले संपूर्ण नाव येथे लिहा.",
            importance: "high",
          },
          {
            type: "field",
            name: "जन्म तारीख (Date of Birth)",
            explanation: "DD/MM/YYYY या प्रारूपात आपली जन्म तारीख निवडा.",
            importance: "high",
          },
          {
            type: "field",
            name: "वार्षिक कौटुंबिक उत्पन्न (Annual Family Income)",
            explanation:
              "कुटुंबाचे एकूण वार्षिक उत्पन्न रुपयांमध्ये टाकावे. OBC प्रवर्गासाठी उत्पन्न ₹८ लाखांपर्यंत असणे आवश्यक आहे.",
            importance: "high",
          },
          {
            type: "field",
            name: "महाविद्यालय / संस्था (College / Institution)",
            explanation: "आपण ज्या मान्यताप्राप्त महाविद्यालयात शिकत आहात ते ड्रॉपडाउनमधून निवडा.",
            importance: "high",
          },
          {
            type: "button",
            name: "उत्पन्न प्रमाणपत्र अपलोड करा (Upload Income Certificate)",
            explanation:
              "ग्राम तहसीलदाराने दिलेले वैध उत्पन्न प्रमाणपत्र PDF किंवा JPG स्वरूपात (कमाल ५०० KB) अपलोड करा.",
            importance: "high",
          },
          {
            type: "button",
            name: "जतन करा आणि पुढे जा (Save & Continue)",
            explanation:
              "सर्व माहिती भरल्यानंतर पुढील टप्प्यावर (शैक्षणिक तपशील) जाण्यासाठी हे हिरवे बटण दाबा.",
            importance: "high",
          },
        ],
        nextAction:
          "आधार क्रमांक प्रविष्ट करून पडताळणी करा, शैक्षणिक आणि उत्पन्न माहिती भरा, आवश्यक कागदपत्रे अपलोड करा आणि 'Save & Continue' बटण दाबा.",
        warnings: [
          "महत्त्वाचे: उत्पन्न प्रमाणपत्र आर्थिक वर्षाचे असणे आवश्यक आहे. जात प्रमाणपत्र जात पडताळणी समितीने प्रमाणित असणे आवश्यक आहे.",
        ],
      };
    }
    if (language === "hi") {
      return {
        summary:
          "यह MahaDBT (महाराष्ट्र प्रत्यक्ष लाभ हस्तांतरण) पोर्टल पर पोस्ट-मैट्रिक छात्रवृत्ति आवेदन का चरण 1 है। छात्रों को यहां आधार नंबर, शैक्षिक विवरण और आय प्रमाण पत्र अपलोड करना है।",
        elements: [
          {
            type: "field",
            name: "आधार संख्या (Aadhaar Number)",
            explanation:
              "अपना 12-अंकीय आधार नंबर दर्ज करें। सत्यापन के लिए 'Verify' बटन दबाएं।",
            importance: "high",
          },
          {
            type: "field",
            name: "आवेदक का पूरा नाम (Applicant Full Name)",
            explanation: "आधार कार्ड पर जैसा लिखा है वैसा ही अपना पूरा नाम भरें।",
            importance: "high",
          },
          {
            type: "field",
            name: "वार्षिक पारिवारिक आय (Annual Family Income)",
            explanation:
              "परिवार की कुल वार्षिक आय रुपयों में दर्ज करें। OBC वर्ग के लिए अधिकतम ₹8 लाख।",
            importance: "high",
          },
          {
            type: "field",
            name: "कॉलेज / संस्था (College / Institution)",
            explanation: "जिस मान्यता प्राप्त कॉलेज में आप पढ़ते हैं उसे ड्रॉपडाउन से चुनें।",
            importance: "high",
          },
          {
            type: "button",
            name: "आय प्रमाण पत्र अपलोड करें (Upload Income Certificate)",
            explanation:
              "तहसीलदार द्वारा जारी वैध आय प्रमाण पत्र PDF या JPG (अधिकतम 500 KB) में अपलोड करें।",
            importance: "high",
          },
          {
            type: "button",
            name: "सहेजें और जारी रखें (Save & Continue)",
            explanation: "सभी विवरण भरने के बाद अगले चरण पर जाने के लिए यह हरा बटन दबाएं।",
            importance: "high",
          },
        ],
        nextAction:
          "आधार नंबर दर्ज करके सत्यापित करें, शैक्षिक और आय की जानकारी भरें, आवश्यक दस्तावेज अपलोड करें और 'Save & Continue' बटन दबाएं।",
        warnings: [
          "महत्वपूर्ण: आय प्रमाण पत्र चालू वित्तीय वर्ष का होना चाहिए। जाति प्रमाण पत्र जाति सत्यापन समिति द्वारा प्रमाणित होना चाहिए।",
        ],
      };
    }
    return {
      summary:
        "This is Step 1 of the Post-Matric Scholarship Application form on the MahaDBT (Maharashtra Direct Benefit Transfer) portal. Students fill in personal details, educational information, and upload income and caste certificates.",
      elements: [
        {
          type: "field",
          name: "Aadhaar Number (UID)",
          explanation:
            "Enter your 12-digit Aadhaar number. Click the Verify button to validate it against UIDAI records.",
          importance: "high",
        },
        {
          type: "field",
          name: "Applicant Full Name (As per Aadhaar)",
          explanation:
            "Type your complete name exactly as it appears on your Aadhaar card. No abbreviations.",
          importance: "high",
        },
        {
          type: "field",
          name: "Annual Family Income (Rs.)",
          explanation:
            "Enter the total yearly household income in rupees. For OBC category, maximum is ₹8 Lakh.",
          importance: "high",
        },
        {
          type: "field",
          name: "College / Institution Name",
          explanation:
            "Select your enrolled and government-recognized college or university from the dropdown list.",
          importance: "high",
        },
        {
          type: "button",
          name: "Upload Income Certificate",
          explanation:
            "Upload a valid income certificate issued by the Tahsildar in PDF or JPG format (max 500 KB).",
          importance: "high",
        },
        {
          type: "button",
          name: "Upload Caste Certificate",
          explanation:
            "Upload a caste certificate validated by the Caste Scrutiny Committee for SC/ST/OBC categories.",
          importance: "high",
        },
        {
          type: "button",
          name: "Save & Continue",
          explanation:
            "After filling all required fields, click this green button to proceed to Step 2: Educational Details.",
          importance: "high",
        },
      ],
      nextAction:
        "Enter and verify your Aadhaar number, fill in your educational and income details, upload the required documents (income + caste certificate), then click Save & Continue.",
      warnings: [
        "Important: Income certificate must be for the current financial year. Caste certificate must be validated by the Caste Scrutiny Committee. Incorrect documents will result in application rejection.",
      ],
    };
  }

  // RCMS Ration Card
  if (language === "mr") {
    return {
      summary:
        "हे RCMS (रेशन कार्ड व्यवस्थापन प्रणाली) महाराष्ट्र पोर्टलवरील 'रेशन कार्डावर नवीन सदस्य जोडा' या अर्जाचे पृष्ठ आहे. कुटुंबाचे प्रमुख नवीन कुटुंब सदस्याची माहिती येथे भरू शकतात.",
      elements: [
        {
          type: "field",
          name: "रेशन कार्ड क्रमांक (Ration Card Number)",
          explanation:
            "आपला विद्यमान रेशन कार्ड क्रमांक टाकून 'पडताळणी करा' बटणाने तपासणी करा.",
          importance: "high",
        },
        {
          type: "field",
          name: "कुटुंबाच्या प्रमुखाचे नाव (Head of Family Name)",
          explanation: "हे क्षेत्र आपोआप भरले जाते — रेशन कार्ड डेटाबेसमधून माहिती घेतली जाते.",
          importance: "medium",
        },
        {
          type: "field",
          name: "जोडल्या जाणाऱ्या सदस्याचे नाव (Member Name to Add)",
          explanation: "नवीन सदस्याचे पूर्ण नाव टाकावे जसे आधार कार्डावर आहे.",
          importance: "high",
        },
        {
          type: "field",
          name: "प्रमुखाशी नाते (Relationship with Head)",
          explanation:
            "ड्रॉपडाउनमधून संबंध निवडा: मुलगा, मुलगी, जोडीदार, इतर. अचूक संबंध महत्त्वाचे आहे.",
          importance: "high",
        },
        {
          type: "field",
          name: "आधार क्रमांक (Aadhaar Number)",
          explanation:
            "नवीन सदस्याचा १२-अंकी आधार क्रमांक प्रविष्ट करा. आधार अनिवार्य आहे.",
          importance: "high",
        },
        {
          type: "button",
          name: "आधार दस्तऐवज अपलोड करा (Upload Aadhaar Document)",
          explanation: "नवीन सदस्याचे आधार कार्डाची स्कॅन केलेली प्रत PDF किंवा JPG मध्ये अपलोड करा.",
          importance: "high",
        },
        {
          type: "button",
          name: "अर्ज सादर करा (Submit Application)",
          explanation:
            "सर्व माहिती बरोबर असल्यास हे नारंगी बटण दाबा. एक अर्ज क्रमांक (Acknowledgment Number) मिळेल.",
          importance: "high",
        },
      ],
      nextAction:
        "रेशन कार्ड क्रमांक टाकून पडताळणी करा, नवीन सदस्याची माहिती भरा, आधार दस्तऐवज अपलोड करा आणि 'अर्ज सादर करा' बटण दाबा.",
      warnings: [
        "महत्त्वाचे: नवीन सदस्याचे आधार कार्ड त्यांच्या जन्म तारखेशी जुळणे आवश्यक आहे. अर्ज सादर केल्यानंतर पुरवठा विभागाची तपासणी होते.",
      ],
    };
  }
  if (language === "hi") {
    return {
      summary:
        "यह RCMS (राशन कार्ड प्रबंधन प्रणाली) महाराष्ट्र पोर्टल पर 'राशन कार्ड में नया सदस्य जोड़ें' आवेदन पृष्ठ है। परिवार के मुखिया नए सदस्य की जानकारी यहां भर सकते हैं।",
      elements: [
        {
          type: "field",
          name: "राशन कार्ड नंबर (Ration Card Number)",
          explanation:
            "अपना मौजूदा राशन कार्ड नंबर दर्ज करें और 'Verify / पडताळणी करा' बटन दबाएं।",
          importance: "high",
        },
        {
          type: "field",
          name: "परिवार के मुखिया का नाम (Head of Family Name)",
          explanation: "यह फ़ील्ड राशन कार्ड डेटाबेस से स्वतः भर जाती है।",
          importance: "medium",
        },
        {
          type: "field",
          name: "जोड़े जाने वाले सदस्य का नाम (Member Name to Add)",
          explanation: "नए सदस्य का पूरा नाम दर्ज करें जैसा आधार कार्ड पर है।",
          importance: "high",
        },
        {
          type: "field",
          name: "मुखिया से संबंध (Relationship with Head)",
          explanation: "ड्रॉपडाउन से संबंध चुनें: पुत्र, पुत्री, पत्नी/पति, अन्य।",
          importance: "high",
        },
        {
          type: "field",
          name: "आधार नंबर (Aadhaar Number)",
          explanation: "नए सदस्य का 12-अंकीय आधार नंबर दर्ज करें। आधार अनिवार्य है।",
          importance: "high",
        },
        {
          type: "button",
          name: "आधार दस्तावेज अपलोड करें (Upload Aadhaar Document)",
          explanation: "नए सदस्य के आधार कार्ड की स्कैन कॉपी PDF या JPG में अपलोड करें।",
          importance: "high",
        },
        {
          type: "button",
          name: "आवेदन जमा करें (Submit Application)",
          explanation:
            "सभी जानकारी सही होने पर यह नारंगी बटन दबाएं। एक पावती नंबर मिलेगा।",
          importance: "high",
        },
      ],
      nextAction:
        "राशन कार्ड नंबर दर्ज करके सत्यापित करें, नए सदस्य की जानकारी भरें, आधार दस्तावेज अपलोड करें और 'Submit Application' बटन दबाएं।",
      warnings: [
        "महत्वपूर्ण: नए सदस्य का आधार कार्ड उनकी जन्म तिथि से मेल खाना चाहिए। आवेदन के बाद आपूर्ति विभाग द्वारा जांच की जाएगी।",
      ],
    };
  }
  return {
    summary:
      "This is the 'Add New Member to Ration Card' application form on the RCMS (Ration Card Management System) Maharashtra portal. The head of family can add a new family member with their Aadhaar details.",
    elements: [
      {
        type: "field",
        name: "Ration Card Number / रेशन कार्ड क्रमांक",
        explanation:
          "Enter your existing ration card number and click 'Verify' to authenticate it against the RCMS database.",
        importance: "high",
      },
      {
        type: "field",
        name: "Head of Family Name",
        explanation:
          "This field is auto-filled from the RCMS database once your ration card is verified.",
        importance: "medium",
      },
      {
        type: "field",
        name: "Member Name to Add / जोडल्या जाणाऱ्या सदस्याचे नाव",
        explanation:
          "Enter the full name of the new family member exactly as written on their Aadhaar card.",
        importance: "high",
      },
      {
        type: "field",
        name: "Relationship with Head / प्रमुखाशी नाते",
        explanation:
          "Select the relationship from the dropdown: Son (मुलगा), Daughter (मुलगी), Spouse (जोडीदार), Other (इतर).",
        importance: "high",
      },
      {
        type: "field",
        name: "Aadhaar Number / आधार क्रमांक",
        explanation:
          "Enter the 12-digit Aadhaar number of the new member being added. This is mandatory.",
        importance: "high",
      },
      {
        type: "button",
        name: "Upload Aadhaar Document",
        explanation:
          "Upload a scanned copy of the new member's Aadhaar card in PDF or JPG format for verification.",
        importance: "high",
      },
      {
        type: "button",
        name: "Submit Application / अर्ज सादर करा",
        explanation:
          "After filling all fields, click this orange button to submit. You will receive an Acknowledgment Number.",
        importance: "high",
      },
    ],
    nextAction:
      "Enter and verify your ration card number, fill in the new member's details (name, relationship, Aadhaar), upload the Aadhaar document scan, and click Submit Application.",
    warnings: [
      "Important: The new member's Aadhaar must match their date of birth. After submission, the Supply Department will physically verify the application — this may take 15-30 working days.",
    ],
  };
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export const ExplainScreenPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDemoLoading, setIsDemoLoading] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<ScreenExplanation | null>(null);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryEntry[]>([]); 
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // ── Handle real file upload ──────────────────────────────────────────────
  const handleExplainScreen = async (fileOverride?: unknown) => {
    const fileToAnalyze = fileOverride instanceof File ? fileOverride : selectedFile;
    if (!fileToAnalyze) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result: ExplainScreenResult = await ScreenService.explainScreen(
        fileToAnalyze,
        language
      );
      if (result.success && result.explanation) {
        setExplanation(result.explanation);
        setGlossaryTerms(result.glossary || []);
      } else {
        setAnalysisError(
          result.error || "Unable to explain this screen. Please try again with a clearer image."
        );
      }
    } catch (err: any) {
      setAnalysisError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageSelected = (file: File, autoExplain = false) => {
    setSelectedFile(file);
    setValidationError(null);
    setExplanation(null);
    setGlossaryTerms([]);
    setAnalysisError(null);
    if (autoExplain) {
      handleExplainScreen(file);
    }
  };

  // ── Load demo sample — fetch real image + set explanation instantly ───────
  const handleDemoSample = async (sample: DemoSample) => {
    setIsDemoLoading(sample.key);
    setValidationError(null);
    setExplanation(null);
    setGlossaryTerms([]);
    setAnalysisError(null);
    setSelectedFile(null);

    try {
      // Fetch real demo image from public/demo-forms/
      const res = await fetch(sample.imageUrl);
      if (!res.ok) throw new Error("Could not load demo image");
      const blob = await res.blob();
      const file = new File([blob], sample.imageName, { type: "image/jpeg" });

      // Set the file for preview (ImagePreview will create object URL)
      setSelectedFile(file);

      // Immediately compute & set explanation (no API call needed for demos)
      const demoExplanation = getDemoExplanation(sample.key, language);
      setExplanation(demoExplanation);

      // Compute relevant glossary
      const contextText = [
        demoExplanation.summary,
        ...demoExplanation.elements.map((e) => `${e.name} ${e.explanation}`),
      ].join(" ");
      setGlossaryTerms(CivicGlossary.findRelevantTerms(contextText, language));
    } catch (_err) {
      // Fallback: show explanation without image preview
      const demoExplanation = getDemoExplanation(sample.key, language);
      setExplanation(demoExplanation);
      const contextText = [
        demoExplanation.summary,
        ...demoExplanation.elements.map((e) => `${e.name} ${e.explanation}`),
      ].join(" ");
      setGlossaryTerms(CivicGlossary.findRelevantTerms(contextText, language));
    } finally {
      setIsDemoLoading(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setValidationError(null);
    setExplanation(null);
    setGlossaryTerms([]);
    setAnalysisError(null);
  };

  // ── Has anything to show (file OR explanation from demo without file) ─────
  const hasContent = selectedFile !== null || explanation !== null;

  return (
    <div
      className="explain-screen-page"
      style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "var(--space-12)" }}
    >
      {/* 1. Page Header */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Badge variant="warning" style={{ marginBottom: "var(--space-2)" }}>
          दृष्टी सहाय्य • Visual Assist
        </Badge>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--sahayak-blue-dark)",
            marginBottom: "var(--space-2)",
            letterSpacing: "-0.02em",
          }}
        >
          {t("explainScreenTitle")}
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.0625rem",
            maxWidth: "760px",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {t("explainScreenSubtitle")}
        </p>
      </div>

      {/* 2. Upload / Input View (When no file or explanation selected) */}
      {!hasContent && (
        <>
          {/* ── Demo Sample Screenshots ──────────────────────────────────── */}
          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto var(--space-6) auto",
              padding: "var(--space-5)",
              background: "var(--sahayak-blue-pale)",
              borderRadius: "var(--radius-card)",
              border: "1.5px solid var(--sahayak-blue)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                marginBottom: "var(--space-3)",
              }}
            >
              <span style={{ fontSize: "1.1rem" }} aria-hidden="true">
                ⚡
              </span>
              <strong style={{ color: "var(--sahayak-blue-dark)", fontSize: "0.9375rem" }}>
                {language === "mr"
                  ? "त्वरित प्रात्यक्षिक — नमुना स्क्रीनशॉट वापरा"
                  : language === "hi"
                  ? "त्वरित प्रदर्शन — नमूना स्क्रीनशॉट उपयोग करें"
                  : "Quick Demo — Try a sample screenshot instantly"}
              </strong>
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                margin: "0 0 var(--space-4) 0",
              }}
            >
              {language === "mr"
                ? "फाइल अपलोड न करता नमुना सरकारी स्क्रीनशॉट वापरून साहायकची क्षमता पाहा."
                : language === "hi"
                ? "फ़ाइल अपलोड किए बिना नमूना सरकारी स्क्रीनशॉट से साहायक की क्षमता देखें."
                : "See Sahayak explain a government portal screenshot — no file upload required."}
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              {DEMO_SAMPLES.map((sample) => {
                const label =
                  language === "mr"
                    ? sample.labelMr
                    : language === "hi"
                    ? sample.labelHi
                    : sample.labelEn;
                const isLoading = isDemoLoading === sample.key;
                return (
                  <button
                    key={sample.key}
                    type="button"
                    onClick={() => handleDemoSample(sample)}
                    disabled={isDemoLoading !== null}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius-button)",
                      border: "1.5px solid var(--sahayak-blue)",
                      background: "var(--surface)",
                      color: "var(--sahayak-blue-dark)",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: isDemoLoading !== null ? "wait" : "pointer",
                      transition: "all var(--transition-fast)",
                      fontFamily: "inherit",
                      opacity: isDemoLoading !== null && !isLoading ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isDemoLoading) {
                        e.currentTarget.style.background = "var(--sahayak-blue)";
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--surface)";
                      e.currentTarget.style.color = "var(--sahayak-blue-dark)";
                    }}
                    aria-label={`Load sample: ${label}`}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <span
                        style={{
                          display: "inline-block",
                          width: "14px",
                          height: "14px",
                          border: "2px solid var(--sahayak-blue)",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    ) : (
                      <span aria-hidden="true">{sample.icon}</span>
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ maxWidth: "680px", margin: "0 auto var(--space-8) auto" }}>
            <UploadArea
              onImageSelected={handleImageSelected}
              error={validationError}
              onErrorChange={setValidationError}
            />
          </div>

          {/* Full Civic Glossary for quick citizen reference */}
          <Glossary showAllFallback={true} />
        </>
      )}

      {/* 3. Image / Explanation View */}
      {hasContent && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Image Preview — only shown if a real file exists */}
          {selectedFile && (
            <ImagePreview
              file={selectedFile}
              onExplain={handleExplainScreen}
              onChangeImage={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/png,image/jpeg,image/jpg,image/webp";
                input.onchange = (e: any) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageSelected(e.target.files[0]);
                  }
                };
                input.click();
              }}
              onRemove={handleRemoveImage}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* Analysis Error */}
          {analysisError && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #F87171",
                borderRadius: "var(--radius-card)",
                padding: "var(--space-5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)",
                }}
              >
                <span style={{ fontSize: "1.25rem" }} aria-hidden="true">
                  ⚠️
                </span>
                <strong style={{ color: "#991B1B", fontSize: "1rem" }}>
                  {language === "mr"
                    ? "आम्ही या वेळी या स्क्रीनशॉटचे विश्लेषण करू शकलो नाही."
                    : language === "hi"
                    ? "हम इस समय इस छवि का विश्लेषण नहीं कर सके।"
                    : "We couldn't explain this image right now."}
                </strong>
              </div>
              <p style={{ color: "#7F1D1D", fontSize: "0.875rem", margin: "0 0 var(--space-4) 0" }}>
                {analysisError}
              </p>
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleExplainScreen}
                  disabled={isAnalyzing}
                >
                  ↻{" "}
                  {language === "mr"
                    ? "पुन्हा प्रयत्न करा"
                    : language === "hi"
                    ? "पुनः प्रयास करें"
                    : "Try Again"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  📷{" "}
                  {language === "mr"
                    ? "दुसरा स्क्रीनशॉट निवडा"
                    : language === "hi"
                    ? "दूसरी छवि चुनें"
                    : "Upload Another Image"}
                </Button>
              </div>
            </div>
          )}

          {/* 4. Structured Explanation Panel */}
          {explanation && (
            <>
              <ExplanationPanel explanation={explanation} />
              <Glossary terms={glossaryTerms} showAllFallback={true} />
              <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleRemoveImage}
                >
                  📷 Explain Another Screenshot / दुसरा स्क्रीनशॉट तपासा
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
