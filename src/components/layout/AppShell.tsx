import React, { useState, useEffect } from 'react';
import { SkipLink } from './SkipLink';
import { Header } from './Header';
import { PageContainer } from './PageContainer';
import { Footer } from './Footer';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'mr' | 'hi'>('mr');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [textScale, setTextScale] = useState<'default' | 'large' | 'extra-large'>('default');

  // Synchronize document root attributes with accessibility & language preferences
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', currentLanguage);

    if (isHighContrast) {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }

    if (textScale !== 'default') {
      root.setAttribute('data-text-scale', textScale);
    } else {
      root.removeAttribute('data-text-scale');
    }
  }, [currentLanguage, isHighContrast, textScale]);

  const handleToggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const handleCycleTextScale = () => {
    setTextScale((prev) => {
      if (prev === 'default') return 'large';
      if (prev === 'large') return 'extra-large';
      return 'default';
    });
  };

  return (
    <div className="app-shell">
      <SkipLink targetId="main-content" />
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        isHighContrast={isHighContrast}
        onToggleHighContrast={handleToggleHighContrast}
        textScale={textScale}
        onCycleTextScale={handleCycleTextScale}
      />
      <PageContainer>
        {children}
      </PageContainer>
      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};
