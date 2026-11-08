import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSubstituteRequestsViewModel } from '@/features/manager/home/hooks/useSubstituteRequestsViewModel'
import { useManagedWorkspacesQuery } from '@/features/manager/home/hooks/useManagedWorkspacesQuery'
import {
  approveSubstituteRequest,
  rejectSubstituteRequest,
} from '@/features/manager/api/substitute'
import type { ManagerSubstituteListFilters } from '@/features/manager/substitute'
import type { ManagerSubstituteListStatusFilter } from '@/features/manager/substitute/lib/managerSubstituteListFilters'
import type { SubstituteRequestItem } from '@/shared/types/substituteRequest'
import type { SubstituteActionType } from '@/pages/manager/substitute-request/components/ManagerSubstituteActionModal'
import { SubstituteApiStatus } from '@/shared/types/substituteStatus'
import { getSubstituteActionErrorMessage } from '@/features/manager/substitute/lib/substituteActionError'
import { SUBSTITUTE_APPROVE_REFETCH_QUERY_KEYS } from '@/features/manager/substitute/lib/approveRefetchQueryKeys'

type ActionTarget = { id: number; type: SubstituteActionType }

export type ManagerSubstituteSectionKey = 'pending' | 'accepted' | 'cancelled'

export type ManagerSubstituteSection = {
  key: ManagerSubstituteSectionKey
  title: string
  items: SubstituteRequestItem[]
}

const EMPTY_GROUPS = { pending: [], accepted: [], cancelled: [] }

const SECTION_TITLE: Record<ManagerSubstituteSectionKey, string> = {
  pending: '요청됨',
  accepted: '수락됨',
  cancelled: '취소됨',
}

const SECTION_ORDER: ManagerSubstituteSectionKey[] = [
  'pending',
  'accepted',
  'cancelled',
]

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

function buildSections(
  groups: ReturnType<typeof groupByStatus>,
  statusFilter: ManagerSubstituteListStatusFilter
): ManagerSubstituteSection[] {
  const allSections = SECTION_ORDER.map(key => ({
    key,
    title: SECTION_TITLE[key],
    items: groups[key],
  }))

  if (statusFilter !== 'all') {
    return allSections.filter(
      section => section.key === statusFilter && section.items.length > 0
    )
  }

  return allSections.filter(section => section.items.length > 0)
}

export function useManagerSubstituteRequestViewModel(
  filters: ManagerSubstituteListFilters = { statusFilter: 'all' }
) {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useManagedWorkspacesQuery()
  const { statusFilter } = filters
  const { requests, isLoading, isError } = useSubstituteRequestsViewModel(
    activeWorkspaceId,
    { statusFilter }
  )
  const [actionTarget, setActionTarget] = useState<ActionTarget | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ['substitute', 'list'],
    })

  const invalidateAfterApprove = () =>
    Promise.all(
      SUBSTITUTE_APPROVE_REFETCH_QUERY_KEYS.map(queryKey =>
        queryClient.invalidateQueries({ queryKey })
      )
    )

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: string }) =>
      approveSubstituteRequest(
        id,
        comment !== '' ? { approvalComment: comment } : {}
      ),
    onSuccess: async () => {
      await invalidateAfterApprove()
      setActionTarget(null)
      setActionError(null)
    },
    onError: async (error: unknown) => {
      setActionError(getSubstituteActionErrorMessage(error))
      await invalidateAfterApprove()
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

  const sections = useMemo(() => {
    const groups = groupByStatus(requests)
    return buildSections(groups, statusFilter)
  }, [requests, statusFilter])

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
    isEmpty: sections.length === 0,
    sections,
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
