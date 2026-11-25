/**
 * @file index.ts
 * @description Fábrica de adaptadores. Es el único punto del sistema de notificaciones
 * que distingue entre plataformas.
 */

import type { NotificationAdapter } from '../types'
import { BaseAdapter } from './baseAdapter'
import { MacAdapter } from './macAdapter'
import { WindowsAdapter } from './windowsAdapter'

export interface CreateNotificationAdapterOptions {
  platform?: NodeJS.Platform
  /** Icono de la app en PNG (`public/icon.png`). Solo lo usan las plataformas que lo muestran. */
  iconPath?: string
}

export function createNotificationAdapter(
  options: CreateNotificationAdapterOptions = {}
): NotificationAdapter {
  const { platform = process.platform, iconPath } = options

  switch (platform) {
    case 'win32':
      return new WindowsAdapter({ iconPath })
    case 'darwin':
      return new MacAdapter()
    default:
      return new BaseAdapter(platform)
  }
}

export { BaseAdapter, MacAdapter, WindowsAdapter }
