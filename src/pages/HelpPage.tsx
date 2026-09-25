import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge } from '../components/ui';
import { useLanguage } from '../core/language';

export const HelpPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = (language === 'mr' || language === 'hi') ? language : 'en';

  const t = {
    badge: {
      en: 'Citizen Help & FAQs • Support Center',
      mr: 'नागरिक मदत व वारंवार विचारले जाणारे प्रश्न • मदत केंद्र',
      hi: 'नागरिक सहायता और अक्सर पूछे जाने वाले प्रश्न • सहायता केंद्र',
    },
    title: {
      en: 'Help, Citizen FAQs & Helplines',
      mr: 'मदत, नागरिक प्रश्न आणि अधिकृत हेल्पलाइन',
      hi: 'मदद, नागरिक प्रश्न और आधिकारिक हेल्पलाइन',
    },
    subtitle: {
      en: 'Learn about your rights under the Maharashtra Right to Public Services Act (RTS Act 2015), privacy protections, and official escalation mechanisms.',
      mr: 'महाराष्ट्र लोकसेवा हक्क कायदा २०१५ अंतर्गत आपले अधिकार, गोपनीयता संरक्षण आणि अधिकृत दाद मागण्याची कार्यपद्धती जाणून घ्या.',
      hi: 'महाराष्ट्र लोकसेवा अधिकार अधिनियम २०१५ के तहत अपने अधिकार, गोपनीयता सुरक्षा और आधिकारिक अपील तंत्र के बारे में जानें।',
    },
    rtsBadge: {
      en: 'RTS Act 2015',
      mr: 'आरटीएस कायदा २०१५',
      hi: 'आरटीएस अधिनियम २०१५',
    },
    rtsTitle: {
      en: 'What is the Right to Public Services Act?',
      mr: 'महाराष्ट्र लोकसेवा हक्क कायदा काय आहे?',
      hi: 'लोकसेवा अधिकार अधिनियम क्या है?',
    },
    rtsSubtitle: {
      en: 'Maharashtra Right to Public Services Act, 2015',
      mr: 'महाराष्ट्र लोकसेवा हक्क कायदा २०१५ अंतर्गत हमी',
      hi: 'महाराष्ट्र लोकसेवा अधिकार अधिनियम २०१५ के अंतर्गत गारंटी',
    },
    rtsBody: {
      en: 'The RTS Act guarantees transparent, efficient, and time-bound delivery of notified public services to citizens of Maharashtra. If a service is not delivered within the stipulated time, citizens have the right to file an appeal.',
      mr: 'हा कायदा महाराष्ट्रातील नागरिकांना पारदर्शक, कार्यक्षम आणि विहित मुदतीत अधिसूचित शासकीय सेवा मिळण्याची कायदेशीर हमी देतो. विहित मुदतीत सेवा न मिळाल्यास प्रथम व द्वितीय अपील करण्याचा अधिकार नागरिकांना आहे.',
      hi: 'यह अधिनियम महाराष्ट्र के नागरिकों को पारदर्शी, कुशल और समयबद्ध तरीके से अधिसूचित सार्वजनिक सेवाएं प्रदान करने की गारंटी देता है। निर्धारित समय में सेवा न मिलने पर नागरिकों को अपील दायर करने का अधिकार है।',
    },
    privacyBadge: {
      en: 'Data Protection & Safety',
      mr: 'माहिती सुरक्षितता व गोपनीयता',
      hi: 'डेटा सुरक्षा और गोपनीयता',
    },
    privacyTitle: {
      en: 'Does Sahayak store my Aadhaar or Bank details?',
      mr: 'साहायक माझे आधार किंवा बँक तपशील साठवून ठेवतो का?',
      hi: 'क्या साहायक मेरे आधार या बैंक विवरण संग्रहीत करता है?',
    },
    privacySubtitle: {
      en: 'Zero-Credential Storage Policy',
      mr: 'शून्य-क्रेडेंशियल साठवणूक धोरण',
      hi: 'शून्य-क्रेडेंशियल संग्रहण नीति',
    },
    privacyBody: {
      en: 'No. Sahayak AI adheres to a strict Zero-Credential Storage policy. We do not store, log, or transmit personal identity documents, passwords, OTPs, or financial records.',
      mr: 'नाही. साहायक एआय कोणत्याही प्रकारचे वैयक्तिक ओळख दस्तऐवज, पासवर्ड, ओटीपी (OTP), पिन (PIN) किंवा बँक तपशील कधीही साठवून ठेवत नाही किंवा लॉग करत नाही.',
      hi: 'नहीं। साहायक एआई शून्य-क्रेडेंशियल संग्रहण नीति का सख्ती से पालन करता है। हम व्यक्तिगत पहचान दस्तावेज, पासवर्ड, ओटीपी (OTP), पिन (PIN) या वित्तीय रिकॉर्ड कभी संग्रहीत या लॉग नहीं करते।',
    },
    helplinesHeading: {
      en: 'Official Support Helplines',
      mr: 'अधिकृत शासकीय मदत केंद्र व दूरध्वनी',
      hi: 'आधिकारिक सरकारी सहायता केंद्र और हेल्पलाइन',
    },
    aapleSarkarTitle: {
      en: 'Aaple Sarkar Toll-Free',
      mr: 'आपले सरकार टोल-फ्री',
      hi: 'आपले सरकार टोल-फ्री',
    },
    aapleSarkarDesc: {
      en: 'Government of Maharashtra Citizen Helpline',
      mr: 'महाराष्ट्र शासन नागरिक संपर्क केंद्र',
      hi: 'महाराष्ट्र सरकार नागरिक हेल्पलाइन',
    },
    available247: {
      en: 'Available 24x7',
      mr: '२४ तास उपलब्ध',
      hi: '२४ घंटे उपलब्ध',
    },
    rtsHelplineTitle: {
      en: 'RTS Commission Helpline',
      mr: 'लोकसेवा हक्क आयोग हेल्पलाईन',
      hi: 'लोकसेवा अधिकार आयोग हेल्पलाइन',
    },
    rtsHelplineDesc: {
      en: 'Right to Services Escalations & Appeals',
      mr: 'सेवा हक्क दाद व तक्रार निवारण',
      hi: 'सेवा अधिकार शिकायत निवारण',
    },
    rtsHelplineHours: {
      en: 'Mon–Fri (10:00 AM – 5:30 PM)',
      mr: 'सोम–शुक्र (सकाळी १०:०० ते संध्याकाळी ५:३०)',
      hi: 'सोम–शुक्र (सुबह १०:०० से शाम ५:३०)',
    },
    mahadbtTitle: {
      en: 'MahaDBT Technical Support',
      mr: 'MahaDBT तांत्रिक सहाय्य',
      hi: 'MahaDBT तकनीकी सहायता',
    },
    mahadbtDesc: {
      en: 'Scholarship & Direct Benefit Transfer Portal',
      mr: 'शिष्यवृत्ती व थेट लाभ हस्तांतरण कक्ष',
      hi: 'छात्रवृत्ति और प्रत्यक्ष लाभ अंतरण पोर्टल',
    },
    workingDays: {
      en: 'Working Days (9:00 AM – 6:00 PM)',
      mr: 'शासकीय कामकाजाचे दिवस (सकाळी ९:०० ते संध्याकाळी ६:००)',
      hi: 'कार्य दिवस (सुबह ९:०० से शाम ६:००)',
    },
  };

  return (
    <div className="help-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="info" style={{ marginBottom: 'var(--space-2)' }}>
          {t.badge[lang]}
        </Badge>
        <h1 style={{ fontSize: '2rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
          {t.title[lang]}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.6 }}>
          {t.subtitle[lang]}
        </p>
      </div>

      <div className="grid grid-cols-1 grid-cols-2-md" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <Card variant="default">
          <CardHeader>
            <Badge variant="info" size="sm">{t.rtsBadge[lang]}</Badge>
            <CardTitle>{t.rtsTitle[lang]}</CardTitle>
            <CardDescription>{t.rtsSubtitle[lang]}</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
              {t.rtsBody[lang]}
            </p>
          </CardBody>
        </Card>

        <Card variant="default">
          <CardHeader>
            <Badge variant="warning" size="sm">{t.privacyBadge[lang]}</Badge>
            <CardTitle>{t.privacyTitle[lang]}</CardTitle>
            <CardDescription>{t.privacySubtitle[lang]}</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
              {t.privacyBody[lang]}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Official Helplines */}
      <h2 style={{ fontSize: '1.375rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-4)' }}>
        {t.helplinesHeading[lang]}
      </h2>
      <div className="grid grid-cols-1 grid-cols-3-md" style={{ gap: 'var(--space-4)' }}>
        <Card variant="official-source">
          <CardHeader>
            <CardTitle>{t.aapleSarkarTitle[lang]}</CardTitle>
            <CardDescription>{t.aapleSarkarDesc[lang]}</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--sahayak-blue)', margin: 0 }}>
              📞 1800 120 8040
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.available247[lang]}</span>
          </CardBody>
        </Card>

        <Card variant="official-source">
          <CardHeader>
            <CardTitle>{t.rtsHelplineTitle[lang]}</CardTitle>
            <CardDescription>{t.rtsHelplineDesc[lang]}</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--sahayak-blue)', margin: 0 }}>
              📞 022-22045656
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.rtsHelplineHours[lang]}</span>
          </CardBody>
        </Card>

        <Card variant="official-source">
          <CardHeader>
            <CardTitle>{t.mahadbtTitle[lang]}</CardTitle>
            <CardDescription>{t.mahadbtDesc[lang]}</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--sahayak-blue)', margin: 0 }}>
              📞 022-49150800
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.workingDays[lang]}</span>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
