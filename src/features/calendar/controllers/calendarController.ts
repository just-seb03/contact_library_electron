/**
 * @file calendarController.ts
 * @description Controlador IPC para la gestión y persistencia de eventos de agenda en SQLite.
 * El acceso a datos (columnas snake_case ↔ entidad camelCase) vive en `CalendarRepository`.
 */

import { ipcMain } from 'electron'
import type { CalendarEvent } from '../../../core/context/types'
import {
  IPC_CHANNELS,
  createIpcSuccess,
  createIpcError,
  type IpcResponse,
} from '../../../shared/types/ipc'
import { calendarRepository } from '../repositories/CalendarRepository'

/**
 * Registra todos los handlers IPC correspondientes al dominio del calendario.
 */
export function registerCalendarController(): void {
  // [calendar:list] - Recupera los eventos ordenados cronológicamente por fecha y hora
  ipcMain.handle(
    IPC_CHANNELS.CALENDAR_LIST,
    async (): Promise<IpcResponse<CalendarEvent[]>> => {
      try {
        return createIpcSuccess(await calendarRepository.getAll())
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [calendar:saveAll] - Reemplazo transaccional de eventos en SQLite
  ipcMain.handle(
    IPC_CHANNELS.CALENDAR_SAVE_ALL,
    async (_event, events: CalendarEvent[]): Promise<IpcResponse<boolean>> => {
      try {
        if (!Array.isArray(events)) {
          return createIpcError('Se esperaba una lista de eventos de calendario.')
        }
        await calendarRepository.replaceAll(events)
        return createIpcSuccess(true)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // --- Handlers de retrocompatibilidad transitoria ---
  ipcMain.handle('db:calendar:getAll', () => calendarRepository.getAll())

  ipcMain.handle('db:calendar:saveAll', async (_event, events: CalendarEvent[]) => {
    await calendarRepository.replaceAll(events)
    return true
  })
}
