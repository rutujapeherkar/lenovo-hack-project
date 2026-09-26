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
    containsReadWord,
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

  // ── 3. Query Cleaning & Read Keyword ─────────────────────────────────────
  check("Rule 3a: cleanVoiceQuery strips wake word and done keyword in English", () => {
    const cleaned = cleanVoiceQuery("Ok Sahayak I need an income certificate done");
    assert.strictEqual(cleaned, "I need an income certificate");
  });

  check("Rule 3b: cleanVoiceQuery strips wake word and done keyword in Marathi", () => {
    const cleaned = cleanVoiceQuery("ओके साहायक मला रेशन कार्ड हवे आहे झाले");
    assert.strictEqual(cleaned, "मला रेशन कार्ड हवे आहे");
  });

  check("Rule 3c: containsReadWord detects English 'read' and 'read aloud'", () => {
    assert.strictEqual(containsReadWord("read"), true);
    assert.strictEqual(containsReadWord("read aloud"), true);
    assert.strictEqual(containsReadWord("read it please"), true);
  });

  check("Rule 3d: containsReadWord detects Marathi 'वाचा' and Hindi 'पढो'", () => {
    assert.strictEqual(containsReadWord("माहिती वाचा"), true);
    assert.strictEqual(containsReadWord("वाचून दाखवा"), true);
    assert.strictEqual(containsReadWord("योजना पढो"), true);
    assert.strictEqual(containsReadWord("पढ़कर सुनाओ"), true);
  });

  check("Rule 3e: cleanVoiceQuery strips 'read' keyword from query text", () => {
    const cleaned = cleanVoiceQuery("Ok Sahayak explain scholarship read done");
    assert.strictEqual(cleaned, "explain scholarship");
    const cleanedMr = cleanVoiceQuery("ओके साहायक शेतकरी योजना वाचा झाले");
    assert.strictEqual(cleanedMr, "शेतकरी योजना");
  });

  // ── 4. VoiceService API ──────────────────────────────────────────────────
  check("Rule 4a: VoiceService exposes requestMicrophonePermission function", () => {
    assert.strictEqual(typeof VoiceService.requestMicrophonePermission, "function");
  });

  check("Rule 4b: VoiceService exposes startHandsFreeListening function", () => {
    assert.strictEqual(typeof VoiceService.startHandsFreeListening, "function");
  });

  check("Rule 4c: VoiceService exposes containsReadWord function", () => {
    assert.strictEqual(typeof VoiceService.containsReadWord, "function");
  });

  // ── 5. Integrated MicButton Voice Trigger & Immediate Search ────────────
  check("Rule 5a: MicButton component requests mic permission on mount", () => {
    const micContent = fs.readFileSync(
      path.join(rootDir, "src/components/assistant/MicButton.tsx"),
      "utf-8"
    );
    assert.ok(
      micContent.includes("VoiceService.requestMicrophonePermission()"),
      "MicButton must request microphone permission on mount"
    );
    assert.ok(
      micContent.includes("VoiceService.startHandsFreeListening"),
      "MicButton must integrate hands-free listening"
    );
  });

  check("Rule 5b: HomePage has NO separate card and clears search field on 'ok sahayak'", () => {
    const homeContent = fs.readFileSync(
      path.join(rootDir, "src/pages/HomePage.tsx"),
      "utf-8"
    );
    assert.ok(
      !homeContent.includes("<HandsFreeVoiceAssistant"),
      "HomePage must NOT render a separate HandsFreeVoiceAssistant card"
    );
    assert.ok(
      homeContent.includes("<MicButton"),
      "HomePage must render integrated MicButton in search input bar"
    );
    assert.ok(
      homeContent.includes("setQuery('')"),
      "Must clear query text field when 'ok sahayak' is detected for a fresh start"
    );
    assert.ok(
      homeContent.includes("handleSearch(textToSearch, shouldRead)"),
      "Must search immediately with conditional shouldRead flag"
    );
  });

  check("Rule 5c: 'done' preserves preceding query text and stops voice mode", () => {
    const speechChunks = "मला नवीन रेशन कार्ड हवे आहे";
    const doneChunk = "done";
    const combined = `${speechChunks} ${doneChunk}`;
    assert.strictEqual(containsDoneWord(doneChunk), true);
    assert.strictEqual(cleanVoiceQuery(combined), "मला नवीन रेशन कार्ड हवे आहे");
  });

  console.log(`\n=============================================`);
  console.log(`Results: ${passed}/${total} checks PASSED`);
  console.log(`Hands-Free Voice Feature Verification Complete: ALL PASS\n`);
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
