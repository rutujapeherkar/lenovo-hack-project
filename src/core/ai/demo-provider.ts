/**
 * Sahayak AI — Offline Deterministic Demo AI Provider
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 31 & ADR-001
 * Phase: P04 — AI Assistant Core
 * 
 * Provides deterministic, offline fulfillment of citizen queries in English, Marathi, and Hindi.
 * Guaranteed to run with zero internet access, zero external API keys, and zero hallucination.
 */

import type {
  AssistantRequest,
  Language,
  OfficialSource,
  SahayakResponse,
  ScreenExplanation,
  TaskStep,
} from "../shared/types";
import type { AIProvider, AIProviderType } from "./provider";
import { getServiceById, getSchemeById, getSchemes } from "../shared/data-loader";
import { detectIntent } from "../assistant/intent-engine";

const AAPLE_SARKAR_SOURCE: OfficialSource = {
  name: "Aaple Sarkar Citizen Services Portal, Government of Maharashtra",
  url: "https://aaplesarkar.mahaonline.gov.in/",
  lastVerified: "2026-09-25",
};

const MAHADBT_SOURCE: OfficialSource = {
  name: "MahaDBT Portal, Government of Maharashtra",
  url: "https://mahadbt.maharashtra.gov.in/",
  lastVerified: "2026-09-25",
};

const CIVIC_DISCLAIMER: Record<Language, string> = {
  en: "Sahayak AI provides public guidance and does not represent a government department. Always verify on official portals.",
  mr: "सहायक एआय केवळ मार्गदर्शनासाठी आहे आणि कोणत्याही सरकारी विभागाचे प्रतिनिधित्व करत नाही. अंतिम माहितीसाठी अधिकृत पोर्टल तपासा.",
  hi: "सहायक एआई केवल मार्गदर्शन के लिए है और किसी सरकारी विभाग का प्रतिनिधित्व नहीं करता है। आधिकारिक पोर्टल पर अवश्य जांचें।",
};

const SENSITIVE_SAFETY_NOTE: Record<Language, string> = {
  en: "Security Alert: Sahayak AI never requests, stores, or handles OTPs, PINs, passwords, or banking credentials. Never share these with anyone.",
  mr: "सुरक्षा सूचना: सहायक एआय कधीही ओटीपी (OTP), पिन (PIN), पासवर्ड किंवा बँक तपशील मागत नाही अथवा साठवत नाही. हे तपशील कोणाशीही शेअर करू नका.",
  hi: "सुरक्षा चेतावनी: सहायक एआई कभी भी ओटीपी (OTP), पिन (PIN), पासवर्ड या बैंकिंग क्रेडेंशियल नहीं मांगता है। इन्हें किसी के साथ साझा न करें।",
};

export class DemoProvider implements AIProvider {
  public readonly providerId: AIProviderType = "demo";

