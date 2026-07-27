import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { ApplicationStatusFilter } from '@/features/manager/posting/lib/applicationStatus'
import { MOCK_WORKSPACES } from '@/features/manager/posting/mocks/data'
import {
  MOCK_LATENCY,
  useMockPostingStore,
} from '@/features/manager/posting/mocks/store'
import {
  ALL_WORKSPACES,
  type WorkspaceFilter,
} from '@/features/manager/posting/hooks/usePostingListViewModel'

/** 커서 기반 무한스크롤 흉내 — 한 번에 노출할 개수 */
const PAGE_SIZE = 4

interface UseApplicationListOptions {
  /** 특정 공고의 지원자만 조회 (공고 상세 → 지원자 보기) */
  postingId?: number
}

/** 지원자 목록 — 업장·상태 필터 + 무한스크롤 */
export function useApplicationListViewModel({
  postingId,
}: UseApplicationListOptions = {}) {
  const applications = useMockPostingStore(state => state.applications)

  const [workspaceFilter, setWorkspaceFilterState] =
    useState<WorkspaceFilter>(ALL_WORKSPACES)
  const [statusFilter, setStatusFilterState] =
    useState<ApplicationStatusFilter>('ALL')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  /** 다음 페이지 로딩 타이머 — 언마운트·필터 변경 시 취소 */
  const nextPageTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), MOCK_LATENCY)
    return () => clearTimeout(timer)
  }, [])

  useEffect(
    () => () => {
      if (nextPageTimer.current) clearTimeout(nextPageTimer.current)
    },
    []
  )

  /** 진행 중인 다음 페이지 로딩을 취소하고 첫 페이지로 되돌림 */
  const resetPaging = useCallback(() => {
    if (nextPageTimer.current) {
      clearTimeout(nextPageTimer.current)
      nextPageTimer.current = null
    }
    setIsFetchingNextPage(false)
    setVisibleCount(PAGE_SIZE)
  }, [])

  // 필터가 바뀌면 페이지를 처음으로 되돌림
  const setWorkspaceFilter = useCallback(
    (value: WorkspaceFilter) => {
      setWorkspaceFilterState(value)
      resetPaging()
    },
    [resetPaging]
  )

  const setStatusFilter = useCallback(
    (value: ApplicationStatusFilter) => {
      setStatusFilterState(value)
      resetPaging()
    },
    [resetPaging]
  )

  const filteredApplications = useMemo(
    () =>
      applications.filter(application => {
        if (postingId !== undefined && application.postingId !== postingId) {
          return false
        }
        if (
          workspaceFilter !== ALL_WORKSPACES &&
          application.workspaceId !== workspaceFilter
        ) {
          return false
        }
        if (statusFilter !== 'ALL' && application.status !== statusFilter) {
          return false
        }
        return true
      }),
    [applications, postingId, workspaceFilter, statusFilter]
  )

  const visibleApplications = filteredApplications.slice(0, visibleCount)
  const hasNextPage = visibleCount < filteredApplications.length

  /** 커서 기반 다음 페이지 로드 — 실제 API 연동 시 useInfiniteQuery로 교체 */
  const fetchNextPage = useCallback(() => {
    if (nextPageTimer.current) return
    setIsFetchingNextPage(true)
    nextPageTimer.current = setTimeout(() => {
      setVisibleCount(prev => prev + PAGE_SIZE)
      setIsFetchingNextPage(false)
      nextPageTimer.current = null
    }, MOCK_LATENCY)
  }, [])

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
    applications: visibleApplications,
    totalCount: filteredApplications.length,
    isLoading,
    isEmpty: !isLoading && filteredApplications.length === 0,
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
