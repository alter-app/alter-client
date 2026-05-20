import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateUserNotificationConsent,
  updateManagerNotificationConsent,
} from '@/features/notification/api/notificationConsent'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useUpdateNotificationConsent(scope: 'MANAGER' | 'USER' | null) {
  const queryClient = useQueryClient()

  const updater =
    scope === 'MANAGER'
      ? updateManagerNotificationConsent
      : updateUserNotificationConsent

  return useMutation({
    mutationFn: updater,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notification.consent(scope),
      })
    },
  })
}
