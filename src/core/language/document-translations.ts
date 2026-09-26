/**
 * Sahayak AI — Multilingual Document Name Translations
 * 
 * Provides verified translations for official government document prerequisites
 * across English ('en'), Marathi ('mr'), and Hindi ('hi').
 */

import type { Language } from "../shared/types";

export const DOCUMENT_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Income Certificate Documents
  "Proof of Identity (Aadhaar Card / Voter ID / Passport)": {
    en: "Proof of Identity (Aadhaar Card / Voter ID / Passport)",
    mr: "ओळखीचा पुरावा (आधार कार्ड / मतदार ओळखपत्र / पासपोर्ट)",
    hi: "पहचान का प्रमाण (आधार कार्ड / मतदाता पहचान पत्र / पासपोर्ट)",
  },
  "Proof of Address (Ration Card / Electricity Bill / Telephone Bill)": {
    en: "Proof of Address (Ration Card / Electricity Bill / Telephone Bill)",
    mr: "पत्त्याचा पुरावा (रेशन कार्ड / वीज बिल / टेलिफोन बिल)",
    hi: "पते का प्रमाण (राशन कार्ड / बिजली बिल / टेलीफोन बिल)",
  },
  "Income Proof (Salary Slip / Form 16 / Income Tax Return / Talathi Verification Report)": {
    en: "Income Proof (Salary Slip / Form 16 / Income Tax Return / Talathi Verification Report)",
    mr: "उत्पन्नाचा पुरावा (वेतन पावती / फॉर्म १६ / आयकर विवरण / तलाठी पडताळणी अहवाल)",
    hi: "आय का प्रमाण (वेतन पर्ची / फॉर्म 16 / आयकर रिटर्न / तलाठी सत्यापन रिपोर्ट)",
  },
  "Recent passport-sized photograph (3.5cm x 4.5cm)": {
    en: "Recent passport-sized photograph (3.5cm x 4.5cm)",
    mr: "अलीकडील पासपोर्ट आकाराचे छायाचित्र (३.५ सेमी x ४.५ सेमी)",
    hi: "हाल का पासपोर्ट आकार का फोटो (3.5 सेमी x 4.5 सेमी)",
  },
  "Self-Declaration Affidavit in standard prescribed format": {
    en: "Self-Declaration Affidavit in standard prescribed format",
    mr: "विहित नमुन्यातील स्वयंघोषणा शपथपत्र",
    hi: "निर्धारित प्रारूप में स्व-घोषणा शपथ पत्र",
  },

  // Domicile Certificate Documents
  "Proof of Continuous 15-Year Residence in Maharashtra (School Leaving Certificate / Ration Cards / Property Tax receipts / Electricity bills)": {
    en: "Proof of Continuous 15-Year Residence in Maharashtra (School Leaving Certificate / Ration Cards / Property Tax receipts / Electricity bills)",
    mr: "महाराष्ट्रात सलग १५ वर्षे वास्तव्याचा पुरावा (शाळा सोडल्याचा दाखला / रेशन कार्ड / मालमत्ता कर पावती / वीज बिल)",
    hi: "महाराष्ट्र में निरंतर 15 वर्ष निवास का प्रमाण (स्कूल छोड़ने का प्रमाण पत्र / राशन कार्ड / संपत्ति कर रसीद / बिजली बिल)",
  },
  "Birth Certificate of Applicant (or School Leaving Certificate showing birthplace in Maharashtra)": {
    en: "Birth Certificate of Applicant (or School Leaving Certificate showing birthplace in Maharashtra)",
    mr: "अर्जदाराचा जन्म दाखला (किंवा महाराष्ट्रातील जन्म दर्शवणारा शाळा सोडल्याचा दाखला)",
    hi: "आवेदक का जन्म प्रमाण पत्र (या महाराष्ट्र में जन्मस्थान दर्शाने वाला स्कूल छोड़ने का प्रमाण पत्र)",
  },
  "Affidavit affirming domicile status in the prescribed format": {
    en: "Affidavit affirming domicile status in the prescribed format",
    mr: "विहित नमुन्यात अधिवास (डोमिसाइल) दर्जा सिद्ध करणारे शपथपत्र",
    hi: "निर्धारित प्रारूप में अधिवास (डोमिसाइल) स्थिति का शपथ पत्र",
  },

  // Ration Card Member Addition Documents
  "Original Active Ration Card copy": {
    en: "Original Active Ration Card copy",
    mr: "मूळ चालू रेशन कार्डची प्रत",
    hi: "मूल सक्रिय राशन कार्ड की प्रति",
  },
  "Aadhaar Card of the member to be added (Mandatory)": {
    en: "Aadhaar Card of the member to be added (Mandatory)",
    mr: "नाव समाविष्ट करावयाच्या सदस्याचे आधार कार्ड (अनिवार्य)",
    hi: "जोड़े जाने वाले सदस्य का आधार कार्ड (अनिवार्य)",
  },
  "Birth Certificate (in case of newborn child under 5 years)": {
    en: "Birth Certificate (in case of newborn child under 5 years)",
    mr: "जन्म दाखला (५ वर्षांखालील नवजात बालकाच्या बाबतीत)",
    hi: "जन्म प्रमाण पत्र (5 वर्ष से कम आयु के नवजात बच्चे के मामले में)",
  },
  "Marriage Certificate and Deletion Certificate/Surrender Certificate from previous ration card (in case of spouse)": {
    en: "Marriage Certificate and Deletion Certificate/Surrender Certificate from previous ration card (in case of spouse)",
    mr: "विवाह नोंदणी दाखला आणि मागील रेशन कार्डवरून नाव कमी केल्याचा दाखला (पती/पत्नीच्या बाबतीत)",
    hi: "विवाह प्रमाण पत्र और पिछले राशन कार्ड से नाम हटाने का प्रमाण पत्र (जीवनसाथी के मामले में)",
  },
  "Head of Family's Identity Proof & Passport-sized photo": {
    en: "Head of Family's Identity Proof & Passport-sized photo",
    mr: "कुटुंबप्रमुखाचा ओळख पुरावा आणि पासपोर्ट आकाराचा फोटो",
    hi: "परिवार के मुखिया का पहचान प्रमाण और पासपोर्ट आकार का फोटो",
  },

  // Non-Creamy Layer Certificate Documents
  "Proof of Identity (Aadhaar Card / Voter ID)": {
    en: "Proof of Identity (Aadhaar Card / Voter ID)",
    mr: "ओळखीचा पुरावा (आधार कार्ड / मतदार ओळखपत्र)",
    hi: "पहचान का प्रमाण (आधार कार्ड / मतदाता पहचान पत्र)",
  },
  "Proof of Address (Ration Card / Electricity Bill)": {
    en: "Proof of Address (Ration Card / Electricity Bill)",
    mr: "पत्त्याचा पुरावा (रेशन कार्ड / वीज बिल)",
    hi: "पते का प्रमाण (राशन कार्ड / बिजली बिल)",
  },
  "Caste Certificate of the Applicant or Father": {
    en: "Caste Certificate of the Applicant or Father",
    mr: "अर्जदाराचा किंवा वडिलांचा जातीचा दाखला",
    hi: "आवेदक या पिता का जाति प्रमाण पत्र",
  },
  "Income Proof of past 3 consecutive financial years (Salary certificate / Form 16 / ITR / Talathi report)": {
    en: "Income Proof of past 3 consecutive financial years (Salary certificate / Form 16 / ITR / Talathi report)",
    mr: "मागील सलग ३ आर्थिक वर्षांचा उत्पन्न पुरावा (वेतन प्रमाणपत्र / फॉर्म १६ / आयटीआर / तलाठी अहवाल)",
    hi: "पिछले लगातार 3 वित्तीय वर्षों का आय प्रमाण (वेतन प्रमाण पत्र / फॉर्म 16 / आईटीआर / तलाठी रिपोर्ट)",
  },
  "Self-Declaration and Affidavit in Form-B": {
    en: "Self-Declaration and Affidavit in Form-B",
    mr: "फॉर्म-बी मधील स्वयंघोषणा आणि शपथपत्र",
    hi: "फॉर्म-बी में स्व-घोषणा और शपथ पत्र",
  },

  // Senior Citizen Certificate Documents
  "Proof of Age (Birth Certificate / School Leaving Certificate / Passport / PAN Card / Driving Licence)": {
    en: "Proof of Age (Birth Certificate / School Leaving Certificate / Passport / PAN Card / Driving Licence)",
    mr: "वयाचा पुरावा (जन्म दाखला / शाळा सोडल्याचा दाखला / पासपोर्ट / पॅन कार्ड / ड्रायव्हिंग लायसन्स)",
    hi: "आयु का प्रमाण (जन्म प्रमाण पत्र / स्कूल छोड़ने का प्रमाण पत्र / पासपोर्ट / पैन कार्ड / ड्राइविंग लाइसेंस)",
  },
  "Proof of Address (Ration Card / Electricity Bill / Voter ID)": {
    en: "Proof of Address (Ration Card / Electricity Bill / Voter ID)",
    mr: "पत्त्याचा पुरावा (रेशन कार्ड / वीज बिल / मतदार ओळखपत्र)",
    hi: "पते का प्रमाण (राशन कार्ड / बिजली बिल / मतदाता पहचान पत्र)",
  },
  "Proof of Identity (Aadhaar Card)": {
    en: "Proof of Identity (Aadhaar Card)",
    mr: "ओळखीचा पुरावा (आधार कार्ड)",
    hi: "पहचान का प्रमाण (आधार कार्ड)",
  },
  "Recent passport-sized photograph": {
    en: "Recent passport-sized photograph",
    mr: "अलीकडील पासपोर्ट आकाराचे छायाचित्र",
    hi: "हाल का पासपोर्ट आकार का फोटो",
  },
  "Medical Certificate (if applying on grounds of physical frailty or health concessions)": {
    en: "Medical Certificate (if applying on grounds of physical frailty or health concessions)",
    mr: "वैद्यकीय प्रमाणपत्र (शारीरिक दुर्बलता किंवा आरोग्य सवलतीसाठी असल्यास)",
    hi: "चिकित्सा प्रमाण पत्र (शारीरिक दुर्बलता या स्वास्थ्य छूट के आधार पर आवेदन करने पर)",
  },

  // Scheme Documents
  "Domicile Certificate of Maharashtra State": {
    en: "Domicile Certificate of Maharashtra State",
    mr: "महाराष्ट्र राज्याचे अधिवास (डोमिसाइल) प्रमाणपत्र",
    hi: "महाराष्ट्र राज्य का अधिवास प्रमाण पत्र",
  },
  "Valid Income Certificate issued by competent Tehsildar (annual income under ₹8 Lakhs)": {
    en: "Valid Income Certificate issued by competent Tehsildar (annual income under ₹8 Lakhs)",
    mr: "सक्षम तहसीलदारांनी जारी केलेले वैध उत्पन्न प्रमाणपत्र (वार्षिक उत्पन्न रु. ८ लाखांखालील)",
    hi: "सक्षम तहसीलदार द्वारा जारी वैध आय प्रमाण पत्र (वार्षिक आय ₹8 लाख से कम)",
  },
  "HSC / SSC / Previous Semester Marksheet": {
    en: "HSC / SSC / Previous Semester Marksheet",
    mr: "१०वी / १२वी / मागील सेमिस्टरची गुणपत्रिका",
    hi: "10वीं / 12वीं / पिछले सेमेस्टर की अंकतालिका",
  },
  "CAP (Centralized Admission Process) Allotment Letter": {
    en: "CAP (Centralized Admission Process) Allotment Letter",
    mr: "कॅप (केंद्रीय प्रवेश प्रक्रिया) वाटप पत्र",
    hi: "सीएपी (केंद्रीकृत प्रवेश प्रक्रिया) आवंटन पत्र",
  },
  "Aadhaar Card linked with active bank account": {
    en: "Aadhaar Card linked with active bank account",
    mr: "सक्रिय बँक खात्याशी जोडलेले आधार कार्ड",
    hi: "सक्रिय बैंक खाते से जुड़ा आधार कार्ड",
  },
  "Fee Receipt of current academic year": {
    en: "Fee Receipt of current academic year",
    mr: "चालू शैक्षणिक वर्षाची फी पावती",
    hi: "वर्तमान शैक्षणिक वर्ष की शुल्क रसीद",
  },
  "College Bona Fide Certificate": {
    en: "College Bona Fide Certificate",
    mr: "महाविद्यालयाचे बोनाफाईड प्रमाणपत्र",
    hi: "कॉलेज बोनाफाइड प्रमाण पत्र",
  },
  "Age Proof (School Leaving Certificate / Civil Surgeon Certificate)": {
    en: "Age Proof (School Leaving Certificate / Civil Surgeon Certificate)",
    mr: "वयाचा पुरावा (शाळा सोडल्याचा दाखला / सिव्हिल सर्जन प्रमाणपत्र)",
    hi: "आयु का प्रमाण (स्कूल छोड़ने का प्रमाण पत्र / सिविल सर्जन प्रमाण पत्र)",
  },
  "Proof of 15 years Residence in Maharashtra (Domicile or Ration Card)": {
    en: "Proof of 15 years Residence in Maharashtra (Domicile or Ration Card)",
    mr: "महाराष्ट्रात १५ वर्षे वास्तव्याचा पुरावा (डोमिसाइल किंवा रेशन कार्ड)",
    hi: "महाराष्ट्र में 15 वर्ष निवास का प्रमाण (अधिवास या राशन कार्ड)",
  },
  "Income Certificate issued by Tehsildar (annual income within ₹21,000/₹50,000 limit)": {
    en: "Income Certificate issued by Tehsildar (annual income within ₹21,000/₹50,000 limit)",
    mr: "तहसीलदारांनी जारी केलेले उत्पन्न प्रमाणपत्र (वार्षिक उत्पन्न मर्यादा रु. २१,००० / ५०,०००)",
    hi: "तहसीलदार द्वारा जारी आय प्रमाण पत्र (वार्षिक आय ₹21,000 / ₹50,000 की सीमा में)",
  },
  "Disability Certificate with minimum 40% disability (if applying under disability category)": {
    en: "Disability Certificate with minimum 40% disability (if applying under disability category)",
    mr: "किमान ४०% दिव्यांगत्व प्रमाणपत्र (दिव्यांग प्रवर्गातून अर्ज करत असल्यास)",
    hi: "न्यूनतम 40% दिव्यांगता प्रमाण पत्र (यदि दिव्यांग श्रेणी के तहत आवेदन कर रहे हैं)",
  },
  "Death Certificate of husband (for widows) or court decree (for deserted/divorced women)": {
    en: "Death Certificate of husband (for widows) or court decree (for deserted/divorced women)",
    mr: "पतीचा मृत्यू दाखला (विधवांसाठी) किंवा न्यायालयाचा निर्णय (घटस्फोटित/परित्यक्त्या महिलांसाठी)",
    hi: "पति का मृत्यु प्रमाण पत्र (विधवाओं के लिए) या अदालती आदेश (तलाकशुदा/परित्यक्ता महिलाओं के लिए)",
  },
  "Aadhaar Card and Bank Passbook copy": {
    en: "Aadhaar Card and Bank Passbook copy",
    mr: "आधार कार्ड आणि बँक पासबुकची प्रत",
    hi: "आधार कार्ड और बैंक पासबुक की प्रति",
  },
  "Aadhaar Card of the applicant woman": {
    en: "Aadhaar Card of the applicant woman",
    mr: "अर्जदार महिलेचे आधार कार्ड",
    hi: "आवेदक महिला का आधार कार्ड",
  },
  "Domicile Certificate or 15-year Maharashtra Residence Certificate (or Ration Card/Voter ID)": {
    en: "Domicile Certificate or 15-year Maharashtra Residence Certificate (or Ration Card/Voter ID)",
    mr: "अधिवास प्रमाणपत्र किंवा १५ वर्षांचा वास्तव्याचा दाखला (किंवा रेशन कार्ड/मतदार ओळखपत्र)",
    hi: "अधिवास प्रमाण पत्र या 15 वर्ष निवास प्रमाण पत्र (या राशन कार्ड/मतदाता पहचान पत्र)",
  },
  "Yellow or Orange Ration Card (or Tehsildar Income Certificate below ₹2.5 Lakhs)": {
    en: "Yellow or Orange Ration Card (or Tehsildar Income Certificate below ₹2.5 Lakhs)",
    mr: "पिवळे किंवा केशरी रेशन कार्ड (किंवा रु. २.५ लाखांखालील तहसीलदार उत्पन्न प्रमाणपत्र)",
    hi: "पीला या नारंगी राशन कार्ड (या ₹2.5 लाख से कम का तहसीलदार आय प्रमाण पत्र)",
  },
  "Aadhaar-linked Bank Passbook copy": {
    en: "Aadhaar-linked Bank Passbook copy",
    mr: "आधार जोडलेल्या बँक पासबुकची प्रत",
    hi: "आधार से जुड़े बैंक पासबुक की प्रति",
  },
  "Self-Declaration Affidavit of compliance with scheme rules": {
    en: "Self-Declaration Affidavit of compliance with scheme rules",
    mr: "योजनेच्या अटी व शर्तींचे पालन केल्याचे स्वयंघोषणा शपथपत्र",
    hi: "योजना के नियमों के अनुपालन का स्व-घोषणा शपथ पत्र",
  },
  "Updated 7/12 Land Record (Satbara Utara) and 8A Extract from Maharashtra Mahabhulekh": {
    en: "Updated 7/12 Land Record (Satbara Utara) and 8A Extract from Maharashtra Mahabhulekh",
    mr: "महाभूलेखवरून अद्ययावत ७/१२ उतारा (सातबारा) आणि ८-अ नोंद",
    hi: "महाभूलेख से अद्यतन 7/12 भू-अभिलेख (सातबारा) और 8A उद्धरण",
  },
  "Aadhaar Card with mobile number linked for e-KYC verification": {
    en: "Aadhaar Card with mobile number linked for e-KYC verification",
    mr: "ई-केवायसी पडताळणीसाठी मोबाईल नंबर जोडलेले आधार कार्ड",
    hi: "ई-केवाईसी सत्यापन के लिए मोबाइल नंबर से जुड़ा आधार कार्ड",
  },
  "Active Bank Account details (Aadhaar NPCI-mapped)": {
    en: "Active Bank Account details (Aadhaar NPCI-mapped)",
    mr: "सक्रिय बँक खात्याचा तपशील (आधार एनपीसीआय जोडलेले)",
    hi: "सक्रिय बैंक खाते का विवरण (आधार एनपीसीआई से जुड़ा हुआ)",
  },
  "Self-Declaration of land ownership": {
    en: "Self-Declaration of land ownership",
    mr: "जमीन मालकीचे स्वयंघोषणापत्र",
    hi: "भूमि स्वामित्व का स्व-घोषणा पत्र",
  },
  "UDID Card or Civil Surgeon Disability Certificate (40%+ disability)": {
    en: "UDID Card or Civil Surgeon Disability Certificate (40%+ disability)",
    mr: "युडीआयडी (UDID) कार्ड किंवा सिव्हिल सर्जन दिव्यांगत्व प्रमाणपत्र (४०%+ दिव्यांगत्व)",
    hi: "यूडीआईडी कार्ड या सिविल सर्जन दिव्यांगता प्रमाण पत्र (40%+ दिव्यांगता)",
  },
  "Proof of Age and Domicile in Maharashtra": {
    en: "Proof of Age and Domicile in Maharashtra",
    mr: "महाराष्ट्रातील वय आणि अधिवासाचा पुरावा",
    hi: "महाराष्ट्र में आयु और अधिवास का प्रमाण",
  },
  "Income Certificate issued by Tehsildar": {
    en: "Income Certificate issued by Tehsildar",
    mr: "तहसीलदारांनी जारी केलेले उत्पन्न प्रमाणपत्र",
    hi: "तहसीलदार द्वारा जारी आय प्रमाण पत्र",
  },
  "Project proposal / quotation for tools, machinery, or business setup": {
    en: "Project proposal / quotation for tools, machinery, or business setup",
    mr: "व्यवसाय, उपकरणे किंवा यंत्रसामग्रीसाठी प्रकल्प प्रस्ताव / दरपत्रक",
    hi: "उपकरणों, मशीनरी या व्यवसाय सेटअप के लिए परियोजना प्रस्ताव / कोटेशन",
  },
  "Bank Account details and Aadhaar Card": {
    en: "Bank Account details and Aadhaar Card",
    mr: "बँक खात्याचा तपशील आणि आधार कार्ड",
    hi: "बैंक खाते का विवरण और आधार कार्ड",
  },
  "Age Proof verifying 65+ years (School Leaving Certificate / Civil Surgeon Certificate / Voter ID)": {
    en: "Age Proof verifying 65+ years (School Leaving Certificate / Civil Surgeon Certificate / Voter ID)",
    mr: "६५+ वर्षे वयाचा पुरावा (शाळा सोडल्याचा दाखला / सिव्हिल सर्जन प्रमाणपत्र / मतदार ओळखपत्र)",
    hi: "65+ वर्ष आयु का प्रमाण (स्कूल छोड़ने का प्रमाण पत्र / सिविल सर्जन प्रमाण पत्र / मतदाता पहचान पत्र)",
  },
  "Domicile Certificate or 15-year Maharashtra residence proof": {
    en: "Domicile Certificate or 15-year Maharashtra residence proof",
    mr: "अधिवास प्रमाणपत्र किंवा १५ वर्षे वास्तव्याचा पुरावा",
    hi: "अधिवास प्रमाण पत्र या 15 वर्ष निवास का प्रमाण",
  },
  "BPL Card copy (for Category A applicants)": {
    en: "BPL Card copy (for Category A applicants)",
    mr: "बीपीएल (दारिद्र्यरेषेखालील) कार्डची प्रत (प्रवर्ग 'अ' अर्जदारांसाठी)",
    hi: "बीपीएल कार्ड की प्रति (श्रेणी 'ए' आवेदकों के लिए)",
  },
  "Aadhaar Card and Bank Passbook": {
    en: "Aadhaar Card and Bank Passbook",
    mr: "आधार कार्ड आणि बँक पासबुक",
    hi: "आधार कार्ड और बैंक पासबुक",
  },
};

/**
 * Returns the localized document name based on current citizen language preference.
 * Falls back to original English string if no explicit translation exists.
 */
export function getLocalizedDocument(doc: string, language: Language): string {
  if (language === "en") return doc;
  const entry = DOCUMENT_TRANSLATIONS[doc.trim()];
  if (entry && entry[language]) {
    return entry[language];
  }
  return doc;
}
