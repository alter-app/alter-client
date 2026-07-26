import { useEffect, useMemo, useState } from 'react'

import { MOCK_WORKSPACES } from '@/features/manager/posting/mocks/data'
import {
  MOCK_LATENCY,
  useMockPostingStore,
} from '@/features/manager/posting/mocks/store'
import type { PostingStatusFilter } from '@/features/manager/posting/lib/postingStatus'

export const ALL_WORKSPACES = 'ALL' as const
export type WorkspaceFilter = number | typeof ALL_WORKSPACES

/** 내 공고 목록 — 업장·상태 필터 + 로딩(스켈레톤) 상태 */
export function usePostingListViewModel() {
  const postings = useMockPostingStore(state => state.postings)

  const [workspaceFilter, setWorkspaceFilter] =
    useState<WorkspaceFilter>(ALL_WORKSPACES)
  const [statusFilter, setStatusFilter] = useState<PostingStatusFilter>('ALL')
  const [isLoading, setIsLoading] = useState(true)

  // 목업 로딩 지연 — 스켈레톤 확인용
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), MOCK_LATENCY)
    return () => clearTimeout(timer)
  }, [])

  const filteredPostings = useMemo(
    () =>
      postings.filter(posting => {
        if (
          workspaceFilter !== ALL_WORKSPACES &&
          posting.workspaceId !== workspaceFilter
        ) {
          return false
        }
        if (statusFilter !== 'ALL' && posting.status !== statusFilter) {
          return false
        }
        return true
      }),
    [postings, workspaceFilter, statusFilter]
  )

  const workspaceOptions = useMemo(
    () => [
      { value: ALL_WORKSPACES as WorkspaceFilter, label: '전체 업장' },
      ...MOCK_WORKSPACES.map(workspace => ({
        value: workspace.id as WorkspaceFilter,
        label: workspace.businessName,
      })),
    ],
    []
  )

  return {
    postings: filteredPostings,
    totalCount: filteredPostings.length,
    isLoading,
    isEmpty: !isLoading && filteredPostings.length === 0,
    workspaceFilter,
    setWorkspaceFilter,
    statusFilter,
    setStatusFilter,
    workspaceOptions,
  }
}
