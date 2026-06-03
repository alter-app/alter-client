import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  markUserNotificationsRead,
  markManagerNotificationsRead,
} from '@/features/notification/api/notifications'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useMarkNotificationRead(scope: 'MANAGER' | 'USER' | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId?: number) => {
      if (scope === null) return Promise.resolve()
      return scope === 'MANAGER'
        ? markManagerNotificationsRead(notificationId)
        : markUserNotificationsRead(notificationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notification.list(scope, undefined),
      })
    },
  })
}
