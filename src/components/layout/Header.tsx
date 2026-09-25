import React, { useState } from 'react';
import { Link, useRouter } from '../../router';

export interface HeaderProps {
  currentLanguage?: 'en' | 'mr' | 'hi';
  onLanguageChange?: (lang: 'en' | 'mr' | 'hi') => void;
  isHighContrast?: boolean;
  onToggleHighContrast?: () => void;
  textScale?: 'default' | 'normal' | 'large' | 'extra-large';
  onCycleTextScale?: () => void;
  onOpenA11yPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage = 'mr',
  onLanguageChange,
  isHighContrast = false,
  onToggleHighContrast,
  textScale = 'default',
  onCycleTextScale,
  onOpenA11yPanel,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { path } = useRouter();

  const navItems = [
    { href: '/', labelEn: 'Home', labelMr: 'मुख्यपृष्ठ', labelHi: 'होम' },
    { href: '/services', labelEn: 'Services', labelMr: 'सेवा', labelHi: 'सेवाएं' },
    { href: '/schemes', labelEn: 'Schemes', labelMr: 'योजना', labelHi: 'योजनाएं' },
    { href: '/explain-screen', labelEn: 'Explain Screen', labelMr: 'स्क्रीन समजावा', labelHi: 'स्क्रीन समझाएं' },
    { href: '/extension', labelEn: 'Extension', labelMr: 'विस्तार', labelHi: 'एक्सटेंशन' },
    { href: '/help', labelEn: 'Help', labelMr: 'मदत', labelHi: 'मदद' },
    { href: '/settings', labelEn: 'Settings', labelMr: 'प्राधान्ये', labelHi: 'सेटिंग्स' },
  ];

  const getLabel = (item: typeof navItems[0]) => {
    if (currentLanguage === 'mr') return item.labelMr;
    if (currentLanguage === 'hi') return item.labelHi;
    return item.labelEn;
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header role="banner" className="app-header">
      <div className="header-container">
        {/* Sahayak Brand Identity */}
        <Link href="/" className="brand-link" onClick={closeMobileMenu} aria-label="Sahayak AI Home">
          <div className="brand-emblem" aria-hidden="true">
            स
          </div>
          <div className="brand-text">
            <span className="brand-title">Sahayak AI</span>
            <span className="brand-subtitle">
              {currentLanguage === 'mr' ? 'नागरिक सहाय्यक' : currentLanguage === 'hi' ? 'नागरिक सहायक' : 'Civic Assistant'}
            </span>
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="header-nav" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${path === item.href ? 'active' : ''}`}
            >
              {getLabel(item)}
            </Link>
          ))}
          <Link
            href="/design-system"
            className={`nav-link ${path === '/design-system' ? 'active' : ''}`}
            style={{ fontSize: '0.8125rem', opacity: 0.85 }}
          >
            🎨 P01
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Language Selector */}
          <div className="lang-select-group" role="group" aria-label="Language Selector">
            <button
              type="button"
              className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
              onClick={() => onLanguageChange?.('en')}
              aria-pressed={currentLanguage === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn ${currentLanguage === 'mr' ? 'active' : ''}`}
              onClick={() => onLanguageChange?.('mr')}
              aria-pressed={currentLanguage === 'mr'}
            >
              मराठी
            </button>
            <button
              type="button"
              className={`lang-btn ${currentLanguage === 'hi' ? 'active' : ''}`}
              onClick={() => onLanguageChange?.('hi')}
              aria-pressed={currentLanguage === 'hi'}
            >
              हिंदी
            </button>
          </div>

          {/* Accessibility Settings Panel Button (AC-P09-01) */}
          <button
            type="button"
            className="a11y-quick-btn"
            onClick={onOpenA11yPanel}
            aria-label="Open accessibility settings / सुलभता पर्याय"
            title="Accessibility Settings / सुलभता पर्याय (♿)"
            style={{ fontSize: '1rem' }}
          >
            ♿
          </button>

          {/* Quick High-Contrast Shortcut */}
          <button
            type="button"
            className="a11y-quick-btn"
            onClick={onToggleHighContrast}
            aria-label={isHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            title={isHighContrast ? 'Disable high contrast' : 'Enable high contrast'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
            </svg>
          </button>

          {/* Quick Font Size Switcher */}
          <button
            type="button"
            className="a11y-quick-btn"
            onClick={onCycleTextScale}
            aria-label={`Cycle font size (currently ${textScale})`}
            title={`Font size: ${textScale}`}
            style={{ fontWeight: 700, fontSize: '0.8125rem' }}
          >
            A+
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation">
          <nav className="mobile-nav-links">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-nav-link ${path === item.href ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {getLabel(item)}
              </Link>
            ))}
            <Link
              href="/design-system"
              className={`mobile-nav-link ${path === '/design-system' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              🎨 P01 Design System Showcase
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
