import { useEffect, useState } from 'react'
import { useManagedWorkspacesQuery } from '@/features/manager/home/hooks/useManagedWorkspacesQuery'
import { useWorkspaceDetailQuery } from '@/features/manager/home/hooks/useWorkspaceDetailQuery'
import { useWorkspaceWorkersViewModel } from '@/features/manager/home/hooks/useWorkspaceWorkersViewModel'
import { useManagedPostingsViewModel } from '@/features/manager/home/hooks/useManagedPostingsViewModel'
import { useSubstituteRequestsViewModel } from '@/features/manager/home/hooks/useSubstituteRequestsViewModel'
import { useMonthlySchedulesViewModel } from '@/features/manager/home/hooks/useMonthlySchedulesViewModel'
import { useTodaySchedulesViewModel } from '@/features/manager/home/hooks/useTodaySchedulesViewModel'

export function useManagerHomeViewModel() {
  const [isWorkspaceChangeModalOpen, setIsWorkspaceChangeModalOpen] =
    useState(false)

  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } =
    useManagedWorkspacesQuery()

  const { detail: workspaceDetail } = useWorkspaceDetailQuery(activeWorkspaceId)

  const {
    workers: allStoreWorkers,
    totalCount: storeWorkersTotalCount,
    fetchNextPage: fetchNextWorkersPage,
    hasNextPage: hasNextWorkersPage,
    isFetchingNextPage: isFetchingMoreWorkers,
  } = useWorkspaceWorkersViewModel(activeWorkspaceId)

  const {
    postings: allOngoingPostings,
    totalCount: postingsTotalCount,
    fetchNextPage: fetchNextPostingsPage,
    hasNextPage: hasNextPostingsPage,
  } = useManagedPostingsViewModel(activeWorkspaceId, { status: 'OPEN' })

  const {
    requests: allSubstituteRequests,
    totalCount: substituteTotalCount,
    fetchNextPage: fetchNextSubstitutesPage,
    hasNextPage: hasNextSubstitutesPage,
  } = useSubstituteRequestsViewModel(activeWorkspaceId)

  const [visibleWorkersCount, setVisibleWorkersCount] = useState(3)
  const [visiblePostingsCount, setVisiblePostingsCount] = useState(3)
  const [visibleSubstitutesCount, setVisibleSubstitutesCount] = useState(3)

  const storeWorkers = allStoreWorkers.slice(0, visibleWorkersCount)
  const ongoingPostings = allOngoingPostings.slice(0, visiblePostingsCount)
  const substituteRequests = allSubstituteRequests.slice(
    0,
    visibleSubstitutesCount
  )

  const hasMoreWorkers =
    visibleWorkersCount < allStoreWorkers.length || hasNextWorkersPage
  const hasMorePostings =
    visiblePostingsCount < allOngoingPostings.length || hasNextPostingsPage
  const hasMoreSubstitutes =
    visibleSubstitutesCount < allSubstituteRequests.length ||
    hasNextSubstitutesPage

  const showMoreWorkers = () => {
    if (visibleWorkersCount < allStoreWorkers.length) {
      setVisibleWorkersCount(c => c + 3)
    } else {
      fetchNextWorkersPage().then(() => setVisibleWorkersCount(c => c + 3))
    }
  }

  const showMorePostings = () => {
    if (visiblePostingsCount < allOngoingPostings.length) {
      setVisiblePostingsCount(c => c + 3)
    } else {
      fetchNextPostingsPage().then(() => setVisiblePostingsCount(c => c + 3))
    }
  }

  const showMoreSubstitutes = () => {
    if (visibleSubstitutesCount < allSubstituteRequests.length) {
      setVisibleSubstitutesCount(c => c + 3)
    } else {
      fetchNextSubstitutesPage().then(() =>
        setVisibleSubstitutesCount(c => c + 3)
      )
    }
  }

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
    activeWorkspaceId,
    todayWorkers,
    storeWorkers,
    storeWorkersTotalCount,
    showMoreWorkers,
    hasMoreWorkers,
    isFetchingMoreWorkers,
    ongoingPostings,
    postingsTotalCount,
    showMorePostings,
    hasMorePostings,
    substituteRequests,
    substituteTotalCount,
    showMoreSubstitutes,
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
