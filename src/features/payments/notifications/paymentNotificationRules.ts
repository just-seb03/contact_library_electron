/**
 * @file paymentNotificationRules.ts
 * @description Regla pura (sin base de datos ni Electron): resumen diario de cobros.
 * Se testea con datos en memoria.
 *
 * Regla: una vez al día, a las `PAYMENT_SUMMARY_HOUR`, si hay cobros vencidos o que vencen
 * en los próximos `PAYMENT_UPCOMING_DAYS` días, se envía un único resumen.
 * - Vencido: estado "overdue", o "pending" con fecha anterior a hoy.
 * - Por vencer: "pending" con fecha entre hoy y hoy + PAYMENT_UPCOMING_DAYS.
 */

import type { Payment } from '../../../core/context/types'
import { formatCLP } from '../../../core/utils/format'
import {
  createNotificationId,
  type AppNotification,
  type NotificationWindow,
} from '../../../core/notifications/types'
import { addDays, isWithin, parseDateOnly, startOfDay, toDateKey } from '../../../shared/utils/dates'

/** Hora local del resumen diario. */
export const PAYMENT_SUMMARY_HOUR = 9
/** Días hacia adelante que cuentan como "por vencer". */
export const PAYMENT_UPCOMING_DAYS = 7

export function getDuePaymentNotifications(
  payments: Payment[],
  window: NotificationWindow
): AppNotification[] {
  // Normalmente la ventana es de 1 minuto, pero puede abarcar varios días (p. ej. tras una
  // suspensión). En ese caso solo se envía el resumen del día más reciente: los anteriores
  // repetirían la misma información.
  let latestDay: Date | null = null
  for (let day = startOfDay(window.from); day <= window.to; day = addDays(day, 1)) {
    const summaryAt = new Date(day)
    summaryAt.setHours(PAYMENT_SUMMARY_HOUR, 0, 0, 0)
    if (isWithin(summaryAt, window.from, window.to)) latestDay = day
  }

  const summary = latestDay ? buildSummary(payments, latestDay) : null
  return summary ? [summary] : []
}

function buildSummary(payments: Payment[], today: Date): AppNotification | null {
  const upcomingLimit = addDays(today, PAYMENT_UPCOMING_DAYS)
  const overdue: Payment[] = []
  const upcoming: Payment[] = []

  for (const payment of payments) {
    if (payment.status === 'completed') continue
    if (payment.status === 'overdue') {
      overdue.push(payment)
      continue
    }
    const date = parseDateOnly(payment.date)
    if (!date) continue
    if (date < today) overdue.push(payment)
    else if (date <= upcomingLimit) upcoming.push(payment)
  }

  if (overdue.length === 0 && upcoming.length === 0) return null

  const parts = [
    overdue.length > 0 && `${plural(overdue.length, 'vencido', 'vencidos')} (${formatCLP(total(overdue))})`,
    upcoming.length > 0 && `${plural(upcoming.length, 'vence', 'vencen')} esta semana (${formatCLP(total(upcoming))})`,
  ].filter(Boolean)

  const all = [...overdue, ...upcoming]
  const single = all.length === 1 ? all[0] : null

  return {
    id: createNotificationId('payment', 'summary', toDateKey(today)),
    kind: 'payment',
    title: single ? `Cobro pendiente: ${single.client}` : 'Cobros por revisar',
    body: parts.join(' · '),
    // Con un solo cobro se abre directamente; con varios, la sección de Pagos.
    target: single ? { type: 'payment', id: single.id } : undefined,
  }
}

function total(payments: Payment[]): number {
  return payments.reduce((sum, payment) => sum + payment.amount, 0)
}

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`
}
