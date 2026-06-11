import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@/shared/stores/useAuthStore'
import { logoutSession } from '@/shared/api/auth'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { ROUTES } from '@/shared/constants/routes'
import {
  cancelWorkspaceRequest,
  fetchWorkspaceRequestDetail,
} from '@/features/store-register/api/workspaceRequests'

/** 업장 등록 신청 상세 ViewModel — 상세 조회 + 취소 + 재로그인 */
export function useStoreRegisterRequestDetailViewModel(requestId: number) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)
  const logout = useAuthStore(state => state.logout)

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

  /** 승인 완료 시 사장님 계정으로 다시 로그인 — 세션 정리 후 로그인 화면 */
  const reLogin = useCallback(async () => {
    try {
      await logoutSession(scope, isLoggedIn)
    } catch {
      // 서버 로그아웃 실패해도 로컬 세션은 정리
    } finally {
      logout()
      navigate(ROUTES.AUTH.LOGIN, { replace: true })
    }
  }, [isLoggedIn, logout, navigate, scope])

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
    reLogin,
  }
}
