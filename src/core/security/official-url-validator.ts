/**
 * Sahayak AI — Official Government URL Validator & Safety Filter
 * 
 * Source of Truth: docs/source-of-truth/OFFICIAL-SOURCES.md & SECURITY.md Section 22
 * Phase: P10 — Trust, Safety & Fallback
 * 
 * Invariants:
 * 1. AI is strictly prohibited from generating official government links.
 * 2. Official outbound links must strictly resolve to verified .gov.in or .nic.in domains with HTTPS.
 * 3. Never allow arbitrary AI output to create trusted "Apply Now" or "Official Website" routes.
 */

import type { OfficialSource } from "../shared/types";

const ALLOWED_GOVERNMENT_DOMAINS = [
  "gov.in",
  "nic.in",
  "mahaonline.gov.in",
  "maharashtra.gov.in",
  "mahafood.gov.in",
  "mygov.in",
  "india.gov.in",
];

/**
 * Validates whether a given URL is an authentic, verified government link
 */
export function isOfficialGovernmentUrl(urlString: string | null | undefined): boolean {
  if (!urlString || typeof urlString !== "string") return false;

  try {
    const parsed = new URL(urlString);

    // Protocol must be HTTPS
    if (parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Must match or end with an approved government domain
    return ALLOWED_GOVERNMENT_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Validates an OfficialSource object to ensure its URL is authentic
 */
export function validateOfficialSource(
  source: unknown
): OfficialSource | undefined {
  if (!source || typeof source !== "object") return undefined;

  const candidate = source as Record<string, unknown>;

  if (
    typeof candidate.name !== "string" ||
    typeof candidate.url !== "string" ||
    !isOfficialGovernmentUrl(candidate.url)
  ) {
    return undefined;
  }

  return {
    name: candidate.name,
    url: candidate.url,
    lastVerified: typeof candidate.lastVerified === "string" ? candidate.lastVerified : undefined,
  };
}
