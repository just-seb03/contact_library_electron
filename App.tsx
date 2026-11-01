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
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      getPlatform: () => Promise<string>;
      db?: {
        getClients: () => Promise<import('./src/core/context/types').Client[]>;
        createClient: (client: Omit<import('./src/core/context/types').Client, 'id'>) => Promise<import('./src/core/context/types').Client>;
        updateClient: (id: number, data: Partial<import('./src/core/context/types').Client>) => Promise<import('./src/core/context/types').Client>;
        deleteClient: (id: number) => Promise<boolean>;
        saveAllClients: (clients: import('./src/core/context/types').Client[]) => Promise<boolean>;

        getPayments: () => Promise<import('./src/core/context/types').Payment[]>;
        savePayments: (payments: import('./src/core/context/types').Payment[]) => Promise<boolean>;

        getCalendarEvents: () => Promise<import('./src/core/context/types').CalendarEvent[]>;
        saveCalendarEvents: (events: import('./src/core/context/types').CalendarEvent[]) => Promise<boolean>;

        getSettings: () => Promise<Record<string, unknown>>;
        saveSettings: (settings: Record<string, unknown>) => Promise<boolean>;
      };
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
const systemTimeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions();
document.documentElement.lang = new Intl.Locale(systemTimeFormat.locale, {
  hourCycle: systemTimeFormat.hour12 ? 'h12' : 'h23',
}).toString();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento raíz de la aplicación');
}

createRoot(rootElement).render(<App />);

export default App;
