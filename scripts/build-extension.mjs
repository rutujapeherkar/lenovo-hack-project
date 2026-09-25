/**
 * Sahayak AI — Browser Extension Build Script
 * 
 * Compiles extension source files into extension/dist/ ready for Chrome:
 * 1. Background service worker (background.js)
 * 2. Content script (content.js)
 * 3. Side panel UI bundle (sidepanel.js & sidepanel.html)
 * 4. Manifest V3 (manifest.json)
 */

import { build } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const extDir = path.join(rootDir, "extension");
const outDir = path.join(extDir, "dist");

console.log("[Extension Build] Starting compilation into extension/dist/...");

// Ensure output directory exists
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

try {
  // 1. Build Background Service Worker (ES module)
  console.log("  -> Compiling background/service-worker.ts...");
  await build({
    configFile: false,
    build: {
      outDir,
      emptyOutDir: false,
      lib: {
        entry: path.join(extDir, "src/background/service-worker.ts"),
        name: "SahayakBackground",
        formats: ["es"],
        fileName: () => "background.js",
      },
      minify: false,
      sourcemap: false,
    },
  });

  // 2. Build Content Script (IIFE for standalone browser injection)
  console.log("  -> Compiling content/content-script.ts...");
  await build({
    configFile: false,
    build: {
      outDir,
      emptyOutDir: false,
      lib: {
        entry: path.join(extDir, "src/content/content-script.ts"),
        name: "SahayakContentScript",
        formats: ["iife"],
        fileName: () => "content.js",
      },
      minify: false,
      sourcemap: false,
    },
  });

  // 3. Build Side Panel UI (React application bundle)
  console.log("  -> Compiling sidepanel UI...");
  await build({
    configFile: false,
    plugins: [react()],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    build: {
      outDir,
      emptyOutDir: false,
      lib: {
        entry: path.join(extDir, "src/sidepanel/index.tsx"),
        name: "SahayakSidepanel",
        formats: ["es"],
        fileName: () => "sidepanel.js",
      },
      minify: false,
      sourcemap: false,
    },
  });

  // 4. Copy manifest.json, sidepanel.html & logo
  console.log("  -> Copying manifest.json, sidepanel.html, and sahayak-logo.png...");
  fs.copyFileSync(path.join(extDir, "manifest.json"), path.join(outDir, "manifest.json"));
  fs.copyFileSync(path.join(extDir, "sidepanel.html"), path.join(outDir, "sidepanel.html"));
  if (fs.existsSync(path.join(extDir, "sahayak-logo.png"))) {
    fs.copyFileSync(path.join(extDir, "sahayak-logo.png"), path.join(outDir, "sahayak-logo.png"));
  }

  // 5. Package into public/sahayak-extension.zip for 1-click browser download
  const publicDir = path.join(rootDir, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const zipTarget = path.join(publicDir, "sahayak-extension.zip");
  try {
    const { execSync } = await import("node:child_process");
    execSync(`cd "${outDir}" && zip -r "${zipTarget}" .`, { stdio: "pipe" });
    console.log("  -> Generated 1-click download package: public/sahayak-extension.zip");
  } catch (_zipErr) {
    // Graceful fallback if zip CLI is unavailable
  }

  console.log("[Extension Build] SUCCESS: Extension built cleanly in extension/dist/\n");
} catch (err) {
  console.error("[Extension Build] ERROR:", err);
  process.exit(1);
}
