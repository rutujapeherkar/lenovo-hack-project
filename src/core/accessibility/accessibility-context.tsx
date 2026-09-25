/**
 * Sahayak AI — Centralized Accessibility Context & Preference Store
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 32, 44 & DATA-CONTRACTS.md Section 8
 * Phase: P09 — Accessibility & Voice
 * 
 * Responsibilities:
 * 1. Single source of truth for user accessibility preferences across web & extension.
 * 2. Injects DOM attributes (data-contrast, data-text-scale, data-motion, lang) into <html>.
 * 3. Persists preferences to localStorage with graceful fallback.
 * 4. Provides accessible drawer state management.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { AccessibilityPreferences, Language } from "../shared/types";

export const A11Y_STORAGE_KEY = "sahayak_a11y_prefs";

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  textScale: "normal",
  highContrast: false,
  reducedMotion: false,
  readAloud: false,
  language: "mr",
};

export type AccessibilityAction =
  | { type: "SET_TEXT_SCALE"; payload: "normal" | "large" | "extra-large" }
  | { type: "SET_HIGH_CONTRAST"; payload: boolean }
  | { type: "SET_REDUCED_MOTION"; payload: boolean }
  | { type: "SET_READ_ALOUD"; payload: boolean }
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "CYCLE_TEXT_SCALE" }
  | { type: "TOGGLE_HIGH_CONTRAST" }
  | { type: "TOGGLE_REDUCED_MOTION" }
  | { type: "TOGGLE_READ_ALOUD" }
  | { type: "RESET_PREFERENCES" };

/**
 * Pure reducer function for accessibility state transitions (Test P09-A11Y-01)
 */
export function accessibilityReducer(
  state: AccessibilityPreferences,
  action: AccessibilityAction
): AccessibilityPreferences {
  switch (action.type) {
    case "SET_TEXT_SCALE":
      return { ...state, textScale: action.payload };

    case "SET_HIGH_CONTRAST":
      return { ...state, highContrast: action.payload };

    case "SET_REDUCED_MOTION":
      return { ...state, reducedMotion: action.payload };

    case "SET_READ_ALOUD":
      return { ...state, readAloud: action.payload };

    case "SET_LANGUAGE":
      return { ...state, language: action.payload };

    case "CYCLE_TEXT_SCALE": {
      const nextScale: Record<
        AccessibilityPreferences["textScale"],
        AccessibilityPreferences["textScale"]
      > = {
        normal: "large",
        large: "extra-large",
        "extra-large": "normal",
      };
      return { ...state, textScale: nextScale[state.textScale] || "normal" };
    }

    case "TOGGLE_HIGH_CONTRAST":
      return { ...state, highContrast: !state.highContrast };

    case "TOGGLE_REDUCED_MOTION":
      return { ...state, reducedMotion: !state.reducedMotion };

    case "TOGGLE_READ_ALOUD":
      return { ...state, readAloud: !state.readAloud };

    case "RESET_PREFERENCES":
      return { ...DEFAULT_ACCESSIBILITY_PREFERENCES, language: state.language };

    default:
      return state;
  }
}

/**
 * Synchronize accessibility state into HTML root attributes (Test P09-INT-01)
 */
export function applyAccessibilityToDom(prefs: AccessibilityPreferences): void {
  if (typeof document === "undefined" || !document.documentElement) return;
  const root = document.documentElement;

  // 1. Language attribute
  root.setAttribute("lang", prefs.language);

  // 2. High Contrast mode
  if (prefs.highContrast) {
    root.setAttribute("data-contrast", "high");
  } else {
    root.removeAttribute("data-contrast");
  }

  // 3. Text Scaling
  if (prefs.textScale === "large" || prefs.textScale === "extra-large") {
    root.setAttribute("data-text-scale", prefs.textScale);
  } else {
    root.removeAttribute("data-text-scale");
  }

  // 4. Reduced Motion
  if (prefs.reducedMotion) {
    root.setAttribute("data-motion", "reduced");
  } else {
    root.removeAttribute("data-motion");
  }
}

export interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  textScale: AccessibilityPreferences["textScale"];
  highContrast: boolean;
  reducedMotion: boolean;
  readAloud: boolean;
  language: Language;
  setTextScale: (scale: "normal" | "large" | "extra-large") => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setReadAloud: (enabled: boolean) => void;
  setLanguage: (lang: Language) => void;
  cycleTextScale: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleReadAloud: () => void;
  resetPreferences: () => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

export interface AccessibilityProviderProps {
  children: React.ReactNode;
  initialPreferences?: Partial<AccessibilityPreferences>;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  initialPreferences,
}) => {
  const [preferences, dispatch] = useReducer(
    accessibilityReducer,
    DEFAULT_ACCESSIBILITY_PREFERENCES,
    (defaultPrefs) => {
      // Load saved preferences from localStorage if in browser
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          const raw = window.localStorage.getItem(A11Y_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            return {
              ...defaultPrefs,
              ...parsed,
              ...initialPreferences,
            };
          }
        } catch {
          // If storage parsing fails, fallback cleanly
        }
      }
      return { ...defaultPrefs, ...initialPreferences };
    }
  );

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Synchronize state with DOM attributes on change
  useEffect(() => {
    applyAccessibilityToDom(preferences);

    // Save to localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(
          A11Y_STORAGE_KEY,
          JSON.stringify(preferences)
        );
      } catch {
        // Storage full or quota exceeded
      }
    }
  }, [preferences]);

  const setTextScale = useCallback(
    (scale: "normal" | "large" | "extra-large") => {
      dispatch({ type: "SET_TEXT_SCALE", payload: scale });
    },
    []
  );

  const setHighContrast = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_HIGH_CONTRAST", payload: enabled });
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_REDUCED_MOTION", payload: enabled });
  }, []);

  const setReadAloud = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_READ_ALOUD", payload: enabled });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    dispatch({ type: "SET_LANGUAGE", payload: lang });
  }, []);

  const cycleTextScale = useCallback(() => {
    dispatch({ type: "CYCLE_TEXT_SCALE" });
  }, []);

  const toggleHighContrast = useCallback(() => {
    dispatch({ type: "TOGGLE_HIGH_CONTRAST" });
  }, []);

  const toggleReducedMotion = useCallback(() => {
    dispatch({ type: "TOGGLE_REDUCED_MOTION" });
  }, []);

  const toggleReadAloud = useCallback(() => {
    dispatch({ type: "TOGGLE_READ_ALOUD" });
  }, []);

  const resetPreferences = useCallback(() => {
    dispatch({ type: "RESET_PREFERENCES" });
  }, []);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);
  const togglePanel = useCallback(() => setIsPanelOpen((prev) => !prev), []);

  const value: AccessibilityContextType = {
    preferences,
    textScale: preferences.textScale,
    highContrast: preferences.highContrast,
    reducedMotion: preferences.reducedMotion,
    readAloud: preferences.readAloud,
    language: preferences.language,
    setTextScale,
    setHighContrast,
    setReducedMotion,
    setReadAloud,
    setLanguage,
    cycleTextScale,
    toggleHighContrast,
    toggleReducedMotion,
    toggleReadAloud,
    resetPreferences,
    isPanelOpen,
    openPanel,
    closePanel,
    togglePanel,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};
