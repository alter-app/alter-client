import { useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchUserNotifications,
  fetchManagerNotifications,
} from '@/features/notification/api/notifications'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 20

export function useNotifications(
  scope: 'MANAGER' | 'USER' | null,
  type?: string
) {
  const fetcher =
    scope === 'MANAGER' ? fetchManagerNotifications : fetchUserNotifications

  return useInfiniteQuery({
    queryKey: queryKeys.notification.list(scope, type),
    queryFn: ({ pageParam }) =>
      fetcher({
        pageSize: PAGE_SIZE,
        cursor: pageParam as string | undefined,
        type,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page.cursor || undefined,
    enabled: scope !== null,
  })
}
