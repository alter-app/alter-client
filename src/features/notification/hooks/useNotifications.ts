import { useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchUserNotifications,
  fetchManagerNotifications,
} from '@/features/notification/api/notifications'

const PAGE_SIZE = 20

export function useNotifications(scope: 'MANAGER' | 'USER' | null) {
  const fetcher =
    scope === 'MANAGER' ? fetchManagerNotifications : fetchUserNotifications

  return useInfiniteQuery({
    queryKey: ['notifications', scope] as const,
    queryFn: ({ pageParam }) =>
      fetcher({ pageSize: PAGE_SIZE, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page.cursor || undefined,
    enabled: scope !== null,
  })
}