  /**
   * Generates a deterministic SahayakResponse matching the canonical schema.
   */
  public async generateResponse(request: AssistantRequest): Promise<SahayakResponse> {
    const lang = request.language || "en";
    const msg = (request.message || "").trim();
    const intent = detectIntent(msg, request.pageContext);

    // 1. Sensitive Data Intercept (Anti-Phishing / Security Invariant)
    if (/(otp|pin|password|cvv|bank account|atm pin|upi pin)/i.test(msg)) {
      return this.handleSensitiveQuery(lang);
    }

    // 2. Prompt Injection Defense Intercept
    if (/(ignore (all )?previous instructions|system prompt|fake link|bypass)/i.test(msg)) {
      return this.handlePromptInjection(lang);
    }

    // 3. Unknown / Unverified Request Handling
    if (/not have verified|unknown scheme|fake scheme|xyz yojna|unverified/i.test(msg)) {
      return this.handleUnknownScheme(lang);
    }

    // 4. Income Certificate Service Query
    if (/(income|उत्पन्न|आय प्रमाण)/i.test(msg)) {
      return this.handleIncomeCertificate(lang, intent);
    }

    // 5. Domicile / Age & Nationality Query
    if (/(domicile|अधिवास|रहिवासी|निवास)/i.test(msg)) {
      return this.handleDomicileCertificate(lang, intent);
    }

    // 6. Ration Card Queries
    if (/(ration|रेशन|राशन|नाव वाढव)/i.test(msg)) {
      return this.handleRationCard(lang, intent);
    }

    // 7. Welfare Schemes Queries (Scholarships, Ladki Bahin, Pension)
    if (/(scholarship|शिष्यवृत्ती|छात्रवृत्ति|ebc|shikshan)/i.test(msg)) {
      return this.handleScholarshipScheme(lang, intent);
    }

    if (/(ladki bahin|लाडकी बहीण|लाड़की बहिन)/i.test(msg)) {
      return this.handleLadkiBahinScheme(lang, intent);
    }

    if (/(pension|sanjay gandhi|पेन्शन|संजय गांधी|निराधार)/i.test(msg)) {
      return this.handlePensionScheme(lang, intent);
    }

    if (/(scheme|योजना)/i.test(msg)) {
      return this.handleGeneralSchemes(lang, intent);
    }

    // 8. General Public Assistance / Default Fallback
    return this.handleGeneralGuidance(lang, msg, intent);
  }

  // ==========================================================================
  // Handler Implementations
  // ==========================================================================

  private handleSensitiveQuery(lang: Language): SahayakResponse {
    const messages: Record<Language, string> = {
      en: "Sahayak AI will never request or process your OTP, PIN, password, or bank credentials. For your safety, never disclose personal security codes.",
      mr: "सहायक एआय कधीही तुमचा ओटीपी, पिन, पासवर्ड किंवा बँकेचे तपशील विचारणार नाही. सुरक्षिततेसाठी आपले गुप्त कोड कोणाशीही शेअर करू नका.",
      hi: "सहायक एआई कभी भी आपका ओटीपी, पिन, पासवर्ड या बैंक विवरण नहीं मांगेगा। अपनी सुरक्षा के लिए कभी भी अपने गोपनीय कोड साझा न करें।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: "general_information",
      safetyNote: SENSITIVE_SAFETY_NOTE[lang],
    };
  }

