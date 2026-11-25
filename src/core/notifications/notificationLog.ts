/**
 * @file notificationLog.ts
 * @description Registro persistente en SQLite (tabla `notification_log`, migración v2) de las
 * notificaciones ya enviadas, para no repetir avisos entre ticks ni entre reinicios de la app.
 */

import { getDatabase } from '../database/connection'
import type { AppNotification } from './types'

/** Días que se conserva el registro. Debe superar la mayor antelación de cualquier aviso. */
export const NOTIFICATION_LOG_RETENTION_DAYS = 30

/** IDs de la lista que ya fueron enviados. */
export async function getSentNotificationIds(ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set()

  const placeholders = ids.map(() => '?').join(', ')
  const rows = await getDatabase()
    .prepare(`SELECT id FROM notification_log WHERE id IN (${placeholders})`)
    .all<{ id: string }>(...ids)
  return new Set(rows.map((row) => row.id))
}

export async function markNotificationSent(notification: AppNotification): Promise<void> {
  await getDatabase()
    .prepare('INSERT OR IGNORE INTO notification_log (id, kind) VALUES (?, ?)')
    .run(notification.id, notification.kind)
}

/** Elimina registros antiguos. @returns Cantidad de filas eliminadas. */
export async function pruneNotificationLog(
  retentionDays: number = NOTIFICATION_LOG_RETENTION_DAYS
): Promise<number> {
  const result = await getDatabase()
    .prepare("DELETE FROM notification_log WHERE sent_at < datetime('now', ?)")
    .run(`-${retentionDays} days`)
  return result.changes
}
