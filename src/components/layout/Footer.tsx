import React from 'react';
import { Link } from '../../router';

export interface FooterProps {
  currentLanguage?: 'en' | 'mr' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({ currentLanguage = 'en' }) => {
  const disclaimerText = {
    en: 'Disclaimer: Sahayak AI provides guidance and does not represent a government department. Always confirm final requirements on official government portals.',
    mr: 'अस्वीकरण: साहाय्यक एआय हे केवळ मार्गदर्शनासाठी आहे आणि ते कोणत्याही सरकारी विभागाचे प्रतिनिधित्व करत नाही. अंतिम माहितीसाठी नेहमी अधिकृत सरकारी पोर्टल तपासा.',
    hi: 'अस्वीकरण: सहायक एआई केवल मार्गदर्शन प्रदान करता है और किसी भी सरकारी विभाग का प्रतिनिधित्व नहीं करता है। अंतिम जानकारी के लिए हमेशा आधिकारिक सरकारी पोर्टल देखें।',
  };

  return (
    <footer role="contentinfo" className="app-footer">
      <div className="footer-container">
        {/* Civic Mandatory Disclaimer Box */}
        <div className="footer-disclaimer-box" role="note" aria-label="Official Disclaimer">
          <p className="footer-disclaimer-text">
            <strong>⚠️ {currentLanguage === 'mr' ? 'महत्त्वाचे' : currentLanguage === 'hi' ? 'महत्वपूर्ण' : 'Important'}:</strong>{' '}
            {disclaimerText[currentLanguage]}
          </p>
        </div>

        {/* Footer Navigation & Portal Attribution Grid */}
        <div className="footer-grid">
          {/* Col 1: About Sahayak AI */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <img
                src="/sahayak-logo.png"
                alt="Sahayak AI Logo"
                width={32}
                height={32}
                style={{
                  borderRadius: 'var(--radius-sm, 6px)',
                  objectFit: 'contain',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '2px',
                }}
              />
              <h3 className="footer-col-title" style={{ margin: 0 }}>Sahayak AI</h3>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#CBD5E1', margin: '0 0 1rem 0' }}>
              {currentLanguage === 'mr'
                ? 'महाराष्ट्रातील नागरिकांना शासकीय योजना, प्रमाणपत्रे आणि सेवा समजून घेण्यासाठी व अर्ज करण्यासाठी साहाय्यक करणारी एआय प्रणाली.'
                : currentLanguage === 'hi'
                ? 'महाराष्ट्र के नागरिकों को सरकारी योजनाओं, प्रमाणपत्रों और सेवाओं को समझने और आवेदन करने में सहायता करने वाली एआई प्रणाली।'
                : 'An AI-guided civic assistance platform helping citizens navigate Maharashtra government schemes, certificates, and services.'}
            </p>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              🔒 Zero-Credential Storage • Privacy-Preserving
            </span>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="footer-col-title">
              {currentLanguage === 'mr' ? 'जलद दुवे' : currentLanguage === 'hi' ? 'त्वरित लिंक' : 'Quick Navigation'}
            </h3>
            <ul className="footer-links-list">
              <li>
                <Link href="/" className="footer-link">
                  {currentLanguage === 'mr' ? 'मुख्यपृष्ठ' : currentLanguage === 'hi' ? 'होम' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/services" className="footer-link">
                  {currentLanguage === 'mr' ? 'सेवा व प्रमाणपत्रे' : currentLanguage === 'hi' ? 'सेवाएं और प्रमाण पत्र' : 'Services & Certificates'}
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="footer-link">
                  {currentLanguage === 'mr' ? 'शासकीय योजना' : currentLanguage === 'hi' ? 'सरकारी योजनाएं' : 'Welfare Schemes'}
                </Link>
              </li>
              <li>
                <Link href="/explain-screen" className="footer-link">
                  {currentLanguage === 'mr' ? 'स्क्रीन समजावा' : currentLanguage === 'hi' ? 'स्क्रीन समझाएं' : 'Explain Screen'}
                </Link>
              </li>
              <li>
                <Link href="/extension" className="footer-link">
                  {currentLanguage === 'mr' ? 'ब्राउझर साथी' : currentLanguage === 'hi' ? 'ब्राउज़र साथी' : 'Browser Companion'}
                </Link>
              </li>
              <li>
                <Link href="/settings" className="footer-link">
                  {currentLanguage === 'mr' ? 'सुलभता व प्राधान्ये' : currentLanguage === 'hi' ? 'सुलभता और सेटिंग्स' : 'Settings & Preferences'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Maharashtra Portals */}
          <div>
            <h3 className="footer-col-title">
              {currentLanguage === 'mr' ? 'अधिकृत सरकारी पोर्टल्स' : currentLanguage === 'hi' ? 'आधिकारिक सरकारी पोर्टल' : 'Official Portals'}
            </h3>
            <ul className="footer-links-list">
              <li>
                <a
                  href="https://aaplesarkar.mahaonline.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Aaple Sarkar <span style={{ opacity: 0.75, fontSize: '0.8rem' }}>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://mahadbt.maharashtra.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  MahaDBT Portal <span style={{ opacity: 0.75, fontSize: '0.8rem' }}>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://edistrict.maharashtra.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  RTS Maharashtra <span style={{ opacity: 0.75, fontSize: '0.8rem' }}>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.india.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  National Portal of India <span style={{ opacity: 0.75, fontSize: '0.8rem' }}>↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Citizen Assistance & Helplines */}
          <div>
            <h3 className="footer-col-title">
              {currentLanguage === 'mr' ? 'नागरिक मदत' : currentLanguage === 'hi' ? 'नागरिक सहायता' : 'Citizen Assistance'}
            </h3>
            <ul className="footer-links-list">
              <li><Link href="/help" className="footer-link">Help & Citizen FAQs</Link></li>
              <li>
                <span style={{ fontSize: '0.875rem', color: '#CBD5E1' }}>
                  Aaple Sarkar Toll-Free: <strong>1800 120 8040</strong>
                </span>
              </li>
              <li>
                <span style={{ fontSize: '0.875rem', color: '#CBD5E1' }}>
                  RTS Helpdesk: <strong>022-22045656</strong>
                </span>
              </li>
              <li><Link href="/design-system" className="footer-link">Design System Tokens</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Sahayak AI. Open Civic Tech Initiative for Citizen Empowerment.
          </div>
          <div>
            Designed for Maharashtra Citizens • Accessible under WCAG 2.1 AA
          </div>
        </div>
      </div>
    </footer>
  );
};
