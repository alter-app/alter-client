import { useQuery } from '@tanstack/react-query'
import { isEmployedAtWorkspace } from '@/features/job-lookup-map/lib/postingWorkspaceEligibility'

export type PostingWorkspaceEligibilityStatus =
  | 'checking'
  | 'employed'
  | 'eligible'
  | 'error'

export function usePostingWorkspaceEligibility(
  workspaceId: number | undefined
) {
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['postingWorkspaceEligibility', workspaceId],
    queryFn: () => isEmployedAtWorkspace(workspaceId!),
    enabled: workspaceId != null && workspaceId > 0,
    refetchOnMount: 'always',
    retry: false,
  })

  const status: PostingWorkspaceEligibilityStatus =
    isPending || isFetching
      ? 'checking'
      : isError
        ? 'error'
        : data
          ? 'employed'
          : 'eligible'

  return { status, retry: refetch }
}
