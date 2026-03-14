import { useEffect, useMemo, useState } from 'react'
import { useWorkspaceManagersQuery } from '@/shared/hooks/useWorkspaceManagersQuery'
import { useWorkspaceWorkersQuery } from '@/shared/hooks/useWorkspaceWorkersQuery'

type Params = {
  workspaceId?: string
  initialPageSize?: number
  loadMorePageSize?: number
}

export function useWorkspaceMembers(params: Params) {
  const {
    workspaceId,
    initialPageSize = 3,
    loadMorePageSize = 10,
  } = params

  const numericWorkspaceId = useMemo(() => {
    const parsed = Number(workspaceId)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  }, [workspaceId])

  const isWorkspaceIdInvalid = !numericWorkspaceId

  const [workersCursor, setWorkersCursor] = useState<string | undefined>()
  const [managersCursor, setManagersCursor] = useState<string | undefined>()

  const [allWorkers, setAllWorkers] = useState<
    ReturnType<typeof useWorkspaceWorkersQuery>['workers']
  >([])
  const [allManagers, setAllManagers] = useState<
    ReturnType<typeof useWorkspaceManagersQuery>['managers']
  >([])

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

  useEffect(() => {
    setWorkersCursor(undefined)
    setManagersCursor(undefined)
    setAllWorkers([])
    setAllManagers([])
  }, [numericWorkspaceId])

  useEffect(() => {
    if (!numericWorkspaceId || workersLoading || workersError) return
    if (!workers || workers.length === 0) return

    setAllWorkers(prev => {
      const existingIds = new Set(prev.map(worker => worker.id))
      const appended = workers.filter(worker => !existingIds.has(worker.id))
      return [...prev, ...appended]
    })
  }, [numericWorkspaceId, workers, workersLoading, workersError])

  useEffect(() => {
    if (!numericWorkspaceId || managersLoading || managersError) return
    if (!managers || managers.length === 0) return

    setAllManagers(prev => {
      const existingIds = new Set(prev.map(manager => manager.id))
      const appended = managers.filter(manager => !existingIds.has(manager.id))
      return [...prev, ...appended]
    })
  }, [numericWorkspaceId, managers, managersLoading, managersError])

  const workersTotalCount = workersPage?.totalCount ?? allWorkers.length
  const managersTotalCount = managersPage?.totalCount ?? allManagers.length

  const hasMoreWorkers = workersTotalCount > allWorkers.length
  const hasMoreManagers = managersTotalCount > allManagers.length

  const loadMoreWorkers = () =>
    setWorkersCursor(workersPage?.cursor ?? undefined)
  const loadMoreManagers = () =>
    setManagersCursor(managersPage?.cursor ?? undefined)

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
