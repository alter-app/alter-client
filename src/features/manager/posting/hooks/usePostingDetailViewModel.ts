import { useState } from 'react'

import { useClosePostingMutation } from '@/features/manager/posting/hooks/mutation/useClosePostingMutation'
import { useManagerPostingDetailQuery } from '@/features/manager/posting/hooks/query/useManagerPostingDetailQuery'
import { showToast } from '@/shared/stores/useToastStore'

export function usePostingDetailViewModel(postingId: number) {
  const { posting, isLoading, isError } =
    useManagerPostingDetailQuery(postingId)
  const closePosting = useClosePostingMutation(postingId)

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)

  const confirmClose = () => {
    setIsCloseModalOpen(false)
    closePosting.mutate(undefined, {
      onSuccess: () => showToast('모집을 마감했어요'),
    })
  }

  return {
    posting,
    isLoading,
    isNotFound: !isLoading && (isError || posting === null),
    isClosing: closePosting.isPending,
    isCloseModalOpen,
    openCloseModal: () => setIsCloseModalOpen(true),
    closeCloseModal: () => setIsCloseModalOpen(false),
    confirmClose,
  }
}
