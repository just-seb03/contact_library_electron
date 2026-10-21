export interface AppSettings {
  hearingAlerts: boolean;
  paymentReminders: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  hearingAlerts: true,
  paymentReminders: true,
};

export interface SoftwareInfo {
  name: string;
  version: string;
  stack: string;
  environment: string;
}

export const SOFTWARE_INFO: SoftwareInfo = {
  name: 'Contact Library Desktop',
  version: 'v1.0.0',
  stack: 'Framework7 v9.2 · React 18 · Electron 30 · Vite',
  environment: 'Local / SQLite (Offline-First)',
};
