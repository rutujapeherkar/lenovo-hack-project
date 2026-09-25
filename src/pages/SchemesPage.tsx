import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, Alert } from '../components/ui';

export const SchemesPage: React.FC = () => {
  return (
    <div className="schemes-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="success" style={{ marginBottom: 'var(--space-2)' }}>
          योजना शोध • Welfare Schemes Directory
        </Badge>
        <h1 style={{ fontSize: '2rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
          Maharashtra & Central Schemes (कल्याणकारी योजना)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px' }}>
          Discover state and central welfare schemes you are eligible for, understand income and age criteria, and locate official portal links.
        </p>
      </div>

      <Alert variant="info" style={{ marginBottom: 'var(--space-6)' }}>
        Deterministic scheme indexing, filtering, and eligibility questionnaires will be connected in Phase P06 (Scheme Finder).
      </Alert>

      <div className="grid grid-cols-1 grid-cols-2-md" style={{ gap: 'var(--space-6)' }}>
        <Card variant="default">
          <CardHeader>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <Badge variant="success" size="sm">महिला व बालविकास</Badge>
              <Badge variant="neutral" size="sm">महाराष्ट्र राज्य</Badge>
            </div>
            <CardTitle>Mukhyamantri Majhi Ladki Bahin Yojana</CardTitle>
            <CardDescription>₹1,500 monthly direct bank transfer for eligible women aged 21–65.</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Eligibility: Annual family income under ₹2.5 Lakhs, Maharashtra resident with Aadhaar-linked bank account.
            </p>
          </CardBody>
        </Card>

        <Card variant="default">
          <CardHeader>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <Badge variant="info" size="sm">कृषी विभाग</Badge>
              <Badge variant="neutral" size="sm">केंद्र व राज्य</Badge>
            </div>
            <CardTitle>Namo Shetkari Mahasanman Nidhi Yojana</CardTitle>
            <CardDescription>Financial assistance of ₹6,000 per year for farmer families alongside PM-KISAN.</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Eligibility: Landholder farmer families with active land records and e-KYC compliance.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
