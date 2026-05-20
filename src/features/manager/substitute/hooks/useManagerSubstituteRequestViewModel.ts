import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSubstituteRequestsViewModel } from '@/features/manager/home/hooks/useSubstituteRequestsViewModel'
import { useManagedWorkspacesQuery } from '@/features/manager/home/hooks/useManagedWorkspacesQuery'
import {
  approveSubstituteRequest,
  rejectSubstituteRequest,
} from '@/features/manager/api/substitute'
import type { SubstituteRequestItem } from '@/shared/ui/manager/SubstituteApprovalCard'
import type { SubstituteActionType } from '@/pages/manager/substitute-request/components/ManagerSubstituteActionModal'
import { ManagerSubstituteApiStatus } from '@/shared/types/substituteStatus'
import { queryKeys } from '@/shared/lib/queryKeys'

type ActionTarget = { id: number; type: SubstituteActionType }

// ACCEPTED = 워커가 수락해 사장 승인 대기 중 → 요청됨
// APPROVED = 사장이 승인 → 수락됨
// 나머지(REJECTED_BY_APPROVER, REJECTED_BY_TARGET, CANCELLED, EXPIRED 등) → 취소됨
function groupByStatus(requests: SubstituteRequestItem[]) {
  const pending: SubstituteRequestItem[] = []
  const accepted: SubstituteRequestItem[] = []
  const cancelled: SubstituteRequestItem[] = []

  for (const item of requests) {
    if (item.rawStatus === ManagerSubstituteApiStatus.ACCEPTED)
      pending.push(item)
    else if (item.rawStatus === ManagerSubstituteApiStatus.APPROVED)
      accepted.push(item)
    else cancelled.push(item)
  }

  return { pending, accepted, cancelled }
}

export function useManagerSubstituteRequestViewModel() {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useManagedWorkspacesQuery()
  const { requests, isLoading, isError } =
    useSubstituteRequestsViewModel(activeWorkspaceId)
  const [actionTarget, setActionTarget] = useState<ActionTarget | null>(null)

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
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: string }) =>
      rejectSubstituteRequest(id, { approverRejectionReason: comment }),
    onSuccess: async () => {
      await invalidate()
      setActionTarget(null)
    },
  })

  const { pending, accepted, cancelled } = useMemo(
    () => groupByStatus(requests),
    [requests]
  )

  const handleModalSubmit = (comment: string) => {
    if (actionTarget === null) return
    if (actionTarget.type === 'approve') {
      approveMutation.mutate({ id: actionTarget.id, comment })
    } else {
      rejectMutation.mutate({ id: actionTarget.id, comment })
    }
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
    },
    onApproveClick: (id: number) => setActionTarget({ id, type: 'approve' }),
    onRejectClick: (id: number) => setActionTarget({ id, type: 'reject' }),
    onActionModalClose: () => setActionTarget(null),
    onActionModalSubmit: handleModalSubmit,
  }
}
