import { useState } from 'react'

import { usePostingApplicationsQuery } from '@/features/manager/posting/hooks/query/usePostingApplicationsQuery'
import {
  ALL_WORKSPACES,
  useWorkspaceFilterOptions,
  type WorkspaceFilter,
} from '@/features/manager/posting/hooks/query/useWorkspaceFilterOptions'
import type { ApplicationStatusFilter } from '@/features/manager/posting/lib/applicationStatus'

export function useApplicationListViewModel(
  postingId?: number,
  enabled: boolean = true
) {
  const [workspaceFilter, setWorkspaceFilter] =
    useState<WorkspaceFilter>(ALL_WORKSPACES)
  const [statusFilter, setStatusFilter] =
    useState<ApplicationStatusFilter>('ALL')

  const { workspaceOptions } = useWorkspaceFilterOptions()

  const {
    applications,
    totalCount,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePostingApplicationsQuery({
    enabled,
    postingId,
    workspaceId:
      workspaceFilter === ALL_WORKSPACES ? undefined : workspaceFilter,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })

  return {
    applications,
    totalCount,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && applications.length === 0,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    workspaceFilter,
    setWorkspaceFilter,
    statusFilter,
    setStatusFilter,
    workspaceOptions,
  }
}
