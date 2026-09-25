/**
 * Phase P05 Automated Verification Script
 * Validates acceptance criteria from docs/phases/P05-services-task-guidance/03-ACCEPTANCE.md
 * and tests from docs/phases/P05-services-task-guidance/04-TESTS.md.
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

console.log('\n--- SAHAYAK AI: Phase P05 Verification Suite ---\n');

async function runTests() {
  // 1. Architecture & Module Structure
  console.log('1. Checking Services & Task Guidance Module Architecture...');

  await test('AC-P05-01: Core services files exist with clean domain boundaries', () => {
    assert(fs.existsSync(path.join(rootDir, 'src/core/services/service-repository.ts')), 'Missing service-repository.ts');
    assert(fs.existsSync(path.join(rootDir, 'src/core/services/task-service.ts')), 'Missing task-service.ts');
    assert(fs.existsSync(path.join(rootDir, 'src/core/services/index.ts')), 'Missing core/services/index.ts');
    assert(fs.existsSync(path.join(rootDir, 'src/core/language/language-context.tsx')), 'Missing language-context.tsx');
  });

  await test('AC-P05-03 & AC-P05-04: UI components exist in components/services', () => {
    assert(fs.existsSync(path.join(rootDir, 'src/components/services/ServiceCard.tsx')), 'Missing ServiceCard.tsx');
    assert(fs.existsSync(path.join(rootDir, 'src/components/services/DocumentChecklist.tsx')), 'Missing DocumentChecklist.tsx');
    assert(fs.existsSync(path.join(rootDir, 'src/components/services/TaskJourney.tsx')), 'Missing TaskJourney.tsx');
    assert(fs.existsSync(path.join(rootDir, 'src/components/services/ServiceDetails.tsx')), 'Missing ServiceDetails.tsx');
    assert(fs.existsSync(path.join(rootDir, 'src/components/services/index.ts')), 'Missing components/services/index.ts');
  });

  // 2. Service Discovery & Search (Test P05-SRV-01, AC-P05-01, AC-P05-02)
  console.log('\n2. Testing Service Discovery & Multilingual Keyword Search...');

  const { ServiceRepository } = await import('../src/core/services/service-repository.ts');

  await test('Test P05-SRV-01: ServiceRepository.searchServices("income") returns Income Certificate', () => {
    const results = ServiceRepository.searchServices('income');
    assert(results.length >= 1, 'Expected at least 1 service matching "income"');
    const incomeCert = results.find(s => s.id === 'income-certificate');
    assert(incomeCert !== undefined, 'Expected "income-certificate" in search results');
    assert(incomeCert.name.en === 'Income Certificate', 'Expected Income Certificate English name');
  });

  await test('AC-P05-02: Multilingual search in Marathi ("उत्पन्न", "दाखला") and Hindi ("आय")', () => {
    const mrResults = ServiceRepository.searchServices('उत्पन्न');
    assert(mrResults.some(s => s.id === 'income-certificate'), 'Marathi search for "उत्पन्न" failed to find income certificate');

    const hiResults = ServiceRepository.searchServices('आय प्रमाण पत्र');
    assert(hiResults.some(s => s.id === 'income-certificate'), 'Hindi search for "आय प्रमाण पत्र" failed to find income certificate');

    const domicileMr = ServiceRepository.searchServices('अधिवास');
    assert(domicileMr.some(s => s.id === 'domicile-certificate'), 'Marathi search for "अधिवास" failed to find domicile certificate');

    const rationHi = ServiceRepository.searchServices('राशन');
    assert(rationHi.some(s => s.id === 'ration-card-member-addition'), 'Hindi search for "राशन" failed to find ration card service');
  });

  await test('AC-P05-02: Service categories query and filtering', () => {
    const categories = ServiceRepository.getCategories();
    assert(categories.includes('Revenue & Citizen Certificates'), 'Missing Revenue & Citizen Certificates category');
    assert(categories.includes('Food, Civil Supplies & Consumer Protection'), 'Missing Food, Civil Supplies & Consumer Protection category');

    const revenueServices = ServiceRepository.filterByCategory('Revenue & Citizen Certificates');
    assert(revenueServices.length >= 2, 'Expected at least 2 revenue services');
    assert(revenueServices.every(s => s.category === 'Revenue & Citizen Certificates'), 'Category filter leaked services');
  });

  await test('Anti-Hallucination: Search with unknown query returns 0 items without inventing data', () => {
    const unknown = ServiceRepository.searchServices('nonexistent_random_service_xyz999');
    assert(unknown.length === 0, 'Must return empty array for unknown query');
  });

  // 3. Deterministic Task Guidance State Transitions (Test P05-TSK-01, AC-P05-05, AC-P05-06)
  console.log('\n3. Testing Deterministic Task Guidance State Transitions...');

  const { TaskService } = await import('../src/core/services/task-service.ts');
  const service = ServiceRepository.getServiceById('income-certificate');
  assert(service !== undefined, 'income-certificate must exist');

  await test('Test P05-TSK-01: TaskService.initializeTask and sequential advanceStep', () => {
    const steps = service.steps;
    assert(steps.length === 6, `Expected 6 steps for income-certificate, got ${steps.length}`);

    // Step 1: Initialize
    let task = TaskService.initializeTask(service.id);
    assert(task.serviceId === 'income-certificate', 'Task serviceId mismatch');
    assert(task.currentStepId === steps[0].id, `Expected currentStepId to be ${steps[0].id}`);
    assert(task.completedStepIds.length === 0, 'completedStepIds should start empty');
    assert(TaskService.getStepStatus(steps[0].id, task) === 'current', 'Step 1 should be current');
    assert(TaskService.getStepStatus(steps[1].id, task) === 'upcoming', 'Step 2 should be upcoming');

    // Step 2: Advance to step 2
    task = TaskService.advanceStep(task, steps);
    assert(task.currentStepId === steps[1].id, `Expected currentStepId to advance to ${steps[1].id}, got ${task.currentStepId}`);
    assert(task.completedStepIds.includes(steps[0].id), 'Step 1 must be marked completed');
    assert(TaskService.getStepStatus(steps[0].id, task) === 'completed', 'Step 1 status must be completed');
    assert(TaskService.getStepStatus(steps[1].id, task) === 'current', 'Step 2 status must be current');
    assert(TaskService.getStepStatus(steps[2].id, task) === 'upcoming', 'Step 3 status must be upcoming');

    // Step 3: Advance through remaining steps
    for (let i = 2; i < steps.length; i++) {
      task = TaskService.advanceStep(task, steps);
      assert(task.currentStepId === steps[i].id, `Step index ${i} currentStepId mismatch`);
      assert(task.completedStepIds.includes(steps[i - 1].id), `Step ${i - 1} not completed`);
    }

    // Step 4: Advance on final step marks all completed
    task = TaskService.advanceStep(task, steps);
    assert(TaskService.isTaskCompleted(task, steps), 'isTaskCompleted must be true after completing last step');
  });

  await test('AC-P05-05: TaskService.previousStep moves backwards without losing state', () => {
    const steps = service.steps;
    let task = TaskService.initializeTask(service.id);
    task = TaskService.advanceStep(task, steps); // at step 2
    assert(task.currentStepId === steps[1].id, 'Should be at step 2');

    task = TaskService.previousStep(task, steps); // move back to step 1
    assert(task.currentStepId === steps[0].id, 'Should have moved back to step 1');

    // Previous on step 1 remains on step 1
    task = TaskService.previousStep(task, steps);
    assert(task.currentStepId === steps[0].id, 'Should remain on step 1');
  });

  // 4. Accessibility & UI Invariants (Test P05-A11Y-01, AC-P05-07)
  console.log('\n4. Checking Accessibility & UI Invariants...');

  await test('Test P05-A11Y-01: TaskJourney markup contains aria-current="step" on active step', () => {
    const taskJourneyCode = fs.readFileSync(path.join(rootDir, 'src/components/services/TaskJourney.tsx'), 'utf8');
    assert(taskJourneyCode.includes('aria-current={isCurrent ? "step" : undefined}'), 'Missing aria-current="step" on active step button');
    assert(taskJourneyCode.includes('aria-label='), 'Missing aria-label attributes for assistive technology');
  });

  await test('AC-P05-07: DocumentChecklist provides interactive checkboxes with labels & storage', () => {
    const checklistCode = fs.readFileSync(path.join(rootDir, 'src/components/services/DocumentChecklist.tsx'), 'utf8');
    assert(checklistCode.includes('type="checkbox"'), 'Missing checkbox inputs');
    assert(checklistCode.includes('<label'), 'Missing accessible label element');
    assert(checklistCode.includes('htmlFor={checkboxId}'), 'Missing label htmlFor binding');
    assert(checklistCode.includes('sessionStorage'), 'Missing session persistence for checklist state');
  });

  // 5. Official Source & Security Invariants (Test P05-SEC-01, AC-P05-08, AC-P05-10)
  console.log('\n5. Checking Official Source Links & Security Invariants...');

  await test('Test P05-SEC-01 & AC-P05-08: Official outbound links have target="_blank" and rel="noopener noreferrer"', () => {
    const detailsCode = fs.readFileSync(path.join(rootDir, 'src/components/services/ServiceDetails.tsx'), 'utf8');
    assert(detailsCode.includes('target="_blank"'), 'Must specify target="_blank" for external government links');
    assert(detailsCode.includes('rel="noopener noreferrer"'), 'Must specify rel="noopener noreferrer" on outbound links');
    assert(!detailsCode.includes('target="_self"'), 'External links must not open in same window');
  });

  await test('AC-P05-10: Zero automated form submissions or autofill in services code', () => {
    const servicesPageCode = fs.readFileSync(path.join(rootDir, 'src/pages/ServicesPage.tsx'), 'utf8');
    const taskServiceCode = fs.readFileSync(path.join(rootDir, 'src/core/services/task-service.ts'), 'utf8');
    assert(!servicesPageCode.includes('form.submit') && !servicesPageCode.includes('postMessage'), 'ServicesPage must not perform automated submission');
    assert(!taskServiceCode.includes('form.submit') && !taskServiceCode.includes('XMLHttpRequest'), 'TaskService must not submit government forms');
    assert(!taskServiceCode.includes('password') && !taskServiceCode.includes('otp'), 'TaskService must not handle passwords or OTPs');
  });

  // 6. Multilingual Parity & Data Verification (Test P05-MAN-01, AC-P05-09)
  console.log('\n6. Checking Multilingual Parity (en, mr, hi)...');

  const { UI_TRANSLATIONS } = await import('../src/core/language/language-context.tsx');

  await test('Test P05-MAN-01 & AC-P05-09: All UI translation keys have complete en, mr, and hi values', () => {
    const languages = ['en', 'mr', 'hi'];
    for (const [key, trans] of Object.entries(UI_TRANSLATIONS)) {
      for (const lang of languages) {
        const val = trans[lang];
        assert(typeof val === 'string' && val.trim().length > 0, `Missing translation for key "${key}" in language "${lang}"`);
        assert(!val.includes('translation here'), `Placeholder detected in key "${key}" for language "${lang}"`);
      }
    }
  });

  await test('AC-P05-09: Verified services dataset contains complete en, mr, and hi strings for all steps', () => {
    const services = ServiceRepository.getAllServices();
    assert(services.length >= 5, 'Expected at least 5 verified services');

    for (const s of services) {
      assert(s.name.en && s.name.mr && s.name.hi, `Service ${s.id} missing localized names`);
      assert(s.description.en && s.description.mr && s.description.hi, `Service ${s.id} missing localized descriptions`);
      assert(s.steps.length > 0, `Service ${s.id} has 0 steps`);

      for (const step of s.steps) {
        assert(step.title.en && step.title.mr && step.title.hi, `Step ${step.id} missing localized titles`);
        assert(step.description.en && step.description.mr && step.description.hi, `Step ${step.id} missing localized descriptions`);
      }
    }
  });

  // 7. Routing & Integration
  console.log('\n7. Checking Router & Application Shell Integration...');

  await test('AC-P05-03: App.tsx handles /services and /services/:id routing', () => {
    const appCode = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8');
    assert(appCode.includes("path === '/services' || path.startsWith('/services/')"), 'App.tsx must route /services and /services/:id to ServicesPage');
    assert(appCode.includes('<LanguageProvider>'), 'App.tsx must provide LanguageProvider');
  });

  console.log('\n=============================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`Results: ${passed}/${results.length} checks PASSED`);
  if (failed > 0) {
    console.error(`Verification FAILED with ${failed} errors.`);
    process.exit(1);
  } else {
    console.log('Phase P05 Automated Verification Complete: ALL PASS\n');
  }
}

runTests().catch((err) => {
  console.error('Fatal test suite error:', err);
  process.exit(1);
});
