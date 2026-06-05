export { useNotificationSettingsViewModel } from './useNotificationSettingsViewModel'
export { useNotificationViewModel } from './useNotificationViewModel'

export { useMarkNotificationRead } from './hooks/useMarkNotificationRead'
export { useNotificationConsent } from './hooks/useNotificationConsent'
export { useNotifications } from './hooks/useNotifications'
export { useNotificationUnreadCount } from './hooks/useNotificationUnreadCount'
export { useUpdateNotificationConsent } from './hooks/useUpdateNotificationConsent'

export {
  CONSENT_TYPE,
  type ConsentType,
  type NotificationConsentItem,
  type NotificationConsentResponse,
  type NotificationConsentType,
  type UpdateNotificationConsentRequest,
} from './types/consent'
export {
  NOTIFICATION_TYPE,
  type NotificationType,
} from './types/notificationType'
export type {
  NotificationDto,
  NotificationListResponse,
  NotificationPage,
  NotificationQueryParams,
} from './types'
