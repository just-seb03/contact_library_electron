import type { CSSProperties } from 'react';

export type ThemeStyle = CSSProperties & Record<`--${string}`, string | number>;

//Helpers                                                                    */

const rgba = (rgb: string, alpha: number): string => `rgba(${rgb}, ${alpha})`;

const rgbToHex = (rgb: string): string =>
  `#${rgb
    .split(',')
    .map((channel) => Number(channel.trim()).toString(16).padStart(2, '0'))
    .join('')}`;

// Tokens de color
// Fuente única de verdad para los colores semánticos
export const APP_COLOR_RGB = {
  primary: '0, 122, 255',
  success: '52, 199, 89',
  warning: '255, 149, 0',
  danger: '255, 59, 48',
  neutral: '142, 142, 147',
} as const;

// RGB auxiliares (no se exponen como variables CSS)
const BLACK_RGB = '0, 0, 0';
const WHITE_RGB = '255, 255, 255';
const SURFACE_RGB = '245, 245, 247';

export const APP_COLORS = {
  white: '#ffffff',
  black: '#000000',
  background: '#f5f5f7',
  surfaceMuted: '#f9f9fb',
  controlBackground: '#f2f2f7',
  sidebarText: '#1c1c1e',
  bodyText: '#3c3c43',
  secondaryText: '#8e8e93',
  border: '#d1d1d6',
  borderSubtle: '#e5e5ea',
  borderDanger: '#ffccc7',
  selection: '#e5e5ea',
  dangerSurface: '#fff1f0',
  iconMuted: '#c7c7cc',

  // Overlays y bordes translúcidos
  cardBorder: rgba(BLACK_RGB, 0.05),
  glassBorder: rgba(BLACK_RGB, 0.06),
  glassSurface: rgba(SURFACE_RGB, 0.65),
  whiteOverlay: rgba(WHITE_RGB, 0.2),
  whiteTextMuted: rgba(WHITE_RGB, 0.9),
  whiteTextFaint: rgba(WHITE_RGB, 0.6),

  // Tints derivados de APP_COLOR_RGB
  primaryTint: rgba(APP_COLOR_RGB.primary, 0.08),
  primaryStatusTint: rgba(APP_COLOR_RGB.primary, 0.1),
  neutralTint: rgba(APP_COLOR_RGB.neutral, 0.1),
  successTint: rgba(APP_COLOR_RGB.success, 0.1),
  warningTint: rgba(APP_COLOR_RGB.warning, 0.1),

  // Colores semánticos derivados del RGB base
  primary: rgbToHex(APP_COLOR_RGB.primary),
  success: rgbToHex(APP_COLOR_RGB.success),
  warning: rgbToHex(APP_COLOR_RGB.warning),
  danger: rgbToHex(APP_COLOR_RGB.danger),
  neutral: rgbToHex(APP_COLOR_RGB.neutral),

  // Variantes del primario
  primaryStrong: '#0a84ff',
  primaryLight: '#30b0ff',
} as const;

export const APP_SPACING = {
  sectionRadius: 16,
  controlRadius: 8,
  itemRadius: 10,
  glassRadius: 14,
  sectionPadding: 24,
  controlHeight: 36,
  sidebarWidth: 240,
  toolbarHeight: 52,
  pageMaxWidth: 1200,
  pageTopPadding: 24,
  pageBottomPadding: 28,
} as const;

export const MACOS_THEME = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "SF Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
  sidebarGlass: 'rgba(246, 246, 248, 0.82)',
  sidebarGlassDark: 'rgba(28, 28, 30, 0.82)',
  toolbarGlass: 'rgba(255, 255, 255, 0.82)',
  toolbarGlassDark: 'rgba(32, 32, 34, 0.82)',
  backdropBlur: 'blur(30px) saturate(190%)',
  hairlineBorder: '1px solid rgba(0, 0, 0, 0.08)',
  hairlineBorderDark: '1px solid rgba(255, 255, 255, 0.08)',
  trafficLights: {
    close: '#ff5f56',
    closeBorder: 'rgba(224, 68, 62, 0.6)',
    minimize: '#ffbd2e',
    minimizeBorder: 'rgba(222, 161, 35, 0.6)',
    maximize: '#27c93f',
    maximizeBorder: 'rgba(40, 169, 55, 0.6)',
  },
} as const;

