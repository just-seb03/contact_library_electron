import { useEffect } from 'react';
import { f7ready } from 'framework7-react';
import { useApp } from '../core/context/AppContext';
import type { AppTab } from '../core/context/types';
import type { NavigationRequest } from '../shared/types/navigation';
import { getAppTabForRoute, navigateToTab } from './navigation';

/** Alias heredados que algunas llamadas envían en lugar de la ruta. */
const LEGACY_ROUTE_ALIASES: Record<string, AppTab> = {
  config: 'config',
};

/**
 * Escucha las navegaciones que llegan del proceso main (canal `app:navigate`):
 * menú nativo de macOS (Cmd+,), clic en notificaciones, etc.
 * Abre la sección y, si viene un destino, deja el elemento listo para que su página lo abra.
 */
export function useSystemNavigation(): void {
  const { setActiveTab, setSelectedClientId, setNavigationFocus } = useApp();

  useEffect(() => {
    if (!window.electronAPI?.onNavigate) return;

    return window.electronAPI.onNavigate(({ route, target }: NavigationRequest) => {
      const tab = getAppTabForRoute(route) ?? LEGACY_ROUTE_ALIASES[route];
      if (!tab) {
        console.warn('[Navegación] Ruta desconocida recibida del sistema:', route);
        return;
      }

      if (target?.type === 'client') {
        // La ficha del cliente ya se abre con el cliente seleccionado en el contexto.
        setSelectedClientId(target.clientId);
      } else if (target) {
        setNavigationFocus(target);
      }

      setActiveTab(tab);
      f7ready(() => {
        try {
          navigateToTab(tab);
        } catch (err) {
          console.warn(`[Navegación] No se pudo abrir "${route}":`, err);
        }
      });
    });
  }, [setActiveTab, setSelectedClientId, setNavigationFocus]);
}
