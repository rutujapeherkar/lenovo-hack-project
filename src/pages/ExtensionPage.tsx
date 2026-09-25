import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, Alert, Button } from '../components/ui';

export const ExtensionPage: React.FC = () => {
  return (
    <div className="extension-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="neutral" style={{ marginBottom: 'var(--space-2)' }}>
          ब्राउझर विस्तार • Browser Companion
        </Badge>
        <h1 style={{ fontSize: '2rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
          Sahayak AI Chrome Side-Panel Companion
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px' }}>
          An in-browser assistant that opens alongside Aaple Sarkar and MahaDBT portals, providing contextual step roadmaps and field-level guidance without leaving the portal.
        </p>
      </div>

      <Alert variant="info" style={{ marginBottom: 'var(--space-6)' }}>
        Extension Manifest V3 bundle and DOM highlighter engine will be implemented in Phase P08 (Browser Extension).
      </Alert>

      <div className="grid grid-cols-1 grid-cols-3-md" style={{ gap: 'var(--space-6)' }}>
        <Card variant="default">
          <CardHeader>
            <CardTitle>Side-Panel Integration</CardTitle>
            <CardDescription>Zero-tab switching</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Opens directly in Chrome's side panel alongside Aaple Sarkar pages for real-time guidance.
            </p>
          </CardBody>
        </Card>

        <Card variant="default">
          <CardHeader>
            <CardTitle>Field Highlighting</CardTitle>
            <CardDescription>Visual DOM assistance</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Non-intrusively highlights required inputs and translates technical English fields to Marathi.
            </p>
          </CardBody>
        </Card>

        <Card variant="default">
          <CardHeader>
            <CardTitle>Strict Safety Barrier</CardTitle>
            <CardDescription>Zero automated form submission</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Sahayak AI guides the user but never automatically submits forms, intercepts passwords, or stores credentials.
            </p>
          </CardBody>
        </Card>
      </div>

      <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
        <Button variant="primary" size="lg" disabled>
          Download Extension (.zip) — Coming in P08
        </Button>
      </div>
    </div>
  );
};
