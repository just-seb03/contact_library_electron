import type { CSSProperties } from 'react';

type ThemeStyle = CSSProperties & Record<`--${string}`, string | number>;

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
  cardBorder: 'rgba(0, 0, 0, 0.05)',
  whiteOverlay: 'rgba(255, 255, 255, 0.2)',
  whiteTextMuted: 'rgba(255, 255, 255, 0.9)',
  whiteTextFaint: 'rgba(255, 255, 255, 0.6)',
  primaryTint: 'rgba(0, 122, 255, 0.08)',
  neutralTint: 'rgba(142, 142, 147, 0.1)',
  successTint: 'rgba(52, 199, 89, 0.1)',
  warningTint: 'rgba(255, 149, 0, 0.1)',
  primaryStatusTint: 'rgba(0, 122, 255, 0.1)',
  primary: '#007aff',
  primaryStrong: '#0a84ff',
  primaryLight: '#30b0ff',
  success: '#34c759',
  warning: '#ff9500',
  danger: '#ff3b30',
  neutral: '#8e8e93',
} as const;

export const APP_SPACING = {
  sectionRadius: 16,
  controlRadius: 8,
  itemRadius: 10,
  sectionPadding: 24,
  controlHeight: 36,
  sidebarWidth: 250,
  pageMaxWidth: 1200,
  pageTopPadding: 48,
  pageBottomPadding: 28,
} as const;

const SURFACE_STYLE: CSSProperties = {
  backgroundColor: APP_COLORS.white,
};

export const SECTION_STYLE: CSSProperties = {
  ...SURFACE_STYLE,
  borderRadius: APP_SPACING.sectionRadius,
  padding: APP_SPACING.sectionPadding,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
};

export const SECTION_HEADING_STYLE: CSSProperties = {
  margin: '0 0 14px',
  color: APP_COLORS.sidebarText,
  fontSize: 18,
  fontWeight: 600,
};

export const MUTED_ITEM_STYLE: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '12px 14px',
  borderRadius: APP_SPACING.itemRadius,
  backgroundColor: APP_COLORS.surfaceMuted,
};

export const EMPTY_TEXT_STYLE: CSSProperties = {
  margin: 0,
  color: APP_COLORS.secondaryText,
  fontSize: 13,
};

export const ACTION_BUTTON_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  marginLeft: 'auto',
  width: 130,
  height: APP_SPACING.controlHeight,
  padding: '6px 6px',
  border: `1px solid ${APP_COLORS.border}`,
  borderRadius: APP_SPACING.controlRadius,
  backgroundColor: APP_COLORS.controlBackground,
  color: APP_COLORS.primary,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export const PAGE_CONTENT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: '100%',
  maxWidth: APP_SPACING.pageMaxWidth,
  height: '100%',
  margin: '0 auto',
  padding: `${APP_SPACING.pageTopPadding}px 24px ${APP_SPACING.pageBottomPadding}px`,
  boxSizing: 'border-box',
  ...SURFACE_STYLE,
  overflow: 'hidden',
};

export const PAGE_SCROLL_CONTENT_STYLE: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '0 0 16px',
};

export const BACK_BUTTON_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  width: 'fit-content',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: APP_COLORS.primary,
  fontSize: 15,
  fontWeight: 500,
  padding: '4px 0',
};

const APP_COLOR_RGB = {
  primary: '0, 122, 255',
  success: '52, 199, 89',
  warning: '255, 149, 0',
  danger: '255, 59, 48',
  neutral: '142, 142, 147',
} as const;

const FRAMEWORK_PAGE_VARIABLES: ThemeStyle = {
  '--f7-page-bg-color': APP_COLORS.white,
  '--f7-bars-bg-color': APP_COLORS.white,
  '--f7-navbar-bg-color': APP_COLORS.white,
  '--f7-toolbar-bg-color': APP_COLORS.white,
  '--f7-card-bg-color': 'transparent',
  '--f7-list-strong-bg-color': APP_COLORS.white,
  '--f7-list-bg-color': APP_COLORS.white,
};

const SIDEBAR_VARIABLES: ThemeStyle = {
  '--f7-panel-width': `${APP_SPACING.sidebarWidth}px`,
  '--f7-panel-left-width': `${APP_SPACING.sidebarWidth}px`,
  '--f7-panel-bg-color': APP_COLORS.background,
  '--f7-page-bg-color': APP_COLORS.background,
  '--f7-list-strong-bg-color': APP_COLORS.background,
  '--f7-list-bg-color': APP_COLORS.background,
};

