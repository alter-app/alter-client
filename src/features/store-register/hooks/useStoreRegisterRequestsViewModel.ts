import { useQuery } from '@tanstack/react-query'
import useAuthStore from '@/shared/stores/useAuthStore'
import { queryKeys } from '@/shared/lib/queryKeys'
import { fetchWorkspaceRequests } from '@/features/store-register/api/workspaceRequests'

/** 업장 등록 신청 내역 목록 ViewModel */
export function useStoreRegisterRequestsViewModel() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  const query = useQuery({
    queryKey: queryKeys.storeRegisterRequest.list(scope),
    queryFn: () => fetchWorkspaceRequests(scope),
    enabled: isLoggedIn,
    staleTime: 30_000,
  })

  return {
    requests: query.data ?? [],
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    refetch: query.refetch,
  }
}
