import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postManagerPosting } from '@/features/manager/posting/api/posting'
import { toCreatePostingRequest } from '@/features/manager/posting/lib/buildPostingRequest'
import { resolvePostingErrorMessage } from '@/features/manager/posting/lib/postingErrorMessage'
import type { PostingFormValues } from '@/features/manager/posting/types/posting'
import { queryKeys } from '@/shared/lib/queryKeys'
import { showToast } from '@/shared/stores/useToastStore'

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
    onError: (error: unknown) => {
      showToast(
        resolvePostingErrorMessage(error, '공고를 등록하지 못했어요.'),
        'error'
      )
    },
  })
}
