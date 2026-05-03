import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HomeScheduleCalendar,
  WorkingStoresList,
  AppliedStoreList,
} from '@/features/home'
import type { AppliedStoreItem } from '@/features/home/user/applied-stores/ui/AppliedStoreList'
import { useHomeScheduleViewModel } from '@/features/home/user/schedule/hooks/useHomeScheduleViewModel'
import { useWorkspacesViewModel } from '@/features/home/user/workspace/hooks/useWorkspacesViewModel'
import { useAppliedStoresViewModel } from '@/features/home/user/applied-stores/hooks/useAppliedStoresViewModel'
import { Navbar } from '@/shared/ui/common/Navbar'

export function UserHomePage() {
  const navigate = useNavigate()

  const { mode, baseDate, calendarData, isLoading, onDateChange } =
    useHomeScheduleViewModel()

  const { workspaces } = useWorkspacesViewModel()

  const { grouped } = useAppliedStoresViewModel()

  const appliedStores = useMemo<AppliedStoreItem[]>(
    () =>
      grouped
        .flatMap(g => g.stores)
        .slice(0, 5)
        .map(s => ({
          id: s.id,
          storeName: s.storeName,
          status: s.status === 'cancelled' ? 'rejected' : 'applied',
        })),
    [grouped]
  )

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light items-center">
      <div className="sticky top-0 z-10 bg-bg-light w-full">
        <Navbar />
      </div>
      <div className="flex flex-col space-y-3 pb-8 mt-4">
        <HomeScheduleCalendar
          mode={mode}
          baseDate={baseDate}
          data={calendarData}
          isLoading={isLoading}
          onDateChange={onDateChange}
        />

        <WorkingStoresList
          stores={workspaces}
          onMoreClick={() => navigate('/user/workspace')}
          onJoinWorkspaceClick={() => navigate('/user/workspace/join')}
        />

        <AppliedStoreList
          stores={appliedStores}
          onMoreClick={() => navigate('/user/applied-stores')}
        />
      </div>
    </div>
  )
}
