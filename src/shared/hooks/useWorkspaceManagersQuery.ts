import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getWorkspaceManagers,
  type WorkspaceManagersResponse,
} from '@/shared/api/workspaceMembers'
import { queryKeys } from '@/shared/lib/queryKeys'

type WorkspaceManagersQueryParams = {
  workspaceId?: number
  cursor?: string
  pageSize?: number
}

type WorkspaceManagersData = WorkspaceManagersResponse['data']

export function useWorkspaceManagersQuery(
  params: WorkspaceManagersQueryParams
) {
  const { workspaceId, cursor, pageSize } = params

  const { data, isPending, error } = useQuery({
    queryKey: queryKeys.workspace.managers(workspaceId, cursor, pageSize),
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('workspaceId는 필수입니다.')
      }

      const res = await getWorkspaceManagers({
        workspaceId,
        cursor,
        pageSize,
      })
      return res.data
    },
    enabled: !!workspaceId,
  })

  const managers = useMemo(
    () => (data as WorkspaceManagersData | undefined)?.data ?? [],
    [data]
  )

  const pageInfo = useMemo(
    () => (data as WorkspaceManagersData | undefined)?.page,
    [data]
  )

  return {
    managers,
    page: pageInfo,
    isLoading: isPending,
    error,
    rawData: data as WorkspaceManagersData | undefined,
  }
}
