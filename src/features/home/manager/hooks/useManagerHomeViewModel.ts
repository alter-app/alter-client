import { useEffect, useState } from 'react'
import { useManagedWorkspacesQuery } from '@/features/home/manager/hooks/useManagedWorkspacesQuery'
import { useWorkspaceDetailQuery } from '@/features/home/manager/hooks/useWorkspaceDetailQuery'
import { useWorkspaceWorkersViewModel } from '@/features/home/manager/hooks/useWorkspaceWorkersViewModel'
import { useManagedPostingsViewModel } from '@/features/home/manager/hooks/useManagedPostingsViewModel'
import { useSubstituteRequestsViewModel } from '@/features/home/manager/hooks/useSubstituteRequestsViewModel'
import { useMonthlySchedulesViewModel } from '@/features/home/manager/hooks/useMonthlySchedulesViewModel'
import { useTodaySchedulesViewModel } from '@/features/home/manager/hooks/useTodaySchedulesViewModel'

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

  const {
    baseDate: scheduleBaseDate,
    calendarData,
    selectedDateKey,
    isLoading: isScheduleLoading,
    onDateChange: onScheduleDateChange,
    goToPrevMonth,
    goToNextMonth,
  } = useMonthlySchedulesViewModel(activeWorkspaceId)

  const { todayWorkers } = useTodaySchedulesViewModel(activeWorkspaceId)

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
    todayWorkers,
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
      baseDate: scheduleBaseDate,
      selectedDateKey,
      data: calendarData,
      isLoading: isScheduleLoading,
      onDateChange: onScheduleDateChange,
      goToPrevMonth,
      goToNextMonth,
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
