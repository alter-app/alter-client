import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWorkspaceDetail } from '@/features/home/manager/api/workspace'
import { adaptWorkspaceDetailDto } from '@/features/home/manager/types/workspace'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useWorkspaceDetailQuery(workspaceId: number | null) {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.managerWorkspace.detail(workspaceId ?? 0),
    queryFn: () => fetchWorkspaceDetail(workspaceId!),
    enabled: workspaceId !== null,
  })

  const detail = useMemo(
    () => (data?.data ? adaptWorkspaceDetailDto(data.data) : null),
    [data]
  )

  return {
    detail,
    isLoading: isPending && workspaceId !== null,
    isError,
  }
}
