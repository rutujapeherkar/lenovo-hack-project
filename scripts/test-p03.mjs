/**
 * Phase P03 Automated Verification Script
 * Validates acceptance criteria from docs/phases/P03-shared-contracts-data/03-ACCEPTANCE.md
 * and tests from docs/phases/P03-shared-contracts-data/04-TESTS.md.
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

console.log('\n--- SAHAYAK AI: Phase P03 Verification Suite ---\n');

// 1. Shared Types & Canonical Contracts (AC-P03-01, AC-P03-02, AC-P03-03, AC-P03-04)
console.log('1. Checking Canonical Types in src/core/shared/types.ts...');

const typesFile = fs.readFileSync(path.join(rootDir, 'src/core/shared/types.ts'), 'utf8');

test('AC-P03-01: types.ts exports all 23 frozen canonical contracts', () => {
  const contracts = [
    'Language',
    'LocalizedText',
    'OfficialSource',
    'SchemeSource',
    'TaskStep',
    'Service',
    'Scheme',
    'Portal',
    'PortalMatch',
    'PageContext',
    'FormGuide',
    'FormPage',
    'FormField',
    'AssistantRequest',
    'Intent',
    'SahayakResponse',
    'AIProvider',
    'ScreenExplanation',
    'ScreenElement',
    'AccessibilityPreferences',
    'GuidanceMode',
    'CurrentTask',
    'ExtensionMessage',
  ];

  for (const contract of contracts) {
    assert(
      typesFile.includes(`type ${contract}`) || typesFile.includes(`interface ${contract}`),
      `Missing canonical contract: ${contract}`
    );
  }
});

test('AC-P03-02: Language type strictly enforces "en" | "mr" | "hi"', () => {
  assert(
    typesFile.includes('export type Language = "en" | "mr" | "hi";') ||
    typesFile.includes("export type Language = 'en' | 'mr' | 'hi';"),
    'Language type not strictly defined as "en" | "mr" | "hi"'
  );
});

test('AC-P03-03: LocalizedText enforces { en: string; mr: string; hi: string; }', () => {
  assert(typesFile.includes('en: string;'), 'LocalizedText missing en');
  assert(typesFile.includes('mr: string;'), 'LocalizedText missing mr');
  assert(typesFile.includes('hi: string;'), 'LocalizedText missing hi');
});

test('AC-P03-04: OfficialSource contains name, url, and lastVerified', () => {
  assert(typesFile.includes('name: string;'), 'OfficialSource missing name');
  assert(typesFile.includes('url: string;'), 'OfficialSource missing url');
  assert(typesFile.includes('lastVerified'), 'OfficialSource missing lastVerified');
});

// 2. Verified Datasets (AC-P03-05, AC-P03-06, AC-P03-07, AC-P03-08)
console.log('\n2. Checking Verified Civic Datasets...');

const portals = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/maharashtra/portals.json'), 'utf8'));
const services = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/maharashtra/services.json'), 'utf8'));
const schemes = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/maharashtra/schemes.json'), 'utf8'));

test('AC-P03-05: portals.json defines Aaple Sarkar, MahaDBT, RCMS, and Divyang Sahayak', () => {
  const portalIds = portals.map(p => p.id);
  assert(portalIds.includes('aaple-sarkar'), 'Missing aaple-sarkar');
  assert(portalIds.includes('mahadbt'), 'Missing mahadbt');
  assert(portalIds.includes('rcms-maharashtra'), 'Missing rcms-maharashtra');
  assert(portalIds.includes('divyang-sahayak'), 'Missing divyang-sahayak');
  assert(portals.length >= 4, 'Insufficient portals count');
});

test('AC-P03-06: services.json contains Income & Domicile certificates with trilingual steps', () => {
  const serviceIds = services.map(s => s.id);
  assert(serviceIds.includes('income-certificate'), 'Missing income-certificate');
  assert(serviceIds.includes('domicile-certificate'), 'Missing domicile-certificate');

  for (const s of services) {
    assert(s.name.en && s.name.mr && s.name.hi, `Service ${s.id} missing localized names`);
    assert(s.description.en && s.description.mr && s.description.hi, `Service ${s.id} missing localized description`);
    assert(Array.isArray(s.steps) && s.steps.length > 0, `Service ${s.id} has no steps`);
    for (const st of s.steps) {
      assert(st.title.en && st.title.mr && st.title.hi, `Service ${s.id} step ${st.id} missing localized title`);
      assert(st.description.en && st.description.mr && st.description.hi, `Service ${s.id} step ${st.id} missing localized description`);
    }
  }
});

test('AC-P03-07: schemes.json contains structured entries with eligibility, benefits, and officialSource', () => {
  assert(schemes.length >= 4, 'Insufficient schemes count');
  for (const sc of schemes) {
    assert(sc.name.en && sc.name.mr && sc.name.hi, `Scheme ${sc.id} missing localized name`);
    assert(Array.isArray(sc.eligibility) && sc.eligibility.length > 0, `Scheme ${sc.id} missing eligibility`);
    assert(Array.isArray(sc.benefits) && sc.benefits.length > 0, `Scheme ${sc.id} missing benefits`);
    assert(sc.officialSource && sc.officialSource.url, `Scheme ${sc.id} missing officialSource`);
  }
});

test('AC-P03-08: All URLs start with HTTPS and authentic government domains', () => {
  const APPROVED_DOMAINS = ['.gov.in', '.nic.in', '.mahaonline.gov.in', '.eci.gov.in', '.maharashtra.gov.in', '.mahafood.gov.in'];

  function validateUrl(u, ctx) {
    const parsed = new URL(u);
    assert(parsed.protocol === 'https:', `${ctx} URL ${u} is not HTTPS`);
    const h = parsed.hostname.toLowerCase();
    const ok = APPROVED_DOMAINS.some(d => h.endsWith(d) || h === d.replace(/^\./, ''));
    assert(ok, `${ctx} domain ${h} not in approved government list`);
  }

  for (const s of services) {
    validateUrl(s.officialSource.url, `Service ${s.id}`);
  }
  for (const sc of schemes) {
    validateUrl(sc.officialSource.url, `Scheme ${sc.id}`);
  }
  for (const p of portals) {
    const ok = APPROVED_DOMAINS.some(d => p.domain.endsWith(d) || p.domain === d.replace(/^\./, ''));
    assert(ok, `Portal domain ${p.domain} not in approved list`);
  }
});

// 3. Modularity & Zero Duplication (AC-P03-09)
console.log('\n3. Checking Modularity & Zero Duplicate Contracts...');

test('AC-P03-09: Zero duplicate copies of Service, Scheme, or TaskStep exist in feature folders', () => {
  const disallowedFiles = [
    'src/components/services/types.ts',
    'src/components/schemes/types.ts',
    'src/api/services/types.ts',
    'src/api/schemes/types.ts',
    'extension/src/types.ts',
  ];
  for (const f of disallowedFiles) {
    assert(!fs.existsSync(path.join(rootDir, f)), `Disallowed duplicate contract file found: ${f}`);
  }
});

// 4. Security Checks (Test P03-SEC-01)
console.log('\n4. Checking Security Invariants...');

test('Test P03-SEC-01: Zero sensitive credential fields in types.ts', () => {
  const sensitiveKeywords = ['otp', 'pin', 'password', 'cvv', 'bankcredential', 'atmpin', 'upipin'];
  for (const kw of sensitiveKeywords) {
    const rx = new RegExp(`\\b${kw}\\b`, 'i');
    assert(!rx.test(typesFile), `Prohibited sensitive keyword found in types.ts: ${kw}`);
  }
});

// 5. TypeScript Compilation & Runtime Loaders (AC-P03-10, P03-BLD)
console.log('\n5. Executing TypeScript Compilation...');

test('AC-P03-10: TypeScript compiles cleanly with 0 errors (tsc --noEmit)', () => {
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
console.log('Phase P03 Automated Verification Complete: ALL PASS\n');
