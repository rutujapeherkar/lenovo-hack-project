/**
 * Sahayak AI — Prompt Injection & Untrusted Input Guard
 * 
 * Source of Truth: docs/source-of-truth/SECURITY.md Section 23 & P10 Specification
 * Phase: P10 — Trust, Safety & Fallback
 * 
 * Invariants:
 * 1. Webpage text, screenshots, and user queries are untrusted input data, never executable instructions.
 * 2. Neutralizes prompt injections attempting to override system behavior or exfiltrate configuration.
 */

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(\w+\s+){0,3}instructions/i,
  /disregard\s+(\w+\s+){0,3}(instructions|rules|guidelines|constraints)/i,
  /forget\s+(your\s+)?(instructions|persona|rules)/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions|api\s*key)/i,
  /give\s+(me\s+)?(your\s+)?(api\s*key|system\s+prompt|credentials)/i,
  /what\s+are\s+your\s+(initial\s+)?instructions/i,
  /you\s+are\s+now\s+(in\s+developer\s+mode|dan|unfiltered)/i,
  /bypass\s+(all\s+)?(safety|security|rules)/i,
  /repeat\s+(everything|the\s+words)\s+above/i,
  /override\s+(all\s+)?(instructions|rules|guidelines)/i,
];

/**
 * Checks whether an incoming text string contains prompt injection signatures
 */
export function isPromptInjection(text: string | null | undefined): boolean {
  if (!text || typeof text !== "string") return false;
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Encloses untrusted user or page text in secure delimiters for AI reasoning
 */
export function wrapUntrustedInput(text: string): string {
  if (!text || typeof text !== "string") return "";
  const cleaned = text.replace(/<\/?untrusted_input>/gi, "");
  return `<untrusted_input>\n${cleaned}\n</untrusted_input>`;
}
