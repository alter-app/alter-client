import { useQuery } from '@tanstack/react-query'
import {
  fetchUserNotificationUnreadCount,
  fetchManagerNotificationUnreadCount,
} from '@/features/notification/api/notifications'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useNotificationUnreadCount(scope: 'MANAGER' | 'USER' | null) {
  const fetcher =
    scope === 'MANAGER'
      ? fetchManagerNotificationUnreadCount
      : fetchUserNotificationUnreadCount

  return useQuery({
    queryKey: queryKeys.notification.unreadCount(scope),
    queryFn: fetcher,
    enabled: scope !== null,
  })
}
