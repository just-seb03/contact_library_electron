export type AppThemeId = 'default' | 'coffee';

export interface ThemeModeTokens {
  canvasBg: string;
  cardBg: string;
  modalBg: string;
  inputBg: string;
  sidebarGlass: string;
  toolbarGlass: string;
  hoverBg: string;
  activeBg: string;
  subtleBg: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  cardBorder: string;
  hairlineBorder: string;
  divider: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  dangerSurface: string;
  dangerBorder: string;
  /** Colores usados en las miniaturas de vista previa en Ajustes */
  preview: {
    canvas: string;
    sidebar: string;
    card: string;
    muted: string;
  };
}

export interface AppThemeDefinition {
  id: AppThemeId;
  label: string;
  description: string;
  /** Color de acento sugerido (opcional) para mostrar en la tarjeta del selector */
  swatchHex: string;
  light: ThemeModeTokens;
  dark: ThemeModeTokens;
}

/**
 * Convierte un color hexadecimal (#RRGGBB) a formato `rgba(r, g, b, alpha)`.
 */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Catálogo centralizado de temas de la aplicación.
 * Para agregar un nuevo tema en el futuro, solo añade una nueva entrada aquí
 * con sus variantes `light` y `dark`.
 */
export const APP_THEMES: Record<AppThemeId, AppThemeDefinition> = {
  default: {
    id: 'default',
    label: 'Predeterminado',
    description: 'Estética nativa de macOS',
    swatchHex: '#007aff',
    light: {
      canvasBg: '#f5f5f7',
      cardBg: '#ffffff',
      modalBg: '#ffffff',
      inputBg: '#ffffff',
      sidebarGlass: 'rgba(246, 246, 248, 0.82)',
      toolbarGlass: 'rgba(255, 255, 255, 0.82)',
      hoverBg: 'rgba(0, 0, 0, 0.04)',
      activeBg: 'rgba(0, 0, 0, 0.07)',
      subtleBg: 'rgba(0, 0, 0, 0.03)',
      text: '#1c1c1e',
      textSecondary: '#8e8e93',
      textMuted: 'rgba(60, 60, 67, 0.6)',
      cardBorder: 'rgba(0, 0, 0, 0.08)',
      hairlineBorder: 'rgba(0, 0, 0, 0.08)',
      divider: 'rgba(0, 0, 0, 0.06)',
      scrollbarThumb: 'rgba(0, 0, 0, 0.16)',
      scrollbarThumbHover: 'rgba(0, 0, 0, 0.28)',
      dangerSurface: 'rgba(255, 59, 48, 0.10)',
      dangerBorder: 'rgba(255, 59, 48, 0.25)',
      preview: {
        canvas: '#f5f5f7',
        sidebar: '#e5e5ea',
        card: '#ffffff',
        muted: '#c7c7cc',
      },
    },
    dark: {
      canvasBg: '#1e1e20',
      cardBg: 'rgba(38, 38, 42, 0.85)',
      modalBg: '#242426',
      inputBg: 'rgba(255, 255, 255, 0.08)',
      sidebarGlass: 'rgba(28, 28, 30, 0.82)',
      toolbarGlass: 'rgba(30, 30, 34, 0.82)',
      hoverBg: 'rgba(255, 255, 255, 0.06)',
      activeBg: 'rgba(255, 255, 255, 0.10)',
      subtleBg: 'rgba(255, 255, 255, 0.04)',
      text: '#ffffff',
      textSecondary: '#8e8e93',
      textMuted: 'rgba(235, 235, 245, 0.55)',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      hairlineBorder: 'rgba(255, 255, 255, 0.08)',
      divider: 'rgba(255, 255, 255, 0.08)',
      scrollbarThumb: 'rgba(255, 255, 255, 0.18)',
      scrollbarThumbHover: 'rgba(255, 255, 255, 0.32)',
      dangerSurface: 'rgba(255, 59, 48, 0.15)',
      dangerBorder: 'rgba(255, 59, 48, 0.32)',
      preview: {
        canvas: '#1e1e20',
        sidebar: '#2c2c2e',
        card: '#2c2c2e',
        muted: '#48484a',
      },
    },
  },

  coffee: {
    id: 'coffee',
    label: 'Café',
    description: 'Tonos cálidos espresso y crema',
    swatchHex: '#6D4C41',
    light: {
      canvasBg: '#FCF9F5',
      cardBg: '#F7F2EB',
      modalBg: '#FCF9F5',
      inputBg: '#EAE3CC',
      sidebarGlass: hexToRgba('#D6D2C4', 0.88),
      toolbarGlass: hexToRgba('#FCF9F5', 0.86),
      hoverBg: hexToRgba('#E6D3C8', 0.55),
      activeBg: '#E6D3C8',
      subtleBg: hexToRgba('#EAE3CC', 0.65),
      text: '#3C2A21',
      textSecondary: '#5D4E46',
      textMuted: hexToRgba('#5D4E46', 0.78),
      cardBorder: hexToRgba('#3C2A21', 0.10),
      hairlineBorder: hexToRgba('#3C2A21', 0.12),
      divider: hexToRgba('#3C2A21', 0.09),
      scrollbarThumb: hexToRgba('#6D4C41', 0.28),
      scrollbarThumbHover: hexToRgba('#6D4C41', 0.45),
      dangerSurface: 'rgba(255, 59, 48, 0.10)',
      dangerBorder: 'rgba(255, 59, 48, 0.25)',
      preview: {
        canvas: '#FCF9F5',
        sidebar: '#D6D2C4',
        card: '#F7F2EB',
        muted: '#E6D3C8',
      },
    },
    dark: {
      canvasBg: '#1F1916',
      cardBg: '#2E2420',
      modalBg: '#2E2420',
      inputBg: '#464233',
      sidebarGlass: hexToRgba('#1C2522', 0.90),
      toolbarGlass: hexToRgba('#1F1916', 0.88),
      hoverBg: hexToRgba('#6E5B53', 0.35),
      activeBg: '#6E5B53',
      subtleBg: hexToRgba('#464233', 0.55),
      text: '#E6D3C8',
      textSecondary: '#A89E95',
      textMuted: hexToRgba('#A89E95', 0.78),
      cardBorder: hexToRgba('#E6D3C8', 0.10),
      hairlineBorder: hexToRgba('#E6D3C8', 0.10),
      divider: hexToRgba('#E6D3C8', 0.09),
      scrollbarThumb: hexToRgba('#8B6E60', 0.35),
      scrollbarThumbHover: hexToRgba('#8B6E60', 0.55),
      dangerSurface: 'rgba(255, 59, 48, 0.16)',
      dangerBorder: 'rgba(255, 59, 48, 0.34)',
      preview: {
        canvas: '#1F1916',
        sidebar: '#1C2522',
        card: '#2E2420',
        muted: '#464233',
      },
    },
  },
};

