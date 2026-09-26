/**
 * Sahayak AI — Accessible Microphone Button (Web Speech & Hands-Free Integration)
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 35 & P09 Specification
 * Phase: P09 — Accessibility & Voice
 * 
 * Features:
 * 1. Immediate microphone permission request on mount for hands-free readiness.
 * 2. Background wake keyword detection ('ok sahayak', 'okay sahayak', 'साहायक', 'ओके साहायक').
 * 3. Triggers red pulsing active voice state and activates read-aloud when wake word is detected.
 * 4. Listens for completion keyword ('done', 'झाले', 'हो गया', 'पूर्ण') to stop voice mode and search immediately.
 * 5. Manual click toggle fallback with full screen-reader accessibility (aria-live="polite", role="status").
 */

import React, { useState, useEffect, useRef } from "react";
import {
  VoiceService,
  VoiceInputState,
} from "../../core/accessibility/voice-service";
import type { Language } from "../../core/shared/types";

export interface MicButtonProps {
  language: Language;
  onTranscript: (text: string, isFinal: boolean) => void;
  onError?: (state: VoiceInputState, message: string) => void;
  size?: "sm" | "md" | "lg";
  showStatusText?: boolean;
  className?: string;
  disabled?: boolean;
  enableHandsFree?: boolean;
  onWakeWord?: () => void;
  onDone?: (query: string, shouldRead: boolean) => void;
}

