import type { AppThemeId } from '../../../core/theme/themes';
import { deriveOnColor, hctToHex, hexToHct, hexToRgb } from '../../../core/theme/colorScience';

export type AppleAccentColor =
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'green'
  | 'coffee'
  | 'graphite';

export interface AccentColorOption {
  id: AppleAccentColor;
  label: string;
  /** Color semilla en sRGB (Hue/Chroma base en HCT) */
  hex: string;
}

export const MAC_ACCENT_COLORS: AccentColorOption[] = [
  { id: 'blue', label: 'Azul', hex: '#007aff' },
  { id: 'purple', label: 'Morado', hex: '#af52de' },
  { id: 'pink', label: 'Rosa', hex: '#ff2d55' },
  { id: 'red', label: 'Rojo', hex: '#ff3b30' },
  { id: 'orange', label: 'Naranja', hex: '#ff9500' },
  { id: 'green', label: 'Verde', hex: '#34c759' },
  { id: 'coffee', label: 'Café', hex: '#6D4C41' },
  { id: 'graphite', label: 'Grafito', hex: '#8e8e93' },
];

export interface ResolvedAccentTokens {
  accentHex: string;
  onAccentHex: string;
  gradientEndHex: string;
  rgb: string;
  cssVars: Record<string, string>;
}

// Regla HCT de Tone Swapping:
// - En claro: Tone 38 garantiza >= 4.5:1 incluso sobre sidebars T=84 (#D6D2C4) y >= 6.9:1 con texto blanco
// - En oscuro: Tone 78 garantiza >= 8:1 sobre superficies oscuras y >= 7.7:1 contra onAccent oscuro
const LIGHT_ACCENT_TONE = 38;
const DARK_ACCENT_TONE = 78;

/**
 * Devuelve el color de realce adaptado científicamente al modo claro u oscuro
 * manteniendo su matiz (Hue) y croma (Chroma) CAM16 originales.
 */
export function getAccentHexForMode(accentColor: AppleAccentColor | string, darkMode: boolean): string {
  const selected = MAC_ACCENT_COLORS.find((c) => c.id === accentColor) ?? MAC_ACCENT_COLORS[0];
  const { hue, chroma } = hexToHct(selected.hex);
  const targetTone = darkMode ? DARK_ACCENT_TONE : LIGHT_ACCENT_TONE;
  return hctToHex(hue, chroma, targetTone);
}

/**
 * Calcula todas las variables CSS de un color de realce para el modo activo.
 */
export function resolveAccentTokens(accentColor: AppleAccentColor | string, darkMode: boolean): ResolvedAccentTokens {
  const selected = MAC_ACCENT_COLORS.find((c) => c.id === accentColor) ?? MAC_ACCENT_COLORS[0];
  const { hue, chroma } = hexToHct(selected.hex);
  const targetTone = darkMode ? DARK_ACCENT_TONE : LIGHT_ACCENT_TONE;

  const accentHex = hctToHex(hue, chroma, targetTone);
  const onAccentHex = darkMode ? deriveOnColor(accentHex, 60) : '#ffffff';
  const gradientEndHex = hctToHex(hue + 24, Math.max(chroma, 12), targetTone);

  const [r, g, b] = hexToRgb(accentHex);
  const rgb = `${r}, ${g}, ${b}`;

  const cssVars: Record<string, string> = {
    '--macos-accent-color': accentHex,
    '--macos-accent-color-rgb': rgb,
    '--macos-on-accent': onAccentHex,
    '--macos-accent-gradient-end': gradientEndHex,
    '--macos-accent-tint': `rgba(${rgb}, ${darkMode ? 0.16 : 0.12})`,
    '--macos-accent-tint-subtle': `rgba(${rgb}, ${darkMode ? 0.12 : 0.08})`,
    '--macos-accent-tint-status': `rgba(${rgb}, ${darkMode ? 0.18 : 0.15})`,
    '--macos-accent-tint-hover': `rgba(${rgb}, ${darkMode ? 0.22 : 0.18})`,
    '--macos-accent-tint-active': `rgba(${rgb}, ${darkMode ? 0.28 : 0.26})`,
    '--f7-theme-color': accentHex,
    '--f7-theme-color-rgb': rgb,
    '--f7-theme-color-shade': accentHex,
    '--f7-toggle-active-color': accentHex,
    '--f7-button-fill-text-color': onAccentHex,
  };

  return { accentHex, onAccentHex, gradientEndHex, rgb, cssVars };
}

export interface AppSettings {
  hearingAlerts: boolean;
  paymentReminders: boolean;
  soundEffects: boolean;
  themeId: AppThemeId;
  accentColor: AppleAccentColor;
  lawyerName: string;
  lawyerEmail: string;
  lawyerFirm: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  hearingAlerts: true,
  paymentReminders: true,
  soundEffects: true,
  themeId: 'default',
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
