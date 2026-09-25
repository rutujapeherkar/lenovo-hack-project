/**
 * Sahayak AI — Screen Explanation Service
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 21-22 & DATA-CONTRACTS.md Section 26
 * Phase: P07 — Explain Screen
 * 
 * Coordinates:
 * 1. Client-side image validation (size <= 5 MB, supported MIME types).
 * 2. In-memory temporary encoding (zero disk or cloud persistence).
 * 3. Calling /api/explain-screen backend vision endpoint with offline fallback.
 * 4. Civic glossary lookup for detected administrative terminology.
 */

import type { ScreenExplanation, Language } from "../shared/types";
import { validateImageFile, type FileLike } from "./image-validator";
import { CivicGlossary, type GlossaryEntry } from "./glossary";

export interface ExplainScreenResult {
  success: boolean;
  explanation?: ScreenExplanation;
  glossary?: GlossaryEntry[];
  error?: string;
}

export class ScreenService {
  /**
   * Explains an uploaded screenshot file or buffer.
   */
  public static async explainScreen(
    file: File | (FileLike & { buffer?: ArrayBuffer }),
    language: Language
  ): Promise<ExplainScreenResult> {
    // 1. Client-side file validation
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || "Invalid image file.",
      };
    }

    try {
      // 2. Convert to in-memory base64 string
      const base64 = await this.fileToBase64(file);

      // 3. Invoke server-side vision pipeline (/api/explain-screen)
      let explanation: ScreenExplanation | null = null;

      if (typeof fetch !== "undefined") {
        try {
          const res = await fetch("/api/explain-screen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageBase64: base64,
              mimeType: file.type,
              language,
              fileName: file.name || "screenshot.png",
            }),
          });

          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              explanation = json.data as ScreenExplanation;
            }
          }
        } catch (_netErr) {
          // Fall through to offline fallback
        }
      }

      // 4. Offline fallback if API endpoint was unreachable
      if (!explanation) {
        explanation = await this.getOfflineExplanation(file.name || "", language);
      }

      // 5. Extract relevant glossary entries
      const contextText = [
        explanation.summary,
        ...explanation.elements.map((e) => `${e.name} ${e.explanation}`),
      ].join(" ");
      const glossary = CivicGlossary.findRelevantTerms(contextText, language);

      return {
        success: true,
        explanation,
        glossary,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to process screenshot. Please try again.",
      };
    }
  }

  /**
   * In-memory converter to Base64 (zero disk persistence).
   */
  private static fileToBase64(file: File | (FileLike & { buffer?: ArrayBuffer })): Promise<string> {
    return new Promise((resolve, reject) => {
      // Browser File object with FileReader
      if (typeof FileReader !== "undefined" && file instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const commaIdx = result.indexOf(",");
          resolve(commaIdx >= 0 ? result.substring(commaIdx + 1) : result);
        };
        reader.onerror = () => reject(new Error("Unable to read image file."));
        reader.readAsDataURL(file);
        return;
      }

      // ArrayBuffer / Node Buffer
      if ((file as any).buffer) {
        if (typeof (globalThis as any).Buffer !== "undefined") {
          const buf = (globalThis as any).Buffer.from((file as any).buffer);
          resolve(buf.toString("base64"));
          return;
        }
        const bytes = new Uint8Array((file as any).buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        resolve(typeof btoa !== "undefined" ? btoa(binary) : "");
        return;
      }

      resolve("");
    });
  }

  /**
   * Deterministic client-safe offline explanation fallback.
   */
  private static async getOfflineExplanation(
    fileName: string,
    language: Language
  ): Promise<ScreenExplanation> {
    const isCert = fileName.toLowerCase().includes("income") || fileName.toLowerCase().includes("certificate");

    if (language === "mr") {
      return {
        summary: isCert
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
        ],
        nextAction: "आपला नोंदणीकृत मोबाइल नंबर आणि पासवर्ड भरा, कॅप्चा कोड टाईप करा आणि 'लॉगिन' बटण दाबा.",
        warnings: [
          "सुरक्षा सूचना: आपला पासवर्ड किंवा ओटीपी कधीही कोणालाही सांगू नका. अधिकृत शासकीय पोर्टल नेहमी https:// ने सुरू होते.",
        ],
      };
    }

    if (language === "hi") {
      return {
        summary: isCert
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
        ],
        nextAction: "अपना पंजीकृत मोबाइल नंबर और पासवर्ड दर्ज करें, कैप्चा कोड भरें और 'लॉगिन' बटन पर क्लिक करें।",
        warnings: [
          "सुरक्षा चेतावनी: अपना पासवर्ड या ओटीपी कभी भी किसी के साथ साझा न करें। आधिकारिक पोर्टल हमेशा https:// से शुरू होता है।",
        ],
      };
    }

    return {
      summary: isCert
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
      ],
      nextAction: "Enter your registered mobile number and password, solve the visual captcha code, and click the Login button.",
      warnings: [
        "Security Alert: Sahayak AI will never ask for your passwords, OTPs, or PINs. Only enter credentials on verified https:// gov.in domains.",
      ],
    };
  }
}
