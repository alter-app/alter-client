import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { resignWorkspace } from '@/features/user/home/workspace/api/workspace'
import { queryKeys } from '@/shared/lib/queryKeys'
import { ROUTES } from '@/shared/constants/routes'

export function useResignWorkspaceMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (workspaceId: number) => resignWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspace.list(),
      })
      navigate(ROUTES.USER.JOB_LOOKUP_MAP)
    },
  })
}
