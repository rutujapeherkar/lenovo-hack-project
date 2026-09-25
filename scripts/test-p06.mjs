/**
 * Phase P06 Automated Verification Script
 * Validates acceptance criteria from docs/phases/P06-scheme-finder/03-ACCEPTANCE.md
 * and tests from docs/phases/P06-scheme-finder/04-TESTS.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const results = [];
async function test(name, fn) {
  try {
    await fn();
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

console.log('\n--- SAHAYAK AI: Phase P06 Verification Suite ---\n');

async function runTests() {
  // 1. Module Structure & Architecture
  console.log('1. Checking Scheme Finder Module Architecture & Boundaries...');

  await test('AC-P06-01: Core scheme files exist with clean domain boundaries', () => {
    assert(fs.existsSync(path.join(rootDir, 'src/core/schemes/scheme-repository.ts')), 'Missing scheme-repository.ts');
    assert(fs.existsSync(path.join(rootDir, 'src/core/schemes/scheme-service.ts')), 'Missing scheme-service.ts');
    assert(fs.existsSync(path.join(rootDir, 'src/core/schemes/index.ts')), 'Missing core/schemes/index.ts');
  });

  await test('AC-P06-04, AC-P06-06 & AC-P06-07: UI components exist in components/schemes', () => {
    assert(fs.existsSync(path.join(rootDir, 'src/components/schemes/SchemeCard.tsx')), 'Missing SchemeCard.tsx');
    assert(fs.existsSync(path.join(rootDir, 'src/components/schemes/EligibilityList.tsx')), 'Missing EligibilityList.tsx');
    assert(fs.existsSync(path.join(rootDir, 'src/components/schemes/OfficialSourceBox.tsx')), 'Missing OfficialSourceBox.tsx');
    assert(fs.existsSync(path.join(rootDir, 'src/components/schemes/SchemeDetails.tsx')), 'Missing SchemeDetails.tsx');
    assert(fs.existsSync(path.join(rootDir, 'src/components/schemes/index.ts')), 'Missing components/schemes/index.ts');
  });

  // 2. Unit Tests: SchemeRepository (Test P06-SCH-01, Test P06-SCH-02)
  console.log('\n2. Testing Scheme Repository, Category Filtering & Multilingual Search...');

  const { SchemeRepository } = await import('../src/core/schemes/scheme-repository.ts');
  const allSchemes = SchemeRepository.getAllSchemes();
  assert(allSchemes.length >= 6, `Expected at least 6 verified schemes, got ${allSchemes.length}`);

  await test('Test P06-SCH-01: SchemeRepository.filterByCategory("education")', () => {
    const educationSchemes = SchemeRepository.filterByCategory('education');
    assert(educationSchemes.length >= 1, 'Expected at least 1 education scheme');
    assert(
      educationSchemes.every(s => s.category.toLowerCase().includes('education')),
      'All returned schemes must belong to an education category'
    );
    assert(
      educationSchemes.some(s => s.id === 'rcsms-shikshan-shulkh-shishyavrutti'),
      'Rajarshi Shahu Maharaj scheme must be returned'
    );
  });

  await test('Test P06-SCH-02: Keyword search for "divyang" and "अपंग"', () => {
    const divyangResults = SchemeRepository.searchSchemes('divyang');
    assert(divyangResults.length >= 1, 'Search for "divyang" must return results');
    assert(
      divyangResults.some(s => s.id === 'divyang-self-employment-assistance'),
      'Divyang self-employment assistance scheme must be returned for "divyang"'
    );

    const mrResults = SchemeRepository.searchSchemes('अपंग');
    assert(mrResults.length >= 1, 'Search for "अपंग" must return results');
    assert(
      mrResults.some(s => s.id === 'sanjay-gandhi-niradhar-yojna' || s.id === 'divyang-self-employment-assistance'),
      'Disability schemes must be returned for "अपंग"'
    );
  });

  await test('AC-P06-03: Multilingual keyword and natural-language search across English, Marathi, Hindi', () => {
    // English: scholarship
    const scholarshipResults = SchemeRepository.searchSchemes('scholarship');
    assert(scholarshipResults.some(s => s.id === 'rcsms-shikshan-shulkh-shishyavrutti'), 'Search "scholarship" failed');

    // Marathi: लाडकी बहीण
    const ladkiResults = SchemeRepository.searchSchemes('लाडकी बहीण');
    assert(ladkiResults.some(s => s.id === 'majhi-ladki-bahin-yojna'), 'Search "लाडकी बहीण" failed');

    // Hindi: किसान
    const kisanResults = SchemeRepository.searchSchemes('किसान');
    assert(kisanResults.some(s => s.id === 'pm-kisan-maharashtra'), 'Search "किसान" failed');

    // Marathi: श्रावणबाळ पेन्शन
    const shravanbalResults = SchemeRepository.searchSchemes('श्रावणबाळ');
    assert(shravanbalResults.some(s => s.id === 'shravanbal-sewa-nivruttivetan'), 'Search "श्रावणबाळ" failed');
  });

  await test('AC-P06-09: Anti-Hallucination: Search with unknown query returns 0 schemes without fabricating data', () => {
    const unknown = SchemeRepository.searchSchemes('nonexistent_synthetic_scheme_xyz123');
    assert(unknown.length === 0, 'Must return empty array for non-existent scheme');
  });

  // 3. Scheme Service & Grounded AI Simplification
  console.log('\n3. Testing Scheme Service & Grounded AI Simplification...');

  const { SchemeService } = await import('../src/core/schemes/scheme-service.ts');
  const targetScheme = SchemeRepository.getSchemeById('majhi-ladki-bahin-yojna');
  assert(targetScheme !== undefined, 'majhi-ladki-bahin-yojna must exist');

  await test('SchemeService.explainScheme produces grounded explanation in requested language', async () => {
    const mrExplanation = await SchemeService.explainScheme(targetScheme, 'mr');
    assert(typeof mrExplanation === 'string' && mrExplanation.length > 20, 'Expected non-empty Marathi explanation');
    assert(!mrExplanation.includes('synthetic'), 'Must not contain synthetic placeholder');

    const enExplanation = await SchemeService.explainScheme(targetScheme, 'en');
    assert(typeof enExplanation === 'string' && enExplanation.length > 20, 'Expected non-empty English explanation');
  });

  // 4. Multilingual Rendering & Text Integrity (Test P06-LANG-01, AC-P06-10)
  console.log('\n4. Checking Multilingual Rendering (Test P06-LANG-01, AC-P06-10)...');

  await test('Test P06-LANG-01: Marathi scheme title renders correctly without placeholder text', () => {
    const rcsms = SchemeRepository.getSchemeById('rcsms-shikshan-shulkh-shishyavrutti');
    assert(rcsms !== undefined, 'rcsms scheme must exist');
    assert(
      rcsms.name.mr === 'राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना (ईबीसी)',
      'Marathi scheme title mismatch'
    );
    assert(rcsms.name.hi.length > 0, 'Missing Hindi scheme title');
    assert(rcsms.name.en.length > 0, 'Missing English scheme title');
  });

  await test('AC-P06-10: All verified schemes have non-empty en, mr, and hi names, eligibility, and benefits', () => {
    for (const scheme of allSchemes) {
      assert(scheme.name.en && scheme.name.mr && scheme.name.hi, `Scheme ${scheme.id} missing localized names`);
      assert(scheme.eligibility.length > 0, `Scheme ${scheme.id} has 0 eligibility items`);
      assert(scheme.benefits.length > 0, `Scheme ${scheme.id} has 0 benefits`);
      assert(scheme.documents.length > 0, `Scheme ${scheme.id} has 0 documents`);
      assert(scheme.state === 'Maharashtra', `Scheme ${scheme.id} must be scoped to Maharashtra`);
    }
  });

  // 5. Official Source, Outbound URLs & Security (Test P06-MAN-01, Test P06-SEC-01, AC-P06-07)
  console.log('\n5. Checking Official Source Links & Security Invariants (Test P06-SEC-01)...');

  await test('Test P06-SEC-01: Every URL in verified scheme registry matches authentic government domain with HTTPS', () => {
    const authenticDomains = [
      'mahadbt.maharashtra.gov.in',
      'sjsa.maharashtra.gov.in',
      'www.maharashtra.gov.in',
      'pmkisan.gov.in',
      'divyangsahayak.maharashtra.gov.in',
    ];

    for (const scheme of allSchemes) {
      const url = scheme.officialSource.url;
      assert(url.startsWith('https://'), `Scheme ${scheme.id} URL must use HTTPS: ${url}`);
      const parsed = new URL(url);
      assert(
        authenticDomains.some(d => parsed.hostname === d || parsed.hostname.endsWith('.gov.in')),
        `Scheme ${scheme.id} URL is not an authentic government domain: ${url}`
      );
    }
  });

  await test('Test P06-MAN-01 & AC-P06-07: MahaDBT scholarship official source points to authentic domain', () => {
    const rcsms = SchemeRepository.getSchemeById('rcsms-shikshan-shulkh-shishyavrutti');
    assert(rcsms.officialSource.url.includes('mahadbt.maharashtra.gov.in'), 'MahaDBT URL mismatch');
  });

  await test('AC-P06-07 & Test P06-SEC-01: Official outbound links in UI have target="_blank" and rel="noopener noreferrer"', () => {
    const sourceBoxCode = fs.readFileSync(path.join(rootDir, 'src/components/schemes/OfficialSourceBox.tsx'), 'utf8');
    assert(sourceBoxCode.includes('target="_blank"'), 'Must specify target="_blank" on outbound links');
    assert(sourceBoxCode.includes('rel="noopener noreferrer"'), 'Must specify rel="noopener noreferrer" on outbound links');

    const detailsCode = fs.readFileSync(path.join(rootDir, 'src/components/schemes/SchemeDetails.tsx'), 'utf8');
    assert(detailsCode.includes('target="_blank"'), 'Must specify target="_blank" on outbound links in SchemeDetails');
    assert(detailsCode.includes('rel="noopener noreferrer"'), 'Must specify rel="noopener noreferrer" on outbound links in SchemeDetails');
  });

  // 6. Router & Application Shell Integration (AC-P06-05, AC-P06-08)
  console.log('\n6. Checking Router & Application Shell Integration...');

  await test('AC-P06-05: App.tsx handles /schemes and /schemes/:id routing', () => {
    const appCode = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8');
    assert(appCode.includes("path === '/schemes' || path.startsWith('/schemes/')"), 'App.tsx must route /schemes and /schemes/:id to SchemesPage');
  });

  await test('AC-P06-08: SchemesPage provides empty state with links to myScheme and MahaDBT', () => {
    const schemesPageCode = fs.readFileSync(path.join(rootDir, 'src/pages/SchemesPage.tsx'), 'utf8');
    assert(schemesPageCode.includes('https://www.myscheme.gov.in/'), 'Empty state must provide link to myScheme');
    assert(schemesPageCode.includes('https://mahadbt.maharashtra.gov.in/'), 'Empty state must provide link to MahaDBT');
  });

  console.log('\n=============================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`Results: ${passed}/${results.length} checks PASSED`);
  if (failed > 0) {
    console.error(`Verification FAILED with ${failed} errors.`);
    process.exit(1);
  } else {
    console.log('Phase P06 Automated Verification Complete: ALL PASS\n');
  }
}

runTests().catch((err) => {
  console.error('Fatal test suite error:', err);
  process.exit(1);
});
