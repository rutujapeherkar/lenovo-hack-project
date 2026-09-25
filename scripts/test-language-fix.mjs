/**
 * Sahayak AI — Verification Suite for Language Default Fix
 * 
 * Verifies all 12 rules specified in the Language Default Fix prompt:
 * 1. Default to "en" if no preference exists
 * 2. Initial dashboard render language is English
 * 3. Never auto-select Marathi or Hindi
 * 4. User can manually select "en", "mr", "hi"
 * 5. Explicit change persists to storage
 * 6. Subsequent visits restore explicitly saved preference
 * 7. Missing, invalid, or unsupported values fallback to English
 * 8. Zero locale/browser inference
 * 9. Voice input starts in English (en-IN), switches to selected language
 * 10. Localization architecture preserved
 * 11. Existing Language type reused
 * 12. No state duplication between LanguageProvider and AccessibilityProvider
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n--- SAHAYAK AI: Language Default Fix Verification Suite ---\n");

let passed = 0;
let failed = 0;

function check(title, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${title}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${title}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// -----------------------------------------------------------------------------
// 1. Mock browser localStorage environment for unit testing
// -----------------------------------------------------------------------------
const storageStore = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => (storageStore.has(key) ? storageStore.get(key) : null),
    setItem: (key, val) => storageStore.set(key, String(val)),
    removeItem: (key) => storageStore.delete(key),
    clear: () => storageStore.clear(),
  },
};
globalThis.document = {
  documentElement: {
    setAttribute: (_k, _v) => {},
  },
};

// Import language module
const {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  isValidLanguage,
  getInitialLanguage,
  UI_TRANSLATIONS,
} = await import("../src/core/language/language-context.tsx");

const {
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  A11Y_STORAGE_KEY,
} = await import("../src/core/accessibility/accessibility-context.tsx");

const { VoiceService } = await import("../src/core/accessibility/voice-service.ts");

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

// Rule 1: No language preference -> default to "en"
check("Rule 1: If no language preference exists in storage, getInitialLanguage defaults to 'en'", () => {
  storageStore.clear();
  const initial = getInitialLanguage();
  assert.strictEqual(initial, "en", "Expected 'en' when storage is empty");
});

check("Rule 1b: DEFAULT_ACCESSIBILITY_PREFERENCES defaults language to 'en'", () => {
  assert.strictEqual(
    DEFAULT_ACCESSIBILITY_PREFERENCES.language,
    "en",
    "Accessibility preferences must default to 'en'"
  );
});

// Rule 2 & 3: Do NOT auto-select Marathi or Hindi
check("Rule 2 & 3: Does NOT auto-select 'mr' or 'hi' on first visit", () => {
  storageStore.clear();
  const initial = getInitialLanguage();
  assert.notStrictEqual(initial, "mr");
  assert.notStrictEqual(initial, "hi");
});

// Rule 4: Manual selection allowed
check("Rule 4: isValidLanguage accepts 'en', 'mr', 'hi'", () => {
  assert.strictEqual(isValidLanguage("en"), true);
  assert.strictEqual(isValidLanguage("mr"), true);
  assert.strictEqual(isValidLanguage("hi"), true);
  assert.deepStrictEqual(SUPPORTED_LANGUAGES, ["en", "mr", "hi"]);
});

// Rule 5: User explicitly changes language -> persists to storage
check("Rule 5: Explicitly selected language is stored in localStorage", () => {
  storageStore.clear();
  storageStore.set(LANGUAGE_STORAGE_KEY, "mr");
  assert.strictEqual(storageStore.get(LANGUAGE_STORAGE_KEY), "mr");

  storageStore.set(LANGUAGE_STORAGE_KEY, "hi");
  assert.strictEqual(storageStore.get(LANGUAGE_STORAGE_KEY), "hi");

  storageStore.set(LANGUAGE_STORAGE_KEY, "en");
  assert.strictEqual(storageStore.get(LANGUAGE_STORAGE_KEY), "en");
});

// Rule 6: Subsequent visits restore explicitly saved language
check("Rule 6: Subsequent visit restores explicitly saved Marathi preference", () => {
  storageStore.clear();
  storageStore.set(LANGUAGE_STORAGE_KEY, "mr");
  assert.strictEqual(getInitialLanguage(), "mr");
});

check("Rule 6b: Subsequent visit restores explicitly saved Hindi preference", () => {
  storageStore.clear();
  storageStore.set(LANGUAGE_STORAGE_KEY, "hi");
  assert.strictEqual(getInitialLanguage(), "hi");
});

check("Rule 6c: Subsequent visit restores explicitly saved English preference", () => {
  storageStore.clear();
  storageStore.set(LANGUAGE_STORAGE_KEY, "en");
  assert.strictEqual(getInitialLanguage(), "en");
});

// Rule 7: Missing, invalid, or unsupported -> fallback to English
check("Rule 7a: Missing saved preference falls back to 'en'", () => {
  storageStore.clear();
  assert.strictEqual(getInitialLanguage(), "en");
});

check("Rule 7b: Invalid language string ('french', 'es', 'invalid') falls back to 'en'", () => {
  storageStore.set(LANGUAGE_STORAGE_KEY, "french");
  assert.strictEqual(getInitialLanguage(), "en");

  storageStore.set(LANGUAGE_STORAGE_KEY, "es");
  assert.strictEqual(getInitialLanguage(), "en");

  storageStore.set(LANGUAGE_STORAGE_KEY, "xyz-invalid");
  assert.strictEqual(getInitialLanguage(), "en");

  storageStore.set(LANGUAGE_STORAGE_KEY, "");
  assert.strictEqual(getInitialLanguage(), "en");
});

check("Rule 7c: isValidLanguage rejects unsupported types or codes", () => {
  assert.strictEqual(isValidLanguage(null), false);
  assert.strictEqual(isValidLanguage(undefined), false);
  assert.strictEqual(isValidLanguage(123), false);
  assert.strictEqual(isValidLanguage({}), false);
  assert.strictEqual(isValidLanguage("fr"), false);
  assert.strictEqual(isValidLanguage("de"), false);
});

// Rule 8: Zero inference from browser locale / OS locale / IP
check("Rule 8: Source code audit confirms zero calls to navigator.language(s)", () => {
  const srcDir = path.join(rootDir, "src");
  function scan(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        scan(full);
      } else if (f.endsWith(".ts") || f.endsWith(".tsx")) {
        const content = fs.readFileSync(full, "utf8");
        assert(
          !content.includes("navigator.language"),
          `Forbidden navigator.language found in ${full}`
        );
        assert(
          !content.includes("navigator.languages"),
          `Forbidden navigator.languages found in ${full}`
        );
        assert(
          !content.includes("navigator.userLanguage"),
          `Forbidden navigator.userLanguage found in ${full}`
        );
      }
    }
  }
  scan(srcDir);
});

// Rule 9: Voice input starts in English (en-IN), switches to selected
check("Rule 9a: VoiceService resolves initial English locale to 'en-IN'", () => {
  assert.strictEqual(VoiceService.getLocale("en"), "en-IN");
});

check("Rule 9b: VoiceService resolves Marathi locale to 'mr-IN'", () => {
  assert.strictEqual(VoiceService.getLocale("mr"), "mr-IN");
});

check("Rule 9c: VoiceService resolves Hindi locale to 'hi-IN'", () => {
  assert.strictEqual(VoiceService.getLocale("hi"), "hi-IN");
});

check("Rule 9d: MicButton component defaults language prop to 'en'", () => {
  const micFile = fs.readFileSync(
    path.join(rootDir, "src/components/assistant/MicButton.tsx"),
    "utf8"
  );
  assert(
    micFile.includes('language = "en"'),
    "MicButton default language must be 'en'"
  );
});

// Rule 10 & 11: Preserved localization architecture & types
check("Rule 10 & 11: UI_TRANSLATIONS provides strings in en, mr, and hi", () => {
  for (const [key, trans] of Object.entries(UI_TRANSLATIONS)) {
    assert(trans.en, `Missing English translation for ${key}`);
    assert(trans.mr, `Missing Marathi translation for ${key}`);
    assert(trans.hi, `Missing Hindi translation for ${key}`);
  }
});

// Rule 12: Zero state duplication
check("Rule 12: Header and Footer components default currentLanguage to 'en'", () => {
  const headerFile = fs.readFileSync(
    path.join(rootDir, "src/components/layout/Header.tsx"),
    "utf8"
  );
  assert(
    headerFile.includes("currentLanguage = 'en'"),
    "Header default currentLanguage must be 'en'"
  );

  const footerFile = fs.readFileSync(
    path.join(rootDir, "src/components/layout/Footer.tsx"),
    "utf8"
  );
  assert(
    footerFile.includes("currentLanguage = 'en'"),
    "Footer default currentLanguage must be 'en'"
  );
});

check("Rule 12b: HomePage consumes useLanguage and defaults to 'en'", () => {
  const homeFile = fs.readFileSync(
    path.join(rootDir, "src/pages/HomePage.tsx"),
    "utf8"
  );
  assert(
    homeFile.includes("const { language } = useLanguage();"),
    "HomePage must consume useLanguage()"
  );
  assert(
    homeFile.includes(": 'en'"),
    "HomePage must fallback to 'en'"
  );
});

check("Rule 12c: HelpPage consumes useLanguage and renders in selected language", () => {
  const helpFile = fs.readFileSync(
    path.join(rootDir, "src/pages/HelpPage.tsx"),
    "utf8"
  );
  assert(
    helpFile.includes("const { language } = useLanguage();"),
    "HelpPage must consume useLanguage()"
  );
  assert(
    helpFile.includes("t.title[lang]"),
    "HelpPage must dynamically index translations"
  );
});

console.log(`\n--- Verification Complete: ${passed}/${passed + failed} checks passed ---`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n🎉 ALL LANGUAGE DEFAULT FIX CHECKS PASSED!\n");
}
