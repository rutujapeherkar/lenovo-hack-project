import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, Button, Alert } from '../components/ui';

export const SettingsPage: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState<'default' | 'large' | 'extra-large'>('default');
  const [motionReduced, setMotionReduced] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setHighContrast(root.getAttribute('data-contrast') === 'high');
    const scale = root.getAttribute('data-text-scale') as 'large' | 'extra-large' | null;
    setTextScale(scale || 'default');
    setMotionReduced(root.getAttribute('data-motion') === 'reduced');
  }, []);

  const handleContrastToggle = () => {
    const root = document.documentElement;
    if (highContrast) {
      root.removeAttribute('data-contrast');
      setHighContrast(false);
    } else {
      root.setAttribute('data-contrast', 'high');
      setHighContrast(true);
    }
  };

  const handleTextScaleChange = (scale: 'default' | 'large' | 'extra-large') => {
    const root = document.documentElement;
    if (scale === 'default') {
      root.removeAttribute('data-text-scale');
    } else {
      root.setAttribute('data-text-scale', scale);
    }
    setTextScale(scale);
  };

  const handleMotionToggle = () => {
    const root = document.documentElement;
    if (motionReduced) {
      root.removeAttribute('data-motion');
      setMotionReduced(false);
    } else {
      root.setAttribute('data-motion', 'reduced');
      setMotionReduced(true);
    }
  };

  return (
    <div className="settings-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="info" style={{ marginBottom: 'var(--space-2)' }}>
          प्राधान्ये आणि सुलभता • Citizen Settings
        </Badge>
        <h1 style={{ fontSize: '2rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
          Accessibility & Interface Preferences (सुलभता आणि प्राधान्ये)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px' }}>
          Customize visual contrast, text readability scale, and animation behavior for optimal comfort under WCAG 2.1 AA guidelines.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '720px' }}>
        {/* Contrast Mode */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>High-Contrast Theme (उच्च कॉन्ट्रास्ट मोड)</CardTitle>
            <CardDescription>
              Enforces deep pure black text and high-contrast solid borders with contrast ratio $\ge 7:1$.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <Button
              variant={highContrast ? 'primary' : 'outline'}
              onClick={handleContrastToggle}
            >
              {highContrast ? 'High Contrast Mode: ACTIVE' : 'Enable High Contrast Mode'}
            </Button>
          </CardBody>
        </Card>

        {/* Text Scaling */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Text Readability Scale (फॉन्ट आकार)</CardTitle>
            <CardDescription>
              Increase base font sizing across all pages without clipping or overflowing layout containers.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant={textScale === 'default' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleTextScaleChange('default')}
              >
                Default (100%)
              </Button>
              <Button
                variant={textScale === 'large' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleTextScaleChange('large')}
              >
                Large (115%)
              </Button>
              <Button
                variant={textScale === 'extra-large' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleTextScaleChange('extra-large')}
              >
                Extra Large (130%)
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Reduced Motion */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Reduced Motion (हालचाल कमी करा)</CardTitle>
            <CardDescription>
              Disables CSS transitions, pulses, and animated voice indicators for users sensitive to motion.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <Button
              variant={motionReduced ? 'primary' : 'outline'}
              size="sm"
              onClick={handleMotionToggle}
            >
              {motionReduced ? 'Reduced Motion: ACTIVE' : 'Enable Reduced Motion'}
            </Button>
          </CardBody>
        </Card>

        {/* Zero-Credential Storage Safety Card */}
        <Alert variant="info" title="Privacy and Data Storage Guarantee">
          Sahayak AI stores your theme preferences exclusively in your local browser. No telemetry or personal information is transmitted to any cloud servers.
        </Alert>
      </div>
    </div>
  );
};
