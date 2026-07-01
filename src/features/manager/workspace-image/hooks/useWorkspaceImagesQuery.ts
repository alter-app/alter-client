import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWorkspaceImages } from '@/features/manager/workspace-image/api/workspaceImage'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useWorkspaceImagesQuery(workspaceId: number | null) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.managerWorkspace.images(workspaceId!),
    queryFn: () => fetchWorkspaceImages(workspaceId!),
    enabled: workspaceId !== null,
  })

  const images = useMemo(() => data?.data ?? [], [data])

  return {
    images,
    isLoading: isPending && workspaceId !== null,
    isError,
    refetch,
  }
}
