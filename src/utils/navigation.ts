import { f7 } from 'framework7-react';
import type { AppTab } from '../context/types';

export const APP_TAB_ROUTES: Record<AppTab, string> = {
  inicio: '/home-content/',
  calendar: '/calendar/',
  cliente: '/cliente/',
  pagos: '/pagos/',
  config: '/settings/',
};

const APP_TABS_BY_ROUTE: Record<string, AppTab> = {
  '/home-content/': 'inicio',
  '/calendar/': 'calendar',
  '/cliente/': 'cliente',
  '/pagos/': 'pagos',
  '/settings/': 'config',
};

export function getAppTabForRoute(path: string): AppTab | null {
  return APP_TABS_BY_ROUTE[path] ?? null;
}

export function navigateToTab(tab: AppTab): void {
  const route = APP_TAB_ROUTES[tab];
  const view = f7.views?.get('#content-view') ?? f7.view?.get('#content-view');
  const router = view?.router;

  if (!router) {
    throw new Error('No se pudo encontrar el router de contenido de la aplicación');
  }

  if (router.currentRoute?.url !== route) {
    router.navigate(route);
  }
}
