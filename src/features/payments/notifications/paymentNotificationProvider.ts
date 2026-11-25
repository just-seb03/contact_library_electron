/**
 * @file paymentNotificationProvider.ts
 * @description Proveedor del resumen diario de cobros pendientes y vencidos.
 * Lee de SQLite y delega la decisión en `paymentNotificationRules`.
 */

import type { NotificationProvider } from '../../../core/notifications/types'
import { paymentRepository } from '../repositories/PaymentRepository'
import { getDuePaymentNotifications } from './paymentNotificationRules'

export const paymentNotificationProvider: NotificationProvider = {
  kind: 'payment',

  isEnabled: (preferences) => preferences.paymentReminders,

  async getDue(window) {
    const payments = await paymentRepository.getAll()
    return getDuePaymentNotifications(payments, window)
  },
}
