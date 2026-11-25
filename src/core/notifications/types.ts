/**
 * @file types.ts
 * @description Contratos del sistema de notificaciones.
 *
 * Este archivo NO importa Electron ni conoce la plataforma: lo comparten los proveedores
 * (reglas de negocio de cada feature), el servicio, el scheduler y los adaptadores.
 * Portar a otra plataforma solo exige una nueva implementación de `NotificationAdapter`.
 *
 *   NotificationProvider ──getDue()──▶ Scheduler ──▶ Service ──show()──▶ NotificationAdapter
 *   (calendario, audiencias, cobros)                                     (Windows / macOS)
 */

import type { NavigationRequest, NavigationTarget } from '../../shared/types/navigation'

// ─── Notificación ─────────────────────────────────────────────────────────────

/** Origen de la notificación. Determina la preferencia que la habilita y la ruta por defecto. */
export type NotificationKind = 'calendar' | 'hearing' | 'payment' | 'system'

/**
 * Sección por defecto de cada tipo, usada cuando la notificación no trae `target`
 * (p. ej. el resumen diario de cobros). Deben existir en `navigation/`.
 */
export const NOTIFICATION_ROUTES = {
  calendar: '/calendar/',
  hearing: '/calendar/',
  payment: '/pagos/',
  system: '/',
} as const satisfies Record<NotificationKind, string>

export type NotificationRoute = (typeof NOTIFICATION_ROUTES)[NotificationKind] | '/settings/'

/** Notificación independiente de la plataforma. */
export interface AppNotification {
  /**
   * ID estable y determinista (ver `createNotificationId`). Se usa para no repetir avisos:
   * el mismo hecho debe producir siempre el mismo ID, y un cambio relevante (p. ej. nueva
   * hora de un evento) debe producir uno distinto.
   */
  id: string
  kind: NotificationKind
  title: string
  body: string
  /**
   * Elemento concreto que se abre al hacer clic (evento, audiencia, cliente o pago).
   * Determina también la sección, salvo que se indique `route`.
   */
  target?: NavigationTarget
  /** Sección a abrir. Por defecto: la del `target`, o `NOTIFICATION_ROUTES[kind]`. */
  route?: NotificationRoute
  /** No desaparece sola (p. ej. audiencias). Cada adaptador lo traduce a su plataforma. */
  urgent?: boolean
}

/**
 * Construye un ID determinista con el formato `kind:parte1:parte2...`.
 * @example createNotificationId('calendar', event.id, '2026-11-24T10:00')
 */
export function createNotificationId(
  kind: NotificationKind,
  ...parts: Array<string | number>
): string {
  return [kind, ...parts.map((part) => String(part).replace(/:/g, '_'))].join(':')
}

// ─── Preferencias ─────────────────────────────────────────────────────────────

/**
 * Preferencias del usuario que afectan a las notificaciones.
 * Se alimentan desde los ajustes (`AppSettings`) a través de la caché del proceso main.
 */
export interface NotificationPreferences {
  /** Aviso previo de eventos del calendario (`alarmMinutes`). */
  calendarAlerts: boolean
  /** Aviso 24 h antes de audiencias judiciales. */
  hearingAlerts: boolean
  /** Resumen de cobros pendientes y vencidos. */
  paymentReminders: boolean
  /** Reproducir el sonido del sistema al notificar. */
  sound: boolean
}

// ─── Proveedores (reglas de negocio, uno por feature) ─────────────────────────

/** Intervalo de tiempo consultado en cada tick del scheduler: `(from, to]`. */
export interface NotificationWindow {
  from: Date
  to: Date
}

/**
 * Regla de negocio que decide qué notificar. Vive en su feature (`features/<x>/notifications/`)
 * y no conoce Electron: solo lee datos y devuelve notificaciones, lo que la hace testeable.
 */
export interface NotificationProvider {
  kind: NotificationKind
  /** Si el usuario tiene activado este tipo de aviso. */
  isEnabled(preferences: Readonly<NotificationPreferences>): boolean
  /** Notificaciones cuyo momento de aviso cae dentro de la ventana. */
  getDue(window: NotificationWindow): Promise<AppNotification[]>
}

// ─── Adaptadores (lo único que depende de la plataforma) ──────────────────────

/** Opciones que el servicio resuelve (preferencias, navegación) y entrega al adaptador. */
export interface NotificationDisplayOptions {
  /** Sin sonido. */
  silent: boolean
  /** Se invoca cuando el usuario hace clic en la notificación. */
  onClick: () => void
}

/**
 * Puente con el sistema de notificaciones nativo. Hay una implementación por plataforma
 * (`adapters/windowsAdapter.ts`, `adapters/macAdapter.ts`) y se elige en `adapters/index.ts`.
 */
export interface NotificationAdapter {
  readonly platform: NodeJS.Platform
  /** Si el sistema operativo permite mostrar notificaciones. */
  isSupported(): boolean
  show(notification: AppNotification, options: NotificationDisplayOptions): void
  /** Libera notificaciones vivas al cerrar la app. */
  dispose(): void
}

// ─── Estado (expuesto a la UI de Ajustes por IPC) ─────────────────────────────

export type { NavigationRequest, NavigationTarget }

export interface NotificationStatus {
  supported: boolean
  platform: NodeJS.Platform
}
