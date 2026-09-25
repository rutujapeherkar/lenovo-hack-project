import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge } from '../components/ui';

export const HelpPage: React.FC = () => {
  return (
    <div className="help-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="info" style={{ marginBottom: 'var(--space-2)' }}>
          मदत आणि वारंवार विचारले जाणारे प्रश्न • Citizen Help
        </Badge>
        <h1 style={{ fontSize: '2rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
          Help, Citizen FAQs & Helplines (मदत आणि संपर्क)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px' }}>
          Learn about your rights under the Maharashtra Right to Public Services Act (RTS Act 2015), official escalation mechanisms, and system instructions.
        </p>
      </div>

      <div className="grid grid-cols-1 grid-cols-2-md" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <Card variant="default">
          <CardHeader>
            <Badge variant="info" size="sm">RTS Act 2015</Badge>
            <CardTitle>What is the Right to Public Services Act?</CardTitle>
            <CardDescription>महाराष्ट्र लोकसेवा हक्क कायदा २०१५</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
              The RTS Act guarantees transparent, efficient, and time-bound delivery of notified public services to citizens of Maharashtra. If a service is not delivered within the stipulated time, citizens have the right to file an appeal.
            </p>
          </CardBody>
        </Card>

        <Card variant="default">
          <CardHeader>
            <Badge variant="warning" size="sm">सुरक्षितता</Badge>
            <CardTitle>Does Sahayak store my Aadhaar or Bank details?</CardTitle>
            <CardDescription>गोपनीयता आणि सुरक्षितता नियम</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
              <strong>No.</strong> Sahayak AI adheres to a strict Zero-Credential Storage policy. We do not store, log, or transmit personal identity documents, passwords, OTPs, or financial records.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Official Helplines */}
      <h2 style={{ fontSize: '1.375rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-4)' }}>
        अधिकृत मदत केंद्र / Official Support Helplines
      </h2>
      <div className="grid grid-cols-1 grid-cols-3-md" style={{ gap: 'var(--space-4)' }}>
        <Card variant="official-source">
          <CardHeader>
            <CardTitle>Aaple Sarkar Toll-Free</CardTitle>
            <CardDescription>Government of Maharashtra Citizen Helpline</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--sahayak-blue)', margin: 0 }}>
              📞 1800 120 8040
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available 24x7</span>
          </CardBody>
        </Card>

        <Card variant="official-source">
          <CardHeader>
            <CardTitle>RTS Commission Helpline</CardTitle>
            <CardDescription>Right to Services Escalations</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--sahayak-blue)', margin: 0 }}>
              📞 022-22045656
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mon–Fri (10:00 AM – 5:30 PM)</span>
          </CardBody>
        </Card>

        <Card variant="official-source">
          <CardHeader>
            <CardTitle>MahaDBT Technical Support</CardTitle>
            <CardDescription>Scholarship & Scheme Portal</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--sahayak-blue)', margin: 0 }}>
              📞 022-49150800
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Working Days</span>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
