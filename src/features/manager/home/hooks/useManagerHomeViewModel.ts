import { useEffect, useState } from 'react'
import { useManagedWorkspacesQuery } from '@/features/manager/home/hooks/useManagedWorkspacesQuery'
import { useWorkspaceDetailQuery } from '@/features/manager/home/hooks/useWorkspaceDetailQuery'
import { useWorkspaceWorkersViewModel } from '@/features/manager/home/hooks/useWorkspaceWorkersViewModel'
import { useManagedPostingsViewModel } from '@/features/manager/home/hooks/useManagedPostingsViewModel'
import { useSubstituteRequestsViewModel } from '@/features/manager/home/hooks/useSubstituteRequestsViewModel'
import { useWorkerScheduleCalendarViewModel } from '@/features/manager/home/hooks/useWorkerScheduleCalendarViewModel'
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
  } = useWorkspaceWorkersViewModel(activeWorkspaceId, { status: 'ACTIVATED' })

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

  const [visibleCounts, setVisibleCounts] = useState({
    forWorkspaceId: activeWorkspaceId,
    workers: 3,
    postings: 3,
    substitutes: 3,
  })

  const isSameWorkspace = visibleCounts.forWorkspaceId === activeWorkspaceId
  const visibleWorkersCount = isSameWorkspace ? visibleCounts.workers : 3
  const visiblePostingsCount = isSameWorkspace ? visibleCounts.postings : 3
  const visibleSubstitutesCount = isSameWorkspace
    ? visibleCounts.substitutes
    : 3

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
    const nextCount = visibleWorkersCount + 3
    if (visibleWorkersCount < allStoreWorkers.length) {
      setVisibleCounts(prev => ({
        ...prev,
        forWorkspaceId: activeWorkspaceId,
        workers: nextCount,
      }))
    } else {
      fetchNextWorkersPage().then(() =>
        setVisibleCounts(prev => ({
          ...prev,
          forWorkspaceId: activeWorkspaceId,
          workers: nextCount,
        }))
      )
    }
  }

  const showMorePostings = () => {
    const nextCount = visiblePostingsCount + 3
    if (visiblePostingsCount < allOngoingPostings.length) {
      setVisibleCounts(prev => ({
        ...prev,
        forWorkspaceId: activeWorkspaceId,
        postings: nextCount,
      }))
    } else {
      fetchNextPostingsPage().then(() =>
        setVisibleCounts(prev => ({
          ...prev,
          forWorkspaceId: activeWorkspaceId,
          postings: nextCount,
        }))
      )
    }
  }

  const showMoreSubstitutes = () => {
    const nextCount = visibleSubstitutesCount + 3
    if (visibleSubstitutesCount < allSubstituteRequests.length) {
      setVisibleCounts(prev => ({
        ...prev,
        forWorkspaceId: activeWorkspaceId,
        substitutes: nextCount,
      }))
    } else {
      fetchNextSubstitutesPage().then(() =>
        setVisibleCounts(prev => ({
          ...prev,
          forWorkspaceId: activeWorkspaceId,
          substitutes: nextCount,
        }))
      )
    }
  }

  const {
    baseDate: scheduleBaseDate,
    scheduleData,
    totalWorkHoursText,
    estimatedEarningsText,
    selectedDateKey,
    isLoading: isScheduleLoading,
    onMonthChange: onScheduleMonthChange,
    isModalOpen: isScheduleModalOpen,
    modalDateKey: scheduleModalDateKey,
    visibleWorkers: scheduleVisibleWorkers,
    handleDateClick: onScheduleDateClick,
    closeModal: closeScheduleModal,
  } = useWorkerScheduleCalendarViewModel(activeWorkspaceId)

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
      scheduleData,
      totalWorkHoursText,
      estimatedEarningsText,
      selectedDateKey,
      isLoading: isScheduleLoading,
      onMonthChange: onScheduleMonthChange,
      isModalOpen: isScheduleModalOpen,
      modalDateKey: scheduleModalDateKey,
      visibleWorkers: scheduleVisibleWorkers,
      handleDateClick: onScheduleDateClick,
      closeModal: closeScheduleModal,
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