  private handlePromptInjection(lang: Language): SahayakResponse {
    const messages: Record<Language, string> = {
      en: "Sahayak AI strictly follows public welfare safety guidelines. I provide factual guidance based exclusively on verified Maharashtra government sources.",
      mr: "सहायक एआय सार्वजनिक कल्याण आणि सुरक्षेच्या नियमांचे काटेकोरपणे पालन करते. मी केवळ अधिकृत महाराष्ट्र शासकीय नोंदींच्या आधारे मार्गदर्शन करतो.",
      hi: "सहायक एआई सार्वजनिक कल्याण और सुरक्षा नियमों का कड़ाई से पालन करता है। मैं केवल सत्यापित महाराष्ट्र सरकारी स्रोतों के आधार पर मार्गदर्शन करता हूं।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: "general_information",
      officialSource: AAPLE_SARKAR_SOURCE,
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handleUnknownScheme(lang: Language): SahayakResponse {
    const messages: Record<Language, string> = {
      en: "Sahayak AI does not have verified official records for the requested scheme. To protect citizens from misinformation, unverified schemes are not presented. Please check official government portals.",
      mr: "सहायक एआय कडे या योजनेबाबत अधिकृत व सत्यापित शासकीय माहिती उपलब्ध नाही. नागरिकांच्या सुरक्षेसाठी असत्यापित माहिती दिली जात नाही. कृपया अधिकृत पोर्टल तपासा.",
      hi: "सहायक एआई के पास इस योजना का सत्यापित आधिकारिक रिकॉर्ड उपलब्ध नहीं है। नागरिकों की सुरक्षा के लिए असत्यापित जानकारी प्रदान नहीं की जाती है। कृपया आधिकारिक पोर्टल देखें।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: "unknown",
      officialSource: AAPLE_SARKAR_SOURCE,
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handleIncomeCertificate(lang: Language, intent: string): SahayakResponse {
    const service = getServiceById("income-certificate");
    const messages: Record<Language, string> = {
      en: "To obtain an Income Certificate in Maharashtra, apply via the official Aaple Sarkar portal under Revenue Department services. You will need proof of identity, address, and income.",
      mr: "महाराष्ट्रात उत्पन्नाचा दाखला (Income Certificate) मिळवण्यासाठी महसूल विभागाच्या आपले सरकार पोर्टलवरून ऑनलाइन अर्ज करावा लागतो. यासाठी ओळख, पत्ता आणि उत्पन्नाचा पुरावा आवश्यक असतो.",
      hi: "महाराष्ट्र में आय प्रमाण पत्र प्राप्त करने के लिए राजस्व विभाग के आधिकारिक आपले सरकार पोर्टल के माध्यम से आवेदन करें। इसके लिए पहचान, पते और आय का प्रमाण आवश्यक है।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: intent as any,
      service: service ? { id: service.id, name: service.name[lang] } : undefined,
      steps: service ? this.mapSteps(service.steps, lang) : undefined,
      officialSource: service?.officialSource || AAPLE_SARKAR_SOURCE,
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handleDomicileCertificate(lang: Language, intent: string): SahayakResponse {
    const service = getServiceById("domicile-certificate");
    const messages: Record<Language, string> = {
      en: "The Domicile and Age/Nationality Certificate confirms 15+ years residency in Maharashtra. Apply on Aaple Sarkar with ration card, residence proof, and school leaving certificate.",
      mr: "वय, अधिवास आणि राष्ट्रीयत्व प्रमाणपत्र १५ वर्षांच्या महाराष्ट्र रहिवासाची पुष्टी करते. आपले सरकार पोर्टलवर रेशन कार्ड, रहिवासी पुरावा व शाळा सोडल्याचा दाखला जोडून अर्ज करा.",
      hi: "निवास और आयु/राष्ट्रीयता प्रमाण पत्र महाराष्ट्र में 15+ वर्षों के निवास की पुष्टि करता है। राशन कार्ड, निवास प्रमाण और स्कूल लीविंग सर्टिफिकेट के साथ आपले सरकार पर आवेदन करें।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: intent as any,
      service: service ? { id: service.id, name: service.name[lang] } : undefined,
      steps: service ? this.mapSteps(service.steps, lang) : undefined,
      officialSource: service?.officialSource || AAPLE_SARKAR_SOURCE,
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handleRationCard(lang: Language, intent: string): SahayakResponse {
    const service = getServiceById("ration-card-member-addition");
    const messages: Record<Language, string> = {
      en: "To add a new family member to your Maharashtra ration card, submit Form 8 on the RCMS portal along with the member's birth certificate or Aadhaar card.",
      mr: "महाराष्ट्र रेशन कार्डमध्ये नवीन सदस्याचे नाव वाढवण्यासाठी आरसीएमएस (RCMS) पोर्टलवर फॉर्म ८ भरावा लागतो आणि संबंधित सदस्याचे आधार कार्ड किंवा जन्म प्रमाणपत्र जोडावे लागते.",
      hi: "महाराष्ट्र राशन कार्ड में नए सदस्य का नाम जोड़ने के लिए आरसीएमएस (RCMS) पोर्टल पर फॉर्म 8 भरें और सदस्य का आधार कार्ड या जन्म प्रमाण पत्र संलग्न करें।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: intent as any,
      service: service ? { id: service.id, name: service.name[lang] } : undefined,
      steps: service ? this.mapSteps(service.steps, lang) : undefined,
      officialSource: service?.officialSource || {
        name: "Ration Card Management System (RCMS), Food & Civil Supplies Department",
        url: "https://rcms.mahafood.gov.in/",
        lastVerified: "2026-09-25",
      },
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handleScholarshipScheme(lang: Language, intent: string): SahayakResponse {
    const scheme = getSchemeById("rcsms-shikshan-shulkh-shishyavrutti");
    const messages: Record<Language, string> = {
      en: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna provides 50% tuition and exam fee reimbursement for students with annual family income under ₹8 Lakhs.",
      mr: "राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना (ईबीसी) अंतर्गत ₹८ लाखांपेक्षा कमी वार्षिक उत्पन्न असलेल्या विद्यार्थ्यांना ५०% शिक्षण शुल्क व परीक्षा शुल्क परतावा मिळतो.",
      hi: "राजर्षि छत्रपति शाहू महाराज शिक्षण शुल्क छात्रवृत्ति योजना (ईबीसी) के तहत ₹8 लाख से कम वार्षिक आय वाले छात्रों को 50% शिक्षण शुल्क और परीक्षा शुल्क की प्रतिपूर्ति मिलती है।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: intent as any,
      schemes: scheme ? [scheme] : undefined,
      officialSource: scheme?.officialSource || MAHADBT_SOURCE,
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handleLadkiBahinScheme(lang: Language, intent: string): SahayakResponse {
    const scheme = getSchemeById("majhi-ladki-bahin-yojna");
    const messages: Record<Language, string> = {
      en: "Mukhyamantri Majhi Ladki Bahin Yojna provides ₹1,500 monthly financial assistance directly into bank accounts of eligible Maharashtra women aged 21-65 with family income under ₹2.5 Lakhs.",
      mr: "मुख्यमंत्री माझी लाडकी बहीण योजनेअंतर्गत २१ ते ६५ वयोगटातील पात्र महिलांना, ज्यांचे वार्षिक कौटुंबिक उत्पन्न ₹२.५ लाखांपेक्षा कमी आहे, दरमहा ₹१,५०० थेट बँक खात्यात दिले जातात.",
      hi: "मुख्यमंत्री माझी लाड़की बहिन योजना के तहत 21 से 65 वर्ष की पात्र महिलाओं को, जिनकी वार्षिक पारिवारिक आय ₹2.5 लाख से कम है, प्रति माह ₹1,500 सीधे बैंक खाते में दिए जाते हैं।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: intent as any,
      schemes: scheme ? [scheme] : undefined,
      officialSource: scheme?.officialSource || AAPLE_SARKAR_SOURCE,
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handlePensionScheme(lang: Language, intent: string): SahayakResponse {
    const scheme = getSchemeById("sanjay-gandhi-niradhar-yojna");
    const messages: Record<Language, string> = {
      en: "Sanjay Gandhi Niradhar Anudan Yojna provides ₹1,500 monthly pension for destitute persons, widows, and persons with disabilities living in Maharashtra.",
      mr: "संजय गांधी निराधार अनुदान योजनेद्वारे महाराष्ट्रातील निराधार व्यक्ती, विधवा महिला आणि दिव्यांग नागरिकांना दरमहा ₹१,५०० पेन्शन दिली जाते.",
      hi: "संजय गांधी निराधार अनुदान योजना के माध्यम से महाराष्ट्र के निराधार व्यक्तियों, विधवा महिलाओं और दिव्यांग नागरिकों को प्रति माह ₹1,500 की पेंशन प्रदान की जाती है।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: intent as any,
      schemes: scheme ? [scheme] : undefined,
      officialSource: scheme?.officialSource || {
        name: "Social Justice and Special Assistance Department, Government of Maharashtra",
        url: "https://sjsa.maharashtra.gov.in/",
        lastVerified: "2026-09-25",
      },
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handleGeneralSchemes(lang: Language, intent: string): SahayakResponse {
    const allSchemes = getSchemes().slice(0, 3);
    const messages: Record<Language, string> = {
      en: "Sahayak AI tracks verified welfare schemes across education, pension, and financial empowerment in Maharashtra. Select a scheme to review eligibility and benefits.",
      mr: "सहायक एआय महाराष्ट्रातील शिक्षण, पेन्शन आणि सामाजिक सक्षमीकरणाच्या अधिकृत योजनांची माहिती पुरवते. पात्रता व लाभ पाहण्यासाठी योजना निवडा.",
      hi: "सहायक एआई महाराष्ट्र में शिक्षा, पेंशन और सामाजिक सशक्तिकरण से जुड़ी आधिकारिक योजनाओं की जानकारी प्रदान करता है। पात्रता और लाभ देखने के लिए योजना चुनें।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: intent as any,
      schemes: allSchemes,
      officialSource: AAPLE_SARKAR_SOURCE,
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private handleGeneralGuidance(lang: Language, _query: string, intent: string): SahayakResponse {
    const messages: Record<Language, string> = {
      en: "Namaste! I am Sahayak AI, your civic guide for Maharashtra government services and welfare schemes. Ask about certificates (income, domicile), scholarships, or pensions.",
      mr: "नमस्कार! मी सहायक एआय आहे, महाराष्ट्र शासकीय सेवा आणि कल्याणकारी योजनांसाठी तुमचा मार्गदर्शक. उत्पन्न दाखला, अधिवास, शिष्यवृत्ती किंवा पेन्शनबाबत विचारा.",
      hi: "नमस्ते! मैं सहायक एआई हूं, महाराष्ट्र सरकारी सेवाओं और कल्याणकारी योजनाओं के लिए आपका मार्गदर्शक। आय प्रमाण पत्र, निवास, छात्रवृत्ति या पेंशन के बारे में पूछें।",
    };

    return {
      message: messages[lang],
      language: lang,
      intent: intent as any,
      officialSource: AAPLE_SARKAR_SOURCE,
      safetyNote: CIVIC_DISCLAIMER[lang],
    };
  }

  private mapSteps(steps: TaskStep[], _lang: Language): TaskStep[] {
    return steps.map((s) => ({
      ...s,
      title: {
        en: s.title.en,
        mr: s.title.mr,
        hi: s.title.hi,
      },
      description: {
        en: s.description.en,
        mr: s.description.mr,
        hi: s.description.hi,
      },
    }));
  }

  /**
   * Deterministic multimodal vision explanation for screenshots.
   */
  public async explainImage(
    image: File | { base64?: string; mimeType?: string; language?: Language; fileName?: string }
  ): Promise<ScreenExplanation> {
    const lang: Language = (image as any)?.language || "en";
    const fileName = ((image as any)?.fileName || (image as File)?.name || "").toLowerCase();

    const isCertificate = fileName.includes("income") || fileName.includes("domicile") || fileName.includes("certificate");

    if (lang === "mr") {
      return {
        summary: isCertificate
          ? "ही महाराष्ट्र शासनाच्या आपले सरकार पोर्टलवरील प्रमाणपत्र अर्ज स्क्रीन आहे. याद्वारे तुम्ही नवीन प्रमाणपत्रासाठी तपशील भरू शकता."
          : "ही महाराष्ट्र शासनाच्या अधिकृत नागरिक सेवा पोर्टलची लॉगिन व प्रमाणीकरण स्क्रीन आहे. याद्वारे नागरिक शासकीय सेवा वापरू शकतात.",
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
            explanation: "नोंदणी करताना तयार केलेला गोपनीय पासवर्ड येथे प्रविष्ट करा. हा कोणाशीही शेअर करू नका.",
            importance: "high",
          },
          {
            type: "field",
            name: "कॅप्चा कोड (Captcha Code)",
            explanation: "सुरक्षेसाठी चित्रात दिसणारे अक्षरे आणि अंक अचूकपणे खालील बॉक्समध्ये टाईप करा.",
            importance: "medium",
          },
          {
            type: "button",
            name: "लॉगिन / प्रवेश करा (Login Button)",
            explanation: "तपशील भरल्यानंतर पोर्टलवर प्रवेश करण्यासाठी या निळ्या बटणावर क्लिक करा.",
            importance: "high",
          },
          {
            type: "button",
            name: "नवीन वापरकर्ता नोंदणी (New User Registration)",
            explanation: "आपले खाते नसल्यास आधार कार्डद्वारे नवीन नोंदणी करण्यासाठी या लिंकवर क्लिक करा.",
            importance: "medium",
          },
        ],
        nextAction: "आपला नोंदणीकृत मोबाइल नंबर आणि पासवर्ड भरा, कॅप्चा कोड टाईप करा आणि 'लॉगिन' बटण दाबा.",
        warnings: [
          "सुरक्षा सूचना: आपला पासवर्ड किंवा ओटीपी कधीही कोणालाही सांगू नका. अधिकृत शासकीय पोर्टल नेहमी https:// ने सुरू होते.",
        ],
      };
    }

    if (lang === "hi") {
      return {
        summary: isCertificate
          ? "यह महाराष्ट्र सरकार के आपले सरकार पोर्टल पर प्रमाण पत्र आवेदन स्क्रीन है। यहां आप नए प्रमाण पत्र का विवरण भर सकते हैं।"
          : "यह महाराष्ट्र सरकार के आधिकारिक नागरिक सेवा पोर्टल की लॉगिन स्क्रीन है। इसके माध्यम से नागरिक सरकारी सेवाओं का उपयोग कर सकते हैं।",
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
            explanation: "पंजीकरण के समय बनाया गया गोपनीय पासवर्ड दर्ज करें। इसे किसी के साथ साझा न करें।",
            importance: "high",
          },
          {
            type: "field",
            name: "कैप्चा कोड (Captcha Code)",
            explanation: "सुरक्षा चित्र में दिखाए गए अक्षर और अंक नीचे दिए गए बॉक्स में सही टाइप करें।",
            importance: "medium",
          },
          {
            type: "button",
            name: "लॉगिन (Login Button)",
            explanation: "विवरण भरने के बाद पोर्टल में प्रवेश करने के लिए इस बटन पर क्लिक करें।",
            importance: "high",
          },
          {
            type: "button",
            name: "नया उपयोगकर्ता पंजीकरण (New User Registration)",
            explanation: "यदि आपका खाता नहीं है, तो आधार कार्ड से नया खाता बनाने के लिए यहां क्लिक करें।",
            importance: "medium",
          },
        ],
        nextAction: "अपना पंजीकृत मोबाइल नंबर और पासवर्ड दर्ज करें, कैप्चा कोड भरें और 'लॉगिन' बटन पर क्लिक करें।",
        warnings: [
          "सुरक्षा चेतावनी: अपना पासवर्ड या ओटीपी कभी भी किसी के साथ साझा न करें। आधिकारिक पोर्टल हमेशा https:// से शुरू होता है।",
        ],
      };
    }

    // Default English
    return {
      summary: isCertificate
        ? "This is an official Maharashtra certificate application form screen from the Aaple Sarkar portal."
        : "This is an official Maharashtra citizen portal authentication screen. It allows registered citizens to access public services and track applications.",
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
          explanation: "Enter the secret password you created during registration. Never share this with anyone.",
          importance: "high",
        },
        {
          type: "field",
          name: "Captcha Code",
          explanation: "Type the alphanumeric characters shown in the security image to verify you are a human user.",
          importance: "medium",
        },
        {
          type: "button",
          name: "Login / Sign In",
          explanation: "Click this primary button after entering your credentials to access your dashboard.",
          importance: "high",
        },
        {
          type: "button",
          name: "New User Registration",
          explanation: "If you do not have an Aaple Sarkar account, click this link to register using your Aadhaar card.",
          importance: "medium",
        },
      ],
      nextAction: "Enter your registered mobile number and password, solve the visual captcha code, and click the Login button.",
      warnings: [
        "Security Alert: Sahayak AI will never ask for your passwords, OTPs, or PINs. Only enter credentials on verified https:// gov.in domains.",
      ],
    };
  }
}
