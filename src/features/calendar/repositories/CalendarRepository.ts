import { getDatabase } from '../../../core/database/connection'
import type { CalendarEvent, CalendarEventColorId } from '../../../core/context/types'

export interface CalendarEventRow {
  id: string
  title: string
  date: string
  start_time: string
  end_time: string
  color_id: string
  alarm_minutes: number
  client_id: number | null
  details: string | null
  created_at: string
  updated_at: string
}

export interface CalendarFilters {
  startDate?: string
  endDate?: string
  clientId?: number
  search?: string
}

export interface CreateCalendarEventDTO {
  id?: string
  title: string
  date: string
  startTime: string
  endTime: string
  colorId?: CalendarEventColorId
  alarmMinutes?: number
  clientId?: number | null
  details?: string
}

export interface UpdateCalendarEventDTO {
  title?: string
  date?: string
  startTime?: string
  endTime?: string
  colorId?: CalendarEventColorId
  alarmMinutes?: number
  clientId?: number | null
  details?: string
}

export class CalendarRepository {
  private toEntity(row: CalendarEventRow): CalendarEvent {
    return {
      id: row.id,
      title: row.title,
      date: row.date,
      startTime: row.start_time,
      endTime: row.end_time,
      colorId: (row.color_id as CalendarEventColorId) || 'blue',
      alarmMinutes: Number(row.alarm_minutes) || 15,
      clientId: row.client_id,
      details: row.details || '',
    }
  }

  async getAll(filters?: CalendarFilters): Promise<CalendarEvent[]> {
    const db = getDatabase()
    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.startDate) {
      conditions.push('date >= ?')
      params.push(filters.startDate)
    }

    if (filters?.endDate) {
      conditions.push('date <= ?')
      params.push(filters.endDate)
    }

    if (filters?.clientId) {
      conditions.push('client_id = ?')
      params.push(filters.clientId)
    }

    if (filters?.search && filters.search.trim() !== '') {
      const term = `%${filters.search.trim().toLowerCase()}%`
      conditions.push('(LOWER(title) LIKE ? OR LOWER(details) LIKE ?)')
      params.push(term, term)
    }

    let query = 'SELECT * FROM calendar_events'
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }
    query += ' ORDER BY date ASC, start_time ASC'

    const rows = await db.prepare(query).all<CalendarEventRow>(...params)
    return rows.map((r) => this.toEntity(r))
  }

  async getByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    return this.getAll({ startDate, endDate })
  }

  async getById(id: string): Promise<CalendarEvent | null> {
    const db = getDatabase()
    const row = await db.prepare('SELECT * FROM calendar_events WHERE id = ?').get<CalendarEventRow>(id)
    return row ? this.toEntity(row) : null
  }

  async create(data: CreateCalendarEventDTO): Promise<CalendarEvent> {
    const db = getDatabase()
    const id = data.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

    await db.prepare(`
      INSERT INTO calendar_events (id, title, date, start_time, end_time, color_id, alarm_minutes, client_id, details, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      id,
      data.title,
      data.date,
      data.startTime,
      data.endTime,
      data.colorId || 'blue',
      data.alarmMinutes ?? 15,
      data.clientId || null,
      data.details || ''
    )

    const created = await this.getById(id)
    if (!created) {
      throw new Error(`Error al persistir evento de calendario con id ${id}`)
    }
    return created
  }

  async update(id: string, data: UpdateCalendarEventDTO): Promise<CalendarEvent> {
    const db = getDatabase()
    const existing = await db.prepare('SELECT * FROM calendar_events WHERE id = ?').get<CalendarEventRow>(id)
    if (!existing) {
      throw new Error(`Evento con id ${id} no encontrado`)
    }

    const updatedTitle = data.title !== undefined ? data.title : existing.title
    const updatedDate = data.date !== undefined ? data.date : existing.date
    const updatedStartTime = data.startTime !== undefined ? data.startTime : existing.start_time
    const updatedEndTime = data.endTime !== undefined ? data.endTime : existing.end_time
    const updatedColorId = data.colorId !== undefined ? data.colorId : existing.color_id
    const updatedAlarmMinutes = data.alarmMinutes !== undefined ? data.alarmMinutes : existing.alarm_minutes
    const updatedClientId = data.clientId !== undefined ? data.clientId : existing.client_id
    const updatedDetails = data.details !== undefined ? data.details : existing.details

    await db.prepare(`
      UPDATE calendar_events
      SET title = ?, date = ?, start_time = ?, end_time = ?, color_id = ?, alarm_minutes = ?, client_id = ?, details = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      updatedTitle,
      updatedDate,
      updatedStartTime,
      updatedEndTime,
      updatedColorId,
      updatedAlarmMinutes,
      updatedClientId,
      updatedDetails,
      id
    )

    const updated = await this.getById(id)
    if (!updated) {
      throw new Error(`Error al recuperar evento actualizado con id ${id}`)
    }
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const db = getDatabase()
    const res = await db.prepare('DELETE FROM calendar_events WHERE id = ?').run(id)
    return res.changes > 0
  }

  /**
   * Obtiene eventos que ocurrirán en la fecha y hora indicadas con control de alarmas.
   */
  async getUpcomingAlerts(targetDate: string, startTime: string): Promise<CalendarEvent[]> {
    const db = getDatabase()
    const rows = await db.prepare(`
      SELECT * FROM calendar_events
      WHERE date = ? AND start_time >= ?
      ORDER BY start_time ASC
    `).all<CalendarEventRow>(targetDate, startTime)

    return rows.map((r) => this.toEntity(r))
  }
}

export const calendarRepository = new CalendarRepository()

