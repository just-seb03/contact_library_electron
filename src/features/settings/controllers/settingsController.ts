import { ipcMain } from 'electron'
import { settingsRepository } from '../repositories/SettingsRepository'

export function registerSettingsController(): void {
  // 1. Obtener toda la configuración
  ipcMain.handle('db:settings:getAll', async () => {
    return settingsRepository.getAll()
  })

  // 2. Obtener una clave específica
  ipcMain.handle('db:settings:get', async (_event, key: string) => {
    return settingsRepository.get(key)
  })

  // 3. Establecer una clave específica
  ipcMain.handle('db:settings:set', async (_event, key: string, value: any) => {
    await settingsRepository.set(key, value)
    return true
  })

  // 4. Guardar múltiples opciones (compatibilidad con saveAll)
  ipcMain.handle('db:settings:saveAll', async (_event, settings: Record<string, any>) => {
    await settingsRepository.setMultiple(settings)
    return true
  })
}
