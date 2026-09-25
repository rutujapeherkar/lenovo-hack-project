/**
 * Sahayak AI — Phase P07 Automated Verification Suite
 * 
 * Verifies all Acceptance Criteria (AC-P07-01 through AC-P07-10) and Tests:
 * - Test P07-VAL-01: MIME type validation
 * - Test P07-VAL-02: File size constraint validation
 * - Test P07-API-01: Server-side vision API route & canonical response envelope
 * - Test P07-MAN-01: Login screenshot elements & credential safety warning
 * - Test P07-LANG-01: Trilingual output parity (English, Marathi, Hindi)
 * - Test P07-SEC-01: Privacy disclaimer invariant & ephemeral processing
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n--- SAHAYAK AI: Phase P07 Verification Suite ---\n");

let passed = 0;
let total = 0;

function check(desc, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function asyncCheck(desc, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✓ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    Error: ${err.message}`);
  }
}

// 1. Module Boundaries & File Existence Checks
console.log("1. Checking Explain Screen Architecture & File Structure...");

check("AC-P07-01: Core explain-screen modules exist", () => {
  const files = [
    "src/core/explain-screen/image-validator.ts",
    "src/core/explain-screen/glossary.ts",
    "src/core/explain-screen/screen-service.ts",
    "src/core/explain-screen/index.ts",
    "src/api/explain-screen/route.ts",
    "src/components/explain-screen/UploadArea.tsx",
    "src/components/explain-screen/ImagePreview.tsx",
    "src/components/explain-screen/ExplanationPanel.tsx",
    "src/components/explain-screen/Glossary.tsx",
    "src/components/explain-screen/index.ts",
    "src/components/explain/index.ts",
    "src/pages/ExplainScreenPage.tsx",
  ];
  for (const f of files) {
    const p = path.join(rootDir, f);
    assert(fs.existsSync(p), `Missing required file: ${f}`);
  }
});

// Dynamic import of core modules
const {
  validateImageFile,
  formatFileSize,
  MAX_IMAGE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
} = await import("../src/core/explain-screen/image-validator.ts");

const { CivicGlossary } = await import("../src/core/explain-screen/glossary.ts");
const { ScreenService } = await import("../src/core/explain-screen/screen-service.ts");
const { handleExplainScreenApi } = await import("../src/api/explain-screen/route.ts");
const { isScreenExplanation } = await import("../src/core/shared/validators.ts");

// 2. Unit Tests for Image Validator
console.log("\n2. Testing Image Validation (Test P07-VAL-01, Test P07-VAL-02)...");

check("Test P07-VAL-01: Rejects non-image and unsupported formats (PDF, TXT, GIF)", () => {
  // AC-P07-03: PDF rejected
  const pdfResult = validateImageFile({ name: "doc.pdf", size: 1024, type: "application/pdf" });
  assert.strictEqual(pdfResult.valid, false, "PDF must be rejected");
  assert(pdfResult.error?.includes("Unsupported file format"), "Must provide friendly error");

  // TXT rejected
  const txtResult = validateImageFile({ name: "notes.txt", size: 500, type: "text/plain" });
  assert.strictEqual(txtResult.valid, false, "Text file must be rejected");

  // GIF rejected (supported is PNG, JPG, JPEG, WebP)
  const gifResult = validateImageFile({ name: "anim.gif", size: 2000, type: "image/gif" });
  assert.strictEqual(gifResult.valid, false, "GIF must be rejected");
});

check("AC-P07-02: Accepts image/png, image/jpeg, image/jpg, image/webp", () => {
  for (const mime of ["image/png", "image/jpeg", "image/jpg", "image/webp"]) {
    const res = validateImageFile({ name: `test.${mime.split("/")[1]}`, size: 200000, type: mime });
    assert.strictEqual(res.valid, true, `MIME ${mime} must be valid`);
  }
});

check("Test P07-VAL-02 & AC-P07-04: Rejects files exceeding 5 MB limit", () => {
  const oversizedResult = validateImageFile({
    name: "large.png",
    size: 6 * 1024 * 1024, // 6 MB
    type: "image/png",
  });
  assert.strictEqual(oversizedResult.valid, false, "6 MB file must be rejected");
  assert.strictEqual(oversizedResult.error, "Image size exceeds 5 MB limit.", "Must return exact error message");
});

check("AC-P07-02: Rejects empty (0-byte) files and null inputs", () => {
  const emptyResult = validateImageFile({ name: "empty.png", size: 0, type: "image/png" });
  assert.strictEqual(emptyResult.valid, false, "0 byte file must be rejected");

  const nullResult = validateImageFile(null);
  assert.strictEqual(nullResult.valid, false, "null must be rejected");
});

check("formatFileSize formats bytes correctly", () => {
  assert.strictEqual(formatFileSize(500), "500 B");
  assert.strictEqual(formatFileSize(2048), "2.0 KB");
  assert.strictEqual(formatFileSize(2.5 * 1024 * 1024), "2.5 MB");
});

// 3. Testing Civic Glossary
console.log("\n3. Testing Civic Glossary & Contextual Terms (AC-P07-09)...");

check("CivicGlossary contains essential administrative terms in en, mr, hi", () => {
  const enTerms = CivicGlossary.getAllTerms("en");
  const mrTerms = CivicGlossary.getAllTerms("mr");
  const hiTerms = CivicGlossary.getAllTerms("hi");

  assert(enTerms.length >= 8, "Must have at least 8 essential civic terms");
  assert.strictEqual(enTerms.length, mrTerms.length, "Term count must match across languages");
  assert.strictEqual(mrTerms.length, hiTerms.length, "Term count must match across languages");

  // Check specific terms
  const beneficiary = enTerms.find((t) => t.id === "beneficiary");
  assert(beneficiary, "Must define 'beneficiary'");
  assert(beneficiary.definition.length > 10, "Must have readable definition");

  const domicile = mrTerms.find((t) => t.id === "domicile");
  assert(domicile, "Must define 'domicile' in Marathi");
  assert(/[\u0900-\u097F]/.test(domicile.term), "Marathi term must be in Devanagari");
});

check("CivicGlossary.findRelevantTerms matches terms present in screen text", () => {
  const text = "Please enter the annual income for the beneficiary and upload domicile certificate.";
  const matches = CivicGlossary.findRelevantTerms(text, "en");
  assert(matches.length >= 2, "Must detect 'beneficiary' and 'domicile'");
  assert(matches.some((m) => m.id === "beneficiary"));
  assert(matches.some((m) => m.id === "domicile"));
});

// 4. Server-Side Vision API Route Testing
console.log("\n4. Testing Vision API Route (/api/explain-screen) (Test P07-API-01)...");

await asyncCheck("Test P07-API-01: handleExplainScreenApi processes valid image payload", async () => {
  const dummyBase64 = Buffer.from("fake-png-screenshot-content").toString("base64");
  const response = await handleExplainScreenApi({
    imageBase64: dummyBase64,
    mimeType: "image/png",
    language: "en",
    fileName: "aaplesarkar-login.png",
  });

  assert.strictEqual(response.status, 200, "Must return HTTP 200");
  assert.strictEqual(response.headers["Cache-Control"], "no-store, no-cache, must-revalidate");
  assert.strictEqual(response.body.success, true);
  assert(response.body.data, "Must contain data payload");

  // Validate output against canonical ScreenExplanation schema
  assert(isScreenExplanation(response.body.data), "Output must satisfy isScreenExplanation type guard");
});

await asyncCheck("AC-P07-07 & Test P07-MAN-01: Login screenshot breakdown and credential warnings", async () => {
  const dummyBase64 = Buffer.from("login-screen").toString("base64");
  const response = await handleExplainScreenApi({
    imageBase64: dummyBase64,
    mimeType: "image/png",
    language: "en",
    fileName: "portal-login.png",
  });

  const explanation = response.body.data;
  assert(explanation.summary.length > 0, "Summary must be present");
  assert(explanation.elements.length >= 4, "Must identify fields and buttons");

  // Field breakdown
  const hasUserField = explanation.elements.some((e) => /user|mobile/i.test(e.name));
  const hasPasswordField = explanation.elements.some((e) => /password/i.test(e.name));
  const hasLoginButton = explanation.elements.some((e) => /login/i.test(e.name));

  assert(hasUserField, "Must detect User/Mobile field");
  assert(hasPasswordField, "Must detect Password field");
  assert(hasLoginButton, "Must detect Login button");

  // AC-P07-08: "What should I do next?" section
  assert(explanation.nextAction, "Must have nextAction recommendation");
  assert(explanation.nextAction.length > 10, "nextAction must be actionable");

  // Credential security warning
  assert(explanation.warnings && explanation.warnings.length > 0, "Must include safety warnings");
  assert(explanation.warnings.some((w) => /password|otp|pin|credentials/i.test(w)), "Warning must alert about passwords/OTPs");
});

await asyncCheck("AC-P07-03 & AC-P07-04: API rejects invalid, oversized, or missing inputs", async () => {
  // Missing body
  const emptyRes = await handleExplainScreenApi(null);
  assert.strictEqual(emptyRes.status, 400);

  // Missing imageBase64
  const noDataRes = await handleExplainScreenApi({ mimeType: "image/png", language: "en" });
  assert.strictEqual(noDataRes.status, 400);

  // Invalid language
  const badLangRes = await handleExplainScreenApi({
    imageBase64: "YWJj",
    mimeType: "image/png",
    language: "fr",
  });
  assert.strictEqual(badLangRes.status, 400);

  // Unsupported MIME
  const badMimeRes = await handleExplainScreenApi({
    imageBase64: "YWJj",
    mimeType: "application/pdf",
    language: "en",
  });
  assert.strictEqual(badMimeRes.status, 400);
});

// 5. Multilingual Parity & Marathi/Hindi Rendering
console.log("\n5. Testing Multilingual Output (Test P07-LANG-01)...");

await asyncCheck("Test P07-LANG-01: Marathi screen explanation is completely in Devanagari script", async () => {
  const dummyBase64 = Buffer.from("marathi-screen").toString("base64");
  const response = await handleExplainScreenApi({
    imageBase64: dummyBase64,
    mimeType: "image/png",
    language: "mr",
    fileName: "income-certificate.png",
  });

  const explanation = response.body.data;
  assert(explanation, "Explanation must exist");
  assert(/[\u0900-\u097F]/.test(explanation.summary), "Summary must contain Devanagari characters");
  assert(/[\u0900-\u097F]/.test(explanation.nextAction), "Next action must contain Devanagari characters");
  assert(explanation.elements.every((e) => /[\u0900-\u097F]/.test(e.explanation)), "Element explanations must be in Marathi");
});

await asyncCheck("Hindi screen explanation is completely in Devanagari script", async () => {
  const dummyBase64 = Buffer.from("hindi-screen").toString("base64");
  const response = await handleExplainScreenApi({
    imageBase64: dummyBase64,
    mimeType: "image/png",
    language: "hi",
    fileName: "portal.png",
  });

  const explanation = response.body.data;
  assert(explanation, "Explanation must exist");
  assert(/[\u0900-\u097F]/.test(explanation.summary), "Hindi summary must contain Devanagari characters");
  assert(/[\u0900-\u097F]/.test(explanation.nextAction), "Hindi next action must contain Devanagari characters");
});

// 6. Security Invariants & Privacy Disclaimers
console.log("\n6. Checking Security & Privacy Invariants (Test P07-SEC-01, AC-P07-10)...");

check("Test P07-SEC-01: UploadArea component includes mandatory sensitive credential warning", () => {
  const uploadAreaPath = path.join(rootDir, "src/components/explain-screen/UploadArea.tsx");
  const content = fs.readFileSync(uploadAreaPath, "utf-8");
  assert(content.includes("privacyNotice"), "UploadArea must render privacy notice");

  const langContextPath = path.join(rootDir, "src/core/language/language-context.tsx");
  const langContent = fs.readFileSync(langContextPath, "utf-8");
  assert(
    langContent.includes("Avoid uploading screenshots containing passwords, OTPs, PINs, or banking credentials."),
    "Must have the exact mandatory warning text in language context"
  );
});

check("AC-P07-10: Ephemeral In-Memory Processing Invariant", () => {
  // Ensure no fs.writeFile, multer disk storage, or AWS S3 upload exists in explain-screen code
  const screenServiceContent = fs.readFileSync(
    path.join(rootDir, "src/core/explain-screen/screen-service.ts"),
    "utf-8"
  );
  assert(!screenServiceContent.includes("fs.writeFile"), "Must not write images to disk");
  assert(!screenServiceContent.includes("s3"), "Must not persist to external bucket");

  const routeContent = fs.readFileSync(
    path.join(rootDir, "src/api/explain-screen/route.ts"),
    "utf-8"
  );
  assert(!routeContent.includes("fs.writeFileSync"), "API route must not write image to disk");
  assert(routeContent.includes("Cache-Control"), "API route must enforce no-store header");
});

check("Prompt Injection Defense in AI Vision Prompt", () => {
  const geminiContent = fs.readFileSync(
    path.join(rootDir, "src/core/ai/gemini-provider.ts"),
    "utf-8"
  );
  assert(
    geminiContent.includes("NEVER ask the user to enter passwords, PINs, OTPs, or bank account details"),
    "Prompt must explicitly prohibit credential requests"
  );
  assert(
    geminiContent.includes("Do NOT invent eligibility rules, official fees, or government requirements"),
    "Prompt must prevent hallucinating official government rules"
  );
});

// 7. Client-Side ScreenService Offline Fallback Test
console.log("\n7. Testing ScreenService Client Orchestration & Offline Fallback...");

await asyncCheck("ScreenService.explainScreen returns structured result with glossary", async () => {
  const dummyFile = {
    name: "income-certificate-form.png",
    size: 150000,
    type: "image/png",
    buffer: Buffer.from("mock-image-bytes").buffer,
  };

  const result = await ScreenService.explainScreen(dummyFile, "en");
  assert.strictEqual(result.success, true);
  assert(result.explanation, "Must return explanation");
  assert(isScreenExplanation(result.explanation), "Must be valid canonical ScreenExplanation");
  assert(Array.isArray(result.glossary), "Must include glossary entries");
});

console.log("\n=============================================");
console.log(`Results: ${passed}/${total} checks PASSED`);

if (passed === total) {
  console.log("Phase P07 Automated Verification Complete: ALL PASS\n");
  process.exit(0);
} else {
  console.error("Phase P07 Verification: Some checks failed!\n");
  process.exit(1);
}
