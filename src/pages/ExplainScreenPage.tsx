import React from 'react';
import { Card, CardTitle, CardDescription, Badge, Alert, Button } from '../components/ui';

export const ExplainScreenPage: React.FC = () => {
  return (
    <div className="explain-screen-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="warning" style={{ marginBottom: 'var(--space-2)' }}>
          दृष्टी सहाय्य • Visual Assist
        </Badge>
        <h1 style={{ fontSize: '2rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
          Explain This Screen (स्क्रीन समजावून सांगा)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px' }}>
          Upload a screenshot of any Maharashtra government portal or document form to get a clear, step-by-step Marathi or Hindi explanation of what each field means.
        </p>
      </div>

      <Alert variant="info" style={{ marginBottom: 'var(--space-6)' }}>
        Multimodal image analysis pipeline and OCR privacy protection will be activated in Phase P07 (Explain Screen).
      </Alert>

      <Card variant="default" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>📸</div>
        <CardTitle style={{ marginBottom: 'var(--space-2)' }}>Upload Portal Screenshot</CardTitle>
        <CardDescription style={{ marginBottom: 'var(--space-6)' }}>
          Supported formats: PNG, JPG, WEBP. Maximum file size: 5MB.
        </CardDescription>

        <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-4) 0', fontSize: '0.9375rem' }}>
            ड्रॅग करा किंवा स्क्रीनशॉट निवडा / Drag and drop screenshot here
          </p>
          <Button variant="secondary" size="md">
            Choose Screenshot / फाईल निवडा
          </Button>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          🔒 Privacy Notice: Screenshots are processed in memory and never stored permanently. Do not upload Aadhaar full numbers or banking passwords.
        </p>
      </Card>
    </div>
  );
};
