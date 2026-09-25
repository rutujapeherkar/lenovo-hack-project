/**
 * Sahayak AI — Browser Extension Information Page (P12 Polish)
 *
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 28
 * Phase: P12 — Demo & Hackathon Polish
 *
 * Shows the fully-implemented extension (P08 complete) with actual
 * installation instructions and feature overview for judges.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, Alert } from '../components/ui';
import { useLanguage } from '../core/language';

const INSTALL_STEPS = [
  {
    step: 1,
    icon: '⚙️',
    titleEn: 'Build the Extension',
    titleMr: 'विस्तार तयार करा',
    titleHi: 'एक्सटेंशन बनाएं',
    descEn: 'In your terminal, run: npm run build:extension — this compiles the Manifest V3 bundle into extension/dist/',
    descMr: 'टर्मिनलमध्ये चालवा: npm run build:extension — हे Manifest V3 बंडल extension/dist/ मध्ये संकलित करेल.',
    descHi: 'टर्मिनल में चलाएं: npm run build:extension — यह Manifest V3 बंडल को extension/dist/ में संकलित करेगा.',
  },
  {
    step: 2,
    icon: '🔧',
    titleEn: 'Open Chrome Extensions',
    titleMr: 'Chrome Extensions उघडा',
    titleHi: 'Chrome Extensions खोलें',
    descEn: 'In Chrome, navigate to chrome://extensions — enable "Developer Mode" toggle in the top right.',
    descMr: 'Chrome मध्ये chrome://extensions वर जा — उजव्या वरच्या कोपऱ्यात "Developer Mode" चालू करा.',
    descHi: 'Chrome में chrome://extensions पर जाएं — ऊपर दाईं ओर "Developer Mode" चालू करें.',
  },
  {
    step: 3,
    icon: '📂',
    titleEn: 'Load the Extension Folder',
    titleMr: 'विस्तार फोल्डर लोड करा',
    titleHi: 'एक्सटेंशन फ़ोल्डर लोड करें',
    descEn: 'Click "Load unpacked" and select the extension/dist/ folder from the project repository.',
    descMr: '"Load unpacked" वर क्लिक करा आणि प्रकल्प रिपॉझिटरीमधून extension/dist/ फोल्डर निवडा.',
    descHi: '"Load unpacked" पर क्लिक करें और प्रोजेक्ट रिपॉजिटरी से extension/dist/ फोल्डर चुनें.',
  },
  {
    step: 4,
    icon: '🌐',
    titleEn: 'Open a Supported Portal',
    titleMr: 'समर्थित पोर्टल उघडा',
    titleHi: 'समर्थित पोर्टल खोलें',
    descEn: 'Visit aaplesarkar.mahaonline.gov.in or mahadbt.maharashtra.gov.in in Chrome.',
    descMr: 'Chrome मध्ये aaplesarkar.mahaonline.gov.in किंवा mahadbt.maharashtra.gov.in ला भेट द्या.',
    descHi: 'Chrome में aaplesarkar.mahaonline.gov.in या mahadbt.maharashtra.gov.in पर जाएं.',
  },
  {
    step: 5,
    icon: '🪟',
    titleEn: 'Open Sahayak Side Panel',
    titleMr: 'साहायक साइड पॅनेल उघडा',
    titleHi: 'साहायक साइड पैनल खोलें',
    descEn: 'Click the Sahayak extension icon in the Chrome toolbar, then open the Side Panel from the extension popup.',
    descMr: 'Chrome टूलबारमध्ये साहायक विस्तार चिन्हावर क्लिक करा, नंतर पॉपअपमधून Side Panel उघडा.',
    descHi: 'Chrome टूलबार में साहायक एक्सटेंशन आइकन पर क्लिक करें, फिर पॉपअप से Side Panel खोलें.',
  },
];

const FEATURES = [
  {
    icon: '🪟',
    titleEn: 'Chrome Side Panel',
    titleMr: 'Chrome साइड पॅनेल',
    titleHi: 'Chrome साइड पैनल',
    descEn: 'Opens directly alongside Aaple Sarkar and MahaDBT pages — no tab switching required.',
    descMr: 'आपले सरकार आणि MahaDBT पृष्ठांच्या शेजारी थेट उघडते — टॅब बदलण्याची गरज नाही.',
    descHi: 'आपले सरकार और MahaDBT पृष्ठों के साथ सीधे खुलता है — टैब बदलने की जरूरत नहीं.',
  },
  {
    icon: '🔍',
    titleEn: 'Portal Detection',
    titleMr: 'पोर्टल ओळख',
    titleHi: 'पोर्टल पहचान',
    descEn: 'Automatically identifies Aaple Sarkar, MahaDBT, RCMS, and MahaRera portals by URL.',
    descMr: 'URL द्वारे Aaple Sarkar, MahaDBT, RCMS, MahaRera पोर्टल्स आपोआप ओळखते.',
    descHi: 'URL द्वारा Aaple Sarkar, MahaDBT, RCMS, MahaRera पोर्टल्स स्वचालित रूप से पहचानता है.',
  },
  {
    icon: '✏️',
    titleEn: 'Field Guidance',
    titleMr: 'फील्ड मार्गदर्शन',
    titleHi: 'फ़ील्ड मार्गदर्शन',
    descEn: 'Highlights required form fields and explains them in simple Marathi, Hindi, or English.',
    descMr: 'आवश्यक फॉर्म फील्ड्स हायलाइट करते आणि सोप्या मराठी, हिंदी किंवा इंग्रजीत स्पष्ट करते.',
    descHi: 'आवश्यक फॉर्म फील्ड्स हाइलाइट करता है और सरल मराठी, हिंदी या अंग्रेजी में समझाता है.',
  },
  {
    icon: '🔒',
    titleEn: 'Strict Safety Barrier',
    titleMr: 'कठोर सुरक्षा',
    titleHi: 'कड़ी सुरक्षा',
    descEn: 'Never auto-submits forms, never reads passwords, never stores credentials — guiding only.',
    descMr: 'फॉर्म कधीही आपोआप सबमिट करत नाही, पासवर्ड वाचत नाही, तपशील साठवत नाही — फक्त मार्गदर्शन.',
    descHi: 'कभी ऑटो-सबमिट नहीं करता, पासवर्ड नहीं पढ़ता, तपशील नहीं रखता — केवल मार्गदर्शन.',
  },
];

export const ExtensionPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language as 'en' | 'mr' | 'hi';

  const getTitle = (item: { titleEn: string; titleMr: string; titleHi: string }) =>
    lang === 'mr' ? item.titleMr : lang === 'hi' ? item.titleHi : item.titleEn;
  const getDesc = (item: { descEn: string; descMr: string; descHi: string }) =>
    lang === 'mr' ? item.descMr : lang === 'hi' ? item.descHi : item.descEn;

  return (
    <div className="extension-page">
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="info" style={{ marginBottom: 'var(--space-2)' }}>
          ब्राउझर विस्तार • Browser Companion
        </Badge>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)', letterSpacing: '-0.01em' }}>
          {lang === 'mr' ? 'साहायक AI Chrome साइड-पॅनेल साथी' : lang === 'hi' ? 'साहायक AI Chrome साइड-पैनल साथी' : 'Sahayak AI Chrome Side-Panel Companion'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.6 }}>
          {lang === 'mr'
            ? 'Chrome ब्राउझरमध्ये आपले सरकार आणि MahaDBT पोर्टलसह उघडणारा इन-ब्राउझर सहाय्यक, जो प्रासंगिक पायरी रोडमॅप आणि फील्ड-स्तरीय मार्गदर्शन प्रदान करतो.'
            : lang === 'hi'
            ? 'Chrome ब्राउज़र में आपले सरकार और MahaDBT पोर्टल के साथ खुलने वाला इन-ब्राउज़र सहायक, जो संदर्भात्मक चरण रोडमैप और फ़ील्ड-स्तरीय मार्गदर्शन प्रदान करता है.'
            : 'An in-browser assistant that opens alongside Aaple Sarkar and MahaDBT portals, providing contextual step roadmaps and field-level guidance.'}
        </p>
      </div>

      {/* Implementation Status — P08 Complete */}
      <Alert variant="info" style={{ marginBottom: 'var(--space-6)' }}>
        ✅ {lang === 'mr'
          ? 'विस्तार P08 मध्ये लागू करण्यात आला आहे. Manifest V3, DOM हायलाइटर आणि साइड पॅनेल UI सक्रिय आहे.'
          : lang === 'hi'
          ? 'एक्सटेंशन P08 में लागू किया गया है। Manifest V3, DOM हाइलाइटर और साइड पैनल UI सक्रिय है.'
          : 'Extension is fully implemented (Phase P08 complete). Manifest V3, DOM Highlighter, and Side Panel UI are active.'}
      </Alert>

      {/* Install Steps */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-4)' }}>
        {lang === 'mr' ? 'Chrome मध्ये इन्स्टॉल कसे करावे' : lang === 'hi' ? 'Chrome में कैसे इंस्टॉल करें' : 'How to Install in Chrome'}
      </h2>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        {INSTALL_STEPS.map((step) => (
          <div
            key={step.step}
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-3)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '50%',
                background: 'var(--sahayak-blue-dark)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {step.step}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <span aria-hidden="true">{step.icon}</span>
                <strong style={{ color: 'var(--text)', fontSize: '0.9375rem' }}>{getTitle(step)}</strong>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: 1.55 }}>
                {getDesc(step)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-4)' }}>
        {lang === 'mr' ? 'वैशिष्ट्ये' : lang === 'hi' ? 'विशेषताएं' : 'Features'}
      </h2>
      <div className="grid grid-cols-1 grid-cols-2-md" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {FEATURES.map((feat) => (
          <Card key={feat.titleEn} variant="default">
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span aria-hidden="true">{feat.icon}</span>
                {getTitle(feat)}
              </CardTitle>
              <CardDescription>
                {lang === 'mr' ? 'P08 • विस्तार वैशिष्ट्य' : lang === 'hi' ? 'P08 • एक्सटेंशन फ़ीचर' : 'P08 • Extension Feature'}
              </CardDescription>
            </CardHeader>
            <CardBody>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {getDesc(feat)}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Supported Portals */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-4)' }}>
        {lang === 'mr' ? 'समर्थित अधिकृत पोर्टल्स' : lang === 'hi' ? 'समर्थित आधिकारिक पोर्टल' : 'Supported Official Portals'}
      </h2>
      <div className="grid grid-cols-1 grid-cols-2-md" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        {[
          { name: 'Aaple Sarkar', url: 'aaplesarkar.mahaonline.gov.in', desc: 'Government of Maharashtra — All Citizen Services' },
          { name: 'MahaDBT', url: 'mahadbt.maharashtra.gov.in', desc: 'Scholarship & Welfare Scheme Applications' },
          { name: 'RCMS', url: 'rcms.mahafood.gov.in', desc: 'Ration Card Management System' },
          { name: 'MahaRera', url: 'maharera.mahaonline.gov.in', desc: 'Real Estate Regulatory Authority' },
        ].map((portal) => (
          <div
            key={portal.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
            }}
          >
            <span style={{ fontSize: '1.25rem' }} aria-hidden="true">🏛️</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{portal.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{portal.url}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{portal.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        ℹ️ {lang === 'mr'
          ? 'वरील पोर्टल्सशिवाय इतर पृष्ठांवर, साहायक एआय-आधारित स्पष्टीकरण प्रदान करते (सत्यापित मार्गदर्शन नाही).'
          : lang === 'hi'
          ? 'ऊपर सूचीबद्ध पोर्टल्स के अलावा अन्य पृष्ठों पर, साहायक AI-आधारित स्पष्टीकरण प्रदान करता है (सत्यापित मार्गदर्शन नहीं).'
          : 'On pages outside the above list, Sahayak provides AI-based explanation (not verified step guidance).'}
      </p>
    </div>
  );
};
