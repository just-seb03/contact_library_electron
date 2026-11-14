/**
 * @file calendarController.ts
 * @description Controlador IPC para la gestión y persistencia de eventos de agenda y audiencias en SQLite.
 * Proporciona validación estricta de estructura y respuesta tipada Promise<IpcResponse<T>>.
 */

import { ipcMain } from 'electron'
import { getDatabase } from '../../../core/database/connection'
import type { CalendarEvent, CalendarEventColorId } from '../../../core/context/types'
import {
  IPC_CHANNELS,
  createIpcSuccess,
  createIpcError,
  type IpcResponse,
} from '../../../shared/types/ipc'

interface CalendarEventRow {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  colorId: CalendarEventColorId
  alarmMinutes: number
  clientId: number | null
  details: string
}

/**
 * Mapea una fila de base de datos a la interfaz de entidad de eventos de calendario
 */
function parseCalendarRow(row: CalendarEventRow): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime,
    colorId: row.colorId || 'blue',
    alarmMinutes: row.alarmMinutes ?? 15,
    clientId: row.clientId ?? null,
    details: row.details || '',
  }
}

/**
 * Registra todos los handlers IPC correspondientes al dominio del calendario.
 */
export function registerCalendarController(): void {
  // [calendar:list] - Recupera los eventos ordenados cronológicamente por fecha y hora
  ipcMain.handle(
    IPC_CHANNELS.CALENDAR_LIST,
    async (): Promise<IpcResponse<CalendarEvent[]>> => {
      try {
        const db = getDatabase()
        const rows = await db
          .prepare('SELECT * FROM calendar_events ORDER BY date ASC, startTime ASC')
          .all<CalendarEventRow>()
        return createIpcSuccess(rows.map(parseCalendarRow))
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

        const db = getDatabase()
        await db.transaction(async () => {
          await db.prepare('DELETE FROM calendar_events').run()
          const statement = db.prepare(`
            INSERT INTO calendar_events (id, title, date, startTime, endTime, colorId, alarmMinutes, clientId, details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          for (const event of events) {
            await statement.run(
              event.id,
              event.title,
              event.date,
              event.startTime,
              event.endTime,
              event.colorId || 'blue',
              event.alarmMinutes ?? 15,
              event.clientId || null,
              event.details || ''
            )
          }
        })
        return createIpcSuccess(true)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // --- Handlers de retrocompatibilidad transitoria ---
  ipcMain.handle('db:calendar:getAll', async () => {
    const db = getDatabase()
    return db.prepare('SELECT * FROM calendar_events ORDER BY date ASC, startTime ASC').all()
  })

  ipcMain.handle('db:calendar:saveAll', async (_event, events: CalendarEvent[]) => {
    const db = getDatabase()
    await db.transaction(async () => {
      await db.prepare('DELETE FROM calendar_events').run()
      const statement = db.prepare(`
        INSERT INTO calendar_events (id, title, date, startTime, endTime, colorId, alarmMinutes, clientId, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      for (const event of events) {
        await statement.run(
          event.id,
          event.title,
          event.date,
          event.startTime,
          event.endTime,
          event.colorId || 'blue',
          event.alarmMinutes ?? 15,
          event.clientId || null,
          event.details || ''
        )
      }
    })
    return true
  })
}
