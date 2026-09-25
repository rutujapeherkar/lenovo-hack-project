/**
 * Sahayak AI Extension — DOM Field Highlighter
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 28 & SECURITY.md Section 13-14
 * Phase: P08 — Browser Extension
 * 
 * Injects non-destructive accessible focus highlights onto verified form fields.
 * Security Invariants:
 * 1. Zero password field touch: Strictly rejects highlighting or touching input[type="password"].
 * 2. Zero payment frame touch: Never highlights elements in payment iframes.
 * 3. Zero automatic submission: Does not click submit buttons or submit forms.
 */

export const HIGHLIGHT_CLASS_NAME = "sahayak-field-highlight";
export const HIGHLIGHT_STYLE_ID = "sahayak-extension-styles";

/**
 * Ensures the Sahayak accessible highlight CSS styles are injected into document head.
 */
export function ensureHighlightStylesInjected(doc: Document = document): void {
  if (doc.getElementById(HIGHLIGHT_STYLE_ID)) {
    return;
  }

  const styleEl = doc.createElement("style");
  styleEl.id = HIGHLIGHT_STYLE_ID;
  styleEl.textContent = `
    .${HIGHLIGHT_CLASS_NAME} {
      outline: 3px solid #eb6e27 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 6px rgba(235, 110, 39, 0.25) !important;
      border-radius: 4px !important;
      transition: outline 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
    }
  `;

  if (doc.head) {
    doc.head.appendChild(styleEl);
  } else if (doc.documentElement) {
    doc.documentElement.appendChild(styleEl);
  }
}

/**
 * Finds and highlights a form field element matching fieldId or selector.
 * Returns { success: boolean; error?: string }.
 */
export function highlightField(
  fieldId: string,
  selector?: string,
  doc: Document = document
): { success: boolean; error?: string } {
  ensureHighlightStylesInjected(doc);

  // 1. Locate element via selector or fallback strategies
  let element: HTMLElement | null = null;

  if (selector && typeof selector === "string" && selector.trim().length > 0) {
    try {
      element = doc.querySelector(selector);
    } catch (_err) {
      // Invalid selector syntax; continue to fallback
    }
  }

  if (!element && fieldId) {
    element = doc.getElementById(fieldId);
  }

  if (!element && fieldId) {
    element = doc.querySelector(`[name="${fieldId}"]`);
  }

  if (!element && fieldId) {
    element = doc.querySelector(`input[data-field-id="${fieldId}"]`);
  }

  if (!element) {
    return {
      success: false,
      error: "FIELD_NOT_FOUND",
    };
  }

  // 2. CRITICAL SECURITY INVARIANT: Zero Password & Payment Field Touch
  const inputEl = element as HTMLInputElement;
  const inputType = (inputEl.type || "").toLowerCase();
  const inputName = (inputEl.name || "").toLowerCase();
  const inputId = (inputEl.id || "").toLowerCase();

  if (
    inputType === "password" ||
    inputType === "hidden" ||
    inputName.includes("password") ||
    inputId.includes("password") ||
    inputName.includes("cvv") ||
    inputId.includes("cvv") ||
    inputName.includes("pin") ||
    inputId.includes("pin")
  ) {
    return {
      success: false,
      error: "SECURITY_REJECTION_PASSWORD_FIELD",
    };
  }

  // 3. Clear existing highlights
  clearHighlight(undefined, doc);

  // 4. Apply highlight class non-destructively
  element.classList.add(HIGHLIGHT_CLASS_NAME);

  // 5. Scroll element smoothly into visible center view
  try {
    element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  } catch (_e) {
    element.scrollIntoView();
  }

  return {
    success: true,
  };
}

/**
 * Removes highlight class from active elements.
 */
export function clearHighlight(fieldId?: string, doc: Document = document): void {
  if (fieldId) {
    const el = doc.getElementById(fieldId) || doc.querySelector(`[name="${fieldId}"]`);
    if (el) {
      el.classList.remove(HIGHLIGHT_CLASS_NAME);
    }
  }

  const allHighlighted = doc.querySelectorAll(`.${HIGHLIGHT_CLASS_NAME}`);
  allHighlighted.forEach((el) => el.classList.remove(HIGHLIGHT_CLASS_NAME));
}
