import { ipcMain } from 'electron'
import { calendarRepository } from '../repositories/CalendarRepository'
import type { CalendarEvent } from '../../../core/context/types'

export function registerCalendarController(): void {
  // 1. Obtener eventos (soporta filtros por fecha, cliente o búsqueda)
  ipcMain.handle('db:calendar:getAll', async (_event, filters) => {
    return calendarRepository.getAll(filters)
  })

  // 2. Obtener eventos en rango de fechas (para vistas semanal y mensual)
  ipcMain.handle('db:calendar:getByDateRange', async (_event, startDate: string, endDate: string) => {
    return calendarRepository.getByDateRange(startDate, endDate)
  })

  // 3. Obtener evento por ID
  ipcMain.handle('db:calendar:getById', async (_event, id: string) => {
    return calendarRepository.getById(id)
  })

  // 4. Crear evento atómicamente
  ipcMain.handle('db:calendar:create', async (_event, eventData: any) => {
    return calendarRepository.create(eventData)
  })

  // 5. Actualizar evento atómicamente
  ipcMain.handle('db:calendar:update', async (_event, id: string, eventData: any) => {
    return calendarRepository.update(id, eventData)
  })

  // 6. Eliminar evento
  ipcMain.handle('db:calendar:delete', async (_event, id: string) => {
    return calendarRepository.delete(id)
  })

  // 7. Compatibilidad temporal no destructiva con saveAll
  ipcMain.handle('db:calendar:saveAll', async (_event, events: CalendarEvent[]) => {
    for (const ev of events) {
      const existing = await calendarRepository.getById(ev.id)
      if (existing) {
        await calendarRepository.update(ev.id, ev)
      } else {
        await calendarRepository.create(ev)
      }
    }
    return true
  })
}
