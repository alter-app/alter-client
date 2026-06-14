import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HomeScheduleCalendar,
  WorkingStoresList,
  AppliedStoreList,
  type AppliedStoreItem,
  useWorkspacesViewModel,
  useHomeScheduleViewModel,
  useAppliedStoresViewModel,
} from '@/features/user'
import { useNavbarNotificationProps } from '@/features/notification'
import { Navbar } from '@/shared/ui/common/Navbar'

export function UserHomePage() {
  const navigate = useNavigate()
  const notificationProps = useNavbarNotificationProps()

  const { mode, baseDate, calendarData, isLoading, onDateChange } =
    useHomeScheduleViewModel()

  const { workspaces } = useWorkspacesViewModel()

  const { grouped, getCardStatus } = useAppliedStoresViewModel()

  const appliedStores = useMemo<AppliedStoreItem[]>(
    () =>
      grouped
        .flatMap(g => g.stores)
        .slice(0, 5)
        .map(s => ({
          id: s.id,
          storeName: s.storeName,
          status: getCardStatus(s.status),
        })),
    [grouped, getCardStatus]
  )

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light items-center">
      <div className="sticky top-0 z-10 bg-bg-light w-full">
        <Navbar {...notificationProps} />
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
