/**
 * Sahayak AI — Accessible Microphone Button (Web Speech Integration)
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 35 & P09 Specification
 * Phase: P09 — Accessibility & Voice
 * 
 * States:
 * 1. idle: Standard mic icon ready to capture audio.
 * 2. listening: Pulsing red/amber status with "Listening..." live region.
 * 3. processing: Spinner/loading status while transcribing.
 * 4. unavailable: Disabled state when browser lacks Web Speech API.
 * 
 * Invariants:
 * - Emits transcribed text for user review and editing; NEVER auto-submits.
 * - Screen-reader accessible with aria-live="polite" announcements.
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
}

export const MicButton: React.FC<MicButtonProps> = ({
  language = "en",
  onTranscript,
  onError,
  size = "md",
  showStatusText = false,
  className = "",
  disabled = false,
}) => {
  const [state, setState] = useState<VoiceInputState>("idle");
  const [announcement, setAnnouncement] = useState<string>("");
  const stopListeningRef = useRef<(() => void) | null>(null);

  const isSupported = VoiceService.isSpeechRecognitionSupported();

  useEffect(() => {
    if (!isSupported) {
      setState("not_supported");
      setAnnouncement(VoiceService.getMessage("not_supported", language));
    }
  }, [isSupported, language]);

  // Clean up listening on unmount
  useEffect(() => {
    return () => {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
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

    stopListeningRef.current = VoiceService.startListening({
      language,
      onResult: (text, isFinal) => {
        onTranscript(text, isFinal);
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

        // Reset to idle after timeout for transient errors
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
    let border = "1px solid var(--border)";
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

  const currentLabel = VoiceService.getMessage(state, language);

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
