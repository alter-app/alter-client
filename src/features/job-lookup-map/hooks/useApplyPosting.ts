import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applyPosting } from '@/features/job-lookup-map/api/posting'
import type { ApplyPostingRequest } from '@/features/job-lookup-map/types/posting'

export type ApplyPostingVariables = {
  postingId: number
  body: ApplyPostingRequest
}

export function useApplyPosting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postingId, body }: ApplyPostingVariables) =>
      applyPosting(postingId, body),
    onSuccess: (_, { postingId }) => {
      void queryClient.invalidateQueries({
        queryKey: ['postingDetail', postingId],
      })
      void queryClient.invalidateQueries({
        queryKey: ['jobLookupMap', 'postings'],
      })
    },
  })
}
