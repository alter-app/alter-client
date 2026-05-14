import { useMemo } from 'react'
import {
  useWorkspaceWorkersViewModel,
  useWorkspaceManagersViewModel,
} from '@/features/user'
import { shouldShowInfiniteListLoadMore } from '@/shared/lib/listLoadMoreVisibility'

type Params = {
  workspaceId?: string
  initialPageSize?: number
  loadMorePageSize?: number
}

export function useWorkspaceMembers(params: Params) {
  const { workspaceId, initialPageSize = 3 } = params

  const numericId = useMemo(() => {
    const parsed = Number(workspaceId)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  }, [workspaceId])

  const isWorkspaceIdInvalid = numericId === 0

  const {
    workers,
    totalCount: workersTotalCount,
    fetchNextPage: fetchNextWorkers,
    hasNextPage: hasMoreWorkers,
    isLoading: workersLoading,
    isError: workersError,
  } = useWorkspaceWorkersViewModel(numericId, initialPageSize)

  const {
    managers,
    totalCount: managersTotalCount,
    fetchNextPage: fetchNextManagers,
    hasNextPage: hasMoreManagers,
    isLoading: managersLoading,
    isError: managersError,
  } = useWorkspaceManagersViewModel(numericId, initialPageSize)

  return {
    isWorkspaceIdInvalid,
    isLoading: workersLoading || managersLoading,
    hasError: workersError || managersError,
    workers,
    managers,
    hasMoreWorkers: shouldShowInfiniteListLoadMore(
      hasMoreWorkers,
      workersTotalCount
    ),
    hasMoreManagers: shouldShowInfiniteListLoadMore(
      hasMoreManagers,
      managersTotalCount
    ),
    loadMoreWorkers: fetchNextWorkers,
    loadMoreManagers: fetchNextManagers,
  }
}
