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
} from '@/features/user/substitute/lib/adaptUserSubstituteRequest'
import type {
  ReceivedSubstituteRequestDto,
  SubstituteRequestDirection,
} from '@/features/user/substitute/types'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { queryKeys } from '@/shared/lib/queryKeys'

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
      return response.data
    },
    enabled: isSent && requestId != null && requestId > 0,
  })

  const invalidateLists = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['userSubstitute', 'list'],
    })
    if (requestId != null) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.userSubstitute.sentDetail(requestId),
      })
    }
  }

  const acceptMutation = useMutation({
    mutationFn: () => acceptUserSubstituteRequest(requestId!),
    onSuccess: async () => {
      await invalidateLists()
      options?.onActionSuccess?.()
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (targetRejectionReason: string) =>
      rejectUserSubstituteRequest(requestId!, { targetRejectionReason }),
    onSuccess: async () => {
      await invalidateLists()
      options?.onActionSuccess?.()
    },
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelUserSubstituteRequest(requestId!),
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

  const actionError =
    acceptMutation.isError || rejectMutation.isError || cancelMutation.isError
      ? getAxiosErrorMessage(
          acceptMutation.error ?? rejectMutation.error ?? cancelMutation.error,
          '요청 처리에 실패했습니다.'
        )
      : null

  return {
    detail,
    isLoading: isSent && sentLoading,
    isError:
      (isSent && sentError && sentDetail == null) ||
      (!isSent && options?.receivedFallback == null),
    accept: () => acceptMutation.mutate(),
    reject: (reason: string) => rejectMutation.mutate(reason),
    cancel: () => cancelMutation.mutate(),
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isCancelling: cancelMutation.isPending,
    actionError,
  }
}
