export type AppleAccentColor =
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'green'
  | 'graphite';

export interface AccentColorOption {
  id: AppleAccentColor;
  label: string;
  hex: string;
}

export const MAC_ACCENT_COLORS: AccentColorOption[] = [
  { id: 'blue', label: 'Azul', hex: '#007aff' },
  { id: 'purple', label: 'Morado', hex: '#af52de' },
  { id: 'pink', label: 'Rosa', hex: '#ff2d55' },
  { id: 'red', label: 'Rojo', hex: '#ff3b30' },
  { id: 'orange', label: 'Naranja', hex: '#ff9500' },
  { id: 'green', label: 'Verde', hex: '#34c759' },
  { id: 'graphite', label: 'Grafito', hex: '#8e8e93' },
];

export interface AppSettings {
  hearingAlerts: boolean;
  paymentReminders: boolean;
  soundEffects: boolean;
  accentColor: AppleAccentColor;
  lawyerName: string;
  lawyerEmail: string;
  lawyerFirm: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  hearingAlerts: true,
  paymentReminders: true,
  soundEffects: true,
  accentColor: 'blue',
  lawyerName: 'Sebastián Contreras',
  lawyerEmail: 's.contreras@estudiojuridico.cl',
  lawyerFirm: 'Contreras & Asociados • Derecho Civil y Litigios',
};

export interface SoftwareInfo {
  name: string;
  version: string;
  stack: string;
  environment: string;
  architecture: string;
  buildDate: string;
}

export const SOFTWARE_INFO: SoftwareInfo = {
  name: 'Contact Library para macOS',
  version: 'v1.2.0 (macOS Sequoia Ready)',
  stack: 'Framework7 v9.2 · React 18 · Electron 30 · Vite',
  environment: 'Local / Offline-First (SQLite + LocalStorage)',
  architecture: 'Universal (Apple Silicon & Intel)',
  buildDate: '2026',
};
