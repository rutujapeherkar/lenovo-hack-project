/**
 * Sahayak AI — Citizen Settings & Accessibility Preferences Page
 * 
 * Source of Truth: docs/source-of-truth/UI.md Section 32 & ARCHITECTURE.md Section 28
 * Phase: P09 — Accessibility & Voice
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, Button, Alert } from '../components/ui';
import { useAccessibility, VoiceService } from '../core/accessibility';

export const SettingsPage: React.FC = () => {
  const {
    textScale,
    highContrast,
    reducedMotion,
    readAloud,
    language,
    setTextScale,
    setHighContrast,
    setReducedMotion,
    setReadAloud,
    setLanguage,
    resetPreferences,
  } = useAccessibility();

  const isVoiceSupported = VoiceService.isSpeechRecognitionSupported();
  const isTtsSupported = VoiceService.isSpeechSynthesisSupported();

  const badgeText = language === 'mr'
    ? 'प्राधान्ये आणि सुलभता • Citizen Settings'
    : language === 'hi'
    ? 'प्राथमिकताएं और सुगमता • Citizen Settings'
    : 'Citizen Settings & Accessibility Preferences';

  const headingText = language === 'mr'
    ? 'सुलभता आणि प्राधान्ये (Accessibility & Interface Preferences)'
    : language === 'hi'
    ? 'सुगमता और प्राथमिकताएं (Accessibility & Interface Preferences)'
    : 'Accessibility & Interface Preferences';

  const subtitleText = language === 'mr'
    ? 'आपल्या गरजेनुसार वाचन आकार, दृश्य कॉन्ट्रास्ट आणि व्हॉइस पर्याय निवडा (WCAG 2.1 AA / AAA मानके).'
    : language === 'hi'
    ? 'अपनी आवश्यकतानुसार फ़ॉन्ट साइज़, कंट्रास्ट और वॉयस विकल्प चुनें (WCAG 2.1 AA / AAA मानक)।'
    : 'Customize visual contrast, text readability scale, animation behavior, and voice features for optimal comfort under WCAG 2.1 AA / AAA guidelines.';

  return (
    <div className="settings-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="info" style={{ marginBottom: 'var(--space-2)' }}>
          {badgeText}
        </Badge>
        <h1 style={{ fontSize: '2rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
          {headingText}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.6 }}>
          {subtitleText}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '720px' }}>
        
        {/* Preferred Language */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Preferred Language (पसंतीची भाषा)</CardTitle>
            <CardDescription>
              Select your primary language for civic guidance, voice input, and spoken read-aloud.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Button
                variant={language === 'mr' ? 'primary' : 'outline'}
                onClick={() => setLanguage('mr')}
              >
                मराठी (Marathi)
              </Button>
              <Button
                variant={language === 'en' ? 'primary' : 'outline'}
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
              <Button
                variant={language === 'hi' ? 'primary' : 'outline'}
                onClick={() => setLanguage('hi')}
              >
                हिंदी (Hindi)
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Contrast Mode */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>High-Contrast Theme (उच्च कॉन्ट्रास्ट मोड)</CardTitle>
            <CardDescription>
              Enforces deep pure black text and high-contrast solid borders with contrast ratio $\ge 7:1$ (WCAG AAA).
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant={!highContrast ? 'primary' : 'outline'}
                onClick={() => setHighContrast(false)}
              >
                Standard Contrast
              </Button>
              <Button
                variant={highContrast ? 'primary' : 'outline'}
                onClick={() => setHighContrast(true)}
              >
                {highContrast ? 'High Contrast Mode: ACTIVE' : 'Enable High Contrast'}
              </Button>
            </div>
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
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Button
                variant={textScale === 'normal' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTextScale('normal')}
              >
                Normal (100%)
              </Button>
              <Button
                variant={textScale === 'large' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTextScale('large')}
              >
                Large (115%)
              </Button>
              <Button
                variant={textScale === 'extra-large' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTextScale('extra-large')}
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
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant={!reducedMotion ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setReducedMotion(false)}
              >
                Standard Motion
              </Button>
              <Button
                variant={reducedMotion ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setReducedMotion(true)}
              >
                {reducedMotion ? 'Reduced Motion: ACTIVE' : 'Enable Reduced Motion'}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Voice & Speech Synthesis */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Voice & Audio Interaction (आवाज आणि ऑडिओ संवाद)</CardTitle>
            <CardDescription>
              Configure spoken voice responses and speech-to-text input.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <Button
                  variant={readAloud ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setReadAloud(!readAloud)}
                >
                  {readAloud ? '🔊 Read Responses Aloud: ENABLED' : '🔇 Read Responses Aloud: OFF'}
                </Button>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>Browser Capabilities: </span>
                <span style={{ fontWeight: 600 }}>
                  Speech Recognition: {isVoiceSupported ? '🟢 Available' : '🔴 Not Supported by this browser'}
                </span>
                {' • '}
                <span style={{ fontWeight: 600 }}>
                  Speech Synthesis (TTS): {isTtsSupported ? '🟢 Available' : '🔴 Not Supported'}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Reset Preferences */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant="outline" size="sm" onClick={resetPreferences}>
            ↺ Reset All Preferences to Defaults
          </Button>
        </div>

        {/* Zero-Credential Storage Safety Card */}
        <Alert variant="info" title="Privacy and Data Storage Guarantee">
          Sahayak AI stores your accessibility preferences exclusively in your local browser storage. Voice audio is processed ephemerally using browser-native APIs and is NEVER recorded, saved to disk, or sent to external trackers.
        </Alert>
      </div>
    </div>
  );
};
