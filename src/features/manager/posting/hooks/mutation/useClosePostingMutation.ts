import { useMutation, useQueryClient } from '@tanstack/react-query'

import { patchManagerPostingStatus } from '@/features/manager/posting/api/posting'
import { resolvePostingErrorMessage } from '@/features/manager/posting/lib/postingErrorMessage'
import { queryKeys } from '@/shared/lib/queryKeys'
import { showToast } from '@/shared/stores/useToastStore'

export function useClosePostingMutation(postingId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => patchManagerPostingStatus(postingId, 'CLOSED'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.posting.all })
    },
    onError: (error: unknown) => {
      showToast(
        resolvePostingErrorMessage(error, '모집을 마감하지 못했어요.'),
        'error'
      )
    },
  })
}
