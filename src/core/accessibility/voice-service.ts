/**
 * Sahayak AI — Voice Input & Output Service (Web Speech API Abstraction)
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 28 & UI.md Section 35
 * Phase: P09 — Accessibility & Voice
 * 
 * Invariants:
 * 1. Zero heavyweight browser-bundled speech models (uses native Web Speech API).
 * 2. Voice is strictly an input/output layer; does not replace the assistant core.
 * 3. Never auto-submit forms on voice transcription; places text in input for user confirmation.
 * 4. Safety: Refuses to synthesize speech containing OTP, PIN, password, or financial secrets.
 * 5. Multilingual support across Marathi (mr-IN), Hindi (hi-IN), and English (en-IN) with graceful fallback.
 */

import type { Language } from "../shared/types";

export type VoiceInputState =
  | "idle"
  | "listening"
  | "processing"
  | "success"
  | "no_speech"
  | "permission_denied"
  | "not_supported"
  | "error";

export interface VoiceFeedbackMessages {
  idle: string;
  listening: string;
  processing: string;
  success: string;
  no_speech: string;
  permission_denied: string;
  not_supported: string;
  error: string;
}

export const VOICE_MESSAGES: Record<Language, VoiceFeedbackMessages> = {
  en: {
    idle: "Click microphone to speak",
    listening: "Listening... speak now",
    processing: "Processing your request...",
    success: "Voice recognized",
    no_speech: "We didn't hear anything. Please try again.",
    permission_denied: "Microphone access is blocked. Please allow microphone access in your browser settings.",
    not_supported: "Voice input is not supported in this browser. Please type your request.",
    error: "An error occurred with voice recognition. Please try typing instead.",
  },
  mr: {
    idle: "बोलण्यासाठी मायक्रोफोनवर क्लिक करा",
    listening: "ऐकत आहे... आता बोला",
    processing: "तुमच्या विनंतीवर प्रक्रिया सुरू आहे...",
    success: "आवाज ओळखला गेला",
    no_speech: "काहीही ऐकू आले नाही. कृपया पुन्हा प्रयत्न करा.",
    permission_denied: "मायक्रोफोन प्रवेश अवरोधित आहे. कृपया आपल्या ब्राउझर सेटिंग्जमध्ये मायक्रोफोन परवानगी द्या.",
    not_supported: "या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया आपला प्रश्न टाइप करा.",
    error: "आवाज ओळखताना त्रुटी आली. कृपया टाइप करून विचारणा करा.",
  },
  hi: {
    idle: "बोलने के लिए माइक्रोफ़ोन पर क्लिक करें",
    listening: "सुन रहा है... अब बोलें",
    processing: "आपके अनुरोध पर प्रक्रिया चल रही है...",
    success: "आवाज़ पहचानी गई",
    no_speech: "कुछ भी सुनाई नहीं दिया। कृपया पुनः प्रयास करें।",
    permission_denied: "माइक्रोफ़ोन एक्सेस ब्लॉक है। कृपया अपनी ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।",
    not_supported: "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया लिखकर प्रश्न पूछें।",
    error: "आवाज़ पहचानने में त्रुटि हुई। कृपया लिखकर प्रयास करें।",
  },
};

/** Language mapping to BCP 47 tags for SpeechRecognition & SpeechSynthesis */
export const LANGUAGE_LOCALE_MAP: Record<Language, string> = {
  en: "en-IN",
  mr: "mr-IN",
  hi: "hi-IN",
};

/**
 * Sensitive credential patterns that MUST NEVER be spoken or processed via voice
 * (Rule: P09-SEC-01 & SECURITY.md Section 18)
 */
