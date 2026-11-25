/**
 * @file calendarNotificationRules.ts
 * @description Regla pura (sin base de datos ni Electron): qué eventos de calendario deben
 * avisarse dentro de una ventana de tiempo. Se testea con datos en memoria.
 *
 * Regla: avisar `alarmMinutes` antes del inicio del evento. `alarmMinutes = 0` es "Sin aviso".
 */

import type { CalendarEvent } from '../../../core/context/types'
import {
  createNotificationId,
  type AppNotification,
  type NotificationWindow,
} from '../../../core/notifications/types'
import { addMinutes, isWithin, parseDateTime } from '../../../shared/utils/dates'

/** Mayor aviso previo admitido; define cuánto hay que mirar hacia adelante al consultar. */
export const MAX_CALENDAR_ALARM_MINUTES = 24 * 60

export function getDueCalendarNotifications(
  events: CalendarEvent[],
  window: NotificationWindow
): AppNotification[] {
  const due: AppNotification[] = []

  for (const event of events) {
    if (!(event.alarmMinutes > 0)) continue

    const start = parseDateTime(event.date, event.startTime)
    if (!start) continue

    const alarmAt = addMinutes(start, -event.alarmMinutes)
    if (!isWithin(alarmAt, window.from, window.to)) continue

    due.push({
      id: createNotificationId('calendar', event.id, `${event.date}T${event.startTime}`),
      kind: 'calendar',
      title: event.title,
      body: `Comienza ${describeLeadTime(event.alarmMinutes)} · ${event.startTime}–${event.endTime}`,
      target: { type: 'calendarEvent', id: event.id },
    })
  }

  return due
}

function describeLeadTime(minutes: number): string {
  if (minutes % 60 === 0) {
    const hours = minutes / 60
    return hours === 1 ? 'en 1 hora' : `en ${hours} horas`
  }
  return minutes === 1 ? 'en 1 minuto' : `en ${minutes} minutos`
}
