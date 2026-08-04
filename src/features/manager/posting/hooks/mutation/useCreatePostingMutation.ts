import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postManagerPosting } from '@/features/manager/posting/api/posting'
import { toCreatePostingRequest } from '@/features/manager/posting/lib/buildPostingRequest'
import type { PostingFormValues } from '@/features/manager/posting/types/posting'
import { queryKeys } from '@/shared/lib/queryKeys'

interface CreatePostingVariables {
  values: PostingFormValues
  workspaceId: number
}

export function useCreatePostingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ values, workspaceId }: CreatePostingVariables) =>
      postManagerPosting(toCreatePostingRequest(values, workspaceId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.posting.all })
    },
  })
}
