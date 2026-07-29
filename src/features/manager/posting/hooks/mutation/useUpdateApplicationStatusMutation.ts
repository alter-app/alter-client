import { useMutation, useQueryClient } from '@tanstack/react-query'

import { patchPostingApplicationStatus } from '@/features/manager/posting/api/application'
import type { HiringDecision } from '@/features/manager/posting/lib/applicationStatus'
import { resolvePostingErrorMessage } from '@/features/manager/posting/lib/postingErrorMessage'
import { queryKeys } from '@/shared/lib/queryKeys'
import { showToast } from '@/shared/stores/useToastStore'

export function useUpdateApplicationStatusMutation(
  postingApplicationId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: HiringDecision) =>
      patchPostingApplicationStatus(postingApplicationId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.posting.all })
    },
    onError: (error: unknown) => {
      showToast(
        resolvePostingErrorMessage(error, '상태를 변경하지 못했어요.'),
        'error'
      )
    },
  })
}
