import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, Button, Badge, Alert } from '../components/ui';
import { Link } from '../router';

export const HomePage: React.FC = () => {
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

        {/* Input Placeholder Preview (P01 primitive integration) */}
        <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)', maxWidth: '640px', margin: 'var(--space-6) auto 0 auto' }}>
          <input
            type="text"
            className="form-control"
            placeholder="उदा. मला उत्पन्न प्रमाणपत्र काढायचे आहे किंवा लाडकी बहीण योजनेची माहिती हवी आहे..."
            aria-label="Ask Sahayak AI"
            style={{ flex: 1 }}
            readOnly
          />
          <Button variant="primary">
            शोध घ्या / Search
          </Button>
          <Button variant="mic" micState="idle" aria-label="Voice input placeholder" />
        </div>
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
