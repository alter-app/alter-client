import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWorkspaceImages } from '@/features/manager/workspace-image/api/workspaceImage'
import type { UpdateWorkspaceImagesRequest } from '@/features/manager/workspace-image/types/workspaceImage'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useUpdateWorkspaceImagesMutation(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateWorkspaceImagesRequest) =>
      updateWorkspaceImages(workspaceId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.managerWorkspace.images(workspaceId),
      })
    },
  })
}
