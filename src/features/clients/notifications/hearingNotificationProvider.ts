/**
 * @file hearingNotificationProvider.ts
 * @description Proveedor de avisos de audiencias judiciales.
 * Lee de SQLite y delega la decisión en `hearingNotificationRules`.
 */

import type { NotificationProvider } from '../../../core/notifications/types'
import { caseRepository } from '../repositories/CaseRepository'
import { getDueHearingNotifications } from './hearingNotificationRules'

export const hearingNotificationProvider: NotificationProvider = {
  kind: 'hearing',

  isEnabled: (preferences) => preferences.hearingAlerts,

  async getDue(window) {
    const hearings = await caseRepository.getScheduledHearings()
    return getDueHearingNotifications(hearings, window)
  },
}
