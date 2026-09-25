/**
 * Sahayak AI — Explain Screen Image Preview Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 24
 * Phase: P07 — Explain Screen
 * 
 * Renders selected image thumbnail, file metadata, and trigger actions.
 */

import React, { useState, useEffect } from "react";
import { Button, Card, Badge } from "../ui";
import { useLanguage } from "../../core/language";
import { formatFileSize } from "../../core/explain-screen/image-validator";

export interface ImagePreviewProps {
  file: File;
  onExplain: () => void;
  onChangeImage: () => void;
  onRemove: () => void;
  isAnalyzing: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  onExplain,
  onChangeImage,
  onRemove,
  isAnalyzing,
}) => {
  const { t } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <Card
      variant="default"
      style={{
        padding: "var(--space-6)",
        marginBottom: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-4)",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {file.name}
          </span>
          <Badge variant="neutral">
            {formatFileSize(file.size)}
          </Badge>
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onChangeImage}
            disabled={isAnalyzing}
          >
            {t("changeImage")}
          </Button>
          <Button
            type="button"
            variant="text"
            size="sm"
            onClick={onRemove}
            disabled={isAnalyzing}
            style={{ color: "var(--error, #dc2626)" }}
          >
            {t("removeImage")}
          </Button>
        </div>
      </div>

      {/* Image Preview Box */}
      <div
        style={{
          backgroundColor: "var(--surface-sunken, #0f172a)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "240px",
          maxHeight: "420px",
          border: "1px solid var(--border)",
          marginBottom: "var(--space-6)",
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Uploaded screenshot preview"
            style={{
              maxWidth: "100%",
              maxHeight: "420px",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Loading preview...</div>
        )}
      </div>

      {/* Primary Action Button */}
      <div style={{ textAlign: "center" }}>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onExplain}
          disabled={isAnalyzing}
          style={{
            minWidth: "240px",
            padding: "var(--space-3) var(--space-6)",
            fontSize: "1.0625rem",
          }}
        >
          {isAnalyzing ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              {t("explainingScreen")}
            </span>
          ) : (
            `🔍 ${t("explainScreenButton")}`
          )}
        </Button>
      </div>
    </Card>
  );
};
