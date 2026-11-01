import { ipcMain } from 'electron'
import { getDatabase } from '../../../core/database/connection'

export function registerSettingsController(): void {
  ipcMain.handle('db:settings:getAll', async () => {
    const db = getDatabase()
    const rows = await db.prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>()
    const settings: Record<string, any> = {}
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value)
      } catch {
        settings[row.key] = row.value
      }
    }
    return settings
  })

  ipcMain.handle('db:settings:saveAll', async (_event, settings: Record<string, any>) => {
    const db = getDatabase()
    await db.transaction(async () => {
      const statement = db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `)
      for (const [key, value] of Object.entries(settings)) {
        await statement.run(key, JSON.stringify(value))
      }
    })
    return true
  })
}
