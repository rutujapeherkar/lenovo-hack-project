import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, Button, Badge, Alert } from '../components/ui';
import { Link } from '../router';
import { useAccessibility, VoiceService } from '../core/accessibility';
import { MicButton } from '../components/assistant';
import { ReadAloud } from '../components/accessibility';

export const HomePage: React.FC = () => {
  const { language, readAloud } = useAccessibility();
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const getCurrentLang = (): 'en' | 'mr' | 'hi' => {
    return language || 'mr';
  };

  const handleSearch = async (queryText?: string) => {
    const textToSearch = (queryText !== undefined ? queryText : query).trim();
    if (!textToSearch) return;

    setLoading(true);
    setError(null);
    const lang = getCurrentLang();

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSearch, language: lang }),
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
        setError(json.error?.message || 'Assistant error');
      } else {
        setError(`Server returned HTTP ${res.status}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to Sahayak Assistant service.');
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

        {/* Assistant Response Display */}
        {error && (
          <div style={{ marginTop: 'var(--space-4)', textAlign: 'left' }}>
            <Alert variant="error" title="Assistant Error">{error}</Alert>
          </div>
        )}

        {response && (
          <div style={{ marginTop: 'var(--space-6)', textAlign: 'left' }}>
            <Card variant="interactive">
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  <Badge variant="info">
                    {response.intent ? `हेतू / Intent: ${response.intent}` : 'सहायक मार्गदर्शन'}
                  </Badge>
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
                  {response.service?.name || (response.schemes?.[0]?.name ? response.schemes[0].name[getCurrentLang()] : 'नागरिक मार्गदर्शन / Guidance')}
                </CardTitle>
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
                  <div style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                    <Link href={`/services/${response.service.id}`}>
                      <Button variant="primary" size="sm">
                        🧭 Start Guided Task / कार्य मार्गदर्शन सुरू करा →
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Official Source Link */}
                {response.officialSource && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span>अधिकृत स्त्रोत / Official Source: </span>
                    <a
                      href={response.officialSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--sahayak-blue)', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      {response.officialSource.name} ↗
                    </a>
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
          </div>
        )}
      </section>

      {/* Mandatory Civic Disclaimer Alert */}
      <Alert
        variant="disclaimer"
        title="Civic Platform Notice"
        style={{ marginBottom: 'var(--space-8)' }}
      >
        Sahayak AI assists citizens with step-by-step guidance for Maharashtra e-District and Aaple Sarkar portals. Application submissions and fee payments occur exclusively on official government domains.
      </Alert>

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
