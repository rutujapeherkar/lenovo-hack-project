import React from 'react';
import { RouterProvider, useRouter } from './router';
import { LanguageProvider } from './core/language';
import { AccessibilityProvider } from './core/accessibility';
import { AppShell } from './components/layout';
import { ErrorBoundary } from './components/common';
import {
  HomePage,
  ServicesPage,
  SchemesPage,
  ExplainScreenPage,
  ExtensionPage,
  HelpPage,
  SettingsPage,
  DesignSystemPage,
} from './pages';
import { Button } from './components/ui';

const AppContent: React.FC = () => {
  const { path, navigate } = useRouter();

  const renderRoute = () => {
    if (path === '/' || path === '') {
      return (
        <ErrorBoundary sectionName="Home">
          <HomePage />
        </ErrorBoundary>
      );
    }

    if (path === '/services' || path.startsWith('/services/')) {
      return (
        <ErrorBoundary sectionName="Services">
          <ServicesPage />
        </ErrorBoundary>
      );
    }

    if (path === '/schemes' || path.startsWith('/schemes/')) {
      return (
        <ErrorBoundary sectionName="Schemes">
          <SchemesPage />
        </ErrorBoundary>
      );
    }

    switch (path) {
      case '/explain-screen':
        return (
          <ErrorBoundary sectionName="Explain Screen">
            <ExplainScreenPage />
          </ErrorBoundary>
        );
      case '/extension':
        return (
          <ErrorBoundary sectionName="Extension">
            <ExtensionPage />
          </ErrorBoundary>
        );
      case '/help':
        return (
          <ErrorBoundary sectionName="Help">
            <HelpPage />
          </ErrorBoundary>
        );
      case '/settings':
        return (
          <ErrorBoundary sectionName="Settings">
            <SettingsPage />
          </ErrorBoundary>
        );
      case '/design-system':
        return (
          <ErrorBoundary sectionName="Design System">
            <DesignSystemPage />
          </ErrorBoundary>
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
              ४०४ • Page Not Found
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              The requested page could not be found on Sahayak AI.
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Home / मुख्यपृष्ठावर जा
            </Button>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary sectionName="Application Shell">
      <AppShell>{renderRoute()}</AppShell>
    </ErrorBoundary>
  );
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <LanguageProvider>
        <AccessibilityProvider>
          <AppContent />
        </AccessibilityProvider>
      </LanguageProvider>
    </RouterProvider>
  );
};

export default App;

