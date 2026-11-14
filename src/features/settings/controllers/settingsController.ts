import { ipcMain } from 'electron'
import { getDatabase } from '../../../core/database/connection'
import {
  IPC_CHANNELS,
  createIpcSuccess,
  createIpcError,
  type IpcResponse,
  type SaveSettingsDTO,
} from '../../../shared/types/ipc'

export function registerSettingsController(): void {
  // 1. Obtener todas las configuraciones
  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_GET,
    async (): Promise<IpcResponse<Record<string, unknown>>> => {
      try {
        const db = getDatabase()
        const rows = await db.prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>()
        const settings: Record<string, unknown> = {}
        for (const row of rows) {
          try {
            settings[row.key] = JSON.parse(row.value)
          } catch {
            settings[row.key] = row.value
          }
        }
        return createIpcSuccess(settings)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // 2. Guardar lote completo de configuraciones
  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_SAVE_ALL,
    async (_event, settings: SaveSettingsDTO): Promise<IpcResponse<boolean>> => {
      try {
        if (!settings || typeof settings !== 'object') {
          return createIpcError('Se esperaba un objeto de configuración.')
        }

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
        return createIpcSuccess(true)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // Compatibilidad con canales heredados
  ipcMain.handle('db:settings:getAll', async () => {
    const db = getDatabase()
    const rows = await db.prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>()
    const settings: Record<string, unknown> = {}
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value)
      } catch {
        settings[row.key] = row.value
      }
    }
    return settings
  })

  ipcMain.handle('db:settings:saveAll', async (_event, settings: SaveSettingsDTO) => {
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
