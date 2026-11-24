/**
 * @file preferences.ts
 * @description Caché en memoria (proceso main) de las preferencias que afectan al comportamiento
 * nativo de la app. Existe porque el evento `close` de la ventana es síncrono: no puede esperar
 * una consulta a SQLite para decidir si ocultar o cerrar.
 */

import { getDatabase } from '../database/connection'

export interface SystemPreferences {
  /** Al cerrar la ventana, la app sigue activa en la bandeja (Windows) o barra de menús (macOS). */
  minimizeToTray: boolean
}

const preferences: SystemPreferences = {
  minimizeToTray: true,
}

export function getSystemPreferences(): Readonly<SystemPreferences> {
  return preferences
}

/**
 * Aplica sobre la caché los valores reconocidos de un objeto de configuración arbitrario
 * (por ejemplo, el payload de `settings:saveAll`). Ignora claves desconocidas o mal tipadas.
 */
export function applySystemPreferences(settings: Record<string, unknown>): void {
  if (typeof settings.minimizeToTray === 'boolean') {
    preferences.minimizeToTray = settings.minimizeToTray
  }
}

/**
 * Carga inicial desde SQLite. Debe llamarse después de `initDatabase()`.
 * Si falla, se conservan los valores por defecto.
 */
export async function loadSystemPreferences(): Promise<void> {
  try {
    const rows = await getDatabase()
      .prepare('SELECT key, value FROM settings WHERE key IN (?)')
      .all<{ key: string; value: string }>('minimizeToTray')
    const parsed: Record<string, unknown> = {}
    for (const row of rows) {
      try {
        parsed[row.key] = JSON.parse(row.value)
      } catch {
        parsed[row.key] = row.value
      }
    }
    applySystemPreferences(parsed)
  } catch (error) {
    console.error('[System] No se pudieron cargar las preferencias del sistema:', error)
  }
}
