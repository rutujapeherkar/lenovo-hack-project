/**
 * Sahayak AI — Explain Screen Page
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 24-26 & ARCHITECTURE.md Section 21
 * Phase: P07 — Explain Screen
 * 
 * Citizen page allowing users to upload or paste a screenshot of a government portal,
 * validate client-side, analyze via vision pipeline, and view structured explanations.
 */

import React, { useState } from "react";
import { Badge, Button } from "../components/ui";
import { useLanguage } from "../core/language";
import { ScreenService, type ExplainScreenResult } from "../core/explain-screen";
import type { ScreenExplanation } from "../core/shared/types";
import type { GlossaryEntry } from "../core/explain-screen/glossary";
import { UploadArea, ImagePreview, ExplanationPanel, Glossary } from "../components/explain-screen";

export const ExplainScreenPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<ScreenExplanation | null>(null);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryEntry[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleExplainScreen = async (fileOverride?: unknown) => {
    const fileToAnalyze = (fileOverride instanceof File) ? fileOverride : selectedFile;
    if (!fileToAnalyze) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result: ExplainScreenResult = await ScreenService.explainScreen(
        fileToAnalyze,
        language
      );

      if (result.success && result.explanation) {
        setExplanation(result.explanation);
        setGlossaryTerms(result.glossary || []);
      } else {
        setAnalysisError(
          result.error || "Unable to explain this screen. Please try again with a clearer image."
        );
      }
    } catch (err: any) {
      setAnalysisError(
        err?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageSelected = (file: File, autoExplain = false) => {
    setSelectedFile(file);
    setValidationError(null);
    setExplanation(null);
    setGlossaryTerms([]);
    setAnalysisError(null);
    if (autoExplain) {
      handleExplainScreen(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setValidationError(null);
    setExplanation(null);
    setGlossaryTerms([]);
    setAnalysisError(null);
  };

  return (
    <div className="explain-screen-page" style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "var(--space-12)" }}>
      {/* 1. Page Header */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Badge variant="warning" style={{ marginBottom: "var(--space-2)" }}>
          दृष्टी सहाय्य • Visual Assist
        </Badge>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--sahayak-blue-dark)",
            marginBottom: "var(--space-2)",
            letterSpacing: "-0.02em",
          }}
        >
          {t("explainScreenTitle")}
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.0625rem",
            maxWidth: "760px",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {t("explainScreenSubtitle")}
        </p>
      </div>

      {/* 2. Upload / Input View (When no file is selected) */}
      {!selectedFile && (
        <>
          {/* ── Demo Sample Screenshots (FR-P12-02) ─────────────────────── */}
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto var(--space-6) auto',
              padding: 'var(--space-5)',
              background: 'var(--sahayak-blue-pale)',
              borderRadius: 'var(--radius-card)',
              border: '1.5px solid var(--sahayak-blue)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: '1.1rem' }} aria-hidden="true">⚡</span>
              <strong style={{ color: 'var(--sahayak-blue-dark)', fontSize: '0.9375rem' }}>
                {language === 'mr'
                  ? 'त्वरित प्रात्यक्षिक — नमुना स्क्रीनशॉट वापरा'
                  : language === 'hi'
                  ? 'त्वरित प्रदर्शन — नमूना स्क्रीनशॉट उपयोग करें'
                  : 'Quick Demo — Try a sample screenshot instantly'}
              </strong>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 var(--space-4) 0' }}>
              {language === 'mr'
                ? 'फाइल अपलोड न करता नमुना सरकारी स्क्रीनशॉट वापरून साहायकची क्षमता पाहा.'
                : language === 'hi'
                ? 'फ़ाइल अपलोड किए बिना नमूना सरकारी स्क्रीनशॉट से साहायक की क्षमता देखें.'
                : 'See Sahayak explain a government portal screenshot — no file upload required.'}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {([
                { icon: '🏛️', labelEn: 'Aaple Sarkar Login Form', labelMr: 'आपले सरकार लॉगिन फॉर्म', labelHi: 'आपले सरकार लॉगिन फॉर्म', name: 'aaple-sarkar-login.png' },
                { icon: '💸', labelEn: 'MahaDBT Scholarship Form', labelMr: 'MahaDBT शिष्यवृत्ती फॉर्म', labelHi: 'MahaDBT छात्रवृत्ति फॉर्म', name: 'mahadbt-scholarship.png' },
                { icon: '🍚', labelEn: 'RCMS Ration Card Page', labelMr: 'RCMS रेशन कार्ड पृष्ठ', labelHi: 'RCMS राशन कार्ड पृष्ठ', name: 'rcms-ration-card.png' },
              ] as const).map((sample) => {
                const label = language === 'mr' ? sample.labelMr : language === 'hi' ? sample.labelHi : sample.labelEn;
                return (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      // Minimal valid 1×1 white PNG for demo — passes image validation
                      const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';
                      const byteChars = atob(base64);
                      const byteArr = new Uint8Array(byteChars.length);
                      for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
                      handleImageSelected(new File([byteArr], sample.name, { type: 'image/png' }), true);
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem', borderRadius: 'var(--radius-button)',
                      border: '1.5px solid var(--sahayak-blue)', background: 'var(--surface)',
                      color: 'var(--sahayak-blue-dark)', fontSize: '0.8125rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all var(--transition-fast)', fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sahayak-blue)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--sahayak-blue-dark)'; }}
                    aria-label={`Load sample: ${label}`}
                  >
                    <span aria-hidden="true">{sample.icon}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ maxWidth: "680px", margin: "0 auto var(--space-8) auto" }}>
            <UploadArea
              onImageSelected={handleImageSelected}
              error={validationError}
              onErrorChange={setValidationError}
            />
          </div>

          {/* Full Civic Glossary for quick citizen reference */}
          <Glossary showAllFallback={true} />
        </>
      )}


      {/* 3. Image Selected View */}
      {selectedFile && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <ImagePreview
            file={selectedFile}
            onExplain={handleExplainScreen}
            onChangeImage={() => {
              // Trigger change by clearing or re-uploading
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/png,image/jpeg,image/jpg,image/webp";
              input.onchange = (e: any) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageSelected(e.target.files[0]);
                }
              };
              input.click();
            }}
            onRemove={handleRemoveImage}
            isAnalyzing={isAnalyzing}
          />

          {/* Analysis Error Alert with Try Again & Upload Another Image (Section 11) */}
          {analysisError && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #F87171",
                borderRadius: "var(--radius-card)",
                padding: "var(--space-5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <span style={{ fontSize: "1.25rem" }} aria-hidden="true">⚠️</span>
                <strong style={{ color: "#991B1B", fontSize: "1rem" }}>
                  {language === "mr"
                    ? "आम्ही या वेळी या स्क्रीनशॉटचे विश्लेषण करू शकलो नाही."
                    : language === "hi"
                    ? "हम इस समय इस छवि का विश्लेषण नहीं कर सके।"
                    : "We couldn't explain this image right now."}
                </strong>
              </div>
              <p style={{ color: "#7F1D1D", fontSize: "0.875rem", margin: "0 0 var(--space-4) 0" }}>
                {analysisError}
              </p>
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleExplainScreen}
                  disabled={isAnalyzing}
                >
                  ↻ {language === "mr" ? "पुन्हा प्रयत्न करा" : language === "hi" ? "पुनः प्रयास करें" : "Try Again"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  📷 {language === "mr" ? "दुसरा स्क्रीनशॉट निवडा" : language === "hi" ? "दूसरी छवि चुनें" : "Upload Another Image"}
                </Button>
              </div>
            </div>
          )}

          {/* 4. Structured Explanation Panel (When analysis is complete) */}
          {explanation && (
            <>
              <ExplanationPanel explanation={explanation} />

              {/* Contextual Glossary */}
              <Glossary terms={glossaryTerms} showAllFallback={true} />

              {/* Action to reset / explain another image */}
              <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleRemoveImage}
                >
                  📷 Explain Another Screenshot / दुसरा स्क्रीनशॉट तपासा
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
