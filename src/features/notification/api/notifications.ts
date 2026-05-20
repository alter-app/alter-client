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
