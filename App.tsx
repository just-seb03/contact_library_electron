import { createRoot } from 'react-dom/client';
import Framework7 from 'framework7/lite-bundle';
import Framework7React, { App as Framework7App } from 'framework7-react';
import routes from './src/navigation/routes';
import { AppProvider, useApp } from './src/core/context/AppContext';
import { AppShell } from './src/core/AppShell';
import { applyAppColors } from './src/core/theme/style';
import 'framework7/css/bundle';
import 'framework7/components/grid/css';
import 'framework7-icons/css/framework7-icons.css';

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      getPlatform: () => Promise<string>;
    };
  }
}

export function AppContent() {
  const { darkMode } = useApp();

  return (
    <Framework7App
      name="Contact Library"
      theme="ios"
      dark={darkMode}
      routes={routes}
      view={{ animate: true, transition: 'f7-fade', iosSwipeBack: true }}
    >
      <AppShell />
    </Framework7App>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

Framework7.use(Framework7React);
applyAppColors();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento raíz de la aplicación');
}

createRoot(rootElement).render(<App />);

export default App;
