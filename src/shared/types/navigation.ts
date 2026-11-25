/**
 * @file navigation.ts
 * @description Contrato de navegación entre el proceso main y el renderer (canal `app:navigate`).
 * Permite abrir no solo una sección, sino un elemento concreto (evento, audiencia, cliente, pago).
 * Lo usan las notificaciones, el menú nativo y cualquier otro origen del sistema operativo.
 */

/** Elemento concreto a abrir dentro de una sección. */
export type NavigationTarget =
  | { type: 'calendarEvent'; id: string }
  | { type: 'hearing'; clientId: number }
  | { type: 'client'; clientId: number }
  | { type: 'payment'; id: string }

export type NavigationTargetType = NavigationTarget['type']

export interface NavigationRequest {
  /** Ruta de la sección (p. ej. '/calendar/'). */
  route: string
  /** Elemento a enfocar al llegar. Si se omite, solo se abre la sección. */
  target?: NavigationTarget
}

/** Sección en la que vive cada tipo de elemento. */
export const NAVIGATION_TARGET_ROUTES: Record<NavigationTargetType, string> = {
  calendarEvent: '/calendar/',
  hearing: '/calendar/',
  client: '/cliente/',
  payment: '/pagos/',
}

function isNavigationTarget(value: unknown): value is NavigationTarget {
  if (!value || typeof value !== 'object') return false
  const target = value as Record<string, unknown>
  switch (target.type) {
    case 'calendarEvent':
    case 'payment':
      return typeof target.id === 'string'
    case 'hearing':
    case 'client':
      return typeof target.clientId === 'number'
    default:
      return false
  }
}

/**
 * Normaliza el payload recibido por IPC. Acepta el formato heredado (solo la ruta como texto,
 * usado por el menú de macOS) y descarta destinos mal formados.
 */
export function toNavigationRequest(payload: unknown): NavigationRequest | null {
  if (typeof payload === 'string') return { route: payload }
  if (!payload || typeof payload !== 'object') return null

  const { route, target } = payload as Record<string, unknown>
  if (typeof route !== 'string') return null
  return isNavigationTarget(target) ? { route, target } : { route }
}
