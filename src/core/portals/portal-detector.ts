/**
 * Sahayak AI — Portal Detector & URL Matcher
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 28 & DATA-CONTRACTS.md Section 14
 * Phase: P08 — Browser Extension
 * 
 * Deterministically identifies known government portals from URL, hostname, and document titles.
 */

import type { PortalMatch, Portal } from "../shared/types";
import { getPortals, getPortalByDomain } from "../shared/data-loader";

export class PortalDetector {
  /**
   * Matches a URL string against the verified portals registry.
   */
  public static matchPortal(urlString: string, documentTitle?: string): PortalMatch | null {
    if (!urlString || typeof urlString !== "string") {
      return null;
    }

    try {
      // Normalize URL
      const parsedUrl = new URL(urlString);
      const hostname = parsedUrl.hostname.toLowerCase();
      const pathname = parsedUrl.pathname.toLowerCase();

      // 1. Direct domain match
      const directMatch = getPortalByDomain(hostname);
      if (directMatch) {
        return {
          portalId: directMatch.id,
          confidence: "high",
          matchedBy: "domain",
        };
      }

      // 2. Subdomain / suffix check across verified portals
      const allPortals = getPortals();
      for (const portal of allPortals) {
        const portalDomain = portal.domain.toLowerCase();
        if (hostname.endsWith(portalDomain) || hostname.includes(portalDomain)) {
          return {
            portalId: portal.id,
            confidence: "high",
            matchedBy: "domain",
          };
        }
      }

      // 3. Pathname keyword checks for local testing or reverse proxy environments
      for (const portal of allPortals) {
        if (pathname.includes(portal.id)) {
          return {
            portalId: portal.id,
            confidence: "medium",
            matchedBy: "path",
          };
        }
      }

      // 4. Document title match if provided
      if (documentTitle && typeof documentTitle === "string") {
        const normalizedTitle = documentTitle.toLowerCase();
        for (const portal of allPortals) {
          if (
            normalizedTitle.includes(portal.name.toLowerCase()) ||
            (portal.id === "aaple-sarkar" && (normalizedTitle.includes("aaple sarkar") || normalizedTitle.includes("आपले सरकार"))) ||
            (portal.id === "mahadbt" && (normalizedTitle.includes("mahadbt") || normalizedTitle.includes("महाडीबीटी")))
          ) {
            return {
              portalId: portal.id,
              confidence: "medium",
              matchedBy: "page_text",
            };
          }
        }
      }

      return null;
    } catch (_err) {
      // If URL parsing fails, attempt regex fallback
      const allPortals = getPortals();
      for (const portal of allPortals) {
        if (urlString.toLowerCase().includes(portal.domain.toLowerCase())) {
          return {
            portalId: portal.id,
            confidence: "high",
            matchedBy: "url",
          };
        }
      }
      return null;
    }
  }

  /**
   * Retrieves Portal object for a matched URL or returns undefined.
   */
  public static getPortalForUrl(urlString: string): Portal | undefined {
    const match = this.matchPortal(urlString);
    if (!match) return undefined;
    return getPortals().find((p) => p.id === match.portalId);
  }

  /**
   * Returns whether a given URL is a known, supported government portal.
   */
  public static isKnownPortal(urlString: string): boolean {
    const match = this.matchPortal(urlString);
    return match !== null && match.confidence !== "low";
  }
}
