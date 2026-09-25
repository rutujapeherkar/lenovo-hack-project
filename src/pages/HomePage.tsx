/**
 * Sahayak AI — Home Page (P12 Demo Polish)
 *
 * Source of Truth: docs/source-of-truth/UI.md Section 19 & PRODUCT.md Section 6
 * Phase: P12 — Demo & Hackathon Polish
 *
 * The Home page is the primary demo entry point for judges and citizens.
 * It must immediately communicate the product value proposition and allow
 * the demonstration flow to begin in < 10 seconds.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, Button, Badge, Alert } from '../components/ui';
import { Link } from '../router';
import { useAccessibility, VoiceService } from '../core/accessibility';
import { MicButton } from '../components/assistant';
import { ReadAloud } from '../components/accessibility';
import { SafetyNotice, FallbackView } from '../components/common';
import { sanitizeUserInput } from '../core/security';

// ─── Demo Quick-Action Chips (FR-P12-01) ────────────────────────────────────
// Pre-set scenarios that auto-populate the input and trigger the assistant.
// These cover all 4 core demo journeys: service, schemes, explain, voice.
const QUICK_ACTIONS = [
  {
    icon: '📄',
    labelEn: 'Income Certificate',
    labelMr: 'उत्पन्न प्रमाणपत्र',
    labelHi: 'आय प्रमाण पत्र',
    queryEn: 'I need an income certificate from Maharashtra',
    queryMr: 'मला उत्पन्न प्रमाणपत्र काढायचे आहे',
    queryHi: 'मुझे आय प्रमाण पत्र चाहिए',
  },
  {
    icon: '🎓',
    labelEn: 'Scholarships',
    labelMr: 'शिष्यवृत्ती',
    labelHi: 'छात्रवृत्ति',
    queryEn: 'I am a college student looking for scholarships',
    queryMr: 'मी महाविद्यालयाचा विद्यार्थी आहे, शिष्यवृत्ती हवी आहे',
    queryHi: 'मैं कॉलेज छात्र हूं, छात्रवृत्ति की जानकारी चाहिए',
  },
  {
    icon: '♿',
    labelEn: 'Divyang Pension',
    labelMr: 'दिव्यांग पेन्शन',
    labelHi: 'दिव्यांग पेंशन',
    queryEn: 'I am a divyang person, what pension schemes are available?',
    queryMr: 'मी दिव्यांग आहे, मला पेन्शन योजनेची माहिती हवी आहे',
    queryHi: 'मैं दिव्यांग हूं, पेंशन योजना की जानकारी चाहिए',
  },
  {
    icon: '📸',
    labelEn: 'Explain a Form',
    labelMr: 'फॉर्म समजावा',
    labelHi: 'फॉर्म समझाएं',
    queryEn: 'How to understand or explain a government form',
    queryMr: 'सरकारी फॉर्म कसा समजावून घ्यावा',
    queryHi: 'सरकारी फॉर्म कैसे समझें',
  },
  {
    icon: '🌾',
    labelEn: 'Farmer Benefits',
    labelMr: 'शेतकरी लाभ',
    labelHi: 'किसान लाभ',
    queryEn: 'I am a farmer, what government benefits am I eligible for?',
    queryMr: 'मी शेतकरी आहे, कोणत्या शासकीय योजना मिळू शकतात?',
    queryHi: 'मैं किसान हूं, सरकारी योजनाएं बताइए',
  },
];

export const HomePage: React.FC = () => {
  const { language, readAloud } = useAccessibility();
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [sensitiveWarning, setSensitiveWarning] = React.useState<string | null>(null);
  const [fallbackReason, setFallbackReason] = React.useState<'ai_failure' | 'network_failure' | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const lang = (language || 'mr') as 'en' | 'mr' | 'hi';

  const handleSearch = async (queryText?: string) => {
    const textToSearch = (queryText !== undefined ? queryText : query).trim();
    if (!textToSearch) return;

    setLoading(true);
    setError(null);
    setSensitiveWarning(null);
    setFallbackReason(null);
    setResponse(null);

    // Credential Interception Guard (AC-P10-01, AC-P10-02)
    const sanitization = sanitizeUserInput(textToSearch, lang);
    if (sanitization.isSensitive) {
      setSensitiveWarning(sanitization.warningMessage);
      setQuery(sanitization.sanitized);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sanitization.sanitized, language: lang }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setResponse(json.data);
          setLoading(false);
          if (readAloud && json.data.message) {
            VoiceService.speakText(json.data.message, lang);
          }
          return;
        }
        setFallbackReason('ai_failure');
      } else {
        setFallbackReason('ai_failure');
      }
    } catch (_err: unknown) {
      setFallbackReason('network_failure');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    const queryText = lang === 'mr' ? action.queryMr : lang === 'hi' ? action.queryHi : action.queryEn;
    setQuery(queryText);
    inputRef.current?.focus();
    handleSearch(queryText);
  };

  const getLabel = (action: typeof QUICK_ACTIONS[0]) =>
    lang === 'mr' ? action.labelMr : lang === 'hi' ? action.labelHi : action.labelEn;

  const heroTitle = lang === 'mr'
    ? 'तुम्हाला काय मदत हवी आहे?'
    : lang === 'hi'
    ? 'आपको क्या सहायता चाहिए?'
    : 'How can Sahayak help you today?';

  const heroSubtitle = lang === 'mr'
    ? 'साहायक एआय — शासकीय सेवा, प्रमाणपत्रे आणि कल्याणकारी योजनांसाठी विश्वासार्ह मार्गदर्शन.'
    : lang === 'hi'
    ? 'साहायक एआई — सरकारी सेवाओं, प्रमाण पत्रों और कल्याण योजनाओं के लिए विश्वसनीय मार्गदर्शन.'
    : 'Sahayak AI guides you through government services, certificates, and welfare schemes — step by step, in your language.';

  const searchPlaceholder = lang === 'mr'
    ? 'उदा. मला जात प्रमाणपत्र काढायचे आहे...'
    : lang === 'hi'
    ? 'उदा. मुझे जाति प्रमाण पत्र चाहिए...'
    : 'e.g. I need an income certificate or find scholarships for students...';

  const searchBtnLabel = loading
    ? (lang === 'mr' ? 'शोधत आहे...' : lang === 'hi' ? 'खोज रहे हैं...' : 'Searching...')
    : (lang === 'mr' ? 'विचारा' : lang === 'hi' ? 'पूछें' : 'Ask Sahayak');

  return (
    <div className="home-page">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section
        style={{
          marginBottom: 'var(--space-10)',
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto var(--space-10) auto',
        }}
      >
        <Badge variant="info" style={{ marginBottom: 'var(--space-4)' }}>
          महाराष्ट्र शासन नागरिक सहाय्य • Civic Guidance Platform
        </Badge>

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--sahayak-blue-dark)',
            marginBottom: 'var(--space-3)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          {heroTitle}
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            color: 'var(--text-secondary)',
            lineHeight: '1.65',
            marginBottom: 'var(--space-7)',
            maxWidth: '680px',
            margin: '0 auto var(--space-7) auto',
          }}
        >
          {heroSubtitle}
        </p>

        {/* ── Search Input Row ────────────────────────────────────── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{ maxWidth: '660px', margin: '0 auto' }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface)',
              padding: 'var(--space-1)',
              border: '1.5px solid var(--border)',
              transition: 'box-shadow var(--transition-fast)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder={searchPlaceholder}
              aria-label={lang === 'mr' ? 'साहायक एआयला विचारा' : lang === 'hi' ? 'साहायक से पूछें' : 'Ask Sahayak AI'}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                boxShadow: 'none',
                fontSize: '1rem',
                padding: 'var(--space-2) var(--space-3)',
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <MicButton
              language={language}
              onTranscript={(text) => {
                setQuery(text);
              }}
              disabled={loading}
            />
            <Button
              variant="primary"
              type="submit"
              disabled={loading || !query.trim()}
              style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-md)' }}
            >
              {searchBtnLabel}
            </Button>
          </div>

          {/* ── Quick Action Chips (FR-P12-01) ───────────────────── */}
          <div
            style={{
              marginTop: 'var(--space-4)',
              display: 'flex',
              gap: 'var(--space-2)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {lang === 'mr' ? 'त्वरित विचारा:' : lang === 'hi' ? 'जल्दी पूछें:' : 'Quick ask:'}
            </span>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.labelEn}
                type="button"
                onClick={() => handleQuickAction(action)}
                disabled={loading}
                aria-label={`Quick ask: ${getLabel(action)}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.875rem',
                  borderRadius: '2rem',
                  border: '1.5px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  fontFamily: 'inherit',
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget;
                  t.style.background = 'var(--sahayak-blue-pale)';
                  t.style.borderColor = 'var(--sahayak-blue)';
                  t.style.color = 'var(--sahayak-blue-dark)';
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget;
                  t.style.background = 'var(--surface)';
                  t.style.borderColor = 'var(--border)';
                  t.style.color = 'var(--text)';
                }}
              >
                <span aria-hidden="true">{action.icon}</span>
                {getLabel(action)}
              </button>
            ))}
          </div>
        </form>

        {/* ── Alerts / Feedback ───────────────────────────────────── */}
        {sensitiveWarning && (
          <div style={{ marginTop: 'var(--space-5)', textAlign: 'left', maxWidth: '660px', margin: 'var(--space-5) auto 0 auto' }}>
            <SafetyNotice type="credential" language={lang} customMessage={sensitiveWarning} />
          </div>
        )}

        {fallbackReason && (
          <div style={{ marginTop: 'var(--space-5)', textAlign: 'left', maxWidth: '660px', margin: 'var(--space-5) auto 0 auto' }}>
            <FallbackView reason={fallbackReason} language={lang} onRetry={() => handleSearch()} />
          </div>
        )}

        {error && !fallbackReason && (
          <div style={{ marginTop: 'var(--space-5)', textAlign: 'left', maxWidth: '660px', margin: 'var(--space-5) auto 0 auto' }}>
            <Alert variant="error" title="Assistant Error">{error}</Alert>
          </div>
        )}

        {/* ── Assistant Response ──────────────────────────────────── */}
        {response && (
          <div style={{ marginTop: 'var(--space-7)', textAlign: 'left', maxWidth: '760px', margin: 'var(--space-7) auto 0 auto' }}>
            {/* Sahayak Guidance Card */}
            <Card
              variant="interactive"
              style={{ marginBottom: 'var(--space-4)', borderLeft: '4px solid var(--sahayak-orange)' }}
            >
              <CardHeader>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2)',
                  }}
                >
                  <Badge variant="warning">
                    🤖 {lang === 'mr' ? 'साहायक मार्गदर्शन' : lang === 'hi' ? 'साहायक मार्गदर्शन' : 'Sahayak Guidance'}
                  </Badge>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <ReadAloud text={response.message} language={lang} />
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => {
                        VoiceService.stopSpeaking();
                        setResponse(null);
                        setQuery('');
                      }}
                    >
                      ✕ {lang === 'mr' ? 'बंद करा' : lang === 'hi' ? 'बंद करें' : 'Clear'}
                    </Button>
                  </div>
                </div>
                <CardTitle style={{ marginTop: 'var(--space-2)', fontSize: '1.25rem' }}>
                  {response.service?.name ||
                    (response.schemes?.[0]?.name
                      ? response.schemes[0].name[lang] || response.schemes[0].name.en
                      : lang === 'mr'
                      ? 'नागरिक मार्गदर्शन'
                      : lang === 'hi'
                      ? 'नागरिक मार्गदर्शन'
                      : 'Citizen Guidance')}
                </CardTitle>
                <CardDescription style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {lang === 'mr'
                    ? 'खालील माहिती साहायक एआयचे मार्गदर्शन आहे, हा अधिकृत शासकीय आदेश नाही.'
                    : lang === 'hi'
                    ? 'नीचे दी गई जानकारी साहायक एआई का मार्गदर्शन है, आधिकारिक सरकारी आदेश नहीं।'
                    : 'Guidance below is an AI-assisted explanation — not an official government order.'}
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p style={{ fontSize: '1rem', lineHeight: '1.65', color: 'var(--text)', marginBottom: 'var(--space-4)' }}>
                  {response.message}
                </p>

                {/* Steps preview */}
                {response.steps && response.steps.length > 0 && (
                  <div
                    style={{
                      marginBottom: 'var(--space-4)',
                      background: 'var(--sahayak-blue-pale)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <strong style={{ fontSize: '0.9375rem', color: 'var(--sahayak-blue-dark)', display: 'block', marginBottom: 'var(--space-2)' }}>
                      {lang === 'mr' ? 'मार्गदर्शन पायऱ्या' : lang === 'hi' ? 'मार्गदर्शन चरण' : 'Guidance Steps'} ({response.steps.length}):
                    </strong>
                    <ol style={{ paddingLeft: 'var(--space-5)', margin: 0 }}>
                      {response.steps.slice(0, 3).map((st: any, idx: number) => (
                        <li key={idx} style={{ fontSize: '0.875rem', marginBottom: 'var(--space-1)', lineHeight: 1.55 }}>
                          <strong>{st.title[lang] || st.title.en}:</strong>{' '}
                          {st.description[lang] || st.description.en}
                        </li>
                      ))}
                      {response.steps.length > 3 && (
                        <li style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none' }}>
                          + {response.steps.length - 3} {lang === 'mr' ? 'आणखी पायऱ्या' : lang === 'hi' ? 'और चरण' : 'more steps'}…
                        </li>
                      )}
                    </ol>
                  </div>
                )}

                {/* Start Guided Task CTA */}
                {response.service?.id && (
                  <Link href={`/services/${response.service.id}`}>
                    <Button variant="primary" size="sm">
                      🧭 {lang === 'mr' ? 'मार्गदर्शन सुरू करा' : lang === 'hi' ? 'मार्गदर्शन शुरू करें' : 'Start Guided Task'} →
                    </Button>
                  </Link>
                )}

                {/* Scheme CTA */}
                {!response.service?.id && response.schemes?.length > 0 && (
                  <Link href="/schemes">
                    <Button variant="primary" size="sm">
                      🔍 {lang === 'mr' ? 'सर्व योजना पहा' : lang === 'hi' ? 'सभी योजनाएं देखें' : 'View All Schemes'} →
                    </Button>
                  </Link>
                )}
              </CardBody>
              {response.safetyNote && (
                <CardFooter>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                    ℹ️ {response.safetyNote}
                  </p>
                </CardFooter>
              )}
            </Card>

            {/* Official Source Card */}
            {response.officialSource ? (
              <Card
                variant="interactive"
                style={{ borderLeft: '4px solid var(--sahayak-blue)', backgroundColor: 'var(--sahayak-blue-pale)' }}
              >
                <CardHeader>
                  <Badge variant="info">
                    🏛️ {lang === 'mr' ? 'अधिकृत शासकीय माहिती' : lang === 'hi' ? 'आधिकारिक सरकारी जानकारी' : 'Official Government Information'}
                  </Badge>
                  <CardTitle style={{ marginTop: 'var(--space-2)', fontSize: '1.125rem', color: 'var(--sahayak-blue-dark)' }}>
                    {response.officialSource.name}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                    {lang === 'mr'
                      ? 'अधिकृत नियम, कागदपत्रे व प्रक्रिया तपासण्यासाठी अधिकृत शासकीय संकेतस्थळाला भेट द्या.'
                      : lang === 'hi'
                      ? 'आधिकारिक नियमों, दस्तावेजों और प्रक्रियाओं की पुष्टि के लिए आधिकारिक सरकारी पोर्टल पर जाएं।'
                      : 'Verify current rules, procedures, and documents directly on the official government portal.'}
                  </p>
                  <a
                    href={response.officialSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                    aria-label={`View official information: ${response.officialSource.name}`}
                  >
                    <Button variant="outline" size="sm">
                      🏛️ {lang === 'mr' ? 'अधिकृत माहिती पहा' : lang === 'hi' ? 'आधिकारिक जानकारी देखें' : 'View Official Information'} ↗
                    </Button>
                  </a>
                </CardBody>
              </Card>
            ) : (
              <SafetyNotice
                type="unverified"
                language={lang}
              />
            )}
          </div>
        )}
      </section>

      {/* ── Mandatory Civic Disclaimer (AC-P10-03) ─────────────────────── */}
      <SafetyNotice
        type="disclaimer"
        language={lang}
        style={{ marginBottom: 'var(--space-8)' }}
      />

      {/* ── Core Modules Grid ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-1)' }}>
          {lang === 'mr' ? 'मुख्य विभाग' : lang === 'hi' ? 'मुख्य मॉड्यूल' : 'Core Modules'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-5)' }}>
          {lang === 'mr'
            ? 'शासकीय सेवांसाठी सर्वसमावेशक मार्गदर्शन'
            : lang === 'hi'
            ? 'सरकारी सेवाओं के लिए व्यापक मार्गदर्शन'
            : 'Comprehensive guidance for government services, schemes, and forms.'}
        </p>
      </div>
      <div className="grid grid-cols-1 grid-cols-2-md grid-cols-4-lg" style={{ marginBottom: 'var(--space-12)' }}>
        {/* Services */}
        <Card variant="interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardHeader style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <Badge variant="info" size="sm">शासकीय सेवा</Badge>
            <CardTitle>{lang === 'mr' ? 'सेवा व प्रमाणपत्रे' : lang === 'hi' ? 'सेवाएं और प्रमाण पत्र' : 'Services & Certificates'}</CardTitle>
            <CardDescription>
              {lang === 'mr'
                ? 'उत्पन्न, जात, अधिवास, रेशन कार्ड — पायरी-पायरी मार्गदर्शन.'
                : lang === 'hi'
                ? 'आय, जाति, अधिवास, राशन कार्ड — चरण-दर-चरण मार्गदर्शन.'
                : 'Income, Caste, Domicile, Ration Card — step-by-step guidance.'}
            </CardDescription>
          </CardHeader>
          <CardBody style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Aaple Sarkar • Revenue Dept • Food & Civil Supplies
            </p>
          </CardBody>
          <CardFooter>
            <Link href="/services">
              <Button variant="outline" size="sm" fullWidth>
                {lang === 'mr' ? 'सेवा पहा' : lang === 'hi' ? 'सेवाएं देखें' : 'Explore Services'} ↗
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Schemes */}
        <Card variant="interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardHeader style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <Badge variant="success" size="sm">कल्याणकारी योजना</Badge>
            <CardTitle>{lang === 'mr' ? 'शासकीय योजना' : lang === 'hi' ? 'सरकारी योजनाएं' : 'Welfare Schemes'}</CardTitle>
            <CardDescription>
              {lang === 'mr'
                ? 'केंद्र व राज्य योजनांचे पात्रता, लाभ व अर्ज मार्गदर्शन.'
                : lang === 'hi'
                ? 'केंद्र और राज्य योजनाओं की पात्रता, लाभ और आवेदन मार्गदर्शन.'
                : 'Central & Maharashtra welfare schemes, eligibility, benefits.'}
            </CardDescription>
          </CardHeader>
          <CardBody style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              MahaDBT • Ladki Bahin • PM-KISAN • Sanjay Gandhi Niradhar
            </p>
          </CardBody>
          <CardFooter>
            <Link href="/schemes">
              <Button variant="outline" size="sm" fullWidth>
                {lang === 'mr' ? 'योजना शोधा' : lang === 'hi' ? 'योजनाएं खोजें' : 'Find Schemes'} ↗
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Explain Screen */}
        <Card variant="interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardHeader style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <Badge variant="warning" size="sm">दृष्टी सहाय्य</Badge>
            <CardTitle>{lang === 'mr' ? 'स्क्रीन समजावा' : lang === 'hi' ? 'स्क्रीन समझाएं' : 'Explain Screen'}</CardTitle>
            <CardDescription>
              {lang === 'mr'
                ? 'सरकारी फॉर्मचा स्क्रीनशॉट अपलोड करा — सोप्या भाषेत स्पष्टीकरण मिळवा.'
                : lang === 'hi'
                ? 'सरकारी फॉर्म का स्क्रीनशॉट अपलोड करें — सरल भाषा में समझाइए.'
                : 'Upload a portal screenshot to understand complex form fields.'}
            </CardDescription>
          </CardHeader>
          <CardBody style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Visual Form Explanation • मराठी & हिंदी • Privacy Striping
            </p>
          </CardBody>
          <CardFooter>
            <Link href="/explain-screen">
              <Button variant="outline" size="sm" fullWidth>
                {lang === 'mr' ? 'स्क्रीन अपलोड करा' : lang === 'hi' ? 'स्क्रीन अपलोड करें' : 'Upload Screen'} ↗
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Browser Extension */}
        <Card variant="interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardHeader style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <Badge variant="neutral" size="sm">ब्राउझर विस्तार</Badge>
            <CardTitle>{lang === 'mr' ? 'ब्राउझर साथी' : lang === 'hi' ? 'ब्राउज़र साथी' : 'Browser Companion'}</CardTitle>
            <CardDescription>
              {lang === 'mr'
                ? 'सरकारी पोर्टलवर ब्राउझ करताना थेट मार्गदर्शन.'
                : lang === 'hi'
                ? 'सरकारी पोर्टल पर ब्राउज़ करते समय सीधे मार्गदर्शन.'
                : 'Side-panel co-pilot for Aaple Sarkar and MahaDBT portals.'}
            </CardDescription>
          </CardHeader>
          <CardBody style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Aaple Sarkar Overlay • Step Roadmap • Zero Credential Logging
            </p>
          </CardBody>
          <CardFooter>
            <Link href="/extension">
              <Button variant="outline" size="sm" fullWidth>
                {lang === 'mr' ? 'विस्तार पहा' : lang === 'hi' ? 'एक्सटेंशन देखें' : 'View Extension'} ↗
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
