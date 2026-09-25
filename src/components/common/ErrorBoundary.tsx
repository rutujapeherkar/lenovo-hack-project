/**
 * Sahayak AI — Accessible React Error Boundary Component
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 36 & UI.md Section 46
 * Phase: P10 — Trust, Safety & Fallback
 * 
 * Responsibilities:
 * 1. Isolates component exceptions, preventing full-screen white screens.
 * 2. Displays calm, reassuring, accessible recovery guidance without technical jargon.
 * 3. Provides "Try Again" state reset and "Return Home" navigation controls.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Card, CardHeader, CardTitle, CardBody } from "../ui";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  sectionName?: string;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== "undefined") {
      console.warn(
        `[Sahayak ErrorBoundary] Captured error in section ${
          this.props.sectionName || "unnamed"
        }:`,
        error.message
      );
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  private handleGoHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === "function" && this.state.error) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      const sectionTitle = this.props.sectionName
        ? `${this.props.sectionName} Error`
        : "Something went wrong in this section";

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="error-boundary-container"
          style={{
            padding: "var(--space-6)",
            maxWidth: "600px",
            margin: "var(--space-6) auto",
          }}
        >
          <Card variant="interactive" style={{ borderLeft: "4px solid var(--warning, #D97706)" }}>
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <span style={{ fontSize: "1.5rem" }} aria-hidden="true">⚠️</span>
                <CardTitle style={{ margin: 0, fontSize: "1.25rem" }}>
                  {sectionTitle} / या विभागात समस्या उद्भवली
                </CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
                Sahayak encountered an unexpected issue while displaying this section. Your other pages and guidance remain fully functional.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>
                माहिती दाखवताना तात्पुरती तांत्रिक अडचण आली आहे. आपण पुन्हा प्रयत्न करू शकता किंवा मुख्य पृष्ठावर जाऊ शकता.
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <Button variant="primary" size="sm" onClick={this.handleReset}>
                  ↻ Try Again / पुन्हा प्रयत्न करा
                </Button>
                <Button variant="outline" size="sm" onClick={this.handleGoHome}>
                  🏠 Return to Home / मुख्यपृष्ठावर जा
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
