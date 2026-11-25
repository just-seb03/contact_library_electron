import { hctToHex, hexToHct, hexToRgba } from './colorScience';
import type { AppleAccentColor } from '../../features/settings/data/settingsData';

export type AppThemeId = 'default' | 'coffee' | 'legal_library' | 'estrado';

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
  /** Color de acento en modo claro (y semilla por defecto) */
  swatchHex: string;
  /** Color de acento explícito en modo oscuro (opcional; si falta se calcula con HCT) */
  swatchDarkHex?: string;
  /** Color de realce sugerido al seleccionar este tema */
  recommendedAccent: AppleAccentColor;
  light: ThemeModeTokens;
  dark: ThemeModeTokens;
}

/**
 * Genera los pares Claro/Oscuro de un tema neutro/tinte siguiendo los principios HCT:
 * - Misma familia de matiz (Hue) y croma controlado en todas las superficies.
 * - Separación de luminancia perceptual |Tone_fg - Tone_bg| >= 50 en textos y controles.
 */
interface HctThemeSeed {
  id: AppThemeId;
  label: string;
  description: string;
  swatchHex: string;
  swatchDarkHex?: string;
  recommendedAccent: AppleAccentColor;
  neutralHue: number;
  neutralChromaLight: number;
  neutralChromaDark: number;
  /** Overrides opcionales para conservar tonos característicos validados en claro */
  lightOverrides?: Partial<ThemeModeTokens>;
  darkOverrides?: Partial<ThemeModeTokens>;
}

function buildHctTheme(seed: HctThemeSeed): AppThemeDefinition {
  const { neutralHue: h, neutralChromaLight: cL, neutralChromaDark: cD } = seed;

  // Modo Claro: superficies T=84..100, textos T=14..46 (dT >= 50 frente a canvas T=97)
  const lCanvas = hctToHex(h, cL * 0.4, 97);
  const lCard = '#ffffff';
  const lInput = hctToHex(h, cL * 0.6, 94.5);
  const lSidebar = hctToHex(h, cL * 0.85, 92);
  const lText = hctToHex(h, Math.min(12, cL * 1.4), 14);
  const lTextSec = hctToHex(h, cL, 39);
  const lTextMuted = hctToHex(h, cL, 43);

  const baseLight: ThemeModeTokens = {
    canvasBg: lCanvas,
    cardBg: lCard,
    modalBg: lCard,
    inputBg: lInput,
    sidebarGlass: hexToRgba(lSidebar, 0.86),
    toolbarGlass: hexToRgba(lCard, 0.84),
    hoverBg: hexToRgba(lText, 0.045),
    activeBg: hexToRgba(lText, 0.08),
    subtleBg: hexToRgba(lText, 0.03),
    text: lText,
    textSecondary: lTextSec,
    textMuted: lTextMuted,
    cardBorder: hexToRgba(lText, 0.08),
    hairlineBorder: hexToRgba(lText, 0.08),
    divider: hexToRgba(lText, 0.06),
    scrollbarThumb: hexToRgba(lTextSec, 0.28),
    scrollbarThumbHover: hexToRgba(lTextSec, 0.45),
    dangerSurface: 'rgba(255, 59, 48, 0.10)',
    dangerBorder: 'rgba(255, 59, 48, 0.25)',
    preview: {
      canvas: lCanvas,
      sidebar: lSidebar,
      card: lCard,
      muted: hctToHex(h, cL, 78),
    },
  };

  // Modo Oscuro: superficies T=9.5..27, textos T=71..94 (dT >= 49..84 incluso en inputs T=22)
  const dCanvas = hctToHex(h, cD * 0.75, 10.5);
  const dCardBase = hctToHex(h, cD, 15.2);
  const dSidebar = hctToHex(h, cD * 0.75, 11.5);
  const dInput = hctToHex(h, cD * 1.05, 22);
  const dActive = hctToHex(h, cD * 1.2, 27);
  const dText = hctToHex(h, Math.min(12, cD * 1.3), 93);
  const dTextSec = hctToHex(h, cD * 1.15, 75);
  const dTextMuted = hctToHex(h, cD, 71);

  const baseDark: ThemeModeTokens = {
    canvasBg: dCanvas,
    cardBg: dCardBase,
    modalBg: hctToHex(h, cD, 16.5),
    inputBg: dInput,
    sidebarGlass: hexToRgba(dSidebar, 0.88),
    toolbarGlass: hexToRgba(dCanvas, 0.86),
    hoverBg: hexToRgba(dText, 0.07),
    activeBg: dActive,
    subtleBg: hexToRgba(dText, 0.045),
    text: dText,
    textSecondary: dTextSec,
    textMuted: dTextMuted,
    cardBorder: hexToRgba(dText, 0.09),
    hairlineBorder: hexToRgba(dText, 0.09),
    divider: hexToRgba(dText, 0.08),
    scrollbarThumb: hexToRgba(dTextSec, 0.26),
    scrollbarThumbHover: hexToRgba(dTextSec, 0.44),
    dangerSurface: 'rgba(255, 59, 48, 0.16)',
    dangerBorder: 'rgba(255, 59, 48, 0.34)',
    preview: {
      canvas: dCanvas,
      sidebar: dSidebar,
      card: dCardBase,
      muted: dInput,
    },
  };

  const light: ThemeModeTokens = {
    ...baseLight,
    ...seed.lightOverrides,
    preview: { ...baseLight.preview, ...seed.lightOverrides?.preview },
  };
  const dark: ThemeModeTokens = {
    ...baseDark,
    ...seed.darkOverrides,
    preview: { ...baseDark.preview, ...seed.darkOverrides?.preview },
  };

  return {
    id: seed.id,
    label: seed.label,
    description: seed.description,
    swatchHex: seed.swatchHex,
    swatchDarkHex: seed.swatchDarkHex,
    recommendedAccent: seed.recommendedAccent,
    light,
    dark,
  };
}

