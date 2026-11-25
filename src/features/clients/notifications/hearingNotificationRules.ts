/**
 * @file hearingNotificationRules.ts
 * @description Regla pura (sin base de datos ni Electron): qué audiencias deben avisarse
 * dentro de una ventana de tiempo. Se testea con datos en memoria.
 *
 * Regla: avisar `HEARING_REMINDER_HOURS` antes de `proximaAudiencia` de cada caso.
 */

import {
  createNotificationId,
  type AppNotification,
  type NotificationWindow,
} from '../../../core/notifications/types'
import { addMinutes, isWithin, parseDateWithTime, toTimeKey } from '../../../shared/utils/dates'

/** Antelación del aviso de audiencia. */
export const HEARING_REMINDER_HOURS = 24

/** Datos mínimos de una audiencia programada (caso + nombre del cliente). */
export interface ScheduledHearing {
  clientId: number
  clientName: string
  expediente: string
  juzgado: string
  /** Formato "28 Oct, 2026 - 10:00 AM". */
  proximaAudiencia: string
}

export function getDueHearingNotifications(
  hearings: ScheduledHearing[],
  window: NotificationWindow
): AppNotification[] {
  const due: AppNotification[] = []

  for (const hearing of hearings) {
    const start = parseDateWithTime(hearing.proximaAudiencia)
    if (!start) continue

    const alarmAt = addMinutes(start, -HEARING_REMINDER_HOURS * 60)
    if (!isWithin(alarmAt, window.from, window.to)) continue

    const details = [toTimeKey(start), hearing.juzgado, hearing.expediente && `Exp. ${hearing.expediente}`]
      .filter(Boolean)
      .join(' · ')

    due.push({
      id: createNotificationId('hearing', hearing.clientId, start.toISOString()),
      kind: 'hearing',
      title: `Audiencia mañana: ${hearing.clientName}`,
      body: details,
      urgent: true,
      target: { type: 'hearing', clientId: hearing.clientId },
    })
  }

  return due
}
