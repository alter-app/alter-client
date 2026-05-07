import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchManagedWorkspaces } from '@/features/manager/home/api/workspace'
import { useWorkspaceStore } from '@/shared/stores/useWorkspaceStore'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useManagedWorkspacesQuery() {
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore()

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.managerWorkspace.list(),
    queryFn: fetchManagedWorkspaces,
  })

  const workspaces = useMemo(() => data?.data ?? [], [data])

  // ID가 가장 작은 업장을 기본값으로 설정
  useEffect(() => {
    if (workspaces.length === 0) return
    const hasValidActiveWorkspace =
      activeWorkspaceId !== null &&
      workspaces.some(workspace => workspace.id === activeWorkspaceId)

    if (hasValidActiveWorkspace) return

    const defaultWorkspace = workspaces.reduce((prev, curr) =>
      curr.id < prev.id ? curr : prev
    )
    setActiveWorkspaceId(defaultWorkspace.id)
  }, [workspaces, activeWorkspaceId, setActiveWorkspaceId])

  return {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    isLoading: isPending,
    isError,
  }
}
