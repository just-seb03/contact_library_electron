import type { CSSProperties } from 'react';

export const APP_COLORS = {
  white: '#ffffff',
  black: '#000000',
  background: '#f5f5f7',
  sidebarText: '#1c1c1e',
  selection: '#e5e5ea',
  primary: '#007aff',
  success: '#34c759',
  warning: '#ff9500',
  danger: '#ff3b30',
  neutral: '#8e8e93',
} as const;

const APP_COLOR_RGB = {
  primary: '0, 122, 255',
  success: '52, 199, 89',
  warning: '255, 149, 0',
  danger: '255, 59, 48',
  neutral: '142, 142, 147',
} as const;

/**
 * Estilos para el panel lateral (Panel, View, Page).
 * Utiliza variables CSS de Framework7 directamente en TypeScript sin archivos .css
 */
export const SIDEBAR_SURFACE_STYLE: CSSProperties = {
  backgroundColor: APP_COLORS.white,
  ['--f7-panel-bg-color' as any]: APP_COLORS.white,
  ['--f7-page-bg-color' as any]: APP_COLORS.white,
  ['--f7-list-strong-bg-color' as any]: APP_COLORS.white,
  ['--f7-list-bg-color' as any]: APP_COLORS.white,
};

/**
 * Estilos para el contenedor de contenido principal (content-view).
 * Configura las variables de Framework7 para fondos y offsets.
 */
export const CONTENT_VIEW_STYLE: CSSProperties = {
  backgroundColor: APP_COLORS.background,
  ['--f7-page-bg-color' as any]: APP_COLORS.background,
  ['--f7-bars-bg-color' as any]: APP_COLORS.background,
  ['--f7-navbar-bg-color' as any]: APP_COLORS.background,
  ['--f7-toolbar-bg-color' as any]: APP_COLORS.background,
  ['--f7-card-bg-color' as any]: APP_COLORS.background,
  ['--f7-list-strong-bg-color' as any]: APP_COLORS.background,
  ['--f7-list-bg-color' as any]: APP_COLORS.background,
  ['--f7-page-navbar-offset' as any]: '0px',
  ['--f7-page-toolbar-top-offset' as any]: '0px',
  ['--f7-page-content-extra-padding-top' as any]: '0px',
};

/**
 * Estilos para el contenedor de la barra lateral (LeftBar).
 */
export const SIDEBAR_CONTAINER_STYLE: CSSProperties = {
  backgroundColor: APP_COLORS.white,
  color: APP_COLORS.black,
  ['--f7-menu-list-item-selected-bg-color' as any]: APP_COLORS.selection,
  ['--f7-menu-list-item-selected-text-color' as any]: APP_COLORS.primary,
  ['--f7-menu-list-item-text-color' as any]: APP_COLORS.sidebarText,
  ['--f7-list-item-title-text-color' as any]: APP_COLORS.sidebarText,
  ['--f7-list-item-text-text-color' as any]: APP_COLORS.sidebarText,
  ['--f7-text-color' as any]: APP_COLORS.sidebarText,
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

  root.style.setProperty('--f7-page-bg-color', APP_COLORS.background);
  root.style.setProperty('--f7-bars-bg-color', APP_COLORS.background);
  root.style.setProperty('--f7-navbar-bg-color', APP_COLORS.background);
  root.style.setProperty('--f7-toolbar-bg-color', APP_COLORS.background);
  root.style.setProperty('--f7-card-bg-color', APP_COLORS.background);
  root.style.setProperty('--f7-list-strong-bg-color', APP_COLORS.background);
  root.style.setProperty('--f7-list-bg-color', APP_COLORS.background);
}
