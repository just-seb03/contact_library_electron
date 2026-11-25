import { useEffect } from 'react';
import { useApp } from '../core/context/AppContext';
import type { NavigationTarget, NavigationTargetType } from '../shared/types/navigation';

/**
 * Consume el elemento pendiente de abrir (`navigationFocus`) cuando es del tipo indicado.
 *
 * `open` debe abrir el elemento y devolver `true`; si devuelve `false` (p. ej. los datos aún
 * no cargaron), se reintenta en el siguiente render. Si nadie lo consume, el contexto lo
 * descarta solo pasados unos segundos.
 *
 * @example
 * useNavigationFocus('payment', (target) => {
 *   const payment = payments.find((p) => p.id === target.id);
 *   if (!payment) return false;
 *   highlight(payment.id);
 *   return true;
 * });
 */
export function useNavigationFocus<T extends NavigationTargetType>(
  type: T,
  open: (target: Extract<NavigationTarget, { type: T }>) => boolean
): void {
  const { navigationFocus, setNavigationFocus } = useApp();

  // Sin dependencias a propósito: se reevalúa en cada render para reintentar
  // cuando lleguen los datos. Es barato porque solo actúa si hay un foco de este tipo.
  useEffect(() => {
    if (navigationFocus?.type !== type) return;
    if (open(navigationFocus as Extract<NavigationTarget, { type: T }>)) {
      setNavigationFocus(null);
    }
  });
}
