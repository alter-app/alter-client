import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useSubstituteRequestsViewModel } from '@/features/manager/home/hooks/useSubstituteRequestsViewModel'
import { useManagedWorkspacesQuery } from '@/features/manager/home/hooks/useManagedWorkspacesQuery'
import {
  approveSubstituteRequest,
  rejectSubstituteRequest,
} from '@/features/manager/api/substitute'
import type { SubstituteRequestItem } from '@/shared/ui/manager/SubstituteApprovalCard'
import type { SubstituteActionType } from '@/pages/manager/substitute-request/components/ManagerSubstituteActionModal'
import { SubstituteApiStatus } from '@/shared/types/substituteStatus'
import { queryKeys } from '@/shared/lib/queryKeys'

const SUBSTITUTE_ACTION_ERROR_MESSAGES: Record<string, string> = {
  B001: '이미 처리되었거나 승인/거절할 수 없는 상태입니다.',
  A002: '관리 중인 업장이 아닙니다.',
  B020: '존재하지 않는 대타 요청입니다.',
}

function getSubstituteActionErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = (error.response?.data as { code?: string } | undefined)?.code
    if (code && SUBSTITUTE_ACTION_ERROR_MESSAGES[code]) {
      return SUBSTITUTE_ACTION_ERROR_MESSAGES[code]
    }
  }
  return '처리 중 오류가 발생했습니다. 다시 시도해 주세요.'
}

type ActionTarget = { id: number; type: SubstituteActionType }

const EMPTY_GROUPS = { pending: [], accepted: [], cancelled: [] }

// ACCEPTED = 워커가 수락해 사장 승인 대기 중 → 요청됨
// APPROVED = 사장이 승인 → 수락됨
// REJECTED_BY_APPROVER = 사장이 거절 → 취소됨
function groupByStatus(requests: SubstituteRequestItem[]) {
  if (requests.length === 0) return EMPTY_GROUPS

  const pending: SubstituteRequestItem[] = []
  const accepted: SubstituteRequestItem[] = []
  const cancelled: SubstituteRequestItem[] = []

  for (const item of requests) {
    if (item.rawStatus === SubstituteApiStatus.ACCEPTED) pending.push(item)
    else if (item.rawStatus === SubstituteApiStatus.APPROVED)
      accepted.push(item)
    else if (item.rawStatus === SubstituteApiStatus.REJECTED_BY_APPROVER)
      cancelled.push(item)
  }

  return { pending, accepted, cancelled }
}

export function useManagerSubstituteRequestViewModel() {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useManagedWorkspacesQuery()
  const { requests, isLoading, isError } =
    useSubstituteRequestsViewModel(activeWorkspaceId)
  const [actionTarget, setActionTarget] = useState<ActionTarget | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.substitute.list({
        workspaceId: activeWorkspaceId ?? undefined,
      }),
    })

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: string }) =>
      approveSubstituteRequest(id, { approvalComment: comment }),
    onSuccess: async () => {
      await invalidate()
      setActionTarget(null)
      setActionError(null)
    },
    onError: (error: unknown) => {
      setActionError(getSubstituteActionErrorMessage(error))
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: string }) =>
      rejectSubstituteRequest(id, { approverRejectionReason: comment }),
    onSuccess: async () => {
      await invalidate()
      setActionTarget(null)
      setActionError(null)
    },
    onError: (error: unknown) => {
      setActionError(getSubstituteActionErrorMessage(error))
    },
  })

  const { pending, accepted, cancelled } = useMemo(
    () => groupByStatus(requests),
    [requests]
  )

  const handleModalSubmit = (comment: string) => {
    if (actionTarget === null) return
    setActionError(null)
    if (actionTarget.type === 'approve') {
      approveMutation.mutate({ id: actionTarget.id, comment })
    } else {
      rejectMutation.mutate({ id: actionTarget.id, comment })
    }
  }

  const handleModalClose = () => {
    setActionTarget(null)
    setActionError(null)
  }

  return {
    isLoading,
    isError,
    isEmpty: requests.length === 0,
    pending,
    accepted,
    cancelled,
    actionsDisabled: approveMutation.isPending || rejectMutation.isPending,
    actionModal: {
      open: actionTarget !== null,
      type: actionTarget?.type ?? 'approve',
      pending: approveMutation.isPending || rejectMutation.isPending,
      error: actionError,
    },
    onApproveClick: (id: number) => setActionTarget({ id, type: 'approve' }),
    onRejectClick: (id: number) => setActionTarget({ id, type: 'reject' }),
    onActionModalClose: handleModalClose,
    onActionModalSubmit: handleModalSubmit,
  }
}
