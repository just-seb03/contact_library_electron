/**
 * @file preferences.ts
 * @description Caché en memoria (proceso main) de los ajustes del usuario que afectan al
 * comportamiento nativo de la app: cerrar a la bandeja y notificaciones.
 *
 * Existe porque algunas decisiones deben ser síncronas (el evento `close` de la ventana no puede
 * esperar una consulta a SQLite). Se carga al arrancar y se actualiza en cada `settings:saveAll`.
 * Las claves coinciden con las de `AppSettings` en el renderer.
 */

import { getDatabase } from '../database/connection'

export interface SystemPreferences {
  /** Al cerrar la ventana, la app sigue activa en la bandeja (Windows) o barra de menús (macOS). */
  minimizeToTray: boolean
  /** Aviso previo de eventos del calendario. */
  calendarAlerts: boolean
  /** Aviso 24 h antes de audiencias judiciales. */
  hearingAlerts: boolean
  /** Resumen diario de cobros vencidos y por vencer. */
  paymentReminders: boolean
  /** Sonidos de la app; también decide si las notificaciones suenan. */
  soundEffects: boolean
}

const preferences: SystemPreferences = {
  minimizeToTray: true,
  calendarAlerts: true,
  hearingAlerts: true,
  paymentReminders: true,
  soundEffects: true,
}

/** Claves gestionadas por esta caché (todas booleanas). */
const PREFERENCE_KEYS = Object.keys(preferences) as Array<keyof SystemPreferences>

export function getSystemPreferences(): Readonly<SystemPreferences> {
  return preferences
}

/**
 * Aplica sobre la caché los valores reconocidos de un objeto de configuración arbitrario
 * (por ejemplo, el payload de `settings:saveAll`). Ignora claves desconocidas o mal tipadas.
 */
export function applySystemPreferences(settings: Record<string, unknown>): void {
  for (const key of PREFERENCE_KEYS) {
    const value = settings[key]
    if (typeof value === 'boolean') {
      preferences[key] = value
    }
  }
}

/**
 * Carga inicial desde SQLite. Debe llamarse después de `initDatabase()`.
 * Si falla, se conservan los valores por defecto.
 */
export async function loadSystemPreferences(): Promise<void> {
  try {
    const placeholders = PREFERENCE_KEYS.map(() => '?').join(', ')
    const rows = await getDatabase()
      .prepare(`SELECT key, value FROM settings WHERE key IN (${placeholders})`)
      .all<{ key: string; value: string }>(...PREFERENCE_KEYS)
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
