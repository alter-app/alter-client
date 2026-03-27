import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getWorkspaceWorkers,
  type WorkspaceWorkersResponse,
} from '@/shared/api/workspaceMembers'

export const WORKSPACE_WORKERS_QUERY_KEY = ['workspace', 'workers'] as const

type WorkspaceWorkersQueryParams = {
  workspaceId?: number
  cursor?: string
  pageSize?: number
}

type WorkspaceWorkersData = WorkspaceWorkersResponse['data']

export function useWorkspaceWorkersQuery(params: WorkspaceWorkersQueryParams) {
  const { workspaceId, cursor, pageSize } = params

  const { data, isPending, error } = useQuery({
    queryKey: [...WORKSPACE_WORKERS_QUERY_KEY, workspaceId, cursor, pageSize],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('workspaceId는 필수입니다.')
      }

      const res = await getWorkspaceWorkers({
        workspaceId,
        cursor,
        pageSize,
      })
      return res.data
    },
    enabled: !!workspaceId,
  })

  const workers = useMemo(
    () => (data as WorkspaceWorkersData | undefined)?.data ?? [],
    [data]
  )

  const pageInfo = useMemo(
    () => (data as WorkspaceWorkersData | undefined)?.page,
    [data]
  )

  return {
    workers,
    page: pageInfo,
    isLoading: isPending,
    error,
    rawData: data as WorkspaceWorkersData | undefined,
  }
}
