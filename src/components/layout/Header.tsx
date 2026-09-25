import React, { useState } from 'react';
import { Link, useRouter } from '../../router';

export interface HeaderProps {
  currentLanguage?: 'en' | 'mr' | 'hi';
  onLanguageChange?: (lang: 'en' | 'mr' | 'hi') => void;
  theme?: string;
  onToggleTheme?: () => void;
  isHighContrast?: boolean;
  onToggleHighContrast?: () => void;
  textScale?: 'default' | 'normal' | 'large' | 'extra-large';
  onCycleTextScale?: () => void;
  onOpenA11yPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage = 'en',
  onLanguageChange,
  theme = 'light',
  onToggleTheme,
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
          <img
            src="/sahayak-logo.png"
            alt="Sahayak AI Logo"
            className="brand-logo"
            width={40}
            height={40}
          />
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
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Light / Dark Theme Quick Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark'
                ? currentLanguage === 'mr' ? 'लाइट मोड निवडा' : currentLanguage === 'hi' ? 'लाइट मोड चुनें' : 'Switch to Light Mode'
                : currentLanguage === 'mr' ? 'डार्क मोड निवडा' : currentLanguage === 'hi' ? 'डार्क मोड चुनें' : 'Switch to Dark Mode'
            }
            title={
              theme === 'dark'
                ? currentLanguage === 'mr' ? 'लाइट थीम निवडा (☀️)' : currentLanguage === 'hi' ? 'लाइट थीम चुनें (☀️)' : 'Light Theme (☀️)'
                : currentLanguage === 'mr' ? 'डार्क थीम निवडा (🌙)' : currentLanguage === 'hi' ? 'डार्क थीम चुनें (🌙)' : 'Dark Theme (🌙)'
            }
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: '#FBBF24' }}>
                <circle cx="12" cy="12" r="5" fill="#FBBF24" fillOpacity="0.25" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--sahayak-blue-dark)' }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fillOpacity="0.2" />
              </svg>
            )}
          </button>

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

            {/* Quick theme switch in mobile drawer */}
            <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {currentLanguage === 'mr' ? 'थीम (Theme)' : currentLanguage === 'hi' ? 'थीम (Theme)' : 'Theme Mode'}
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onToggleTheme}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span>{theme === 'dark' ? (currentLanguage === 'mr' ? 'लाइट मोड' : currentLanguage === 'hi' ? 'लाइट मोड' : 'Light Mode') : (currentLanguage === 'mr' ? 'डार्क मोड' : currentLanguage === 'hi' ? 'डार्क मोड' : 'Dark Mode')}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
