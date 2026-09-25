/**
 * Sahayak AI Extension — Content Script Page & Portal Detector
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 28 & SECURITY.md Section 12
 * Phase: P08 — Browser Extension
 * 
 * Safely extracts minimum page context and performs deterministic portal and form identification.
 * Invariant: Never extracts passwords, OTPs, PINs, or sensitive session data.
 */

import type { PageContext, PageDetectionResult, FormGuide } from "../shared/types";
import { PortalDetector } from "../../../src/core/portals/portal-detector";
import { FormGuideRepository } from "../../../src/core/form-guides/form-guide-repository";

export class ContentDetector {
  /**
   * Safely inspects current document and window to extract minimum necessary page context.
   */
  public static extractPageContext(doc: Document = document, win: Window = window): PageContext {
    const url = win.location.href;
    const hostname = win.location.hostname;
    const title = doc.title || "";

    // Extract safe visible headings (h1, h2) for context without dumping whole DOM
    const headings: string[] = [];
    const headingElements = doc.querySelectorAll("h1, h2, .page-title, .portal-header");
    headingElements.forEach((el, index) => {
      if (index < 4) {
        const text = el.textContent?.trim();
        if (text && text.length < 120) {
          headings.push(text);
        }
      }
    });

    const visibleText = headings.join(" • ");

    // Deterministic portal identification
    const portalMatch = PortalDetector.matchPortal(url, title);
    const portalId = portalMatch?.portalId;

    // Form Guide matching
    const matchedGuide = FormGuideRepository.matchGuide(url, visibleText);

    return {
      url,
      domain: hostname,
      title,
      portalId,
      visibleText,
      detectedFormId: matchedGuide?.formId,
    };
  }

  /**
   * Evaluates whether current page is a known government portal or unknown page.
   */
  public static detectPageStatus(doc: Document = document, win: Window = window): PageDetectionResult {
    const context = this.extractPageContext(doc, win);
    const isKnown = Boolean(context.portalId);

    return {
      portalId: context.portalId,
      formId: context.detectedFormId,
      status: isKnown ? "known" : "unknown",
      confidence: isKnown ? "high" : "low",
    };
  }

  /**
   * Returns active FormGuide for current page if available.
   */
  public static getCurrentFormGuide(doc: Document = document, win: Window = window): FormGuide | undefined {
    const context = this.extractPageContext(doc, win);
    return FormGuideRepository.matchGuide(context.url || "", context.visibleText);
  }
}
