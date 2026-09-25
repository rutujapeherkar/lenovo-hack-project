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

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    setValidationError(null);
    setExplanation(null);
    setGlossaryTerms([]);
    setAnalysisError(null);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setValidationError(null);
    setExplanation(null);
    setGlossaryTerms([]);
    setAnalysisError(null);
  };

  const handleExplainScreen = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result: ExplainScreenResult = await ScreenService.explainScreen(
        selectedFile,
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