export const APP_GAP = {
  xs: 6,
  sm: 12,
  md: 14,
  lg: 24,
} as const;

export const APP_FONT_SIZE = {
  xs: 13,
  sm: 15,
  lg: 18,
} as const;

export const APP_FONT_WEIGHT = {
  medium: 500,
  semibold: 600,
} as const;

export const APP_SHADOWS = {
  section: `0 2px 10px ${rgba(BLACK_RGB, 0.04)}`,
  glass: `0 1px 4px ${rgba(BLACK_RGB, 0.06)}, 0 2px 12px ${rgba(BLACK_RGB, 0.04)}`,
  macButton: '0 1px 2px rgba(0, 0, 0, 0.06)',
  macPopover: '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.2)',
} as const;

// Estilos base reutilizables

const SURFACE_STYLE = {
  backgroundColor: APP_COLORS.white,
} as const satisfies CSSProperties;

const SIDEBAR_DIMENSIONS = {
  flex: `0 0 ${APP_SPACING.sidebarWidth}px`,
  width: APP_SPACING.sidebarWidth,
} as const satisfies CSSProperties;

// Estilos de componentes

export const SECTION_STYLE = {
  ...SURFACE_STYLE,
  borderRadius: APP_SPACING.sectionRadius,
  padding: APP_SPACING.sectionPadding,
  boxShadow: APP_SHADOWS.section,
} as const satisfies CSSProperties;

export const SECTION_HEADING_STYLE = {
  margin: `0 0 ${APP_GAP.md}px`,
  color: APP_COLORS.sidebarText,
  fontSize: APP_FONT_SIZE.lg,
  fontWeight: APP_FONT_WEIGHT.semibold,
} as const satisfies CSSProperties;

export const MUTED_ITEM_STYLE = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: APP_GAP.sm,
  padding: `${APP_GAP.sm}px ${APP_GAP.md}px`,
  borderRadius: APP_SPACING.itemRadius,
  backgroundColor: APP_COLORS.surfaceMuted,
} as const satisfies CSSProperties;

export const EMPTY_TEXT_STYLE = {
  margin: 0,
  color: APP_COLORS.secondaryText,
  fontSize: APP_FONT_SIZE.xs,
} as const satisfies CSSProperties;

export const ACTION_BUTTON_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: APP_GAP.xs,
  marginLeft: 'auto',
  width: 130,
  height: APP_SPACING.controlHeight,
  padding: APP_GAP.xs,
  border: `1px solid ${APP_COLORS.border}`,
  borderRadius: APP_SPACING.controlRadius,
  backgroundColor: APP_COLORS.controlBackground,
  color: APP_COLORS.primary,
  fontSize: APP_FONT_SIZE.xs,
  fontWeight: APP_FONT_WEIGHT.medium,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
} as const satisfies CSSProperties;

export const BACK_BUTTON_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: APP_GAP.xs,
  width: 'fit-content',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: APP_COLORS.primary,
  fontSize: APP_FONT_SIZE.sm,
  fontWeight: APP_FONT_WEIGHT.medium,
  padding: '4px 0',
} as const satisfies CSSProperties;

export const PAGE_CONTENT_STYLE = {
  ...SURFACE_STYLE,
  display: 'flex',
  flexDirection: 'column',
  gap: APP_GAP.lg,
  width: '100%',
  maxWidth: APP_SPACING.pageMaxWidth,
  height: '100%',
  margin: '0 auto',
  padding: `${APP_SPACING.pageTopPadding}px ${APP_GAP.lg}px ${APP_SPACING.pageBottomPadding}px`,
  boxSizing: 'border-box',
  overflow: 'hidden',
} as const satisfies CSSProperties;

export const PAGE_SCROLL_CONTENT_STYLE = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '0 0 16px',
} as const satisfies CSSProperties;

export const GLASS_CARD_STYLE = {
  backgroundColor: APP_COLORS.glassSurface,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: `1px solid ${APP_COLORS.glassBorder}`,
  boxShadow: APP_SHADOWS.glass,
  borderRadius: APP_SPACING.glassRadius,
} as const satisfies CSSProperties;

// Variables CSS de Framework7

