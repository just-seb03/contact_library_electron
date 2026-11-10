import { getDatabase } from '../../../core/database/connection'

export interface SettingRow {
  key: string
  value: string
  updated_at: string
}

export class SettingsRepository {
  async getAll(): Promise<Record<string, unknown>> {
    const db = getDatabase()
    const rows = await db.prepare('SELECT key, value FROM settings').all<SettingRow>()
    const result: Record<string, unknown> = {}

    for (const row of rows) {
      try {
        result[row.key] = JSON.parse(row.value)
      } catch {
        result[row.key] = row.value
      }
    }
    return result
  }

  async get<T>(key: string): Promise<T | null> {
    const db = getDatabase()
    const row = await db.prepare('SELECT value FROM settings WHERE key = ?').get<{ value: string }>(key)
    if (!row) return null

    try {
      return JSON.parse(row.value) as T
    } catch {
      return row.value as unknown as T
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    const db = getDatabase()
    const serialized = JSON.stringify(value)

    await db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).run(key, serialized)
  }

  async setMultiple(settings: Record<string, unknown>): Promise<void> {
    const db = getDatabase()
    await db.transaction(async () => {
      const stmt = db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `)
      for (const [key, value] of Object.entries(settings)) {
        await stmt.run(key, JSON.stringify(value))
      }
    })
  }

  async delete(key: string): Promise<boolean> {
    const db = getDatabase()
    const res = await db.prepare('DELETE FROM settings WHERE key = ?').run(key)
    return res.changes > 0
  }
}

export const settingsRepository = new SettingsRepository()

