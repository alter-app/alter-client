import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putManagerPosting } from '@/features/manager/posting/api/posting'
import { toUpdatePostingRequest } from '@/features/manager/posting/lib/buildPostingRequest'
import type { PostingFormValues } from '@/features/manager/posting/types/posting'
import { queryKeys } from '@/shared/lib/queryKeys'

interface UpdatePostingVariables {
  values: PostingFormValues
  originalScheduleIds: number[]
}

export function useUpdatePostingMutation(postingId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ values, originalScheduleIds }: UpdatePostingVariables) =>
      putManagerPosting(
        postingId,
        toUpdatePostingRequest(values, originalScheduleIds)
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.posting.all })
    },
  })
}
