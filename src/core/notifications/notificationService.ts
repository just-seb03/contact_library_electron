/**
 * @file notificationService.ts
 * @description Fachada única para mostrar notificaciones desde el proceso main.
 *
 * Responsabilidades:
 * - Validar que el sistema soporte notificaciones.
 * - Resolver las preferencias globales (sonido) y la ruta de destino.
 * - Al hacer clic: mostrar la ventana y navegar a la sección correspondiente.
 *
 * No conoce la plataforma (eso es del adaptador) ni la ventana (recibe callbacks),
 * y no decide QUÉ notificar (eso es de los proveedores y el scheduler).
 */

import { NAVIGATION_TARGET_ROUTES } from '../../shared/types/navigation'
import {
  NOTIFICATION_ROUTES,
  type AppNotification,
  type NavigationRequest,
  type NotificationAdapter,
  type NotificationPreferences,
  type NotificationStatus,
} from './types'

/** Valores usados hasta que las preferencias reales estén conectadas (paso 7). */
export const DEFAULT_NOTIFICATION_PREFERENCES: Readonly<NotificationPreferences> = {
  calendarAlerts: true,
  hearingAlerts: true,
  paymentReminders: true,
  sound: true,
}

export interface NotificationServiceOptions {
  adapter: NotificationAdapter
  /** Preferencias actuales del usuario. Se consulta en cada notificación. */
  getPreferences?: () => Readonly<NotificationPreferences>
  /** Muestra (o crea) la ventana principal. */
  onOpen: () => void
  /** Navega el renderer a una sección y, opcionalmente, abre un elemento concreto. */
  navigate: (request: NavigationRequest) => void
}

/** Sección + elemento a abrir al hacer clic en la notificación. */
export function resolveNavigation(notification: AppNotification): NavigationRequest {
  const { target } = notification
  const route =
    notification.route ??
    (target ? NAVIGATION_TARGET_ROUTES[target.type] : NOTIFICATION_ROUTES[notification.kind])
  return target ? { route, target } : { route }
}

let service: NotificationServiceOptions | null = null

export function initNotificationService(options: NotificationServiceOptions): void {
  service = options
}

export function getNotificationPreferences(): Readonly<NotificationPreferences> {
  return service?.getPreferences?.() ?? DEFAULT_NOTIFICATION_PREFERENCES
}

export function getNotificationStatus(): NotificationStatus {
  return {
    supported: service?.adapter.isSupported() ?? false,
    platform: service?.adapter.platform ?? process.platform,
  }
}

/**
 * Muestra una notificación.
 * @returns `true` si se entregó al sistema; `false` si el servicio no está listo o no hay soporte.
 */
export function showNotification(notification: AppNotification): boolean {
  if (!service) {
    console.warn('[Notifications] Servicio no inicializado; se descarta:', notification.id)
    return false
  }

  const { adapter, onOpen, navigate } = service
  if (!adapter.isSupported()) return false

  const request = resolveNavigation(notification)

  adapter.show(notification, {
    silent: !getNotificationPreferences().sound,
    onClick: () => {
      onOpen()
      navigate(request)
    },
  })
  return true
}

export function disposeNotificationService(): void {
  service?.adapter.dispose()
  service = null
}
