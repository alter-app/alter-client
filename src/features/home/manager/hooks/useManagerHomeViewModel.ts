import { useEffect, useState } from 'react'
import type { TodayWorkerItem } from '@/features/home/manager/ui/TodayWorkerList'
import type { StoreWorkerRole } from '@/features/home/manager/ui/StoreWorkerListItem'
import type { CalendarViewData } from '@/features/home/user/schedule/types/schedule'
import type { JobPostingItem } from '@/shared/ui/manager/OngoingPostingCard'
import type { SubstituteRequestItem } from '@/shared/ui/manager/SubstituteApprovalCard'
import { useManagedWorkspacesQuery } from '@/features/home/manager/hooks/useManagedWorkspacesQuery'
import { useWorkspaceDetailQuery } from '@/features/home/manager/hooks/useWorkspaceDetailQuery'

export interface ManagerStoreWorkerData {
  id: string
  name: string
  role: StoreWorkerRole
  nextWorkDate: string
  profileImageUrl?: string
}

const TODAY_WORKERS: TodayWorkerItem[] = [
  { id: '1', name: '알바생1', workTime: '00:00 ~ 00:00' },
  { id: '2', name: '알바생2', workTime: '00:00 ~ 00:00' },
]

const STORE_WORKERS: ManagerStoreWorkerData[] = [
  { id: '1', name: '이름임', role: 'manager', nextWorkDate: '2025. 1. 1.' },
  { id: '2', name: '이름임', role: 'staff', nextWorkDate: '2025. 1. 1.' },
  { id: '3', name: '이름임', role: 'staff', nextWorkDate: '2025. 1. 1.' },
]

const ONGOING_POSTINGS: JobPostingItem[] = [
  {
    id: '1',
    dDay: 'D-3',
    title: '[가게이름] 평일 저녁 마감 근무자 모집',
    wage: '시급 10,030원',
    workHours: '17:00 ~ 21:00',
    workDays: '수, 목, 금',
  },
  {
    id: '2',
    dDay: 'D-7',
    title: '[가게이름] 평일 저녁 마감 근무자 모집',
    wage: '시급 10,030원',
    workHours: '07:00 ~ 13:00',
    workDays: '월, 화, 수',
  },
  {
    id: '3',
    dDay: 'D-27',
    title: '[가게이름] 평일 저녁 마감 근무자 모집',
    wage: '시급 10,030원',
    workHours: '07:00 ~ 13:00',
    workDays: '월, 화, 수',
  },
]

const SUBSTITUTE_REQUESTS: SubstituteRequestItem[] = [
  {
    id: '1',
    name: '나영채',
    role: '알바',
    dateRange: '1월 1일 ↔ 1월 10일',
    status: 'accepted',
  },
  {
    id: '2',
    name: '나영채',
    role: '알바',
    dateRange: '1월 1일 ↔ 1월 10일',
    status: 'pending',
  },
  {
    id: '3',
    name: '나영채',
    role: '알바',
    dateRange: '1월 1일 ↔ 1월 10일',
    status: 'pending',
  },
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
    storeWorkers: STORE_WORKERS,
    ongoingPostings: ONGOING_POSTINGS,
    substituteRequests: SUBSTITUTE_REQUESTS,
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
