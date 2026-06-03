import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  NotificationListResponse,
  NotificationQueryParams,
} from '@/features/notification/types'

const DEFAULT_PAGE_SIZE = 20

function buildParams(params: NotificationQueryParams) {
  return {
    pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
    ...(params.cursor ? { cursor: params.cursor } : {}),
    ...(params.type ? { type: params.type } : {}),
  }
}

/** GET /app/users/me/notifications */
export async function fetchUserNotifications(
  params: NotificationQueryParams = {}
): Promise<NotificationListResponse> {
  const response = await axiosInstance.get<NotificationListResponse>(
    '/app/users/me/notifications',
    { params: buildParams(params) }
  )
  return response.data
}

/** GET /manager/notifications/me */
export async function fetchManagerNotifications(
  params: NotificationQueryParams = {}
): Promise<NotificationListResponse> {
  const response = await axiosInstance.get<NotificationListResponse>(
    '/manager/notifications/me',
    { params: buildParams(params) }
  )
  return response.data
}

export async function markUserNotificationsRead(notificationId: number | null) {
  const response = await axiosInstance.patch(
    '/app/users/me/notifications/read',
    {
      notificationId,
    }
  )
  return response.data
}

export async function markManagerNotificationsRead(
  notificationId: number | null
) {
  const response = await axiosInstance.patch('/manager/notifications/read', {
    notificationId,
  })
  return response.data
}

export async function fetchUserNotificationUnreadCount(): Promise<{
  unreadCount: number
  hasUnread: boolean
}> {
  const response = await axiosInstance.get<{
    data: { unreadCount: number; hasUnread: boolean }
  }>('/app/users/me/notifications/unread-count')
  return response.data.data
}

export async function fetchManagerNotificationUnreadCount(): Promise<{
  unreadCount: number
  hasUnread: boolean
}> {
  const response = await axiosInstance.get<{
    data: { unreadCount: number; hasUnread: boolean }
  }>('/manager/notifications/me/unread-count')
  return response.data.data
}
