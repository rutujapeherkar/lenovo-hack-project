/**
 * Sahayak AI — Deterministic Form Guide Repository
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 28 & DATA-CONTRACTS.md Section 15-18
 * Phase: P08 — Browser Extension
 * 
 * Holds verified deterministic step-by-step form guides for Maharashtra citizen portals.
 * Anti-Hallucination Invariant: Selectors are explicitly structured and verified.
 * Password fields and payment frames are strictly excluded from field guidance.
 */

import type { FormGuide } from "../shared/types";

export const AAPLE_SARKAR_AUTH_GUIDE: FormGuide = {
  formId: "aaple-sarkar-login",
  portalId: "aaple-sarkar",
  name: {
    en: "Aaple Sarkar Citizen Portal Login & Access",
    mr: "आपले सरकार नागरिक पोर्टल लॉगिन व प्रवेश",
    hi: "आपले सरकार नागरिक पोर्टल लॉगिन और प्रवेश",
  },
  pages: [
    {
      id: "login-page",
      title: {
        en: "Citizen Authentication",
        mr: "नागरिक प्रमाणीकरण",
        hi: "नागरिक प्रमाणीकरण",
      },
      match: {
        urlPattern: "aaplesarkar.mahaonline.gov.in",
        requiredText: ["Citizen Login", "नागरिक लॉगिन", "Aaple Sarkar"],
        stableSelectors: ["#login_user_id", "#user_id", "#txtLoginId", "input[name='userId']"],
      },
      fields: [
        {
          id: "userId",
          selector: "#login_user_id, #user_id, #txtLoginId, input[name='userId'], #username",
          label: {
            en: "Registered Mobile Number or Username",
            mr: "नोंदणीकृत मोबाइल क्रमांक किंवा युझर आयडी",
            hi: "पंजीकृत मोबाइल नंबर या यूजर आईडी",
          },
          help: {
            en: "Enter your 10-digit mobile number or the username you chose when registering on Aaple Sarkar.",
            mr: "आपले सरकारवर नोंदणी करताना दिलेला १० अंकी मोबाइल नंबर किंवा वापरकर्ता नाव येथे टाका.",
            hi: "आपले सरकार पर पंजीकरण के समय दिया गया 10 अंकों का मोबाइल नंबर या यूजर आईडी यहां दर्ज करें।",
          },
          required: true,
          inputType: "text",
          explanation: {
            en: "This field verifies your identity as a registered Maharashtra citizen.",
            mr: "हा रकाना तुमची अधिकृत नागरिक ओळख पडताळण्यासाठी वापरला जातो.",
            hi: "यह फ़ील्ड आपकी पंजीकृत नागरिक पहचान सत्यापित करने के लिए उपयोग की जाती है।",
          },
        },
        {
          id: "captcha",
          selector: "#captcha, #txtCaptcha, input[name='captcha'], #captchaCode",
          label: {
            en: "Security Captcha Code",
            mr: "सुरक्षा कॅप्चा कोड",
            hi: "सुरक्षा कैप्चा कोड",
          },
          help: {
            en: "Type the exact characters and numbers displayed in the adjacent verification image.",
            mr: "शेजारील चित्रात दिसणारे इंग्रजी अक्षरे आणि अंक जसेच्या तसे येथे टाईप करा.",
            hi: "पास के सुरक्षा चित्र में दिखाए गए अक्षर और अंक यहां सही-सही टाइप करें।",
          },
          required: true,
          inputType: "text",
          explanation: {
            en: "The captcha proves you are a genuine human citizen and protects the government portal from automated bots.",
            mr: "कॅप्चा कोडमुळे तुम्ही स्वतः अर्ज भरत आहात याची खात्री होते आणि पोर्टल सुरक्षित राहते.",
            hi: "कैप्चा कोड सुनिश्चित करता है कि आप स्वयं आवेदन भर रहे हैं और पोर्टल सुरक्षित रहता है।",
          },
        },
        {
          id: "loginBtn",
          selector: "#btnLogin, #btnSubmit, input[type='submit'][value*='Login'], button[type='submit']",
          label: {
            en: "Login Button",
            mr: "लॉगिन / प्रवेश करा बटण",
            hi: "लॉगिन बटन",
          },
          help: {
            en: "After entering your mobile number, password, and captcha, click this button to access your citizen dashboard.",
            mr: "तपशील भरल्यानंतर पोर्टलवर प्रवेश करण्यासाठी या बटणावर क्लिक करा.",
            hi: "विवरण भरने के बाद पोर्टल में प्रवेश करने के लिए इस बटन पर क्लिक करें।",
          },
          required: true,
          inputType: "text",
          explanation: {
            en: "Clicking this submits your login details to open the services menu.",
            mr: "यावर क्लिक केल्यावर तुमचे खाते उघडेल आणि सेवांची यादी दिसेल.",
            hi: "इस पर क्लिक करने से आपका खाता खुलेगा और सेवाओं की सूची दिखाई देगी।",
          },
        },
      ],
    },
  ],
};

