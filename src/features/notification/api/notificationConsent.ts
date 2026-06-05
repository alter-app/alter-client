import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  NotificationConsentResponse,
  UpdateNotificationConsentRequest,
} from '@/features/notification/types/consent'

/** GET /app/users/me/notification-consent */
export async function fetchUserNotificationConsent(): Promise<NotificationConsentResponse> {
  const response = await axiosInstance.get<NotificationConsentResponse>(
    '/app/users/me/notification-consent'
  )
  return response.data
}

/** GET /manager/me/notification-consent */
export async function fetchManagerNotificationConsent(): Promise<NotificationConsentResponse> {
  const response = await axiosInstance.get<NotificationConsentResponse>(
    '/manager/me/notification-consent'
  )
  return response.data
}

/** PUT /app/users/me/notification-consent */
export async function updateUserNotificationConsent(
  body: UpdateNotificationConsentRequest
): Promise<void> {
  await axiosInstance.put('/app/users/me/notification-consent', body)
}

/** PUT /manager/me/notification-consent */
export async function updateManagerNotificationConsent(
  body: UpdateNotificationConsentRequest
): Promise<void> {
  await axiosInstance.put('/manager/me/notification-consent', body)
}
