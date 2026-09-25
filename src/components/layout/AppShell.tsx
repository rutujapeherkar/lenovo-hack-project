import React from 'react';
import { SkipLink } from './SkipLink';
import { Header } from './Header';
import { PageContainer } from './PageContainer';
import { Footer } from './Footer';
import { useLanguage } from '../../core/language';
import { useAccessibility } from '../../core/accessibility';
import { AccessibilityPanel } from '../accessibility';
import type { Language } from '../../core/shared/types';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { language, setLanguage } = useLanguage();
  const {
    highContrast,
    toggleHighContrast,
    textScale,
    cycleTextScale,
    setLanguage: setA11yLanguage,
    isPanelOpen,
    openPanel,
    closePanel,
  } = useAccessibility();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setA11yLanguage(newLang);
  };

  return (
    <div className="app-shell">
      <SkipLink targetId="main-content" />
      <Header
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        isHighContrast={highContrast}
        onToggleHighContrast={toggleHighContrast}
        textScale={textScale}
        onCycleTextScale={cycleTextScale}
        onOpenA11yPanel={openPanel}
      />
      <PageContainer>
        {children}
      </PageContainer>
      <Footer currentLanguage={language} />
      <AccessibilityPanel isOpen={isPanelOpen} onClose={closePanel} />
    </div>
  );
};
