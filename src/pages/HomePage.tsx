import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, Button, Badge, Alert } from '../components/ui';
import { Link } from '../router';
import { useAccessibility, VoiceService } from '../core/accessibility';
import { MicButton } from '../components/assistant';
import { ReadAloud } from '../components/accessibility';
import { SafetyNotice, FallbackView } from '../components/common';
import { sanitizeUserInput } from '../core/security';

export const HomePage: React.FC = () => {
  const { language, readAloud } = useAccessibility();
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [sensitiveWarning, setSensitiveWarning] = React.useState<string | null>(null);
  const [fallbackReason, setFallbackReason] = React.useState<'ai_failure' | 'network_failure' | null>(null);

  const getCurrentLang = (): 'en' | 'mr' | 'hi' => {
    return language || 'mr';
  };

  const handleSearch = async (queryText?: string) => {
    const textToSearch = (queryText !== undefined ? queryText : query).trim();
    if (!textToSearch) return;

    setLoading(true);
    setError(null);
    setSensitiveWarning(null);
    setFallbackReason(null);
    const lang = getCurrentLang();

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
    } catch (_err: any) {
      setFallbackReason('network_failure');
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    { label: 'उत्पन्न प्रमाणपत्र', text: 'मला उत्पन्न प्रमाणपत्र काढायचे आहे' },
    { label: 'Income Certificate', text: 'What services can I use for an income certificate?' },
    { label: 'लाडकी बहीण योजना', text: 'माझी लाडकी बहीण योजनेची माहिती हवी आहे' },
  ];

  return (
    <div className="home-page">
      {/* Civic Hero */}
      <section style={{ marginBottom: 'var(--space-8)', textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-8) auto' }}>
        <Badge variant="info" style={{ marginBottom: 'var(--space-3)' }}>
          महाराष्ट्र शासन नागरिक सहाय्य • Civic Guidance Platform
        </Badge>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-3)' }}>
          Tell Sahayak what you need.
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          साहाय्यकला सांगा तुम्हाला काय हवे आहे. मिळवा जात प्रमाणपत्र, उत्पन्नाचा दाखला, रेशन कार्ड आणि विविध शासकीय योजनांचे अचूक मार्गदर्शन.
        </p>

        {/* Input & Search Interface */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{ marginTop: 'var(--space-6)', maxWidth: '640px', margin: 'var(--space-6) auto 0 auto' }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="text"
              className="form-control"
              placeholder="उदा. मला उत्पन्न प्रमाणपत्र काढायचे आहे किंवा लाडकी बहीण योजनेची माहिती हवी आहे..."
              aria-label="Ask Sahayak AI"
              style={{ flex: 1 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'शोधत आहे... / Searching...' : 'शोध घ्या / Search'}
            </Button>
            <MicButton
              language={language}
              onTranscript={(text) => {
                setQuery(text);
              }}
              disabled={loading}
            />
          </div>

          {/* Quick Sample Queries */}
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', alignSelf: 'center' }}>उदाहरणे:</span>
            {sampleQueries.map((sample, i) => (
              <button
                key={i}
                type="button"
                className="badge badge-neutral"
                style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                onClick={() => {
                  setQuery(sample.text);
                  handleSearch(sample.text);
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </form>

        {/* Sensitive Credential Alert (AC-P10-01) */}
        {sensitiveWarning && (
          <div style={{ marginTop: 'var(--space-4)', textAlign: 'left' }}>
            <SafetyNotice type="credential" language={getCurrentLang()} customMessage={sensitiveWarning} />
          </div>
        )}

        {/* Graceful Fallback View (AC-P10-06) */}
        {fallbackReason && (
          <div style={{ marginTop: 'var(--space-4)', textAlign: 'left' }}>
            <FallbackView reason={fallbackReason} language={getCurrentLang()} onRetry={() => handleSearch()} />
          </div>
        )}

        {/* Assistant Response Display */}
        {error && !fallbackReason && (
          <div style={{ marginTop: 'var(--space-4)', textAlign: 'left' }}>
            <Alert variant="error" title="Assistant Error">{error}</Alert>
          </div>
        )}

        {response && (
          <div style={{ marginTop: 'var(--space-6)', textAlign: 'left' }}>
            {/* 1. SAHAYAK GUIDANCE SECTION */}
            <Card variant="interactive" style={{ marginBottom: 'var(--space-4)', borderLeft: '4px solid var(--sahayak-orange)' }}>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Badge variant="warning">
                      🤖 {getCurrentLang() === 'mr' ? 'साहायक मार्गदर्शन' : getCurrentLang() === 'hi' ? 'साहायक मार्गदर्शन' : 'Sahayak Guidance'}
                    </Badge>
                    {response.intent && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ({response.intent})
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <ReadAloud text={response.message} language={getCurrentLang()} />
                    <Button variant="text" size="sm" onClick={() => {
                      VoiceService.stopSpeaking();
                      setResponse(null);
                    }}>
                      Clear ✕
                    </Button>
                  </div>
                </div>
                <CardTitle style={{ marginTop: 'var(--space-2)', fontSize: '1.25rem' }}>
                  {response.service?.name || (response.schemes?.[0]?.name ? response.schemes[0].name[getCurrentLang()] : (getCurrentLang() === 'mr' ? 'नागरिक मार्गदर्शन' : getCurrentLang() === 'hi' ? 'नागरिक मार्गदर्शन' : 'Citizen Guidance'))}
                </CardTitle>
                <CardDescription style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {getCurrentLang() === 'mr'
                    ? 'खालील माहिती साहायक एआयचे मार्गदर्शन आहे, हा अधिकृत शासकीय आदेश नाही.'
                    : getCurrentLang() === 'hi'
                    ? 'नीचे दी गई जानकारी साहायक एआई का मार्गदर्शन है, आधिकारिक सरकारी आदेश नहीं।'
                    : 'The guidance below is an AI-assisted explanation, not an official government instruction.'}
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p style={{ fontSize: '1rem', lineHeight: '1.65', color: 'var(--text)', marginBottom: 'var(--space-4)' }}>
                  {response.message}
                </p>

                {/* Steps Preview if service guidance */}
                {response.steps && response.steps.length > 0 && (
                  <div style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-4)', background: 'var(--sahayak-blue-pale)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                    <strong style={{ fontSize: '0.9375rem', color: 'var(--sahayak-blue-dark)' }}>
                      मार्गदर्शन पायऱ्या / Guidance Steps ({response.steps.length}):
                    </strong>
                    <ol style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-5)', margin: 'var(--space-2) 0 0 0' }}>
                      {response.steps.slice(0, 3).map((st: any, idx: number) => (
                        <li key={idx} style={{ fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                          <strong>{st.title[getCurrentLang()] || st.title.en}:</strong> {st.description[getCurrentLang()] || st.description.en}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Service Task Journey CTA */}
                {response.service?.id && (
                  <div style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                    <Link href={`/services/${response.service.id}`}>
                      <Button variant="primary" size="sm">
                        🧭 Start Guided Task / कार्य मार्गदर्शन सुरू करा →
                      </Button>
                    </Link>
                  </div>
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

            {/* 2. OFFICIAL INFORMATION SECTION (CLEARLY SEPARATED) */}
            {response.officialSource ? (
              <Card variant="interactive" style={{ borderLeft: '4px solid var(--sahayak-blue)', backgroundColor: '#F8FAFC' }}>
                <CardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Badge variant="info">
                      🏛️ {getCurrentLang() === 'mr' ? 'अधिकृत शासकीय माहिती' : getCurrentLang() === 'hi' ? 'आधिकारिक सरकारी जानकारी' : 'Official Information'}
                    </Badge>
                  </div>
                  <CardTitle style={{ marginTop: 'var(--space-2)', fontSize: '1.125rem', color: 'var(--sahayak-blue-dark)' }}>
                    {response.officialSource.name}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                    {getCurrentLang() === 'mr'
                      ? 'अधिकृत नियम, कागदपत्रे व प्रक्रिया तपासण्यासाठी अधिकृत शासकीय संकेतस्थळाला भेट द्या.'
                      : getCurrentLang() === 'hi'
                      ? 'आधिकारिक नियमों, दस्तावेजों और प्रक्रियाओं की पुष्टि के लिए आधिकारिक सरकारी पोर्टल पर जाएं।'
                      : 'Verify rules, procedures, and required documents directly on the official government portal.'}
                  </p>
                  <div>
                    <a
                      href={response.officialSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                      aria-label={`View Official Information: ${response.officialSource.name}`}
                    >
                      <Button variant="outline" size="sm">
                        🏛️ {getCurrentLang() === 'mr' ? 'अधिकृत माहिती पहा' : getCurrentLang() === 'hi' ? 'आधिकारिक जानकारी देखें' : 'View Official Information'} ↗
                      </Button>
                    </a>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <SafetyNotice
                type="unverified"
                language={getCurrentLang()}
              />
            )}
          </div>
        )}
      </section>

      {/* Mandatory Civic Disclaimer Alert (AC-P10-03) */}
      <SafetyNotice
        type="disclaimer"
        language={getCurrentLang()}
        style={{ marginBottom: 'var(--space-8)' }}
      />

      {/* Primary Civic Modules Grid */}
      <h2 style={{ fontSize: '1.5rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-4)' }}>
        मुख्य विभाग / Core Modules
      </h2>
      <div className="grid grid-cols-1 grid-cols-2-md grid-cols-4-lg" style={{ marginBottom: 'var(--space-10)' }}>
        {/* Module 1: Services */}
        <Card variant="interactive">
          <CardHeader>
            <Badge variant="info" size="sm">शासकीय सेवा</Badge>
            <CardTitle>Services & Certificates</CardTitle>
            <CardDescription>
              Step-by-step documentation guides for Income, Caste, Domicile, and Ration cards.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Aaple Sarkar • Revenue Department • Food & Civil Supplies
            </p>
          </CardBody>
          <CardFooter>
            <Link href="/services">
              <Button variant="outline" size="sm" fullWidth>
                Explore Services ↗
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Module 2: Schemes */}
        <Card variant="interactive">
          <CardHeader>
            <Badge variant="success" size="sm">कल्याणकारी योजना</Badge>
            <CardTitle>Welfare Schemes</CardTitle>
            <CardDescription>
              Find eligible Central & Maharashtra welfare schemes, benefits, and timelines.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              MahaDBT • Majhi Ladki Bahin • PM-KISAN • Sanjay Gandhi Niradhar
            </p>
          </CardBody>
          <CardFooter>
            <Link href="/schemes">
              <Button variant="outline" size="sm" fullWidth>
                Find Schemes ↗
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Module 3: Explain Screen */}
        <Card variant="interactive">
          <CardHeader>
            <Badge variant="warning" size="sm">दृष्टी सहाय्य</Badge>
            <CardTitle>Explain Screen</CardTitle>
            <CardDescription>
              Upload portal screenshots to understand complex form fields and instructions.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Visual Form Explanation • Marathi & Hindi Translation • Privacy Striping
            </p>
          </CardBody>
          <CardFooter>
            <Link href="/explain-screen">
              <Button variant="outline" size="sm" fullWidth>
                Upload Screen ↗
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Module 4: Extension */}
        <Card variant="interactive">
          <CardHeader>
            <Badge variant="neutral" size="sm">ब्राउझर विस्तार</Badge>
            <CardTitle>Browser Companion</CardTitle>
            <CardDescription>
              Side-panel co-pilot offering live guidance while browsing official portals.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Aaple Sarkar Overlay • Step Roadmap • Zero Credential Logging
            </p>
          </CardBody>
          <CardFooter>
            <Link href="/extension">
              <Button variant="outline" size="sm" fullWidth>
                View Extension ↗
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
