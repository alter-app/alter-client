import { useMemo, useState } from 'react'

import {
  DECISION_COPY,
  isTerminalApplicationStatus,
  type HiringDecision,
} from '@/features/manager/posting/lib/applicationStatus'
import { useMockPostingStore } from '@/features/manager/posting/mocks/store'
import { showToast } from '@/shared/stores/useToastStore'

/** 지원자 상세 — 인적사항 조회 + 채용 결정(서류합격·최종합격·불합격) */
export function useApplicationDetailViewModel(applicationId: number) {
  const applications = useMockPostingStore(state => state.applications)
  const updateApplicationStatus = useMockPostingStore(
    state => state.updateApplicationStatus
  )

  const [pendingDecision, setPendingDecision] = useState<HiringDecision | null>(
    null
  )

  const application = useMemo(
    () => applications.find(item => item.id === applicationId) ?? null,
    [applications, applicationId]
  )

  const isTerminal = application
    ? isTerminalApplicationStatus(application.status)
    : false

  const confirmDecision = () => {
    if (!pendingDecision) return
    updateApplicationStatus(applicationId, pendingDecision)
    showToast(DECISION_COPY[pendingDecision].toast)
    setPendingDecision(null)
  }

  return {
    application,
    isNotFound: application === null,
    /** 종료된 지원서는 채용 결정 액션을 숨깁니다 */
    canDecide: application !== null && !isTerminal,
    pendingDecision,
    decisionCopy: pendingDecision ? DECISION_COPY[pendingDecision] : null,
    requestDecision: (decision: HiringDecision) => setPendingDecision(decision),
    cancelDecision: () => setPendingDecision(null),
    confirmDecision,
  }
}
