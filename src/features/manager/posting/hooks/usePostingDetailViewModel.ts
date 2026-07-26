import { useMemo, useState } from 'react'

import { useMockPostingStore } from '@/features/manager/posting/mocks/store'
import { showToast } from '@/shared/stores/useToastStore'

/** 공고 상세 — 조회 + 모집 마감 처리 */
export function usePostingDetailViewModel(postingId: number) {
  const postings = useMockPostingStore(state => state.postings)
  const applications = useMockPostingStore(state => state.applications)
  const closePosting = useMockPostingStore(state => state.closePosting)

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)

  const posting = useMemo(
    () => postings.find(item => item.id === postingId) ?? null,
    [postings, postingId]
  )

  // 목업 지원자 수 — 실제 API에서는 공고 상세 응답 필드 사용
  const applicantCount = useMemo(
    () => applications.filter(item => item.postingId === postingId).length,
    [applications, postingId]
  )

  const confirmClose = () => {
    closePosting(postingId)
    setIsCloseModalOpen(false)
    showToast('모집을 마감했어요')
  }

  return {
    posting,
    applicantCount,
    isNotFound: posting === null,
    isCloseModalOpen,
    openCloseModal: () => setIsCloseModalOpen(true),
    closeCloseModal: () => setIsCloseModalOpen(false),
    confirmClose,
  }
}
