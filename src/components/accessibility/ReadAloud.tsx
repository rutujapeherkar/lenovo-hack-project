/**
 * Sahayak AI — Read Aloud (Text-to-Speech) Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 35 & P09 Specification
 * Phase: P09 — Accessibility & Voice
 * 
 * Responsibilities:
 * 1. Enables citizens to listen to guidance summaries, steps, and explanations.
 * 2. Matches regional pronunciation across English (en-IN), Marathi (mr-IN), and Hindi (hi-IN).
 * 3. Immediate stop on clicking "Stop" or navigating away.
 * 4. Strictly suppresses sensitive credentials.
 */

import React, { useState, useEffect } from "react";
import { VoiceService } from "../../core/accessibility/voice-service";
import type { Language } from "../../core/shared/types";

export interface ReadAloudProps {
  text: string;
  language: Language;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const READ_ALOUD_LABELS = {
  listen: {
    en: "Read aloud",
    mr: "ऐका (वाचा)",
    hi: "सुनें (पढ़ें)",
  },
  stop: {
    en: "Stop speaking",
    mr: "थांबवा",
    hi: "रोकें",
  },
  unsupported: {
    en: "Audio unavailable",
    mr: "आवाज अनुपलब्ध",
    hi: "आवाज़ अनुपलब्ध",
  },
};

export const ReadAloud: React.FC<ReadAloudProps> = ({
  text,
  language = "mr",
  label,
  size = "sm",
  className = "",
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = VoiceService.isSpeechSynthesisSupported();

  // Stop speech on unmount (navigation away)
  useEffect(() => {
    return () => {
      VoiceService.stopSpeaking();
    };
  }, []);

  const handleToggle = () => {
    if (!isSupported) return;

    if (isSpeaking) {
      VoiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const success = VoiceService.speakText(text, language, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    if (success) {
      setIsSpeaking(true);
    }
  };

  if (!isSupported) {
    return null;
  }

  const defaultLabel = isSpeaking
    ? READ_ALOUD_LABELS.stop[language] || READ_ALOUD_LABELS.stop.en
    : READ_ALOUD_LABELS.listen[language] || READ_ALOUD_LABELS.listen.en;

  const displayLabel = label || defaultLabel;

  return (
    <button
      type="button"
      className={`btn ${isSpeaking ? "btn-outline" : "btn-outline"} btn-${size} ${className}`.trim()}
      onClick={handleToggle}
      aria-label={isSpeaking ? "Stop read aloud" : "Read text aloud"}
      aria-pressed={isSpeaking}
      title={displayLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        minHeight: size === "sm" ? "36px" : "44px",
        padding: size === "sm" ? "4px 10px" : "6px 14px",
        borderColor: isSpeaking ? "var(--sahayak-blue)" : undefined,
        backgroundColor: isSpeaking ? "var(--sahayak-blue-pale)" : undefined,
        fontWeight: isSpeaking ? 600 : 500,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: size === "sm" ? "1rem" : "1.125rem" }}>
        {isSpeaking ? "⏹" : "🔊"}
      </span>
      <span>{displayLabel}</span>
    </button>
  );
};
