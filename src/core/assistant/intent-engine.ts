/**
 * Sahayak AI — Deterministic Multilingual Intent Classification Engine
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 10 & DATA-CONTRACTS.md Section 22
 * Phase: P04 — AI Assistant Core
 * 
 * Classifies user requests across English, Marathi, and Hindi into canonical Intent types.
 * Evaluates deterministic keyword and regex heuristics before delegating to AI.
 */

import type { Intent, PageContext } from "../shared/types";
import { VALID_INTENTS } from "../shared/validators";

interface IntentRule {
  intent: Intent;
  patterns: RegExp[];
  priority: number;
}

/**
 * Deterministic multilingual intent rules ordered by specificity.
 */
const INTENT_RULES: IntentRule[] = [
  // 1. Required Documents Queries
  {
    intent: "required_documents",
    priority: 90,
    patterns: [
      /\b(documents?|papers?|proofs?|checklist)\b/i,
      /\b(what docs?|documents required|papers needed|required documents)\b/i,
      /(कागदपत्रे|कागदपत्र|दस्तऐवज|पुरावे|कागदपत्रे काय लागतील|कोणती कागदपत्रे)/i,
      /(दस्तावेज|कागजात|प्रमाण पत्र के लिए क्या लगेगा|क्या दस्तावेज)/i,
    ],
  },

  // 2. Next Step / Task Progression Queries
  {
    intent: "next_step",
    priority: 85,
    patterns: [
      /\b(next step|what next|what to do next|how to proceed|following step)\b/i,
      /(पुढील पायरी|पुढे काय करायचे|पुढची पायरी|पुढचे पाऊल)/i,
      /(अगला कदम|आगे क्या करना है|अगला स्टेप|इसके बाद क्या)/i,
    ],
  },

  // 3. Screen Explanation Queries
  {
    intent: "explain_screen",
    priority: 80,
    patterns: [
      /\b(explain (this )?screen|screenshot|what is on (this )?screen|read screen)\b/i,
      /(स्क्रीन समजून सांगा|स्क्रीन स्पष्ट करा|स्क्रीनशॉट|स्क्रीनवर काय आहे)/i,
      /(स्क्रीन समझाओ|स्क्रीनशॉट|स्क्रीन पर क्या है)/i,
    ],
  },

  // 4. Field Explanation Queries
  {
    intent: "explain_field",
    priority: 75,
    patterns: [
      /\b(explain (this )?field|what is this field|field help|input help)\b/i,
      /(हे फील्ड काय आहे|या रकान्यात काय भरायचे|फील्ड समजवा)/i,
      /(यह फील्ड क्या है|इस बॉक्स में क्या भरना है|फील्ड समझाओ)/i,
    ],
  },

  // 5. Current Page Help Queries
  {
    intent: "current_page_help",
    priority: 70,
    patterns: [
      /\b(current page|help on this page|stuck on this page|portal help)\b/i,
      /(या पानावर मदत|सध्याच्या पानावर मदत|पोर्टलवर अडकलो)/i,
      /(इस पेज पर मदद|वर्तमान पेज|पोर्टल पर सहायता)/i,
    ],
  },

  // 6. Welfare Scheme Discovery Queries
  {
    intent: "scheme_discovery",
    priority: 65,
    patterns: [
      /\b(schemes?|yojna|yojana|scholarships?|pension|subsidy|subsidies|welfare|grant|ebc|ladki bahin|pm-?kisan|shravanbal|sanjay gandhi)\b/i,
      /(योजना|शिष्यवृत्ती|पेन्शन|निवृत्तीवेतन|अनुदान|लाडकी बहीण|संजय गांधी निराधार|श्रावणबाळ|ईबीसी)/i,
      /(योजना|छात्रवृत्ति|पेंशन|लाड़की बहिन|पीएम किसान|अनुदान|कल्याणकारी योजना)/i,
    ],
  },

  // 7. Civic Service Guidance & Application Queries (Step journeys)
  {
    intent: "service_guidance",
    priority: 60,
    patterns: [
      /\b(how to apply|apply for|procedure for|process to get|steps for|application process)\b/i,
      /\b(how to get income certificate|how to get domicile|apply domicile|apply ration card)\b/i,
      /(कसे काढायचे|अर्ज कसा करावा|अर्ज करण्याची प्रक्रिया|प्रक्रिया काय आहे|कसा मिळवायचा)/i,
      /(मला उत्पन्न प्रमाणपत्र कसे काढायचे|दाखला कसा काढायचा|नाव कसे वाढवायचे)/i,
      /(आवेदन कैसे करें|कैसे प्राप्त करें|प्रक्रिया क्या है|कैसे बनवाएं)/i,
      /(आय प्रमाण पत्र कैसे बनाएं|निवास प्रमाण पत्र कैसे प्राप्त करें)/i,
    ],
  },

  // 8. Civic Service Discovery Queries (Finding services, certificates, portals)
  {
    intent: "service_discovery",
    priority: 55,
    patterns: [
      /\b(income certificate|domicile|caste certificate|ration card|non[- ]creamy layer|senior citizen certificate|aaple sarkar|mahaonline)\b/i,
      /\b(citizen service|public service|certificate|revenue department|rcms)\b/i,
      /(उत्पन्न प्रमाणपत्र|उत्पन्नाचा दाखला|उत्पन्न दाखला|दाखला|अधिवास प्रमाणपत्र|रहिवासी दाखला|रेशन कार्ड|रेशनकार्ड|नाव वाढवणे|नॉन क्रिमीलेअर)/i,
      /(आपले सरकार|महसूल विभाग|नागरिक सेवा)/i,
      /(आय प्रमाण पत्र|निवास प्रमाण पत्र|राशन कार्ड|जाति प्रमाण पत्र|नाम जोड़ना|नागरिक सेवाएं)/i,
    ],
  },

  // 9. General Information Queries
  {
    intent: "general_information",
    priority: 40,
    patterns: [
      /\b(help|info|information|what can you do|who are you|hello|hi|namaste|contact|helpline|rts act)\b/i,
      /(मदत|माहिती|नमस्कार|तुम्ही कोण आहात|काय करू शकता|संपर्क|हेल्पलाईन)/i,
      /(मदद|जानकारी|नमस्ते|आप कौन हैं|क्या कर सकते हैं|हेल्पलाइन)/i,
    ],
  },
];

/**
 * Classifies raw user text into one of the canonical Intent values.
 */
export function detectIntent(message: string, context?: PageContext): Intent {
  if (!message || typeof message !== "string") {
    return "unknown";
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return "unknown";
  }

  // Check contextual overrides if PageContext specifies explicit form/field state
  if (context?.detectedFieldId && trimmed.length < 30 && /what|help|काय|क्या/i.test(trimmed)) {
    return "explain_field";
  }

  if (context?.detectedFormId && /where|page|help|अडकलो|मदत/i.test(trimmed)) {
    return "current_page_help";
  }

  // Evaluate pattern rules by priority
  for (const rule of INTENT_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(trimmed)) {
        return rule.intent;
      }
    }
  }

  // Default to general_information if query has substantial content, else unknown
  return trimmed.split(/\s+/).length >= 2 ? "general_information" : "unknown";
}

/**
 * Asserts that an intent string is a valid canonical Intent.
 */
export function isValidIntent(intent: string): intent is Intent {
  return VALID_INTENTS.includes(intent as Intent);
}
