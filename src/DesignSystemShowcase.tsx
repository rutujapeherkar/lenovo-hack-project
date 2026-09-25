import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, CardFooter, Badge, Alert, Container } from './components/ui';

export const DesignSystemShowcase: React.FC = () => {
  // Accessibility state
  const [contrast, setContrast] = useState<'standard' | 'high'>('standard');
  const [textScale, setTextScale] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'mr' | 'hi'>('en');

  // Input states
  const [sampleInput, setSampleInput] = useState('John Doe / जॉन डो');
  const [errorInput, setErrorInput] = useState('');
  const [micState, setMicState] = useState<'idle' | 'listening' | 'processing' | 'unavailable'>('idle');

  // Apply to document root for real-time live preview
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-contrast', contrast);
    root.setAttribute('data-text-scale', textScale);
    root.setAttribute('data-motion', reducedMotion ? 'reduced' : 'standard');
    root.setAttribute('lang', language);
  }, [contrast, textScale, reducedMotion, language]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      {/* Top Banner / Announcement */}
      <div style={{ backgroundColor: 'var(--sahayak-blue-dark)', color: 'var(--text-inverse)', padding: 'var(--space-2) 0', fontSize: 'var(--font-size-sm)' }}>
        <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>महाराष्ट्र शासन अधिकृत सेवा मार्गदर्शक — डिझाइन सिस्टीम (P01)</span>
          <span style={{ opacity: 0.85 }}>Sahayak AI • Civic-Tech Visual System</span>
        </Container>
      </div>

      {/* Main Header */}
      <header style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)', padding: 'var(--space-4) 0' }}>
        <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-button)', backgroundColor: 'var(--sahayak-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
              S
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-xl)', margin: 0, color: 'var(--sahayak-blue-dark)' }}>
                Sahayak AI <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>Design System</span>
              </h1>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                "Making digital services usable for everyone."
              </p>
            </div>
          </div>

          {/* Quick Accessibility Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Button
              variant={contrast === 'high' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setContrast(contrast === 'high' ? 'standard' : 'high')}
              aria-pressed={contrast === 'high'}
            >
              {contrast === 'high' ? '● High Contrast Active' : '◐ High Contrast'}
            </Button>

            <Button
              variant={textScale === 'large' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTextScale(textScale === 'normal' ? 'large' : textScale === 'large' ? 'extra-large' : 'normal')}
            >
              A± Text: {textScale}
            </Button>

            <Button
              variant={reducedMotion ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setReducedMotion(!reducedMotion)}
            >
              {reducedMotion ? '⚡ Motion: Reduced' : '⚡ Motion: Standard'}
            </Button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'mr' | 'hi')}
              aria-label="Language Selector"
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: 'var(--font-size-sm)', minHeight: '36px' }}
            >
              <option value="en">English (EN)</option>
              <option value="mr">मराठी (MR)</option>
              <option value="hi">हिंदी (HI)</option>
            </select>
          </div>
        </Container>
      </header>

      {/* Main Content Showcase */}
      <main>
        <Container style={{ paddingTop: 'var(--space-8)' }}>
          {/* Overview Callout */}
          <Alert variant="info" title="Phase P01 — Design System Verification & Showcase">
            This page verifies the tokens, typography, accessibility overrides, and base components derived from <code>docs/source-of-truth/UI.md</code>.
          </Alert>

          {/* Mandatory Civic Disclaimer (UI.md Section 52) */}
          <Alert variant="disclaimer">
            <strong>अधिकृत सूचना / Official Disclaimer:</strong> Sahayak AI provides guidance and does not represent a government department. Requirements and procedures may change. Verify current information on the official service portal before submitting an application.
          </Alert>

          {/* 1. Color Palette Tokens */}
          <section className="section">
            <h2>1. Sahayak Color Palette Tokens (UI.md Section 6)</h2>
            <p className="body-secondary">
              Civic-tech palette dominated by white surfaces (70%), soft neutral/light-blue surfaces (20%), and primary Sahayak blue accents (8%).
            </p>
            <div className="grid grid-cols-1 grid-cols-2-md grid-cols-4-lg" style={{ marginTop: 'var(--space-4)' }}>
              <div style={{ backgroundColor: 'var(--sahayak-blue)', color: 'white', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)' }}>
                <strong>--sahayak-blue</strong>
                <div>#00599F</div>
                <small>Primary Brand / Action</small>
              </div>
              <div style={{ backgroundColor: 'var(--sahayak-blue-dark)', color: 'white', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)' }}>
                <strong>--sahayak-blue-dark</strong>
                <div>#003C6D</div>
                <small>Deep Emphasis / Dark Sec</small>
              </div>
              <div style={{ backgroundColor: 'var(--sahayak-blue-light)', color: 'var(--sahayak-blue-dark)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)' }}>
                <strong>--sahayak-blue-light</strong>
                <div>#E7EEF5</div>
                <small>Light Blue Surfaces</small>
              </div>
              <div style={{ backgroundColor: 'var(--sahayak-blue-pale)', color: 'var(--sahayak-blue-dark)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)' }}>
                <strong>--sahayak-blue-pale</strong>
                <div>#DBEFFD</div>
                <small>Info / Accessibility Bg</small>
              </div>
            </div>

            {/* Status Colors */}
            <div className="grid grid-cols-1 grid-cols-3-md" style={{ marginTop: 'var(--space-4)' }}>
              <div style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', padding: 'var(--space-3)', borderRadius: 'var(--radius-button)' }}>
                <strong>Success (#16803C)</strong> — Verified Government Source
              </div>
              <div style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid var(--warning)', color: 'var(--warning)', padding: 'var(--space-3)', borderRadius: 'var(--radius-button)' }}>
                <strong>Warning (#B7791F)</strong> — Deadlines / Pending Status
              </div>
              <div style={{ backgroundColor: 'var(--error-bg)', border: '1px solid var(--error)', color: 'var(--error)', padding: 'var(--space-3)', borderRadius: 'var(--radius-button)' }}>
                <strong>Error (#C53030)</strong> — Form Validation / Alert
              </div>
            </div>
          </section>

          {/* 2. Multilingual Typography Scale */}
          <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
            <h2>2. Multilingual Typography & Devanagari Script Support</h2>
            <p className="body-secondary">
              Testing typography pairing: <strong>Inter</strong> for Latin and <strong>Noto Sans Devanagari</strong> for Marathi & Hindi. Line heights relaxed to 1.65 to ensure matras and conjuncts do not clip.
            </p>

            <div className="grid grid-cols-1 grid-cols-3-md" style={{ marginTop: 'var(--space-4)' }}>
              <Card>
                <Badge variant="info">English (EN)</Badge>
                <h3 style={{ marginTop: 'var(--space-3)' }}>Income Certificate Guidance</h3>
                <p>Citizens can apply for an Income Certificate online via Aaple Sarkar. Prepare address and identity proofs before starting.</p>
                <small className="text-muted">Font: Inter, 16px Base</small>
              </Card>

              <Card>
                <Badge variant="success">मराठी (MR)</Badge>
                <h3 style={{ marginTop: 'var(--space-3)' }}>उत्पन्न प्रमाणपत्र मार्गदर्शन</h3>
                <p>आपले सरकार पोर्टलद्वारे नागरिक उत्पन्नाच्या प्रमाणपत्रासाठी ऑनलाइन अर्ज करू शकतात. अर्ज करण्यापूर्वी आवश्यक कागदपत्रे तयार ठेवा.</p>
                <small className="text-muted">Font: Noto Sans Devanagari</small>
              </Card>

              <Card>
                <Badge variant="warning">हिंदी (HI)</Badge>
                <h3 style={{ marginTop: 'var(--space-3)' }}>आय प्रमाण पत्र मार्गदर्शन</h3>
                <p>नागरिक आपले सरकार पोर्टल के माध्यम से आय प्रमाण पत्र के लिए ऑनलाइन आवेदन कर सकते हैं। आवेदन करने से पहले आवश्यक दस्तावेज तैयार रखें।</p>
                <small className="text-muted">Font: Noto Sans Devanagari</small>
              </Card>
            </div>
          </section>

          {/* 3. Button Component Primitives */}
          <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
            <h2>3. Reusable Button Primitives (UI.md Section 34)</h2>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', marginTop: 'var(--space-4)' }}>
              <Button variant="primary">Primary Action / मुख्य कृती</Button>
              <Button variant="secondary">Secondary Action / दुय्यम कृती</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="text">Text Button / लिंक</Button>
              <Button variant="primary" disabled>Disabled State</Button>
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <h4>Accessible Microphone Button (UI.md Section 35)</h4>
              <p className="body-secondary">
                Four explicit visual and assistive states for speech accessibility. Active State: <strong>{micState.toUpperCase()}</strong>
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                <div style={{ textAlign: 'center' }}>
                  <button className="btn-mic" onClick={() => setMicState('idle')} aria-label="Set Microphone Idle">🎙</button>
                  <div style={{ fontSize: 'var(--font-size-xs)', marginTop: 4 }}>Idle</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button className="btn-mic listening" onClick={() => setMicState('listening')} aria-label="Set Microphone Listening">●</button>
                  <div style={{ fontSize: 'var(--font-size-xs)', marginTop: 4, color: 'var(--error)', fontWeight: 600 }}>Listening...</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button className="btn-mic" style={{ backgroundColor: 'var(--sahayak-blue-dark)' }} onClick={() => setMicState('processing')} aria-label="Set Microphone Processing">⏳</button>
                  <div style={{ fontSize: 'var(--font-size-xs)', marginTop: 4 }}>Processing</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button className="btn-mic" style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }} onClick={() => setMicState('unavailable')} aria-label="Set Microphone Unavailable">🚫</button>
                  <div style={{ fontSize: 'var(--font-size-xs)', marginTop: 4, color: 'var(--text-muted)' }}>Unavailable</div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Form Inputs & Validation */}
          <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
            <h2>4. Form Input Primitives & Accessible States</h2>
            <div className="grid grid-cols-1 grid-cols-2-md" style={{ marginTop: 'var(--space-4)' }}>
              <Input
                label="पूर्ण नाव / Full Name"
                required
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                helperText="Enter your name as it appears on your Aadhaar card."
                placeholder="उदा. राहुल शर्मा"
              />

              <Input
                label="वार्षिक उत्पन्न (रुपये) / Annual Income (₹)"
                required
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                errorText={!errorInput ? "वार्षिक उत्पन्न प्रविष्ट करणे आवश्यक आहे / Annual income is mandatory." : undefined}
                placeholder="उदा. 80000"
              />
            </div>
          </section>

          {/* 5. Cards & Official Source Component */}
          <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
            <h2>5. Cards & Official Source Distinction (UI.md Section 39)</h2>
            <div className="grid grid-cols-1 grid-cols-2-md" style={{ marginTop: 'var(--space-4)' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Income Certificate / उत्पन्न प्रमाणपत्र</CardTitle>
                  <Badge variant="info">महसूल विभाग</Badge>
                </CardHeader>
                <CardBody>
                  This certificate provides verified statutory proof of household income for scholarships, fee concessions, and government welfare benefits in Maharashtra.
                  <div style={{ marginTop: 'var(--space-3)' }}>
                    <strong>आवश्यक कागदपत्रे / Required Documents:</strong>
                    <ul style={{ margin: 'var(--space-2) 0 0 var(--space-4)', padding: 0 }}>
                      <li>ओळख पुरावा (Aadhaar / Voter ID)</li>
                      <li>रहिवासी पुरावा (Ration card / Electricity bill)</li>
                      <li>मागील वर्षाचा उत्पन्नाचा दाखला / Income proof</li>
                    </ul>
                  </div>
                </CardBody>
                <CardFooter>
                  <span className="text-muted">अपेक्षित वेळ: 15 दिवस</span>
                  <Button variant="primary" size="sm">मार्गदर्शन सुरू करा ↗</Button>
                </CardFooter>
              </Card>

              {/* Official Source Card */}
              <Card isOfficialSource>
                <div className="authority-title">OFFICIAL SOURCE / अधिकृत स्रोत</div>
                <h3 style={{ margin: 'var(--space-2) 0', color: 'var(--sahayak-blue-dark)' }}>
                  Aaple Sarkar — Government of Maharashtra
                </h3>
                <p style={{ margin: 'var(--space-2) 0', fontSize: 'var(--font-size-sm)' }}>
                  Official Citizen Services Portal (आपले सरकार पोर्टल). Public services and certificates are legally issued and processed by the Government of Maharashtra.
                </p>
                <div className="source-meta">
                  <span>✓ अंतिम पडताळणी: 25 सप्टेंबर 2026</span> • <span>Domain: aaplesarkar.mahaonline.gov.in</span>
                </div>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://aaplesarkar.mahaonline.gov.in/', '_blank', 'noopener,noreferrer')}
                  >
                    Open Official Portal ↗
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* 6. Badges & Status Indicators */}
          <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
            <h2>6. Status Badges & Chips (UI.md Section 40)</h2>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
              <Badge variant="success">✓ Verified (पडताळलेले)</Badge>
              <Badge variant="warning">⏳ मुदत संपत आहे (Ending Soon)</Badge>
              <Badge variant="error">✕ अर्ज बंद (Closed)</Badge>
              <Badge variant="info">🏛️ महाराष्ट्र शासन (Gov of Maharashtra)</Badge>
              <Badge variant="neutral">📂 शिक्षण विभाग (Education)</Badge>
            </div>
          </section>
        </Container>
      </main>

      {/* Footer */}
      <footer style={{ marginTop: 'var(--space-12)', borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface-soft)', padding: 'var(--space-8) 0' }}>
        <Container style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: 'var(--sahayak-blue-dark)', margin: '0 0 var(--space-2) 0' }}>
            Sahayak AI — Accessibility & Task Navigation Layer
          </p>
          <p className="caption" style={{ margin: 0, maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto' }}>
            Sahayak AI is an assistive civic-tech layer. We don't replace digital services; we make them usable. All official trademarks belong to their respective statutory authorities.
          </p>
        </Container>
      </footer>
    </div>
  );
};
