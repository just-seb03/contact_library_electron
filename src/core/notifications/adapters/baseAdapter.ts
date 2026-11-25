/**
 * @file baseAdapter.ts
 * @description Implementación común sobre `Notification` de Electron, válida en todas las plataformas.
 * Los adaptadores de cada sistema heredan de aquí y solo sobrescriben `buildOptions()`
 * para añadir lo que es exclusivo de su plataforma.
 */

import { Notification, type NotificationConstructorOptions } from 'electron'
import type {
  AppNotification,
  NotificationAdapter,
  NotificationDisplayOptions,
} from '../types'

/**
 * Máximo de notificaciones que se mantienen referenciadas.
 * Si el objeto `Notification` se recolecta (GC), el clic deja de funcionar, sobre todo
 * cuando el aviso ya pasó al Centro de actividades de Windows o de notificaciones de macOS.
 */
const MAX_TRACKED_NOTIFICATIONS = 50

export class BaseAdapter implements NotificationAdapter {
  readonly platform: NodeJS.Platform

  /** Notificaciones vivas, en orden de creación (la más antigua primero). */
  private readonly tracked = new Set<Notification>()

  constructor(platform: NodeJS.Platform = process.platform) {
    this.platform = platform
  }

  isSupported(): boolean {
    return Notification.isSupported()
  }

  show(notification: AppNotification, options: NotificationDisplayOptions): void {
    if (!this.isSupported()) return

    const native = new Notification(this.buildOptions(notification, options))
    this.track(native)

    native.on('click', () => {
      this.release(native)
      options.onClick()
    })

    // Solo Windows: el sistema rechazó la notificación (p. ej. falta el AppUserModelID).
    native.on('failed', (_event, error) => {
      this.release(native)
      console.error(`[Notifications] No se pudo mostrar "${notification.id}":`, error)
    })

    native.show()
  }

  dispose(): void {
    for (const native of this.tracked) {
      native.removeAllListeners()
      native.close()
    }
    this.tracked.clear()
  }

  /**
   * Traduce la notificación genérica a opciones de Electron.
   * Las subclases llaman a `super.buildOptions()` y añaden sus particularidades.
   */
  protected buildOptions(
    notification: AppNotification,
    options: NotificationDisplayOptions
  ): NotificationConstructorOptions {
    return {
      title: notification.title,
      body: notification.body,
      silent: options.silent,
      // Windows/Linux: 'never' mantiene el aviso en pantalla hasta que el usuario lo cierre.
      timeoutType: notification.urgent ? 'never' : 'default',
    }
  }

  // No se libera en el evento 'close': en Windows se emite cuando el aviso pasa al
  // Centro de actividades, y desde ahí el usuario todavía puede hacer clic.
  private track(native: Notification): void {
    this.tracked.add(native)
    if (this.tracked.size > MAX_TRACKED_NOTIFICATIONS) {
      const oldest = this.tracked.values().next().value
      if (oldest) this.release(oldest)
    }
  }

  private release(native: Notification): void {
    native.removeAllListeners()
    this.tracked.delete(native)
  }
}
