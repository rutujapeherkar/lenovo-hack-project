/**
 * Sahayak AI — Hands-Free Voice Assistant Component
 * 
 * Accessible hands-free mode for Divyang and motor-impaired citizens:
 * 1. Asks for microphone permission immediately on load.
 * 2. Continuously listens for wake keyword: 'Ok Sahayak' (or 'ओके साहायक' / 'साहायक').
 * 3. On wake word detection:
 *    - Automatically turns on the Read Aloud feature.
 *    - Provides instant audible & visual confirmation.
 *    - Begins recording citizen query.
 * 4. Continuously captures query until citizen says 'Done' (or 'झाले' / 'हो गया').
 * 5. On 'Done' keyword detection:
 *    - Cleans transcribed query.
 *    - Immediately triggers assistant search and reads out results.
 */

import React, { useState, useEffect, useRef } from "react";
import { VoiceService } from "../../core/accessibility";
import type { Language } from "../../core/shared/types";
import { Badge, Button } from "../ui";

export interface HandsFreeVoiceAssistantProps {
  language: Language;
  onQuerySubmit: (query: string) => void;
  onWakeWord?: () => void;
  isSearching?: boolean;
}

export const HandsFreeVoiceAssistant: React.FC<HandsFreeVoiceAssistantProps> = ({
  language,
  onQuerySubmit,
  onWakeWord,
  isSearching = false,
}) => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [status, setStatus] = useState<"idle" | "listening_wake" | "recording_query" | "processing">("listening_wake");
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // 1. Ask for microphone permission immediately on mount
  useEffect(() => {
    let isMounted = true;

    const initMic = async () => {
      if (typeof window === "undefined") return;
      const granted = await VoiceService.requestMicrophonePermission();
      if (isMounted) {
        setMicPermissionGranted(granted);
      }
    };

    initMic();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Start Hands-Free continuous recognition
  useEffect(() => {
    if (!isActive || !VoiceService.isSpeechRecognitionSupported()) {
      setStatus("idle");
      return;
    }

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    const cancel = VoiceService.startHandsFreeListening({
      language,
      onWakeWordDetected: () => {
        setStatus("recording_query");
        setLiveTranscript("");
        onWakeWord?.();

        // Voice prompt feedback: "Sahayak is listening, tell me..."
        const promptText =
          language === "mr"
            ? "साहायक ऐकत आहे, सांगा..."
            : language === "hi"
            ? "साहायक सुन रहा है, बताइए..."
            : "Sahayak is listening, tell me...";

        VoiceService.speakText(promptText, language);
      },
      onTranscriptUpdate: (transcript) => {
        setLiveTranscript(transcript);
      },
      onDoneDetected: (finalQuery) => {
        setStatus("processing");
        const queryToSearch = finalQuery.trim();
        if (queryToSearch) {
          onQuerySubmit(queryToSearch);
        }
        setTimeout(() => {
          setStatus("listening_wake");
          setLiveTranscript("");
        }, 1500);
      },
      onError: (_errState) => {
        // If not allowed, keep in idle/prompt state
      },
      onStatusChange: (newStatus) => {
        if (!isSearching) {
          setStatus(newStatus);
        }
      },
    });

    cleanupRef.current = cancel;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isActive, language, isSearching, onQuerySubmit, onWakeWord]);

  if (!VoiceService.isSpeechRecognitionSupported()) {
    return null;
  }

  // Quick manual triggers for testing or when mic is muted
  const handleSimulateWake = () => {
    setStatus("recording_query");
    setLiveTranscript("");
    onWakeWord?.();
    const promptText =
      language === "mr"
        ? "साहायक ऐकत आहे, सांगा..."
        : language === "hi"
        ? "साहायक सुन रहा है, बताइए..."
        : "Sahayak is listening, tell me...";
    VoiceService.speakText(promptText, language);
  };

  const handleSimulateDone = () => {
    const query = liveTranscript.trim() || (language === "mr" ? "मला उत्पन्न प्रमाणपत्र काढायचे आहे" : "I need an income certificate");
    setStatus("processing");
    onQuerySubmit(query);
    setTimeout(() => {
      setStatus("listening_wake");
      setLiveTranscript("");
    }, 1500);
  };

  return (
    <div
      className="hands-free-voice-hud"
      role="region"
      aria-label="Hands-Free Voice Assistant"
      style={{
        margin: "0 auto var(--space-4) auto",
        maxWidth: "680px",
        background: status === "recording_query" ? "var(--sahayak-orange-pale, #fff7ed)" : "var(--surface)",
        border: `1.5px solid ${status === "recording_query" ? "var(--sahayak-orange, #ea580c)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg, 14px)",
        padding: "var(--space-3) var(--space-4)",
        boxShadow: "0 4px 16px -2px rgba(0, 45, 82, 0.08)",
        transition: "all var(--transition-fast)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span
            style={{
              fontSize: "1.25rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              animation: status === "recording_query" ? "pulse 1.2s infinite" : "none",
            }}
            aria-hidden="true"
          >
            {status === "recording_query" ? "🔴" : "🎙️"}
          </span>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
              <strong style={{ fontSize: "0.875rem", color: "var(--sahayak-blue-dark)" }}>
                {language === "mr"
                  ? "हात-मुक्त व्हॉइस मोड (Hands-Free)"
                  : language === "hi"
                  ? "हैंड्स-फ्री वॉइस मोड"
                  : "Hands-Free Voice Mode"}
              </strong>
              <Badge variant={status === "recording_query" ? "warning" : "info"} size="sm">
                {status === "recording_query"
                  ? language === "mr" ? "ऐकत आहे..." : language === "hi" ? "सुन रहे हैं..." : "Listening..."
                  : language === "mr" ? "सक्रिय" : language === "hi" ? "सक्रिय" : "Active"}
              </Badge>
            </div>

            <p style={{ margin: "2px 0 0 0", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              {status === "recording_query" ? (
                <span>
                  {liveTranscript ? (
                    <strong style={{ color: "var(--text-primary)" }}>"{liveTranscript}"</strong>
                  ) : (
                    <span>
                      {language === "mr"
                        ? "तुमचा प्रश्न बोला... पूर्ण झाल्यावर 'झाले' (Done) म्हणा."
                        : language === "hi"
                        ? "अपना प्रश्न बोलें... समाप्त होने पर 'Done' (हो गया) कहें।"
                        : 'Speak your question... Say "Done" when finished.'}
                    </span>
                  )}
                </span>
              ) : (
                <span>
                  {language === "mr"
                    ? 'सुरू करण्यासाठी "ओके साहायक" म्हणा, नंतर प्रश्न संपल्यावर "झाले" (Done) म्हणा.'
                    : language === "hi"
                    ? 'शुरू करने के लिए "ओके साहायक" बोलें, फिर प्रश्न पूरा होने पर "Done" कहें।'
                    : 'Say "Ok Sahayak" to ask anything, then say "Done" to search.'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls & Simulation for Divyang/Testing */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {status === "recording_query" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateDone}
              aria-label="Finish speaking and search"
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
            >
              ✓ {language === "mr" ? "झाले (Done)" : language === "hi" ? "Done (सर्च करा)" : 'Done (Search)'}
            </Button>
          ) : (
            <Button
              variant="text"
              size="sm"
              onClick={handleSimulateWake}
              aria-label="Activate voice assistant"
              style={{ fontSize: "0.75rem", padding: "4px 8px", color: "var(--sahayak-blue)" }}
            >
              🎤 {language === "mr" ? '"ओके साहायक"' : '"Ok Sahayak"'}
            </Button>
          )}

          <Button
            variant="text"
            size="sm"
            onClick={() => setIsActive(!isActive)}
            aria-label={isActive ? "Disable hands-free voice" : "Enable hands-free voice"}
            style={{ fontSize: "0.75rem", padding: "4px 6px", color: "var(--text-muted)" }}
            title={isActive ? "Pause hands-free listening" : "Resume hands-free listening"}
          >
            {isActive ? "⏸️" : "▶️"}
          </Button>
        </div>
      </div>

      {micPermissionGranted === false && (
        <div style={{ marginTop: "var(--space-2)", fontSize: "0.75rem", color: "var(--error)" }}>
          ⚠️{" "}
          {language === "mr"
            ? "मायक्रोफोन परवानगी नाकारली आहे. ब्राउझर सेटिंग्जमधून मायक्रोफोन चालू करा."
            : language === "hi"
            ? "माइक्रोफ़ोन अनुमति अवरुद्ध है। ब्राउज़र सेटिंग्स से माइक्रोफ़ोन चालू करें।"
            : "Microphone permission is blocked. Please allow mic access in your browser."}
        </div>
      )}
    </div>
  );
};