/**
 * Catálogo centralizado de temas de la aplicación (calibrados con ciencia HCT).
 * Para agregar un nuevo tema en el futuro, basta con añadir una llamada a `buildHctTheme`.
 */
export const APP_THEMES: Record<AppThemeId, AppThemeDefinition> = {
  default: buildHctTheme({
    id: 'default',
    label: 'Predeterminado',
    description: 'Estética nativa de macOS',
    swatchHex: '#007aff',
    recommendedAccent: 'blue',
    neutralHue: 264,
    neutralChromaLight: 2.5,
    neutralChromaDark: 2.5,
    lightOverrides: {
      canvasBg: '#f5f5f7',
      inputBg: '#ffffff',
      sidebarGlass: 'rgba(246, 246, 248, 0.82)',
      toolbarGlass: 'rgba(255, 255, 255, 0.82)',
      hoverBg: 'rgba(0, 0, 0, 0.04)',
      activeBg: 'rgba(0, 0, 0, 0.07)',
      subtleBg: 'rgba(0, 0, 0, 0.03)',
      text: '#1c1c1e',
      preview: {
        canvas: '#f5f5f7',
        sidebar: '#e5e5ea',
        card: '#ffffff',
        muted: '#c7c7cc',
      },
    },
    darkOverrides: {
      canvasBg: '#1e1e20',
      cardBg: 'rgba(38, 38, 42, 0.85)',
      modalBg: '#242426',
      inputBg: 'rgba(255, 255, 255, 0.08)',
      sidebarGlass: 'rgba(28, 28, 30, 0.82)',
      toolbarGlass: 'rgba(30, 30, 34, 0.82)',
      hoverBg: 'rgba(255, 255, 255, 0.06)',
      activeBg: 'rgba(255, 255, 255, 0.11)',
      subtleBg: 'rgba(255, 255, 255, 0.04)',
      text: '#ffffff',
      preview: {
        canvas: '#1e1e20',
        sidebar: '#2c2c2e',
        card: '#2c2c2e',
        muted: '#48484a',
      },
    },
  }),

  coffee: buildHctTheme({
    id: 'coffee',
    label: 'Café',
    description: 'Tonos cálidos espresso y crema',
    swatchHex: '#6D4C41',
    recommendedAccent: 'coffee',
    neutralHue: 37.5,
    neutralChromaLight: 9,
    neutralChromaDark: 7.2,
    lightOverrides: {
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
      // Tone 36 garantiza >= 4.5:1 incluso sobre el sidebar #D6D2C4
      textMuted: hctToHex(37.5, 9, 36),
      scrollbarThumb: hexToRgba('#6D4C41', 0.28),
      scrollbarThumbHover: hexToRgba('#6D4C41', 0.45),
      preview: {
        canvas: '#FCF9F5',
        sidebar: '#D6D2C4',
        card: '#F7F2EB',
        muted: '#E6D3C8',
      },
    },
    darkOverrides: {
      canvasBg: '#1F1916',
      cardBg: '#2E2420',
      modalBg: '#2E2420',
      // Sidebar, input y active armonizados al mismo matiz espresso (Hue 37.5°) con dT >= 50
      sidebarGlass: hexToRgba(hctToHex(37.5, 5.5, 11), 0.90),
      toolbarGlass: hexToRgba('#1F1916', 0.88),
      hoverBg: hexToRgba('#E6D3C8', 0.09),
      activeBg: hctToHex(37.5, 9, 27),
      subtleBg: hexToRgba('#E6D3C8', 0.05),
      text: '#E6D3C8',
      textSecondary: hctToHex(37.5, 8.5, 74),
      textMuted: hctToHex(37.5, 7.5, 71),
      scrollbarThumb: hexToRgba('#E6D3C8', 0.24),
      scrollbarThumbHover: hexToRgba('#E6D3C8', 0.40),
      preview: {
        canvas: '#1F1916',
        sidebar: hctToHex(37.5, 5.5, 11),
        card: '#2E2420',
        muted: hctToHex(37.5, 7.5, 22),
      },
    },
  }),

  legal_library: buildHctTheme({
    id: 'legal_library',
    label: 'Biblioteca Jurídica',
    description: 'Verde botella y salvia editorial',
    swatchHex: '#1E5641',
    swatchDarkHex: '#6EB396',
    recommendedAccent: 'forest',
    neutralHue: 165,
    neutralChromaLight: 5.5,
    neutralChromaDark: 7.5,
    lightOverrides: {
      canvasBg: '#F7F9F7',
      cardBg: '#ffffff',
      modalBg: '#ffffff',
      sidebarGlass: hexToRgba('#EAEFE9', 0.88),
      toolbarGlass: hexToRgba('#F7F9F7', 0.86),
      text: '#19231D',
      scrollbarThumb: hexToRgba('#1E5641', 0.24),
      scrollbarThumbHover: hexToRgba('#1E5641', 0.40),
      preview: {
        canvas: '#F7F9F7',
        sidebar: '#EAEFE9',
        card: '#ffffff',
        muted: hctToHex(165, 5.5, 78),
      },
    },
    darkOverrides: {
      canvasBg: '#131A16',
      sidebarGlass: hexToRgba('#1C2620', 0.90),
      toolbarGlass: hexToRgba('#131A16', 0.88),
      text: '#DFE8E2',
      scrollbarThumb: hexToRgba('#6EB396', 0.28),
      scrollbarThumbHover: hexToRgba('#6EB396', 0.45),
      preview: {
        canvas: '#131A16',
        sidebar: '#1C2620',
        card: hctToHex(165, 7.5, 15.2),
        muted: hctToHex(165, 7.875, 22),
      },
    },
  }),

  estrado: buildHctTheme({
    id: 'estrado',
    label: 'Estrado',
    description: 'Borgoña y grafito editorial',
    swatchHex: '#7A1F2B',
    swatchDarkHex: '#D67A87',
    recommendedAccent: 'burgundy',
    neutralHue: 355,
    neutralChromaLight: 2.5,
    neutralChromaDark: 4,
    lightOverrides: {
      canvasBg: '#FCFAFA',
      cardBg: '#ffffff',
      modalBg: '#ffffff',
      sidebarGlass: hexToRgba('#F2ECEC', 0.88),
      toolbarGlass: hexToRgba('#FCFAFA', 0.86),
      text: '#211A1B',
      scrollbarThumb: hexToRgba('#7A1F2B', 0.22),
      scrollbarThumbHover: hexToRgba('#7A1F2B', 0.38),
      preview: {
        canvas: '#FCFAFA',
        sidebar: '#F2ECEC',
        card: '#ffffff',
        muted: hctToHex(355, 2.5, 78),
      },
    },
    darkOverrides: {
      canvasBg: '#1A1617',
      sidebarGlass: hexToRgba('#262022', 0.90),
      toolbarGlass: hexToRgba('#1A1617', 0.88),
      text: '#EAE2E3',
      scrollbarThumb: hexToRgba('#D67A87', 0.28),
      scrollbarThumbHover: hexToRgba('#D67A87', 0.45),
      preview: {
        canvas: '#1A1617',
        sidebar: '#262022',
        card: hctToHex(355, 4, 15.2),
        muted: hctToHex(355, 4.2, 22),
      },
    },
  }),
};

export const THEME_LIST: AppThemeDefinition[] = Object.values(APP_THEMES);

/**
 * Devuelve la paleta correspondiente a un tema y modo (claro/oscuro),
 * con respaldo seguro al tema predeterminado.
 */
export function getThemeTokens(themeId: AppThemeId | string | undefined, darkMode: boolean): ThemeModeTokens {
  const theme = themeId && themeId in APP_THEMES ? APP_THEMES[themeId as AppThemeId] : APP_THEMES.default;
  return darkMode ? theme.dark : theme.light;
}

/**
 * Devuelve el color de acento representativo de un tema adaptado al modo (Tone Swapping).
 */
export function getThemeSwatchHex(theme: AppThemeDefinition, darkMode: boolean): string {
  if (darkMode && theme.swatchDarkHex) {
    return theme.swatchDarkHex;
  }
  if (!darkMode && theme.swatchDarkHex) {
    return theme.swatchHex;
  }
  const { hue, chroma } = hexToHct(theme.swatchHex);
  return hctToHex(hue, chroma, darkMode ? 78 : 38);
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