export const MicButton: React.FC<MicButtonProps> = ({
  language = "en",
  onTranscript,
  onError,
  size = "md",
  showStatusText = false,
  className = "",
  disabled = false,
  enableHandsFree = true,
  onWakeWord,
  onDone,
}) => {
  const [state, setState] = useState<VoiceInputState>("idle");
  const [announcement, setAnnouncement] = useState<string>("");
  const stopListeningRef = useRef<(() => void) | null>(null);
  const stopHandsFreeRef = useRef<(() => void) | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const onDoneRef = useRef(onDone);
  const onWakeWordRef = useRef(onWakeWord);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    onWakeWordRef.current = onWakeWord;
  }, [onWakeWord]);

  const isSupported = VoiceService.isSpeechRecognitionSupported();

  useEffect(() => {
    if (!isSupported) {
      setState("not_supported");
      setAnnouncement(VoiceService.getMessage("not_supported", language));
    }
  }, [isSupported, language]);

  // Request microphone permission immediately on mount for seamless accessibility
  useEffect(() => {
    if (typeof window !== "undefined" && isSupported) {
      VoiceService.requestMicrophonePermission();
    }
  }, [isSupported]);

  // Set up continuous Hands-Free background wake-word listening
  useEffect(() => {
    if (!isSupported || !enableHandsFree || disabled) {
      if (stopHandsFreeRef.current) {
        stopHandsFreeRef.current();
        stopHandsFreeRef.current = null;
      }
      return;
    }

    if (stopHandsFreeRef.current) {
      stopHandsFreeRef.current();
      stopHandsFreeRef.current = null;
    }

    const stop = VoiceService.startHandsFreeListening({
      language,
      onWakeWordDetected: () => {
        // Red voice icon triggers!
        setState("listening");
        const listenMsg = VoiceService.getMessage("listening", language);
        setAnnouncement(listenMsg);
        onWakeWordRef.current?.();

        // Spoken confirmation cue
        const promptText =
          language === "mr"
            ? "साहायक ऐकत आहे, सांगा..."
            : language === "hi"
            ? "साहायक सुन रहा है, बताइए..."
            : "Sahayak is listening, tell me...";
        VoiceService.speakText(promptText, language);
      },
      onTranscriptUpdate: (cleanedTranscript) => {
        if (cleanedTranscript) {
          onTranscriptRef.current(cleanedTranscript, false);
        }
      },
      onDoneDetected: (finalQuery, shouldRead) => {
        // Stop red voice mode immediately!
        setState("idle");
        setAnnouncement(VoiceService.getMessage("success", language));
        const queryToSearch = finalQuery.trim();
        if (queryToSearch && onDoneRef.current) {
          onDoneRef.current(queryToSearch, shouldRead);
        }
      },
      onError: (errState, errMsg) => {
        if (errState === "permission_denied") {
          setState("permission_denied");
        }
        onError?.(errState, errMsg);
      },
      onStatusChange: (status) => {
        if (status === "recording_query") {
          setState("listening");
        } else if (status === "idle" || status === "listening_wake") {
          setState((prev) => (prev === "listening" ? "idle" : prev));
        }
      },
    });

    stopHandsFreeRef.current = stop;

    return () => {
      if (stopHandsFreeRef.current) {
        stopHandsFreeRef.current();
        stopHandsFreeRef.current = null;
      }
    };
  }, [isSupported, enableHandsFree, disabled, language, onError]);

  // Clean up listening on unmount
  useEffect(() => {
    return () => {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      if (stopHandsFreeRef.current) {
        stopHandsFreeRef.current();
        stopHandsFreeRef.current = null;
      }
    };
  }, []);

  const handleToggle = () => {
    if (disabled || !isSupported) return;

    if (state === "listening" || state === "processing") {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setState("idle");
      setAnnouncement(VoiceService.getMessage("idle", language));
      return;
    }

    setState("listening");
    const listenMsg = VoiceService.getMessage("listening", language);
    setAnnouncement(listenMsg);
    onWakeWordRef.current?.();

    stopListeningRef.current = VoiceService.startListening({
      language,
      onResult: (text, isFinal) => {
        onTranscript(text, isFinal);

        // Check if citizen said "stop" while assistant is speaking
        if (VoiceService.isSpeaking() && VoiceService.containsStopWord(text)) {
          VoiceService.stopSpeaking();
          return;
        }

        // Check if citizen said "done" or "read" during manual session
        const isDone = VoiceService.containsDoneWord(text);
        const isRead = VoiceService.containsReadWord(text);

        if (isDone || isRead) {
          if (stopListeningRef.current) {
            stopListeningRef.current();
            stopListeningRef.current = null;
          }
          setState("idle");
          setAnnouncement(VoiceService.getMessage("success", language));
          const shouldRead = isRead;
          const cleanQuery = VoiceService.cleanVoiceQuery(text);
          if (cleanQuery && onDoneRef.current) {
            onDoneRef.current(cleanQuery, shouldRead);
          }
          return;
        }

        if (isFinal) {
          setState("idle");
          setAnnouncement(VoiceService.getMessage("success", language));
        }
      },
      onStateChange: (newState) => {
        setState(newState);
        setAnnouncement(VoiceService.getMessage(newState, language));
      },
      onError: (errState, errMsg) => {
        setState(errState);
        setAnnouncement(errMsg);
        onError?.(errState, errMsg);

        if (errState === "no_speech") {
          setTimeout(() => {
            setState((prev) => (prev === "no_speech" ? "idle" : prev));
          }, 4000);
        }
      },
    });
  };

  const getButtonStyles = () => {
    const isListening = state === "listening";
    const isUnavailable = !isSupported || state === "not_supported" || state === "permission_denied";

    let bg = "var(--surface)";
    let border = "1.5px solid var(--border)";
    let color = "var(--sahayak-blue)";

    if (isListening) {
      bg = "var(--error-bg, #F8D7DA)";
      border = "2px solid var(--error, #DC2626)";
      color = "var(--error, #DC2626)";
    } else if (isUnavailable) {
      bg = "var(--surface-muted, #E2E8F0)";
      border = "1px solid var(--border)";
      color = "var(--text-muted, #718096)";
    }

    const sizeDim = size === "sm" ? "36px" : size === "lg" ? "52px" : "44px";

    return {
      minWidth: sizeDim,
      minHeight: sizeDim,
      width: sizeDim,
      height: sizeDim,
      borderRadius: "50%",
      backgroundColor: bg,
      border,
      color,
      cursor: isUnavailable || disabled ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size === "sm" ? "1rem" : size === "lg" ? "1.5rem" : "1.25rem",
      transition: "all 0.2s ease",
      position: "relative" as const,
      flexShrink: 0,
    };
  };

  const currentLabel =
    state === "listening"
      ? language === "mr"
        ? "साहायक ऐकत आहे... संपल्यावर 'झाले' (Done) म्हणा"
        : language === "hi"
        ? "साहायक सुन रहा है... समाप्त होने पर 'Done' कहें"
        : "Sahayak is listening... Say 'Done' when finished"
      : language === "mr"
      ? "व्हॉइस इनपुट ('ओके साहायक' म्हणा किंवा क्लिक करा)"
      : language === "hi"
      ? "वॉइस इनपुट ('ओके साहायक' बोलें या क्लिक करें)"
      : "Voice input (Say 'Ok Sahayak' or click)";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
      }}
      className={`mic-button-container ${className}`.trim()}
    >
      <button
        type="button"
        style={getButtonStyles()}
        onClick={handleToggle}
        disabled={disabled || !isSupported || state === "not_supported"}
        aria-label={currentLabel}
        aria-pressed={state === "listening"}
        title={currentLabel}
        className={`btn-mic-accessible ${state === "listening" ? "listening-pulse" : ""}`}
      >
        {state === "listening" ? (
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "var(--error, #DC2626)",
              boxShadow: "0 0 0 4px rgba(220, 38, 38, 0.25)",
            }}
            aria-hidden="true"
          />
        ) : state === "processing" ? (
          <span aria-hidden="true">⏳</span>
        ) : !isSupported || state === "not_supported" ? (
          <span aria-hidden="true" style={{ textDecoration: "line-through", opacity: 0.7 }}>
            🎙
          </span>
        ) : (
          <span aria-hidden="true">🎙</span>
        )}
      </button>

      {/* Screen reader live region for accessibility announcements (Test P09-A11Y-02) */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
        id="voice-status-announcement"
      >
        {announcement}
      </div>

      {/* Optional visible status text */}
      {showStatusText && (
        <span
          style={{
            fontSize: "0.875rem",
            color: state === "listening" ? "var(--error, #DC2626)" : "var(--text-secondary)",
            fontWeight: state === "listening" ? 600 : 400,
          }}
        >
          {currentLabel}
        </span>
      )}
    </div>
  );
};
