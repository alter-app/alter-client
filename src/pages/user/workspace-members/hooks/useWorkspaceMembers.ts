import { useEffect, useMemo, useState } from 'react'
import { useWorkspaceManagersQuery } from '@/shared/hooks/useWorkspaceManagersQuery'
import { useWorkspaceWorkersQuery } from '@/shared/hooks/useWorkspaceWorkersQuery'

type Params = {
  workspaceId?: string
  initialPageSize?: number
  loadMorePageSize?: number
}

export function useWorkspaceMembers(params: Params) {
  const { workspaceId, initialPageSize = 3, loadMorePageSize = 10 } = params

  const numericWorkspaceId = useMemo(() => {
    const parsed = Number(workspaceId)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  }, [workspaceId])

  const isWorkspaceIdInvalid = !numericWorkspaceId
  type WorkersState = {
    workspaceId?: number
    cursor?: string
    items: ReturnType<typeof useWorkspaceWorkersQuery>['workers']
  }

  type ManagersState = {
    workspaceId?: number
    cursor?: string
    items: ReturnType<typeof useWorkspaceManagersQuery>['managers']
  }

  const [workersState, setWorkersState] = useState<WorkersState>({
    workspaceId: numericWorkspaceId,
    cursor: undefined,
    items: [],
  })

  const [managersState, setManagersState] = useState<ManagersState>({
    workspaceId: numericWorkspaceId,
    cursor: undefined,
    items: [],
  })

  const workersCursor =
    workersState.workspaceId === numericWorkspaceId
      ? workersState.cursor
      : undefined
  const managersCursor =
    managersState.workspaceId === numericWorkspaceId
      ? managersState.cursor
      : undefined

  const {
    workers,
    isLoading: workersLoading,
    error: workersError,
    page: workersPage,
  } = useWorkspaceWorkersQuery({
    workspaceId: numericWorkspaceId,
    cursor: workersCursor,
    pageSize: workersCursor ? loadMorePageSize : initialPageSize,
  })

  const {
    managers,
    isLoading: managersLoading,
    error: managersError,
    page: managersPage,
  } = useWorkspaceManagersQuery({
    workspaceId: numericWorkspaceId,
    cursor: managersCursor,
    pageSize: managersCursor ? loadMorePageSize : initialPageSize,
  })
  const allWorkers =
    workersState.workspaceId === numericWorkspaceId ? workersState.items : []
  const allManagers =
    managersState.workspaceId === numericWorkspaceId ? managersState.items : []

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWorkersState(prev => {
      if (prev.workspaceId === numericWorkspaceId) return prev

      return {
        workspaceId: numericWorkspaceId,
        cursor: undefined,
        items: [],
      }
    })

    setManagersState(prev => {
      if (prev.workspaceId === numericWorkspaceId) return prev

      return {
        workspaceId: numericWorkspaceId,
        cursor: undefined,
        items: [],
      }
    })
  }, [numericWorkspaceId])

  useEffect(() => {
    if (!numericWorkspaceId || workersLoading || workersError) return
    if (!workers || workers.length === 0) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWorkersState(prev => {
      if (prev.workspaceId !== numericWorkspaceId) {
        const existingIds = new Set(workers.map(worker => worker.id))
        const uniqueWorkers = workers.filter(
          worker => !existingIds.has(worker.id)
        )

        return {
          workspaceId: numericWorkspaceId,
          cursor: undefined,
          items: uniqueWorkers,
        }
      }

      const existingIds = new Set(prev.items.map(worker => worker.id))
      const appended = workers.filter(worker => !existingIds.has(worker.id))

      return {
        ...prev,
        items: [...prev.items, ...appended],
      }
    })
  }, [numericWorkspaceId, workers, workersLoading, workersError])

  useEffect(() => {
    if (!numericWorkspaceId || managersLoading || managersError) return
    if (!managers || managers.length === 0) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setManagersState(prev => {
      if (prev.workspaceId !== numericWorkspaceId) {
        const existingIds = new Set(managers.map(manager => manager.id))
        const uniqueManagers = managers.filter(
          manager => !existingIds.has(manager.id)
        )

        return {
          workspaceId: numericWorkspaceId,
          cursor: undefined,
          items: uniqueManagers,
        }
      }

      const existingIds = new Set(prev.items.map(manager => manager.id))
      const appended = managers.filter(manager => !existingIds.has(manager.id))

      return {
        ...prev,
        items: [...prev.items, ...appended],
      }
    })
  }, [numericWorkspaceId, managers, managersLoading, managersError])

  const workersTotalCount = workersPage?.totalCount ?? allWorkers.length
  const managersTotalCount = managersPage?.totalCount ?? allManagers.length

  const hasMoreWorkers = workersTotalCount > allWorkers.length
  const hasMoreManagers = managersTotalCount > allManagers.length

  const loadMoreWorkers = () => {
    if (!numericWorkspaceId) return

    setWorkersState(prev => {
      if (prev.workspaceId !== numericWorkspaceId) return prev

      return {
        ...prev,
        cursor: workersPage?.cursor ?? undefined,
      }
    })
  }

  const loadMoreManagers = () => {
    if (!numericWorkspaceId) return

    setManagersState(prev => {
      if (prev.workspaceId !== numericWorkspaceId) return prev

      return {
        ...prev,
        cursor: managersPage?.cursor ?? undefined,
      }
    })
  }

  const isLoading = workersLoading || managersLoading
  const hasError = !!workersError || !!managersError

  return {
    numericWorkspaceId,
    isWorkspaceIdInvalid,

    isLoading,
    hasError,

    workers: allWorkers,
    managers: allManagers,

    hasMoreWorkers,
    hasMoreManagers,

    loadMoreWorkers,
    loadMoreManagers,
  }
}
