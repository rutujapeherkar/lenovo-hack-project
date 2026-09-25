import React from 'react';
import { RouterProvider, useRouter } from './router';
import { AppShell } from './components/layout';
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
    switch (path) {
      case '/':
        return <HomePage />;
      case '/services':
        return <ServicesPage />;
      case '/schemes':
        return <SchemesPage />;
      case '/explain-screen':
        return <ExplainScreenPage />;
      case '/extension':
        return <ExtensionPage />;
      case '/help':
        return <HelpPage />;
      case '/settings':
        return <SettingsPage />;
      case '/design-system':
        return <DesignSystemPage />;
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

  return <AppShell>{renderRoute()}</AppShell>;
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
};

export default App;
