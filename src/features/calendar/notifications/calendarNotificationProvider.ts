/**
 * @file calendarNotificationProvider.ts
 * @description Proveedor de avisos previos de eventos del calendario.
 * Lee de SQLite y delega la decisión en `calendarNotificationRules`.
 */

import type { NotificationProvider } from '../../../core/notifications/types'
import { addMinutes, toDateKey } from '../../../shared/utils/dates'
import { calendarRepository } from '../repositories/CalendarRepository'
import {
  MAX_CALENDAR_ALARM_MINUTES,
  getDueCalendarNotifications,
} from './calendarNotificationRules'

export const calendarNotificationProvider: NotificationProvider = {
  kind: 'calendar',

  isEnabled: (preferences) => preferences.calendarAlerts,

  async getDue(window) {
    // Solo los días en que puede empezar un evento cuyo aviso cae en la ventana.
    const events = await calendarRepository.getByDateRange(
      toDateKey(window.from),
      toDateKey(addMinutes(window.to, MAX_CALENDAR_ALARM_MINUTES))
    )
    return getDueCalendarNotifications(events, window)
  },
}
