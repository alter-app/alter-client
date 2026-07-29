import { useState } from 'react'

import {
  DECISION_COPY,
  isTerminalApplicationStatus,
  type HiringDecision,
} from '@/features/manager/posting/lib/applicationStatus'
import { useUpdateApplicationStatusMutation } from '@/features/manager/posting/hooks/mutation/useUpdateApplicationStatusMutation'
import { usePostingApplicationDetailQuery } from '@/features/manager/posting/hooks/query/usePostingApplicationDetailQuery'
import { showToast } from '@/shared/stores/useToastStore'

export function useApplicationDetailViewModel(applicationId: number) {
  const { application, isLoading, isError } =
    usePostingApplicationDetailQuery(applicationId)
  const updateStatus = useUpdateApplicationStatusMutation(applicationId)

  const [pendingDecision, setPendingDecision] = useState<HiringDecision | null>(
    null
  )

  const isTerminal = application
    ? isTerminalApplicationStatus(application.status)
    : false

  const confirmDecision = () => {
    if (!pendingDecision) return
    const decision = pendingDecision
    setPendingDecision(null)
    updateStatus.mutate(decision, {
      onSuccess: () => showToast(DECISION_COPY[decision].toast),
    })
  }

  return {
    application,
    isLoading,
    isNotFound: !isLoading && (isError || application === null),
    canDecide: application !== null && !isTerminal,
    isDeciding: updateStatus.isPending,
    pendingDecision,
    decisionCopy: pendingDecision ? DECISION_COPY[pendingDecision] : null,
    requestDecision: (decision: HiringDecision) => {
      if (updateStatus.isPending) return
      setPendingDecision(decision)
    },
    cancelDecision: () => setPendingDecision(null),
    confirmDecision,
  }
}
