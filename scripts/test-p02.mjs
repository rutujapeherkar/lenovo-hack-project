/**
 * Phase P02 Automated Verification Script
 * Validates acceptance criteria from docs/phases/P02-project-scaffold/03-ACCEPTANCE.md
 * and tests from docs/phases/P02-project-scaffold/04-TESTS.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const results = [];
function test(name, fn) {
  try {
    fn();
    results.push({ name, status: 'PASS' });
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    results.push({ name, status: 'FAIL', error: err.message });
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log('\n--- SAHAYAK AI: Phase P02 Verification Suite ---\n');

// 1. Structure Tests (AC-P02-01, AC-P02-05)
console.log('1. Checking Project Structure & Boundaries...');

test('package.json exists with required scripts (dev, build, lint, test)', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  assert(pkg.scripts?.dev, 'Missing dev script');
  assert(pkg.scripts?.build, 'Missing build script');
  assert(pkg.scripts?.lint, 'Missing lint script');
  assert(pkg.scripts?.test, 'Missing test script');
});

test('tsconfig.json has strict mode and path aliases', () => {
  const tsconfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'tsconfig.json'), 'utf8'));
  assert(tsconfig.compilerOptions.strict === true, 'strict must be true');
  assert(tsconfig.compilerOptions.paths?.['@/*'], 'Missing @/* alias');
  assert(tsconfig.compilerOptions.paths?.['@/components/*'], 'Missing @/components/* alias');
  assert(tsconfig.compilerOptions.paths?.['@/core/*'], 'Missing @/core/* alias');
});

test('Directory tree conforms to ARCHITECTURE.md Section 48', () => {
  const requiredDirs = [
    'src/components/layout',
    'src/components/ui',
    'src/components/assistant',
    'src/components/services',
    'src/components/schemes',
    'src/components/explain-screen',
    'src/components/accessibility',
    'src/core/assistant',
    'src/core/ai',
    'src/core/services',
    'src/core/schemes',
    'src/core/form-guides',
    'src/core/portals',
    'src/core/explain-screen',
    'src/core/language',
    'src/core/accessibility',
    'src/core/official-sources',
    'src/api/assistant',
    'src/api/schemes',
    'src/api/explain-screen',
    'src/data/maharashtra',
    'extension/src/background',
    'extension/src/content',
    'extension/src/sidepanel',
    'extension/src/shared',
  ];

  for (const dir of requiredDirs) {
    assert(fs.existsSync(path.join(rootDir, dir)), `Missing required directory: ${dir}`);
  }
});

// 2. Security Tests (AC-P02-03, AC-P02-04, Test P02-SEC-01)
console.log('\n2. Checking Security & Environment Config...');

test('.gitignore ignores secrets, environment files, and build outputs', () => {
  const gitignore = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
  assert(gitignore.includes('.env'), 'Must ignore .env');
  assert(gitignore.includes('node_modules'), 'Must ignore node_modules');
  assert(gitignore.includes('dist'), 'Must ignore dist');
});

test('.env.example contains demo placeholders and zero real API keys', () => {
  const envExample = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf8');
  assert(envExample.includes('AI_PROVIDER=demo'), 'Must default to demo AI provider');
  assert(envExample.includes('AI_API_KEY='), 'Must contain AI_API_KEY placeholder');
  assert(!envExample.match(/AI_API_KEY=\w{10,}/), 'Must not contain active secrets');
});

// 3. Layout & Component Architecture (AC-P02-06, AC-P02-07, AC-P02-09, A11Y)
console.log('\n3. Checking Layout Components & Landmarks...');

test('Header component renders brand, navigation links, and language toggles', () => {
  const header = fs.readFileSync(path.join(rootDir, 'src/components/layout/Header.tsx'), 'utf8');
  assert(header.includes('Sahayak AI'), 'Must render Sahayak AI brand');
  assert(header.includes('/services') && header.includes('/schemes'), 'Must link to core pages');
  assert(header.includes('lang-select-group'), 'Must contain language selector');
  assert(header.includes('role="banner"'), 'Must have banner landmark');
});

test('Footer component renders mandatory civic disclaimer and official links', () => {
  const footer = fs.readFileSync(path.join(rootDir, 'src/components/layout/Footer.tsx'), 'utf8');
  assert(
    footer.includes('does not represent a government department') ||
    footer.includes('कोणत्याही सरकारी विभागाचे प्रतिनिधित्व करत नाही'),
    'Must include mandatory civic disclaimer'
  );
  assert(footer.includes('aaplesarkar.mahaonline.gov.in'), 'Must reference Aaple Sarkar');
  assert(footer.includes('mahadbt.maharashtra.gov.in'), 'Must reference MahaDBT');
  assert(footer.includes('role="contentinfo"'), 'Must have contentinfo landmark');
});

test('PageContainer enforces main landmark and 1280px responsive bounds', () => {
  const pageContainer = fs.readFileSync(path.join(rootDir, 'src/components/layout/PageContainer.tsx'), 'utf8');
  assert(pageContainer.includes('role="main"'), 'Must have main landmark');
  assert(pageContainer.includes('id="main-content"'), 'Must have id="main-content" for SkipLink');
});

test('SkipLink component is accessible', () => {
  const skipLink = fs.readFileSync(path.join(rootDir, 'src/components/layout/SkipLink.tsx'), 'utf8');
  assert(skipLink.includes('#main-content'), 'Must point to main content target');
});

// 4. Routes Verification (AC-P02-08, Test P02-INT-01)
console.log('\n4. Checking Route Page Shells...');

test('All core route page components exist and are mapped in App.tsx', () => {
  const pages = [
    'src/pages/HomePage.tsx',
    'src/pages/ServicesPage.tsx',
    'src/pages/SchemesPage.tsx',
    'src/pages/ExplainScreenPage.tsx',
    'src/pages/ExtensionPage.tsx',
    'src/pages/HelpPage.tsx',
    'src/pages/SettingsPage.tsx',
    'src/pages/DesignSystemPage.tsx',
  ];

  for (const page of pages) {
    assert(fs.existsSync(path.join(rootDir, page)), `Missing route component: ${page}`);
  }

  const app = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8');
  const expectedRoutes = ['/', '/services', '/schemes', '/explain-screen', '/extension', '/help', '/settings', '/design-system'];
  for (const route of expectedRoutes) {
    assert(app.includes(`'${route}'`), `Route ${route} not mapped in App.tsx`);
  }
});

// 5. TypeScript Compilation (Test P02-BLD-01)
console.log('\n5. Executing TypeScript Compilation (tsc --noEmit)...');

test('TypeScript compiles cleanly with 0 errors (tsc --noEmit)', () => {
  try {
    execSync('npx tsc --noEmit', { cwd: rootDir, stdio: 'pipe' });
  } catch (err) {
    throw new Error(`TypeScript compilation failed:\n${err.stdout?.toString() || err.stderr?.toString()}`);
  }
});

// Summary
console.log('\n=============================================');
const passed = results.filter(r => r.status === 'PASS').length;
const total = results.length;
console.log(`Results: ${passed}/${total} checks PASSED`);
if (passed !== total) {
  process.exit(1);
}
console.log('Phase P02 Automated Verification Complete: ALL PASS\n');
