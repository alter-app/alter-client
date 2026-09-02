import { useQuery } from '@tanstack/react-query'
import useAuthStore from '@/shared/stores/useAuthStore'
import { queryKeys } from '@/shared/lib/queryKeys'
import { fetchBusinessTypes } from '@/features/store-register/api/workspaceRequests'

/** 업장 등록 신청 폼의 업종 목록 — 마스터 데이터라 오래 캐싱합니다 */
export function useBusinessTypes() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  const query = useQuery({
    queryKey: queryKeys.storeRegisterRequest.businessTypes(scope),
    queryFn: () => fetchBusinessTypes(scope),
    enabled: isLoggedIn,
    staleTime: 60 * 60 * 1000,
  })

  return {
    businessTypes: query.data ?? [],
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    refetch: query.refetch,
  }
}
