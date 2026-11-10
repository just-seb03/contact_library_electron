/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    getPlatform: () => Promise<string>;
    db?: {
      getClients: () => Promise<import('./core/context/types').Client[]>;
      createClient: (client: Omit<import('./core/context/types').Client, 'id'>) => Promise<import('./core/context/types').Client>;
      updateClient: (id: number, data: Partial<import('./core/context/types').Client>) => Promise<import('./core/context/types').Client>;
      deleteClient: (id: number) => Promise<boolean>;
      saveAllClients: (clients: import('./core/context/types').Client[]) => Promise<boolean>;

      getPayments: () => Promise<import('./core/context/types').Payment[]>;
      savePayments: (payments: import('./core/context/types').Payment[]) => Promise<boolean>;

      getCalendarEvents: () => Promise<import('./core/context/types').CalendarEvent[]>;
      saveCalendarEvents: (events: import('./core/context/types').CalendarEvent[]) => Promise<boolean>;

      getSettings: () => Promise<Record<string, unknown>>;
      saveSettings: (settings: Record<string, unknown>) => Promise<boolean>;
    };
  };
}
