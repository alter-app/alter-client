import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchManagedWorkspaces } from '@/features/manager/api/workspace'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { SelectOption } from '@/shared/ui/common/SelectDropdown'

export const ALL_WORKSPACES = 'ALL' as const
export type WorkspaceFilter = number | typeof ALL_WORKSPACES

function useActivatedWorkspaces() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.managerWorkspace.list(),
    queryFn: fetchManagedWorkspaces,
  })

  const workspaces = useMemo(
    () =>
      (data?.data ?? []).filter(
        workspace => workspace.status?.value === 'ACTIVATED'
      ),
    [data]
  )

  return { workspaces, isLoading: isPending, isError }
}

export function useWorkspaceFilterOptions() {
  const { workspaces, isLoading, isError } = useActivatedWorkspaces()

  const workspaceOptions = useMemo<SelectOption<WorkspaceFilter>[]>(
    () => [
      { value: ALL_WORKSPACES, label: '전체 업장' },
      ...workspaces.map(workspace => ({
        value: workspace.id as WorkspaceFilter,
        label: workspace.businessName,
      })),
    ],
    [workspaces]
  )

  return { workspaceOptions, isLoading, isError }
}

export function useWorkspaceSelectOptions() {
  const { workspaces, isLoading, isError } = useActivatedWorkspaces()

  const workspaceOptions = useMemo<SelectOption<number>[]>(
    () =>
      workspaces.map(workspace => ({
        value: workspace.id,
        label: workspace.businessName,
      })),
    [workspaces]
  )

  return { workspaceOptions, isLoading, isError }
}
