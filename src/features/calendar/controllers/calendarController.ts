import { ipcMain } from 'electron'
import { getDatabase } from '../../../core/database/connection'

export function registerCalendarController(): void {
  ipcMain.handle('db:calendar:getAll', async () => {
    const db = getDatabase()
    return db.prepare('SELECT * FROM calendar_events ORDER BY date ASC, startTime ASC').all()
  })

  ipcMain.handle('db:calendar:saveAll', async (_event, events: any[]) => {
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
