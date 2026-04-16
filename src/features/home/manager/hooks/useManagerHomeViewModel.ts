import { useEffect, useState } from 'react'
import type { TodayWorkerItem } from '@/features/home/manager/ui/TodayWorkerList'
import type { CalendarViewData } from '@/features/home/user/schedule/types/schedule'
import { useManagedWorkspacesQuery } from '@/features/home/manager/hooks/useManagedWorkspacesQuery'
import { useWorkspaceDetailQuery } from '@/features/home/manager/hooks/useWorkspaceDetailQuery'
import { useWorkspaceWorkersViewModel } from '@/features/home/manager/hooks/useWorkspaceWorkersViewModel'
import { useManagedPostingsViewModel } from '@/features/home/manager/hooks/useManagedPostingsViewModel'
import { useSubstituteRequestsViewModel } from '@/features/home/manager/hooks/useSubstituteRequestsViewModel'

const TODAY_WORKERS: TodayWorkerItem[] = [
  { id: '1', name: '알바생1', workTime: '00:00 ~ 00:00' },
  { id: '2', name: '알바생2', workTime: '00:00 ~ 00:00' },
]

const MANAGER_SCHEDULE_BASE_DATE = new Date('2026-01-08T00:00:00+09:00')
const MANAGER_SCHEDULE_SELECTED_DATE_KEY = '2026-01-08'
const MANAGER_SCHEDULE_ESTIMATED_EARNINGS_TEXT = '약 619,200원'

const MANAGER_SCHEDULE_DAYS = [
  1, 2, 3, 4, 9, 10, 11, 16, 17, 18, 23, 24, 25, 30, 31,
]

const MANAGER_SCHEDULE_DATA: CalendarViewData = {
  summary: {
    totalWorkHours: 60,
    eventCount: MANAGER_SCHEDULE_DAYS.length,
  },
  events: MANAGER_SCHEDULE_DAYS.map((day, index) => {
    const dayText = String(day).padStart(2, '0')
    const dateKey = `2026-01-${dayText}`

    return {
      shiftId: index + 1,
      workspaceName: '가게 이름',
      position: '알바',
      status: 'CONFIRMED',
      startDateTime: `${dateKey}T10:00:00+09:00`,
      endDateTime: `${dateKey}T14:00:00+09:00`,
      dateKey,
      startTimeLabel: '10:00',
      endTimeLabel: '14:00',
      durationHours: 4,
    }
  }),
}

export function useManagerHomeViewModel() {
  const [isWorkspaceChangeModalOpen, setIsWorkspaceChangeModalOpen] =
    useState(false)

  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } =
    useManagedWorkspacesQuery()

  const { detail: workspaceDetail } = useWorkspaceDetailQuery(activeWorkspaceId)

  const {
    workers: storeWorkers,
    fetchNextPage: fetchMoreWorkers,
    hasNextPage: hasMoreWorkers,
    isFetchingNextPage: isFetchingMoreWorkers,
  } = useWorkspaceWorkersViewModel(activeWorkspaceId)

  const {
    postings: ongoingPostings,
    totalCount: postingsTotalCount,
    fetchNextPage: fetchMorePostings,
    hasNextPage: hasMorePostings,
  } = useManagedPostingsViewModel(activeWorkspaceId, { status: 'OPEN' })

  const {
    requests: substituteRequests,
    totalCount: substituteTotalCount,
    fetchNextPage: fetchMoreSubstitutes,
    hasNextPage: hasMoreSubstitutes,
  } = useSubstituteRequestsViewModel(activeWorkspaceId)

  useEffect(() => {
    if (!isWorkspaceChangeModalOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isWorkspaceChangeModalOpen])

  useEffect(() => {
    if (!isWorkspaceChangeModalOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsWorkspaceChangeModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isWorkspaceChangeModalOpen])

  return {
    todayWorkers: TODAY_WORKERS,
    storeWorkers,
    fetchMoreWorkers,
    hasMoreWorkers,
    isFetchingMoreWorkers,
    ongoingPostings,
    postingsTotalCount,
    fetchMorePostings,
    hasMorePostings,
    substituteRequests,
    substituteTotalCount,
    fetchMoreSubstitutes,
    hasMoreSubstitutes,
    schedule: {
      baseDate: MANAGER_SCHEDULE_BASE_DATE,
      selectedDateKey: MANAGER_SCHEDULE_SELECTED_DATE_KEY,
      estimatedEarningsText: MANAGER_SCHEDULE_ESTIMATED_EARNINGS_TEXT,
      data: MANAGER_SCHEDULE_DATA,
    },
    workspaceDetail,
    workspaceChangeModal: {
      isOpen: isWorkspaceChangeModalOpen,
      items: workspaces,
      selectedWorkspaceId: activeWorkspaceId,
    },
    openWorkspaceChangeModal: () => setIsWorkspaceChangeModalOpen(true),
    closeWorkspaceChangeModal: () => setIsWorkspaceChangeModalOpen(false),
    selectWorkspace: (workspaceId: number) => {
      setActiveWorkspaceId(workspaceId)
      setIsWorkspaceChangeModalOpen(false)
    },
  }
}
