/**
 * Sahayak AI — Explain Screen Upload Area Component
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 24 & SECURITY.md Section 16
 * Phase: P07 — Explain Screen
 * 
 * Accessible drag-and-drop & file selector with:
 * - Immediate client-side validation (MIME, 5 MB limit)
 * - Clipboard paste support
 * - Prominent sensitive credentials privacy warning
 * - Keyboard navigation (Tab, Enter, Space)
 */

import React, { useState, useRef, useCallback } from "react";
import { Button, Alert } from "../ui";
import { useLanguage } from "../../core/language";
import { validateImageFile } from "../../core/explain-screen/image-validator";

export interface UploadAreaProps {
  onImageSelected: (file: File) => void;
  error?: string | null;
  onErrorChange?: (error: string | null) => void;
  disabled?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onImageSelected,
  error,
  onErrorChange,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        if (onErrorChange) {
          onErrorChange(validation.error || "Invalid file");
        }
        return;
      }
      if (onErrorChange) {
        onErrorChange(null);
      }
      onImageSelected(file);
    },
    [onImageSelected, onErrorChange]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      // Reset input value so same file can be re-selected if removed
      e.target.value = "";
    }
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const item = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
        if (item) {
          e.preventDefault();
          processFile(item);
        }
      }
    },
    [disabled, processFile]
  );

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerFileInput();
    }
  };

  return (
    <div
      className="upload-area-container"
      onPaste={handlePaste}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {/* 1. Sensitive Data Privacy Warning — Always visible above dropzone */}
      <Alert
        variant="warning"
        style={{
          marginBottom: "var(--space-4)",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <span aria-hidden="true" style={{ fontSize: "1.125rem" }}>🔒</span>
        <span>
          <strong>{t("privacyNotice")}</strong>
        </span>
      </Alert>

      {/* Validation Error Display */}
      {error && (
        <Alert
          variant="error"
          style={{
            marginBottom: "var(--space-4)",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </Alert>
      )}

      {/* 2. Drag-and-drop dropzone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`${t("uploadScreenshot")} - ${t("dragDropOrChoose")}`}
        aria-disabled={disabled}
        onClick={triggerFileInput}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging
            ? "2.5px dashed var(--sahayak-orange)"
            : "2px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
          backgroundColor: isDragging
            ? "rgba(235, 110, 39, 0.05)"
            : "var(--surface-sunken, #f8fafc)",
          padding: "var(--space-8) var(--space-4)",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "220px",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
        />

        <div
          aria-hidden="true"
          style={{
            fontSize: "3rem",
            lineHeight: 1,
            marginBottom: "var(--space-3)",
            transform: isDragging ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s ease",
          }}
        >
          📷
        </div>

        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: "0 0 var(--space-2) 0",
          }}
        >
          {t("uploadScreenshot")}
        </h3>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9375rem",
            margin: "0 0 var(--space-4) 0",
            maxWidth: "420px",
          }}
        >
          {t("dragDropOrChoose")}
        </p>

        <Button
          type="button"
          variant="secondary"
          size="md"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            triggerFileInput();
          }}
          style={{ pointerEvents: "auto" }}
        >
          {t("chooseScreenshot")}
        </Button>

        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginTop: "var(--space-4)",
            marginBottom: 0,
          }}
        >
          {t("supportedFormats")}
        </p>
      </div>
    </div>
  );
};
