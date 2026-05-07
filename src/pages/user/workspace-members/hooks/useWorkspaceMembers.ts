import { useMemo } from 'react'
import {
  useWorkspaceWorkersViewModel,
  useWorkspaceManagersViewModel,
} from '@/features/user'

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
    fetchNextPage: fetchNextWorkers,
    hasNextPage: hasMoreWorkers,
    isLoading: workersLoading,
    isError: workersError,
  } = useWorkspaceWorkersViewModel(numericId, initialPageSize)

  const {
    managers,
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
    hasMoreWorkers,
    hasMoreManagers,
    loadMoreWorkers: fetchNextWorkers,
    loadMoreManagers: fetchNextManagers,
  }
}
