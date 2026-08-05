import { useState } from 'react'

import { useManagerPostingsQuery } from '@/features/manager/posting/hooks/query/useManagerPostingsQuery'
import {
  ALL_WORKSPACES,
  useWorkspaceFilterOptions,
  type WorkspaceFilter,
} from '@/features/manager/posting/hooks/query/useWorkspaceFilterOptions'
import type { PostingStatusFilter } from '@/features/manager/posting/lib/postingStatus'

export function usePostingListViewModel() {
  const [workspaceFilter, setWorkspaceFilter] =
    useState<WorkspaceFilter>(ALL_WORKSPACES)
  const [statusFilter, setStatusFilter] = useState<PostingStatusFilter>('ALL')

  const { workspaceOptions } = useWorkspaceFilterOptions()

  const {
    postings,
    totalCount,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useManagerPostingsQuery({
    workspaceId:
      workspaceFilter === ALL_WORKSPACES ? undefined : workspaceFilter,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })

  return {
    postings,
    totalCount,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && postings.length === 0,
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
