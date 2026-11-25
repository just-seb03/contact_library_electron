/**
 * @file index.ts
 * @description API pública del módulo de notificaciones (proceso main).
 * Uso desde main.ts: initNotificationService → registerNotificationProvider → startNotificationScheduler.
 */

export {
  NOTIFICATION_ROUTES,
  createNotificationId,
  type AppNotification,
  type NavigationRequest,
  type NavigationTarget,
  type NotificationAdapter,
  type NotificationDisplayOptions,
  type NotificationKind,
  type NotificationPreferences,
  type NotificationProvider,
  type NotificationRoute,
  type NotificationStatus,
  type NotificationWindow,
} from './types'
export {
  DEFAULT_NOTIFICATION_PREFERENCES,
  disposeNotificationService,
  getNotificationPreferences,
  getNotificationStatus,
  initNotificationService,
  resolveNavigation,
  showNotification,
  type NotificationServiceOptions,
} from './notificationService'
export {
  refreshNotifications,
  registerNotificationProvider,
  startNotificationScheduler,
  stopNotificationScheduler,
  type NotificationSchedulerOptions,
} from './notificationScheduler'
export {
  createNotificationAdapter,
  type CreateNotificationAdapterOptions,
} from './adapters'
