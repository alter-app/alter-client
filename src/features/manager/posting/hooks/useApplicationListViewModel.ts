import { useState } from 'react'

import { usePostingApplicationsQuery } from '@/features/manager/posting/hooks/query/usePostingApplicationsQuery'
import {
  ALL_WORKSPACES,
  useWorkspaceFilterOptions,
  type WorkspaceFilter,
} from '@/features/manager/posting/hooks/query/useWorkspaceFilterOptions'
import type { ApplicationStatusFilter } from '@/features/manager/posting/lib/applicationStatus'

// 서버에 postingId 필터가 없어 공고별로 좁힐 수 없음 (응답 DTO에도 postingId 없음)
export function useApplicationListViewModel() {
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
