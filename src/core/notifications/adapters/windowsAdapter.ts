/**
 * @file windowsAdapter.ts
 * @description Particularidades de las notificaciones (toasts) de Windows.
 *
 * Requisitos del sistema (fuera de este archivo):
 * - `app.setAppUserModelId(APP_ID)` en el arranque (ya configurado en `main.ts`).
 * - App empaquetada: Windows solo muestra toasts si existe un acceso directo en el menú Inicio
 *   con ese AppUserModelID. El instalador NSIS lo crea automáticamente.
 *
 * Extensión futura: botones de acción ("Posponer", "Ver") mediante `toastXml`.
 */

import type { NotificationConstructorOptions } from 'electron'
import type { AppNotification, NotificationDisplayOptions } from '../types'
import { BaseAdapter } from './baseAdapter'

export interface WindowsAdapterOptions {
  /** Icono que se muestra dentro del toast (PNG). */
  iconPath?: string
}

export class WindowsAdapter extends BaseAdapter {
  private readonly iconPath?: string

  constructor(options: WindowsAdapterOptions = {}) {
    super('win32')
    this.iconPath = options.iconPath
  }

  protected override buildOptions(
    notification: AppNotification,
    options: NotificationDisplayOptions
  ): NotificationConstructorOptions {
    return {
      ...super.buildOptions(notification, options),
      icon: this.iconPath,
    }
  }
}
