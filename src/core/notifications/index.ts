/**
 * @file index.ts
 * @description API pública del módulo de notificaciones (proceso main).
 * Se irá ampliando con el servicio y el scheduler (pasos 4 y 6).
 */

export {
  NOTIFICATION_ROUTES,
  createNotificationId,
  type AppNotification,
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
  createNotificationAdapter,
  type CreateNotificationAdapterOptions,
} from './adapters'