const FRAMEWORK_PAGE_VARIABLES = {
  '--f7-page-bg-color': APP_COLORS.white,
  '--f7-bars-bg-color': APP_COLORS.white,
  '--f7-navbar-bg-color': APP_COLORS.white,
  '--f7-toolbar-bg-color': APP_COLORS.white,
  '--f7-card-bg-color': 'transparent',
  '--f7-list-strong-bg-color': APP_COLORS.white,
  '--f7-list-bg-color': APP_COLORS.white,
} as const satisfies ThemeStyle;

const SIDEBAR_VARIABLES = {
  '--f7-panel-width': `${APP_SPACING.sidebarWidth}px`,
  '--f7-panel-left-width': `${APP_SPACING.sidebarWidth}px`,
  '--f7-panel-bg-color': APP_COLORS.background,
  '--f7-page-bg-color': APP_COLORS.background,
  '--f7-list-strong-bg-color': APP_COLORS.background,
  '--f7-list-bg-color': APP_COLORS.background,
} as const satisfies ThemeStyle;

const SIDEBAR_MENU_VARIABLES = {
  '--f7-menu-list-item-selected-bg-color': APP_COLORS.selection,
  '--f7-menu-list-item-selected-text-color': APP_COLORS.primary,
  '--f7-menu-list-item-text-color': APP_COLORS.sidebarText,
  '--f7-list-item-title-text-color': APP_COLORS.sidebarText,
  '--f7-list-item-text-text-color': APP_COLORS.sidebarText,
  '--f7-text-color': APP_COLORS.sidebarText,
} as const satisfies ThemeStyle;

export const SIDEBAR_SURFACE_STYLE = {
  ...SIDEBAR_DIMENSIONS,
  backgroundColor: APP_COLORS.background,
  ...SIDEBAR_VARIABLES,
} as const satisfies ThemeStyle;

export const CONTENT_VIEW_STYLE = {
  ...SURFACE_STYLE,
  ...FRAMEWORK_PAGE_VARIABLES,
  '--f7-page-navbar-offset': '0px',
  '--f7-page-toolbar-top-offset': '0px',
  '--f7-page-content-extra-padding-top': '0px',
} as const satisfies ThemeStyle;

export const SIDEBAR_CONTAINER_STYLE = {
  ...SIDEBAR_DIMENSIONS,
  backgroundColor: APP_COLORS.background,
  color: APP_COLORS.black,
  ...SIDEBAR_MENU_VARIABLES,
} as const satisfies ThemeStyle;

export const SIDEBAR_ICON = {
  color: APP_COLORS.sidebarText,
  selectedColor: APP_COLORS.primary,
} as const;

// Alias mantenidos por compatibilidad con el código existente
export const SIDEBAR_ICON_SELECTED_COLOR = SIDEBAR_ICON.selectedColor;
export const SIDEBAR_ICON_COLOR = SIDEBAR_ICON.color;
                              
// Se calcula una sola vez al cargar el módulo, no en cada llamada.
const buildCssVariables = (): Record<string, string> => {
  const variables: Record<string, string> = {
    '--f7-theme-color': APP_COLORS.primary,
    '--f7-theme-color-rgb': APP_COLOR_RGB.primary,
  };

  // Variables propias: --app-color-* y --app-color-*-rgb
  for (const [name, value] of Object.entries(APP_COLORS)) {
    variables[`--app-color-${name}`] = value;
  }
  for (const [name, value] of Object.entries(APP_COLOR_RGB)) {
    variables[`--app-color-${name}-rgb`] = value;
  }

  // Alias de Framework7 -> variables propias
  const f7Aliases = {
    blue: 'primary',
    green: 'success',
    orange: 'warning',
    red: 'danger',
    gray: 'neutral',
  } as const;

  for (const [f7Name, appName] of Object.entries(f7Aliases)) {
    variables[`--f7-color-${f7Name}`] = `var(--app-color-${appName})`;
    variables[`--f7-color-${f7Name}-rgb`] = `var(--app-color-${appName}-rgb)`;
  }

  // Variables de página de Framework7
  for (const [name, value] of Object.entries(FRAMEWORK_PAGE_VARIABLES)) {
    variables[name] = String(value);
  }

  return variables;
};

const APP_CSS_VARIABLES = buildCssVariables();

//Inyecta las variables CSS del sistema y de Framework7 en el elemento raíz.
export function applyAppColors(): void {
  const { style } = document.documentElement;
  for (const [key, value] of Object.entries(APP_CSS_VARIABLES)) {
    style.setProperty(key, value);
  }
}