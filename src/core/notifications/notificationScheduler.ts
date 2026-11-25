/**
 * @file notificationScheduler.ts
 * @description Planificador de notificaciones del proceso main.
 *
 * Cada `intervalMs` (60 s) revisa la ventana de tiempo transcurrida desde la revisión anterior
 * `(lastCheck, now]`, pregunta a los proveedores activos qué toca avisar, descarta lo que ya se
 * envió (`notification_log`) y muestra el resto.
 *
 * Por qué un tick periódico y no un `setTimeout` por evento: no hay que reprogramar nada cuando
 * cambian los datos, y no se desfasa con la suspensión del equipo.
 *
 * - Al arrancar y al reanudar tras suspensión, la ventana mira hacia atrás como máximo
 *   `catchUpMinutes` (15): se recuperan avisos recientes, no los de hace horas.
 * - No importa Electron: `main.ts` conecta `refreshNotifications()` a `powerMonitor` 'resume'.
 */

import {
  getSentNotificationIds,
  markNotificationSent,
  pruneNotificationLog,
} from './notificationLog'
import { getNotificationPreferences, showNotification } from './notificationService'
import type { AppNotification, NotificationProvider, NotificationWindow } from './types'

export interface NotificationSchedulerOptions {
  /** Frecuencia de revisión. Por defecto 60 s. */
  intervalMs?: number
  /** Cuánto se mira hacia atrás como máximo (arranque, suspensión). Por defecto 15 min. */
  catchUpMinutes?: number
  /** Reloj inyectable (pruebas). */
  now?: () => Date
}

const DEFAULT_INTERVAL_MS = 60_000
const DEFAULT_CATCH_UP_MINUTES = 15

const providers = new Map<NotificationProvider['kind'], NotificationProvider>()

let timer: ReturnType<typeof setInterval> | null = null
let lastCheck: Date | null = null
let config: Required<NotificationSchedulerOptions> | null = null

/** Evita revisiones simultáneas; si se pide otra durante una en curso, se encadena. */
let running: Promise<void> | null = null
let rerunRequested = false

/** Registra (o reemplaza) el proveedor de un tipo de notificación. */
export function registerNotificationProvider(provider: NotificationProvider): void {
  providers.set(provider.kind, provider)
}

export function startNotificationScheduler(options: NotificationSchedulerOptions = {}): void {
  if (timer) return

  config = {
    intervalMs: options.intervalMs ?? DEFAULT_INTERVAL_MS,
    catchUpMinutes: options.catchUpMinutes ?? DEFAULT_CATCH_UP_MINUTES,
    now: options.now ?? (() => new Date()),
  }
  lastCheck = null

  pruneNotificationLog().catch((error) => {
    console.error('[Notifications] No se pudo limpiar el registro de notificaciones:', error)
  })

  void refreshNotifications()
  timer = setInterval(() => void refreshNotifications(), config.intervalMs)
}

export function stopNotificationScheduler(): void {
  if (timer) clearInterval(timer)
  timer = null
  config = null
}

/**
 * Revisa ahora (sin esperar al siguiente tick). Úsese al reanudar tras suspensión.
 * Se resuelve cuando termina la revisión.
 */
export function refreshNotifications(): Promise<void> {
  if (!config) return Promise.resolve()
  if (running) {
    rerunRequested = true
    return running
  }

  running = (async () => {
    do {
      rerunRequested = false
      await checkOnce()
    } while (rerunRequested && config)
  })().finally(() => {
    running = null
  })
  return running
}

async function checkOnce(): Promise<void> {
  if (!config) return

  const now = config.now()
  const window = computeWindow(now, lastCheck, config.catchUpMinutes)
  lastCheck = now
  if (!window) return

  const due = await collectDue(window)
  if (due.length === 0) return

  let alreadySent: Set<string>
  try {
    alreadySent = await getSentNotificationIds(due.map((notification) => notification.id))
  } catch (error) {
    // Sin registro no se puede garantizar que no se repitan: mejor no avisar en este tick.
    console.error('[Notifications] No se pudo leer el registro de enviados:', error)
    return
  }

  for (const notification of due) {
    if (alreadySent.has(notification.id)) continue
    if (!showNotification(notification)) continue
    try {
      await markNotificationSent(notification)
    } catch (error) {
      console.error(`[Notifications] No se pudo registrar "${notification.id}":`, error)
    }
  }
}

/**
 * Ventana `(from, to]` a revisar. Nunca mira más atrás de `catchUpMinutes`.
 * @returns `null` si el reloj retrocedió (cambio de hora manual): se espera al siguiente tick.
 */
export function computeWindow(
  now: Date,
  previousCheck: Date | null,
  catchUpMinutes: number
): NotificationWindow | null {
  const earliest = new Date(now.getTime() - catchUpMinutes * 60_000)
  if (previousCheck && previousCheck.getTime() > now.getTime()) return null

  const from = previousCheck && previousCheck > earliest ? previousCheck : earliest
  return { from, to: now }
}

/** Avisos de todos los proveedores activos, sin duplicados. Un proveedor con error no frena a los demás. */
async function collectDue(window: NotificationWindow): Promise<AppNotification[]> {
  const preferences = getNotificationPreferences()
  const active = [...providers.values()].filter((provider) => provider.isEnabled(preferences))

  const results = await Promise.all(
    active.map(async (provider) => {
      try {
        return await provider.getDue(window)
      } catch (error) {
        console.error(`[Notifications] Error en el proveedor "${provider.kind}":`, error)
        return []
      }
    })
  )

  const unique = new Map<string, AppNotification>()
  for (const notification of results.flat()) unique.set(notification.id, notification)
  return [...unique.values()]
}
