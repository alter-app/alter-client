import { useQuery } from '@tanstack/react-query'
import {
  fetchUserNotificationConsent,
  fetchManagerNotificationConsent,
} from '@/features/notification/api/notificationConsent'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useNotificationConsent(scope: 'MANAGER' | 'USER' | null) {
  const fetcher =
    scope === 'MANAGER'
      ? fetchManagerNotificationConsent
      : fetchUserNotificationConsent

  return useQuery({
    queryKey: queryKeys.notification.consent(scope),
    queryFn: fetcher,
    enabled: scope !== null,
    staleTime: 1000 * 60 * 60,
  })
}