export const INCOME_CERTIFICATE_FORM_GUIDE: FormGuide = {
  formId: "income-certificate-form",
  portalId: "aaple-sarkar",
  name: {
    en: "Income Certificate Application Form (Revenue Department)",
    mr: "उत्पन्नाचा दाखला अर्ज (महसूल विभाग)",
    hi: "आय प्रमाण पत्र आवेदन पत्र (राजस्व विभाग)",
  },
  pages: [
    {
      id: "applicant-details",
      title: {
        en: "Applicant & Family Details",
        mr: "अर्जदार व कौटुंबिक तपशील",
        hi: "आवेदक और पारिवारिक विवरण",
      },
      match: {
        urlPattern: "aaplesarkar.mahaonline.gov.in",
        requiredText: ["Income Certificate", "उत्पन्नाचे प्रमाणपत्र", "Revenue Department"],
        stableSelectors: ["#applicant_name", "#annual_income", "input[name='annualIncome']"],
      },
      fields: [
        {
          id: "applicantName",
          selector: "#applicant_name, #txtApplicantName, input[name='applicantName'], #fullName",
          label: {
            en: "Full Name of Applicant",
            mr: "अर्जदाराचे संपूर्ण नाव",
            hi: "आवेदक का पूरा नाम",
          },
          help: {
            en: "Enter the full name exactly as it appears on your Aadhaar card or School Leaving Certificate.",
            mr: "आधार कार्ड किंवा शाळा सोडल्याच्या दाखल्यावरील नावाप्रमाणेच संपूर्ण नाव अचूक प्रविष्ट करा.",
            hi: "आधार कार्ड या स्कूल लीविंग सर्टिफिकेट के अनुसार पूरा नाम सही दर्ज करें।",
          },
          required: true,
          inputType: "text",
          explanation: {
            en: "This name will be printed directly on the issued government income certificate.",
            mr: "हे नाव थेट शासकीय प्रमाणपत्रावर मुद्रित केले जाईल.",
            hi: "यह नाम सीधे सरकारी प्रमाण पत्र पर मुद्रित होगा।",
          },
        },
        {
          id: "annualIncome",
          selector: "#annual_income, #txtAnnualIncome, input[name='annualIncome'], #totalIncome",
          label: {
            en: "Annual Family Income (in INR ₹)",
            mr: "वार्षिक कौटुंबिक उत्पन्न (रुपयांमध्ये)",
            hi: "वार्षिक पारिवारिक आय (रुपये में)",
          },
          help: {
            en: "Enter total yearly income from all sources as verified by Talathi report, salary slip, or IT returns.",
            mr: "तलाठी अहवाल किंवा पगार पावतीनुसार सर्व मार्ग मिळून येणारे वार्षिक उत्पन्न येथे लिहा.",
            hi: "तलाठी रिपोर्ट या वेतन पर्ची के अनुसार सभी स्रोतों से वार्षिक आय यहां लिखें।",
          },
          required: true,
          inputType: "number",
          explanation: {
            en: "Government welfare scheme eligibility (e.g. EBC scholarship under ₹8L, Ladki Bahin under ₹2.5L) depends on this amount.",
            mr: "शासकीय योजनांची पात्रता (उदा. ईबीसी शिष्यवृत्ती ₹८ लाखांखाली) या उत्पन्नावर अवलंबून असते.",
            hi: "सरकारी योजनाओं की पात्रता (उदा. ईबीसी छात्रवृत्ति ₹8 लाख से कम) इसी आय पर निर्भर करती है।",
          },
        },
        {
          id: "reasonForCertificate",
          selector: "#reason, #txtReason, select[name='purpose'], #purpose",
          label: {
            en: "Purpose of Certificate",
            mr: "दाखल्याचा उद्देश / कारण",
            hi: "प्रमाण पत्र का उद्देश्य / कारण",
          },
          help: {
            en: "Select why you need this certificate (e.g. Education/Scholarship, Ration Card, or Welfare Scheme).",
            mr: "दाखला कशासाठी हवा आहे (उदा. शिक्षण/शिष्यवृत्ती, रेशन कार्ड किंवा योजना) ते निवडा.",
            hi: "प्रमाण पत्र किसलिए चाहिए (उदा. शिक्षा/छात्रवृत्ति, राशन कार्ड या योजना) वह चुनें।",
          },
          required: true,
          inputType: "select",
          explanation: {
            en: "Specifies the administrative validity of the certificate for that purpose.",
            mr: "प्रमाणपत्राचा अधिकृत वापर कशासाठी होणार आहे हे यातून स्पष्ट होते.",
            hi: "प्रमाण पत्र का आधिकारिक उपयोग किसलिए होगा यह इससे स्पष्ट होता है।",
          },
        },
      ],
    },
  ],
};

const REGISTERED_FORM_GUIDES: FormGuide[] = [
  AAPLE_SARKAR_AUTH_GUIDE,
  INCOME_CERTIFICATE_FORM_GUIDE,
];

export class FormGuideRepository {
  public static getAllGuides(): FormGuide[] {
    return [...REGISTERED_FORM_GUIDES];
  }

  public static getGuideById(formId: string): FormGuide | undefined {
    return REGISTERED_FORM_GUIDES.find((g) => g.formId === formId);
  }

  public static getGuidesForPortal(portalId: string): FormGuide[] {
    return REGISTERED_FORM_GUIDES.filter((g) => g.portalId === portalId);
  }

  public static matchGuide(url: string, pageText?: string): FormGuide | undefined {
    if (!url) return undefined;
    const lowerUrl = url.toLowerCase();
    const lowerText = (pageText || "").toLowerCase();

    for (const guide of REGISTERED_FORM_GUIDES) {
      for (const page of guide.pages) {
        const urlMatch = !page.match.urlPattern || lowerUrl.includes(page.match.urlPattern.toLowerCase());
        const textMatch =
          !page.match.requiredText ||
          page.match.requiredText.some((req) => lowerText.includes(req.toLowerCase()));

        if (urlMatch && (textMatch || !page.match.requiredText)) {
          return guide;
        }
      }
    }

    // Default to portal-level guide if URL matches portal domain
    if (lowerUrl.includes("aaplesarkar.mahaonline.gov.in")) {
      if (lowerUrl.includes("income") || lowerText.includes("income") || lowerText.includes("उत्पन्न")) {
        return INCOME_CERTIFICATE_FORM_GUIDE;
      }
      return AAPLE_SARKAR_AUTH_GUIDE;
    }

    return undefined;
  }
}
