/**
 * Sahayak AI — Hands-Free Voice Assistant Verification Suite
 *
 * Verifies:
 * 1. Wake word detection ('ok sahayak', 'okay sahayak', 'sahayak', 'ओके साहायक')
 * 2. Done keyword detection ('done', 'i am done', 'झाले', 'हो गया')
 * 3. Voice query cleaning (stripping wake word and done keywords)
 * 4. VoiceService API methods (requestMicrophonePermission, startHandsFreeListening)
 * 5. HandsFreeVoiceAssistant component integration in HomePage
 * 6. Automatic Read Aloud activation upon wake word detection
 * 7. Immediate search execution and voice playback upon 'done' detection
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n--- SAHAYAK AI: Hands-Free Voice Assistant Verification Suite ---\n");

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
    process.exit(1);
  }
}

async function run() {
  const {
    VoiceService,
    containsWakeWord,
    containsDoneWord,
    cleanVoiceQuery,
  } = await import("../src/core/accessibility/voice-service.ts");

  // ── 1. Wake Word Detection ───────────────────────────────────────────────
  check("Rule 1a: containsWakeWord detects 'ok sahayak'", () => {
    assert.strictEqual(containsWakeWord("ok sahayak"), true);
    assert.strictEqual(containsWakeWord("Ok Sahayak please help me"), true);
  });

  check("Rule 1b: containsWakeWord detects 'okay sahayak' and 'hey sahayak'", () => {
    assert.strictEqual(containsWakeWord("okay sahayak I need income certificate"), true);
    assert.strictEqual(containsWakeWord("hey sahayak find scholarship"), true);
  });

  check("Rule 1c: containsWakeWord detects Marathi/Hindi Devanagari 'ओके साहायक'", () => {
    assert.strictEqual(containsWakeWord("ओके साहायक मला मदत हवी आहे"), true);
    assert.strictEqual(containsWakeWord("साहायक मला योजना सांगा"), true);
  });

  check("Rule 1d: containsWakeWord rejects unrelated speech", () => {
    assert.strictEqual(containsWakeWord("hello google what is the weather"), false);
    assert.strictEqual(containsWakeWord("just searching for a portal"), false);
  });

  // ── 2. Done Keyword Detection ────────────────────────────────────────────
  check("Rule 2a: containsDoneWord detects 'done'", () => {
    assert.strictEqual(containsDoneWord("I want an income certificate done"), true);
    assert.strictEqual(containsDoneWord("done"), true);
  });

  check("Rule 2b: containsDoneWord detects 'i am done' and 'finished'", () => {
    assert.strictEqual(containsDoneWord("i am done"), true);
    assert.strictEqual(containsDoneWord("finished searching"), true);
  });

  check("Rule 2c: containsDoneWord detects Marathi 'झाले' and 'हो झाले'", () => {
    assert.strictEqual(containsDoneWord("मला रेशन कार्ड हवे आहे झाले"), true);
    assert.strictEqual(containsDoneWord("हो झाले"), true);
    assert.strictEqual(containsDoneWord("अर्ज माहिती पूर्ण"), true);
  });

  // ── 3. Query Cleaning ────────────────────────────────────────────────────
  check("Rule 3a: cleanVoiceQuery strips wake word and done keyword in English", () => {
    const cleaned = cleanVoiceQuery("Ok Sahayak I need an income certificate done");
    assert.strictEqual(cleaned, "I need an income certificate");
  });

  check("Rule 3b: cleanVoiceQuery strips wake word and done keyword in Marathi", () => {
    const cleaned = cleanVoiceQuery("ओके साहायक मला रेशन कार्ड हवे आहे झाले");
    assert.strictEqual(cleaned, "मला रेशन कार्ड हवे आहे");
  });

  // ── 4. VoiceService API ──────────────────────────────────────────────────
  check("Rule 4a: VoiceService exposes requestMicrophonePermission function", () => {
    assert.strictEqual(typeof VoiceService.requestMicrophonePermission, "function");
  });

  check("Rule 4b: VoiceService exposes startHandsFreeListening function", () => {
    assert.strictEqual(typeof VoiceService.startHandsFreeListening, "function");
  });

  // ── 5. Component & Integration ───────────────────────────────────────────
  check("Rule 5a: HandsFreeVoiceAssistant component file exists", () => {
    const compPath = path.join(rootDir, "src/components/assistant/HandsFreeVoiceAssistant.tsx");
    assert.ok(fs.existsSync(compPath), "HandsFreeVoiceAssistant.tsx must exist");
  });

  check("Rule 5b: HandsFreeVoiceAssistant requests mic permission on mount", () => {
    const compContent = fs.readFileSync(
      path.join(rootDir, "src/components/assistant/HandsFreeVoiceAssistant.tsx"),
      "utf-8"
    );
    assert.ok(
      compContent.includes("VoiceService.requestMicrophonePermission()"),
      "Must call requestMicrophonePermission on mount"
    );
  });

  check("Rule 5c: HomePage mounts HandsFreeVoiceAssistant and turns on Read Aloud on wake word", () => {
    const homeContent = fs.readFileSync(
      path.join(rootDir, "src/pages/HomePage.tsx"),
      "utf-8"
    );
    assert.ok(homeContent.includes("<HandsFreeVoiceAssistant"), "HomePage must render HandsFreeVoiceAssistant");
    assert.ok(homeContent.includes("setReadAloud(true)"), "Must activate read feature on wake word");
    assert.ok(homeContent.includes("handleSearch(spokenQuery, true)"), "Must search immediately on done with voice playback");
  });

  console.log(`\n=============================================`);
  console.log(`Results: ${passed}/${total} checks PASSED`);
  console.log(`Hands-Free Voice Feature Verification Complete: ALL PASS\n`);
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
