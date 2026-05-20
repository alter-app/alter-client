import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateNotificationConsentRequest } from '@/features/notification/types/consent'
import {
  updateUserNotificationConsent,
  updateManagerNotificationConsent,
} from '@/features/notification/api/notificationConsent'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useUpdateNotificationConsent(scope: 'MANAGER' | 'USER' | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateNotificationConsentRequest) => {
      if (scope === null) return Promise.resolve()
      return scope === 'MANAGER'
        ? updateManagerNotificationConsent(body)
        : updateUserNotificationConsent(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notification.consent(scope),
      })
    },
  })
}