const SENSITIVE_CREDENTIAL_PATTERNS = [
  /\b(otp|one[- ]time[- ]password|verification[- ]code)\b/i,
  /(ओटीपी|वन[- ]टाइम[- ]पासवर्ड)/i,
  /\b(pin|upi[- ]pin|atm[- ]pin|mpin)\b/i,
  /(पिन|यूपीआय[- ]पिन|एमपिन)/i,
  /\b(password|passwd|passcode)\b/i,
  /(गुपित शब्द|गुप्त शब्द|पासवर्ड|पासकोड|गुप्त कोड)/i,
  /\b(cvv|cvc)\b/i,
  /(सीव्हीव्ही|सीवीवी)/i,
  /\b(debit[- ]card|credit[- ]card|(?:credit|debit|atm)\s+card\s+number|16[- ]digit)\b/i,
  /\b(net[- ]banking|bank password)\b/i,
  /\b(\d{4,6})\b.*\b(otp|pin|code)\b/i,
  /\b(otp|pin|code)\b.*\b(\d{4,6})\b/i,
];

/**
 * Checks if a string contains sensitive credentials (OTP, PIN, passwords, CVV)
 */
export function containsSensitiveCredentials(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  return SENSITIVE_CREDENTIAL_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Detects whether spoken transcript contains wake keyword ("ok sahayak", "okay sahayak", "sahayak", etc.)
 */
export function containsWakeWord(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const normalized = text.toLowerCase();
  return (
    normalized.includes("ok sahayak") ||
    normalized.includes("okay sahayak") ||
    normalized.includes("hey sahayak") ||
    normalized.includes("hello sahayak") ||
    normalized.includes("sahayak") ||
    normalized.includes("ओके साहायक") ||
    normalized.includes("साहायक") ||
    normalized.includes("सहायक")
  );
}

/**
 * Detects whether spoken transcript contains completion keyword ("done", "झाले", "हो गया", etc.)
 */
export function containsDoneWord(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const lower = text.toLowerCase().trim();

  const enMatches = [
    "done",
    "i'm done",
    "im done",
    "i am done",
    "finished",
    "stop listening",
    "search now",
    "submit",
    "that's it",
    "thats it",
  ];
  for (const w of enMatches) {
    if (
      new RegExp(`(^|\\s|[^a-zA-Z0-9])${w.replace("'", "['’]?")}($|\\s|[^a-zA-Z0-9])`, "i").test(lower) ||
      lower === w
    ) {
      return true;
    }
  }

  const indicMatches = [
    "झाले",
    "हो झाले",
    "पूर्ण",
    "हो गया",
    "बस",
    "डन",
    "शोध",
    "सर्च करा",
    "खोजो",
  ];
  return indicMatches.some((w) => text.includes(w));
}

/**
 * Strips wake word and done keywords from transcribed query
 */
export function cleanVoiceQuery(text: string): string {
  if (!text || typeof text !== "string") return "";
  let cleaned = text
    .replace(/\b(ok sahayak|okay sahayak|hey sahayak|hello sahayak|ok sahyak|sahayak)\b/gi, "")
    .replace(/(ओके साहायक|साहायक|सहायक|ओके सहायक)/g, "")
    .replace(/\b(i'm done|im done|i am done|done|finished|stop listening|search now|submit|that's it|thats it)\b/gi, "")
    .replace(/(हो झाले|झाले|पूर्ण|हो गया|बस|डन|सर्च करा|खोजो)/g, "")
    .trim();

  // Strip leading/trailing punctuation and whitespace
  cleaned = cleaned.replace(/^[,\.\s\-:?।!]+|[,\.\s\-:?।!]+$/g, "").trim();
  return cleaned;
}

export interface HandsFreeVoiceOptions {
  language: Language;
  onWakeWordDetected: () => void;
  onTranscriptUpdate: (transcript: string) => void;
  onDoneDetected: (finalQuery: string) => void;
  onError?: (state: VoiceInputState, errorMessage: string) => void;
  onStatusChange?: (status: "idle" | "listening_wake" | "recording_query" | "processing") => void;
}

export interface VoiceRecognitionOptions {
  language: Language;
  onResult: (text: string, isFinal: boolean) => void;
  onError?: (state: VoiceInputState, errorMessage: string) => void;
  onStateChange?: (state: VoiceInputState) => void;
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export class VoiceService {
  private static recognitionInstance: any = null;
  /** Active utterance reference to prevent Chrome garbage-collection mid-speech */
  private static activeUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Check if speech-to-text is supported by the current browser environment
   */
  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Alias for test suite compatibility (Test P09-VOI-01)
   */
  public static isVoiceSupported(): boolean {
    return this.isSpeechRecognitionSupported();
  }

  /**
   * Check if text-to-speech is supported by the current browser environment
   */
  public static isSpeechSynthesisSupported(): boolean {
    if (typeof window === "undefined") return false;
    return (
      "speechSynthesis" in window &&
      typeof window.speechSynthesis.speak === "function"
    );
  }

  /**
   * Alias for TTS capability
   */
  public static isTtsSupported(): boolean {
    return this.isSpeechSynthesisSupported();
  }

  /**
   * Resolves BCP-47 locale tag for given language
   */
  public static getLocale(language: Language): string {
    return LANGUAGE_LOCALE_MAP[language] || "en-IN";
  }

  /**
   * Get user-friendly feedback message for current state and language
   */
  public static getMessage(state: VoiceInputState, language: Language): string {
    const langDict = VOICE_MESSAGES[language] || VOICE_MESSAGES.en;
    return langDict[state] || langDict.error;
  }

  /**
   * Immediately requests browser microphone permission via getUserMedia
   */
  public static async requestMicrophonePermission(): Promise<boolean> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (_err) {
      return false;
    }
  }

  /**
   * Start hands-free keyword-activated voice session:
   * 1. Listens continuously for wake word "Ok Sahayak"
   * 2. When wake word is detected, triggers onWakeWordDetected (e.g. activates read feature)
   * 3. Continuously records until user says "Done"
   * 4. When "Done" is detected, stops and passes cleaned query to onDoneDetected
   */
  public static startHandsFreeListening(options: HandsFreeVoiceOptions): () => void {
    const {
      language,
      onWakeWordDetected,
      onTranscriptUpdate,
      onDoneDetected,
      onError,
      onStatusChange,
    } = options;

    if (!this.isSpeechRecognitionSupported()) {
      onError?.("not_supported", this.getMessage("not_supported", language));
      onStatusChange?.("idle");
      return () => {};
    }

    let isManuallyStopped = false;
    let phase: "waiting_wake" | "recording_query" = "waiting_wake";
    let recognition: any = null;
    let accumulatedQueryText = "";

    const startSession = () => {
      if (isManuallyStopped) return;

      try {
        const SpeechRecognitionConstructor =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;

        recognition = new SpeechRecognitionConstructor();
        recognition.lang = this.getLocale(language);
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          onStatusChange?.(phase === "waiting_wake" ? "listening_wake" : "recording_query");
        };

        recognition.onresult = (event: any) => {
          let fullSessionTranscript = "";
          let latestChunk = "";

          for (let i = 0; i < event.results.length; ++i) {
            fullSessionTranscript += event.results[i][0].transcript + " ";
          }
          fullSessionTranscript = fullSessionTranscript.trim();

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            latestChunk += event.results[i][0].transcript + " ";
          }
          latestChunk = latestChunk.trim();

          if (!latestChunk && !fullSessionTranscript) return;

          if (phase === "waiting_wake") {
            if (containsWakeWord(latestChunk) || containsWakeWord(fullSessionTranscript)) {
              phase = "recording_query";
              onStatusChange?.("recording_query");
              onWakeWordDetected();

              // Extract any words already spoken in the same breath after wake word
              const initialQuery = cleanVoiceQuery(fullSessionTranscript || latestChunk);
              accumulatedQueryText = initialQuery;
              if (initialQuery) {
                onTranscriptUpdate(initialQuery);
              }

              // Check if they said "done" in the same breath
              if (containsDoneWord(latestChunk) || containsDoneWord(fullSessionTranscript)) {
                phase = "waiting_wake";
                onStatusChange?.("processing");
                const finalQuery = cleanVoiceQuery(fullSessionTranscript || accumulatedQueryText);
                accumulatedQueryText = "";
                onDoneDetected(finalQuery);
              }
            }
          } else if (phase === "recording_query") {
            const isDoneSpoken =
              containsDoneWord(latestChunk) ||
              containsDoneWord(fullSessionTranscript);

            if (isDoneSpoken) {
              phase = "waiting_wake";
              onStatusChange?.("processing");

              // Compute the full final query from session and accumulated buffer
              let finalQuery = cleanVoiceQuery(fullSessionTranscript);
              if (!finalQuery || finalQuery.length < 2) {
                finalQuery = cleanVoiceQuery(accumulatedQueryText + " " + latestChunk);
              }
              if (!finalQuery) {
                finalQuery = accumulatedQueryText;
              }
              finalQuery = cleanVoiceQuery(finalQuery);

              accumulatedQueryText = "";
              onDoneDetected(finalQuery);
            } else {
              // Update live transcript while query is being spoken
              const cleanFull = cleanVoiceQuery(fullSessionTranscript);
              if (cleanFull) {
                accumulatedQueryText = cleanFull;
                onTranscriptUpdate(cleanFull);
              } else {
                const cleanChunk = cleanVoiceQuery(latestChunk);
                if (cleanChunk) {
                  accumulatedQueryText = (accumulatedQueryText + " " + cleanChunk).trim();
                  onTranscriptUpdate(accumulatedQueryText);
                }
              }
            }
          }
        };

        recognition.onerror = (event: any) => {
          const errorType = event.error;
          if (errorType === "not-allowed" || errorType === "service-not-allowed") {
            onError?.("permission_denied", this.getMessage("permission_denied", language));
            isManuallyStopped = true;
          }
        };

        recognition.onend = () => {
          // Restart standby recognition seamlessly unless cancelled
          if (!isManuallyStopped) {
            setTimeout(() => {
              if (!isManuallyStopped) {
                startSession();
              }
            }, 250);
          }
        };

        recognition.start();
      } catch (err: any) {
        onError?.("error", err?.message || "Failed to initialize hands-free voice");
      }
    };

    startSession();

    return () => {
      isManuallyStopped = true;
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // Ignore abort
        }
      }
    };
  }

  public static containsWakeWord = containsWakeWord;
  public static containsDoneWord = containsDoneWord;
  public static cleanVoiceQuery = cleanVoiceQuery;

  /**
   * Start listening for voice input using Web Speech API
   * Returns a cleanup cancellation function
   */
  public static startListening(options: VoiceRecognitionOptions): () => void {
    const { language, onResult, onError, onStateChange } = options;

    if (!this.isSpeechRecognitionSupported()) {
      onStateChange?.("not_supported");
      onError?.(
        "not_supported",
        this.getMessage("not_supported", language)
      );
      return () => {};
    }

    // Stop any existing recognition session
    this.stopListening();

    try {
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognitionConstructor();
      this.recognitionInstance = recognition;

      recognition.lang = this.getLocale(language);
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      onStateChange?.("listening");

      recognition.onstart = () => {
        onStateChange?.("listening");
      };

      recognition.onresult = (event: any) => {
        onStateChange?.("processing");
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const transcriptToEmit = finalTranscript || interimTranscript;
        if (transcriptToEmit) {
          onResult(transcriptToEmit.trim(), Boolean(finalTranscript));
          if (finalTranscript) {
            onStateChange?.("success");
          }
        }
      };

      recognition.onerror = (event: any) => {
        const errorType = event.error;
        let state: VoiceInputState = "error";

        if (errorType === "not-allowed" || errorType === "service-not-allowed") {
          state = "permission_denied";
        } else if (errorType === "no-speech") {
          state = "no_speech";
        } else if (errorType === "audio-capture") {
          state = "error";
        }

        onStateChange?.(state);
        onError?.(state, this.getMessage(state, language));
      };

      recognition.onend = () => {
        this.recognitionInstance = null;
      };

      recognition.start();

      return () => {
        this.stopListening();
      };
    } catch (err: any) {
      onStateChange?.("error");
      onError?.("error", this.getMessage("error", language));
      return () => {};
    }
  }

  /**
   * Stop active speech recognition instance
   */
  public static stopListening(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch {
        // Ignore abort exceptions on already closed streams
      }
      this.recognitionInstance = null;
    }
  }

  /**
   * Synthesize text to speech using Web Speech API (with security credential filter)
   * Returns true if playback started successfully, false if blocked or unsupported
   */
  public static speakText(
    text: string,
    language: Language,
    options: SpeakOptions = {}
  ): boolean {
    const { rate = 0.95, pitch = 1.0, volume = 1.0, onStart, onEnd, onError } = options;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return false;
    }

    // SECURITY CHECK (Test P09-SEC-01): Strictly refuse to speak credentials
    if (containsSensitiveCredentials(text)) {
      const securityError = new Error(
        "Voice synthesis blocked: Sensitive credentials (OTP/PIN/password) cannot be spoken aloud."
      );
      if (typeof console !== "undefined") {
        console.warn("[Sahayak Voice Security]", securityError.message);
      }
      onError?.(securityError);
      return false;
    }

    if (!this.isSpeechSynthesisSupported()) {
      onError?.(new Error("Speech synthesis is not supported in this browser"));
      return false;
    }

    try {
      // Cancel previous speech before starting new utterance
      this.stopSpeaking();

      // Chrome speech synthesis freeze fix: resume if stuck in paused state
      if (typeof window !== "undefined" && window.speechSynthesis?.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Select regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const targetLocale = this.getLocale(language);

      // 1. Primary: exact language match or prefix (e.g. "mr-IN", "mr", "hi-IN", "en-IN")
      let matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === targetLocale.toLowerCase() ||
          v.lang.toLowerCase().replace('_', '-').startsWith(language) ||
          v.name.toLowerCase().includes(language === 'mr' ? 'marathi' : language === 'hi' ? 'hindi' : 'english')
      );

      // 2. Devanagari Fallback for Marathi:
      // Most OSes (macOS, Windows, ChromeOS, iOS) lack a native mr-IN voice out-of-the-box.
      // However, Marathi is written in Devanagari script.
      // Hindi TTS voices (hi-IN, e.g. "Google हिन्दी", Apple "Lekha", Microsoft "Swara")
      // synthesize Devanagari Marathi phonetics accurately and fluently.
      // When falling back to a Hindi voice, utterance.lang MUST match the voice language (e.g. "hi-IN"),
      // otherwise Chrome blocks speech with a "language-unavailable" error.
      if (!matchedVoice && language === "mr") {
        matchedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.name.toLowerCase().includes("hindi") ||
            v.name.toLowerCase().includes("lekha")
        );
      }

      // 3. Indian English fallback if neither Marathi nor Hindi voice found
      if (!matchedVoice && (language === "mr" || language === "hi")) {
        matchedVoice = voices.find((v) => v.lang.toLowerCase().includes("-in"));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = targetLocale;
      }

      // Retain active utterance reference to prevent Chrome garbage-collection mid-speech
      this.activeUtterance = utterance;

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        this.activeUtterance = null;
        onEnd?.();
      };

      utterance.onerror = (event: any) => {
        this.activeUtterance = null;
        if (event.error !== "canceled" && event.error !== "interrupted") {
          onError?.(new Error(`Speech synthesis error: ${event.error}`));
        }
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: any) {
      this.activeUtterance = null;
      onError?.(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }

  /**
   * Stop active speech synthesis immediately
   */
  public static stopSpeaking(): void {
    this.activeUtterance = null;
    if (this.isSpeechSynthesisSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel errors
      }
    }
  }

  /**
   * Check if speech synthesis is currently active
   */
  public static isSpeaking(): boolean {
    if (!this.isSpeechSynthesisSupported()) return false;
    return Boolean(window.speechSynthesis.speaking || this.activeUtterance);
  }

  /**
   * Get active utterance reference if any is currently speaking
   */
  public static getActiveUtterance(): SpeechSynthesisUtterance | null {
    return this.activeUtterance;
  }

  /**
   * Get available browser voices for language
   */
  public static getAvailableVoices(language?: Language): SpeechSynthesisVoice[] {
    if (!this.isSpeechSynthesisSupported()) return [];
    const voices = window.speechSynthesis.getVoices();
    if (!language) return voices;
    const targetLocale = this.getLocale(language).toLowerCase();
    return voices.filter(
      (v) =>
        v.lang.toLowerCase() === targetLocale ||
        v.lang.toLowerCase().startsWith(language)
    );
  }
}
