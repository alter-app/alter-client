import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  acceptUserSubstituteRequest,
  cancelUserSubstituteRequest,
  fetchSentSubstituteRequestDetail,
  rejectUserSubstituteRequest,
} from '@/features/user/substitute/api/userSubstituteRequests'
import {
  adaptReceivedSubstituteDetail,
  adaptSentSubstituteDetail,
  formatDetailMinutes,
  normalizeSentSubstituteDetailDto,
} from '@/features/user/substitute/lib/adaptUserSubstituteRequest'
import {
  USER_SUBSTITUTE_RESPOND_ERROR_FALLBACK,
  getUserSubstituteActionErrorMessage,
  isUserSubstituteConflictError,
} from '@/features/user/substitute/lib/substituteActionError'
import { USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS } from '@/features/user/substitute/lib/substituteRefetchQueryKeys'
import type {
  ReceivedSubstituteRequestDto,
  SubstituteRequestDirection,
} from '@/features/user/substitute/types'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { queryKeys } from '@/shared/lib/queryKeys'

function requireRequestId(requestId: number | null): number {
  if (requestId == null || !Number.isFinite(requestId) || requestId <= 0) {
    throw new Error('유효하지 않은 대타 요청 ID입니다.')
  }
  return requestId
}

function isActionableRequestId(requestId: number | null): requestId is number {
  return requestId != null && Number.isFinite(requestId) && requestId > 0
}

export function useUserSubstituteRequestDetailViewModel(
  requestId: number | null,
  direction: SubstituteRequestDirection,
  options?: {
    receivedFallback?: ReceivedSubstituteRequestDto | null
    onActionSuccess?: () => void
  }
) {
  const queryClient = useQueryClient()
  const isSent = direction === 'SENT'

  const {
    data: sentDetail,
    isPending: sentLoading,
    isError: sentError,
  } = useQuery({
    queryKey: queryKeys.userSubstitute.sentDetail(requestId ?? 0),
    queryFn: async () => {
      const response = await fetchSentSubstituteRequestDetail(requestId!)
      return normalizeSentSubstituteDetailDto(response.data)
    },
    enabled: isSent && requestId != null && requestId > 0,
  })

  const invalidateLists = async () => {
    await Promise.all(
      USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS.map(queryKey =>
        queryClient.invalidateQueries({ queryKey })
      )
    )
    if (requestId != null) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.userSubstitute.sentDetail(requestId),
      })
    }
  }

  // 실패 안내는 mutation이 끝나야 보이므로 재조회를 기다리지 않는다(기다리면 그동안 '처리 중'에 머문다).
  const refetchAfterFailure = () => {
    void invalidateLists()
  }

  const canMutate = isActionableRequestId(requestId)

  const acceptMutation = useMutation({
    mutationFn: () => acceptUserSubstituteRequest(requireRequestId(requestId)),
    onSuccess: async () => {
      await invalidateLists()
      options?.onActionSuccess?.()
    },
    onError: refetchAfterFailure,
  })

  const rejectMutation = useMutation({
    mutationFn: (targetRejectionReason: string) =>
      rejectUserSubstituteRequest(requireRequestId(requestId), {
        targetRejectionReason,
      }),
    onSuccess: async () => {
      await invalidateLists()
      options?.onActionSuccess?.()
    },
    onError: refetchAfterFailure,
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelUserSubstituteRequest(requireRequestId(requestId)),
    onSuccess: async () => {
      await invalidateLists()
      options?.onActionSuccess?.()
    },
  })

  const baseDetail = isSent
    ? sentDetail != null
      ? adaptSentSubstituteDetail(sentDetail)
      : null
    : options?.receivedFallback != null
      ? adaptReceivedSubstituteDetail(options.receivedFallback)
      : null

  const detail =
    baseDetail != null
      ? {
          ...baseDetail,
          startMinuteLabel: formatDetailMinutes(
            isSent && sentDetail != null
              ? sentDetail.schedule.startDateTime
              : (options?.receivedFallback?.schedule.startDateTime ?? '')
          ),
          endMinuteLabel: formatDetailMinutes(
            isSent && sentDetail != null
              ? sentDetail.schedule.endDateTime
              : (options?.receivedFallback?.schedule.endDateTime ?? '')
          ),
        }
      : null

  const respondError = acceptMutation.error ?? rejectMutation.error
  const respondErrorMessage =
    respondError != null
      ? getUserSubstituteActionErrorMessage(
          respondError,
          USER_SUBSTITUTE_RESPOND_ERROR_FALLBACK
        )
      : null
  const isRespondConflict =
    respondError != null && isUserSubstituteConflictError(respondError)

  // 충돌은 보던 요청 상태가 낡았다는 뜻이라 상세에 남기지 않고 확인 후 다시 조회된 목록으로 돌려보낸다.
  const conflictError = isRespondConflict ? respondErrorMessage : null
  const rejectError =
    !isRespondConflict && rejectMutation.isError ? respondErrorMessage : null
  const actionError = acceptMutation.isError
    ? isRespondConflict
      ? null
      : respondErrorMessage
    : cancelMutation.isError
      ? getAxiosErrorMessage(
          cancelMutation.error,
          USER_SUBSTITUTE_RESPOND_ERROR_FALLBACK
        )
      : null

  // 한 번에 한 동작의 오류만 보이도록 다른 동작의 이전 오류를 지운다.
  const resetActionErrors = () => {
    acceptMutation.reset()
    rejectMutation.reset()
    cancelMutation.reset()
  }

  return {
    detail,
    isLoading: isSent && sentLoading,
    isError:
      (isSent && sentError && sentDetail == null) ||
      (!isSent && options?.receivedFallback == null),
    accept: () => {
      if (!canMutate) return
      resetActionErrors()
      acceptMutation.mutate()
    },
    reject: (reason: string) => {
      if (!canMutate) return
      resetActionErrors()
      rejectMutation.mutate(reason)
    },
    cancel: () => {
      if (!canMutate) return
      resetActionErrors()
      cancelMutation.mutate()
    },
    clearRejectError: () => rejectMutation.reset(),
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isCancelling: cancelMutation.isPending,
    actionError,
    rejectError,
    conflictError,
  }
}
