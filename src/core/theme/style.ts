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

export function applyAppColors(): void {
  const root = document.documentElement;

  Object.entries(APP_COLORS).forEach(([name, value]) => {
    root.style.setProperty(`--app-color-${name}`, value);
  });

  Object.entries(APP_COLOR_RGB).forEach(([name, value]) => {
    root.style.setProperty(`--app-color-${name}-rgb`, value);
  });

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
}
