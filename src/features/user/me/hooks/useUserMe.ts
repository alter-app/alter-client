import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/features/user/me/api/user'
import type { UserMeDto } from '@/features/user/me/types/user'
import useAuthStore from '@/shared/stores/useAuthStore'
import { queryKeys } from '@/shared/lib/queryKeys'

export interface UserMeViewModel {
  id?: number
  name: string
  nickname: string
  email: string
  phone: string
  profileImageUrl?: string
  joinedAt?: Date
  joinedAtFormatted: string
  raw: UserMeDto | null
}

const FALLBACK_JOINED_AT = '-'

function formatJoinedAt(iso?: string | null): {
  date?: Date
  formatted: string
} {
  if (!iso) return { formatted: FALLBACK_JOINED_AT }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return { formatted: FALLBACK_JOINED_AT }
  }
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return { date, formatted: `${yyyy}.${mm}.${dd}` }
}

export function useUserMe() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  const query = useQuery({
    queryKey: queryKeys.user.me(scope),
    queryFn: () => getUserMe(scope ?? 'USER'),
    enabled: isLoggedIn && Boolean(scope),
    staleTime: 60_000,
  })

  const viewModel = useMemo<UserMeViewModel>(() => {
    const dto = query.data ?? null
    const { date, formatted } = formatJoinedAt(dto?.createdAt)
    return {
      id: dto?.id,
      name: dto?.name ?? '',
      nickname: dto?.nickname ?? '',
      email: dto?.email ?? '',
      phone: dto?.contact ?? dto?.phone ?? '',
      profileImageUrl: dto?.profileImageUrl ?? undefined,
      joinedAt: date,
      joinedAtFormatted: formatted,
      raw: dto,
    }
  }, [query.data])

  return {
    user: viewModel,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