const SIDEBAR_MENU_VARIABLES: ThemeStyle = {
  '--f7-menu-list-item-selected-bg-color': APP_COLORS.selection,
  '--f7-menu-list-item-selected-text-color': APP_COLORS.primary,
  '--f7-menu-list-item-text-color': APP_COLORS.sidebarText,
  '--f7-list-item-title-text-color': APP_COLORS.sidebarText,
  '--f7-list-item-text-text-color': APP_COLORS.sidebarText,
  '--f7-text-color': APP_COLORS.sidebarText,
};

/**
 * Estilos para el panel lateral (Panel, View, Page).
 * Utiliza variables CSS de Framework7 directamente en TypeScript sin archivos .css
 */
export const SIDEBAR_SURFACE_STYLE: ThemeStyle = {
  width: APP_SPACING.sidebarWidth,
  minWidth: APP_SPACING.sidebarWidth,
  maxWidth: APP_SPACING.sidebarWidth,
  backgroundColor: APP_COLORS.background,
  ...SIDEBAR_VARIABLES,
};

/**
 * Estilos para el contenedor de contenido principal (content-view).
 * Configura las variables de Framework7 para fondos y offsets.
 */
export const CONTENT_VIEW_STYLE: ThemeStyle = {
  ...SURFACE_STYLE,
  ...FRAMEWORK_PAGE_VARIABLES,
  '--f7-page-navbar-offset': '0px',
  '--f7-page-toolbar-top-offset': '0px',
  '--f7-page-content-extra-padding-top': '0px',
};

/**
 * Estilos para el contenedor de la barra lateral (LeftBar).
 */
export const SIDEBAR_CONTAINER_STYLE: ThemeStyle = {
  width: APP_SPACING.sidebarWidth,
  minWidth: APP_SPACING.sidebarWidth,
  maxWidth: APP_SPACING.sidebarWidth,
  backgroundColor: APP_COLORS.background,
  color: APP_COLORS.black,
  ...SIDEBAR_MENU_VARIABLES,
};

/**
 * Estilo con efecto translúcido / glassmorphism para las cartas.
 */
export const GLASS_CARD_STYLE: CSSProperties = {
  backgroundColor: `rgba(245, 245, 247, 0.65)`,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06), 0 2px 12px rgba(0, 0, 0, 0.04)',
  borderRadius: '14px',
};

/**
 * Color del icono seleccionado en el sidebar.
 */
export const SIDEBAR_ICON_SELECTED_COLOR = APP_COLORS.primary;

/**
 * Color del icono no seleccionado en el sidebar.
 */
export const SIDEBAR_ICON_COLOR = APP_COLORS.sidebarText;

/**
 * Inyecta las variables CSS de color del sistema y de Framework7 en el elemento raíz (:root)
 */
export function applyAppColors(): void {
  const root = document.documentElement;

  Object.entries(APP_COLORS).forEach(([name, value]) => {
    root.style.setProperty(`--app-color-${name}`, value);
  });

  Object.entries(APP_COLOR_RGB).forEach(([name, value]) => {
    root.style.setProperty(`--app-color-${name}-rgb`, value);
  });

  root.style.setProperty('--f7-theme-color', APP_COLORS.primary);
  root.style.setProperty('--f7-theme-color-rgb', APP_COLOR_RGB.primary);
  root.style.setProperty('--f7-color-blue', 'var(--app-color-primary)');
  root.style.setProperty('--f7-color-green', 'var(--app-color-success)');
  root.style.setProperty('--f7-color-orange', 'var(--app-color-warning)');
  root.style.setProperty('--f7-color-red', 'var(--app-color-danger)');
  root.style.setProperty('--f7-color-gray', 'var(--app-color-neutral)');
  root.style.setProperty('--f7-color-blue-rgb', 'var(--app-color-primary-rgb)');
  root.style.setProperty('--f7-color-green-rgb', 'var(--app-color-success-rgb)');
  root.style.setProperty('--f7-color-orange-rgb', 'var(--app-color-warning-rgb)');
  root.style.setProperty('--f7-color-red-rgb', 'var(--app-color-danger-rgb)');
  root.style.setProperty('--f7-color-gray-rgb', 'var(--app-color-neutral-rgb)');

  Object.entries(FRAMEWORK_PAGE_VARIABLES).forEach(([name, value]) => {
    root.style.setProperty(name, String(value));
  });
}
