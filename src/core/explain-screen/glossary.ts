/**
 * Sahayak AI — Civic Terminology Glossary
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 26 & ARCHITECTURE.md Section 21
 * Phase: P07 — Explain Screen
 * 
 * Provides accessible, plain-language explanations of confusing Maharashtra administrative
 * and digital governance terms in English, Marathi, and Hindi.
 */

import type { Language } from "../shared/types";

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  category: "identity" | "revenue" | "welfare" | "portal";
}

interface TrilingualTerm {
  id: string;
  category: "identity" | "revenue" | "welfare" | "portal";
  term: Record<Language, string>;
  definition: Record<Language, string>;
  keywords: string[];
}

const CIVIC_GLOSSARY: TrilingualTerm[] = [
  {
    id: "beneficiary",
    category: "welfare",
    term: {
      en: "Beneficiary",
      mr: "लाभार्थी (Beneficiary)",
      hi: "लाभार्थी (Beneficiary)",
    },
    definition: {
      en: "The citizen, student, farmer, or individual who is eligible to receive the monetary grant, pension, or service benefit.",
      mr: "ज्या नागरिकाला, विद्यार्थ्याला किंवा व्यक्तीला शासकीय योजनेचा लाभ किंवा अनुदान मिळते ती व्यक्ती.",
      hi: "वह नागरिक, छात्र या व्यक्ति जो सरकारी योजना का लाभ या वित्तीय सहायता प्राप्त करने के लिए पात्र है।",
    },
    keywords: ["beneficiary", "लाभार्थी", "लाभारती"],
  },
  {
    id: "domicile",
    category: "identity",
    term: {
      en: "Domicile Certificate",
      mr: "अधिवास दाखला / रहिवासी प्रमाणपत्र (Domicile)",
      hi: "अधिवास / निवास प्रमाण पत्र (Domicile)",
    },
    definition: {
      en: "Official legal certificate issued by the Revenue Department confirming continuous residency in Maharashtra state for at least 15 years.",
      mr: "तहसीलदारांनी जारी केलेले अधिकृत प्रमाणपत्र, जे आपण महाराष्ट्रात किमान १५ वर्षे सतत वास्तव्यास असल्याचे सिद्ध करते.",
      hi: "राजस्व विभाग द्वारा जारी आधिकारिक प्रमाण पत्र जो प्रमाणित करता है कि आप कम से कम 15 वर्षों से महाराष्ट्र में रह रहे हैं।",
    },
    keywords: ["domicile", "अधिवास", "रहिवासी", "निवास"],
  },
  {
    id: "creamy-layer",
    category: "welfare",
    term: {
      en: "Non-Creamy Layer (NCL)",
      mr: "नॉन-क्रिमीलेअर प्रमाणपत्र (NCL)",
      hi: "नॉन-क्रीमी लेयर प्रमाण पत्र (NCL)",
    },
    definition: {
      en: "Certificate verifying that a family's annual income is below ₹8 Lakhs, required for OBC/VJNT fee concessions and job reservations.",
      mr: "कौटुंबिक वार्षिक उत्पन्न ₹८ लाखांच्या आत असल्याचे दाखवणारे प्रमाणपत्र, जे ओबीसी/व्हीजेएनटी आरक्षणासाठी आवश्यक असते.",
      hi: "पारिवारिक वार्षिक आय ₹8 लाख से कम होने का प्रमाण पत्र, जो आरक्षण और शुल्क छूट के लिए आवश्यक है।",
    },
    keywords: ["creamy", "ncl", "क्रिमीलेअर", "क्रीमी लेयर"],
  },
  {
    id: "talathi",
    category: "revenue",
    term: {
      en: "Talathi / Patwari",
      mr: "तलाठी (Talathi)",
      hi: "तलाठी / पटवारी (Talathi)",
    },
    definition: {
      en: "The village-level revenue officer responsible for inspecting land records, issuing income verification reports, and updating the 7/12 extract.",
      mr: "गाव पातळीवरील महसूल अधिकारी जो पिकांची व जमिनीची नोंद ठेवतो आणि उत्पन्नाचा चौकशी अहवाल देतो.",
      hi: "ग्राम स्तर पर राजस्व अधिकारी जो भूमि रिकॉर्ड बनाए रखता है और आय सत्यापन रिपोर्ट जारी करता है।",
    },
    keywords: ["talathi", "तलाठी", "पटवारी"],
  },
  {
    id: "satbara-7-12",
    category: "revenue",
    term: {
      en: "7/12 Extract (Satbara Utara)",
      mr: "७/१२ उतारा (Satbara Extract)",
      hi: "7/12 खतौनी / सातबारा (Satbara)",
    },
    definition: {
      en: "The official land register extract in Maharashtra showing land ownership rights, survey numbers, and seasonal crop information.",
      mr: "जमिनीच्या मालकी हक्क, क्षेत्रफळ आणि पिकांची नोंद असणारा महाराष्ट्र शासनाचा अधिकृत भूमी अभिलेख उतारा.",
      hi: "महाराष्ट्र का आधिकारिक भूमि रिकॉर्ड जो भूमि के स्वामित्व, क्षेत्रफल और फसलों का विवरण दर्शाता है।",
    },
    keywords: ["7/12", "satbara", "उतारा", "सातबारा"],
  },
  {
    id: "gazette",
    category: "identity",
    term: {
      en: "Maharashtra Government Gazette (Rajpatra)",
      mr: "शासकीय राजपत्र (Gazette)",
      hi: "सरकारी राजपत्र (Gazette)",
    },
    definition: {
      en: "The official government publication used to legally announce and notify changes in citizen name, religion, or statutory regulations.",
      mr: "नाव बदलणे, धर्म बदलणे किंवा अधिकृत सरकारी नियमांची कायदेशीर घोषणा करणारे शासनाचे अधिकृत नियतकालिक.",
      hi: "आधिकारिक सरकारी प्रकाशन जिसके माध्यम से नाम परिवर्तन या सरकारी नियमों की आधिकारिक घोषणा की जाती है।",
    },
    keywords: ["gazette", "राजपत्र", "गॅझेट"],
  },
  {
    id: "ekyc",
    category: "portal",
    term: {
      en: "Aadhaar e-KYC",
      mr: "आधार ई-केवायसी (e-KYC)",
      hi: "आधार ई-केवाईसी (e-KYC)",
    },
    definition: {
      en: "Electronic identity verification using an OTP sent to your Aadhaar-linked mobile number.",
      mr: "आपल्या आधार कार्डशी जोडलेल्या मोबाइल नंबरवर येणाऱ्या ओटीपीद्वारे केली जाणारी डिजिटल ओळख पडताळणी.",
      hi: "आधार से जुड़े मोबाइल नंबर पर प्राप्त ओटीपी के माध्यम से की जाने वाली डिजिटल पहचान सत्यापन प्रक्रिया।",
    },
    keywords: ["ekyc", "e-kyc", "केवायसी", "केवाईसी"],
  },
  {
    id: "aaple-sarkar",
    category: "portal",
    term: {
      en: "Aaple Sarkar Portal",
      mr: "आपले सरकार पोर्टल (Aaple Sarkar)",
      hi: "आपले सरकार पोर्टल (Aaple Sarkar)",
    },
    definition: {
      en: "Maharashtra's official citizen portal for applying online for Right to Services (RTS) certificates and revenue documents.",
      mr: "महाराष्ट्र शासनाचे अधिकृत पोर्टल ज्याद्वारे नागरिक सेवा हमी कायद्यांतर्गत प्रमाणपत्रे व दाखल्यांसाठी अर्ज करता येतो.",
      hi: "महाराष्ट्र सरकार का आधिकारिक नागरिक पोर्टल जिसके माध्यम से सेवा के अधिकार के तहत प्रमाण पत्रों के लिए ऑनलाइन आवेदन किया जाता है।",
    },
    keywords: ["aaple", "sarkar", "आपले", "सरकार"],
  },
];

export class CivicGlossary {
  /**
   * Retrieves all glossary terms in the requested language.
   */
  public static getAllTerms(language: Language): GlossaryEntry[] {
    return CIVIC_GLOSSARY.map((item) => ({
      id: item.id,
      term: item.term[language] || item.term.en,
      definition: item.definition[language] || item.definition.en,
      category: item.category,
    }));
  }

  /**
   * Identifies terms relevant to a specific screenshot explanation or detected text.
   */
  public static findRelevantTerms(contextText: string, language: Language): GlossaryEntry[] {
    const lower = (contextText || "").toLowerCase();
    const matching = CIVIC_GLOSSARY.filter((item) =>
      item.keywords.some((k) => lower.includes(k.toLowerCase()))
    );

    // If matches found, return them; otherwise return top 4 representative terms
    const selected = matching.length > 0 ? matching : CIVIC_GLOSSARY.slice(0, 4);

    return selected.map((item) => ({
      id: item.id,
      term: item.term[language] || item.term.en,
      definition: item.definition[language] || item.definition.en,
      category: item.category,
    }));
  }
}
