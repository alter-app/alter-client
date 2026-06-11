import { useQuery } from '@tanstack/react-query'
import useAuthStore from '@/shared/stores/useAuthStore'
import { queryKeys } from '@/shared/lib/queryKeys'
import { fetchWorkspaceRequestReasons } from '@/features/store-register/api/workspaceRequests'

/** 신청 상세의 반려 사유 목록 (최신순) */
export function useStoreRegisterReasonsViewModel(
  requestId: number,
  enabled: boolean
) {
  const scope = useAuthStore(state => state.scope)

  const query = useQuery({
    queryKey: queryKeys.storeRegisterRequest.reasons(scope, requestId),
    queryFn: () => fetchWorkspaceRequestReasons(scope, requestId),
    enabled: enabled && Number.isFinite(requestId),
  })

  // 최신순 정렬 (createdAt 내림차순)
  const reasons = [...(query.data ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return {
    reasons,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
  }
}