export const THEME_LIST: AppThemeDefinition[] = Object.values(APP_THEMES);

/**
 * Devuelve la paleta correspondiente a un tema y modo (claro/oscuro),
 * con respaldo seguro al tema predeterminado.
 */
export function getThemeTokens(themeId: AppThemeId | string | undefined, darkMode: boolean): ThemeModeTokens {
  const theme = (themeId && themeId in APP_THEMES ? APP_THEMES[themeId as AppThemeId] : APP_THEMES.default);
  return darkMode ? theme.dark : theme.light;
}

/**
 * Convierte un objeto `ThemeModeTokens` al diccionario exacto de variables CSS
 * (`--macos-*` y `--f7-*`) que consume toda la aplicación.
 */
export function themeTokensToCssVars(tokens: ThemeModeTokens): Record<string, string> {
  return {
    '--f7-page-bg-color': tokens.canvasBg,
    '--f7-card-bg-color': tokens.cardBg,
    '--macos-canvas-bg': tokens.canvasBg,
    '--macos-card-bg': tokens.cardBg,
    '--macos-modal-bg': tokens.modalBg,
    '--macos-input-bg': tokens.inputBg,
    '--macos-sidebar-glass': tokens.sidebarGlass,
    '--macos-toolbar-glass': tokens.toolbarGlass,
    '--macos-hover-bg': tokens.hoverBg,
    '--macos-active-bg': tokens.activeBg,
    '--macos-subtle-bg': tokens.subtleBg,
    '--macos-text': tokens.text,
    '--macos-text-secondary': tokens.textSecondary,
    '--macos-text-muted': tokens.textMuted,
    '--macos-card-border': tokens.cardBorder,
    '--macos-hairline-border': tokens.hairlineBorder,
    '--macos-divider': tokens.divider,
    '--macos-scrollbar-thumb': tokens.scrollbarThumb,
    '--macos-scrollbar-thumb-hover': tokens.scrollbarThumbHover,
    '--macos-danger-surface': tokens.dangerSurface,
    '--macos-danger-border': tokens.dangerBorder,
  };
}

