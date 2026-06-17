import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@/shared/stores/useAuthStore'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import {
  cancelWorkspaceRequest,
  fetchWorkspaceRequestDetail,
} from '@/features/store-register/api/workspaceRequests'

/** 업장 등록 신청 상세 ViewModel — 상세 조회 + 취소 */
export function useStoreRegisterRequestDetailViewModel(requestId: number) {
  const queryClient = useQueryClient()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  const [cancelError, setCancelError] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const query = useQuery({
    queryKey: queryKeys.storeRegisterRequest.detail(scope, requestId),
    queryFn: () => fetchWorkspaceRequestDetail(scope, requestId),
    enabled: isLoggedIn && Number.isFinite(requestId),
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelWorkspaceRequest(scope, requestId),
    onSuccess: async () => {
      setIsConfirmOpen(false)
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.storeRegisterRequest.list(scope),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.storeRegisterRequest.detail(scope, requestId),
        }),
      ])
    },
    onError: (e: unknown) => {
      setCancelError(
        getAxiosErrorMessage(
          e,
          '신청을 취소하지 못했습니다. 잠시 후 다시 시도해 주세요.'
        )
      )
    },
  })

  const openCancelConfirm = useCallback(() => {
    setCancelError(null)
    setIsConfirmOpen(true)
  }, [])

  const closeCancelConfirm = useCallback(() => {
    if (cancelMutation.isPending) return
    setIsConfirmOpen(false)
  }, [cancelMutation.isPending])

  const confirmCancel = useCallback(() => {
    setCancelError(null)
    cancelMutation.mutate()
  }, [cancelMutation])

  return {
    scope,
    requestId,
    detail: query.data ?? null,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    isConfirmOpen,
    isCanceling: cancelMutation.isPending,
    cancelError,
    openCancelConfirm,
    closeCancelConfirm,
    confirmCancel,
  }
}
