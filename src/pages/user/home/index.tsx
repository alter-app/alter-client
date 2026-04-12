import {
  HomeScheduleCalendar,
  WorkingStoresList,
  AppliedStoreList,
} from '@/features/home'
import type { WorkingStoreItem } from '@/features/home/user/ui/WorkingStoreCard'
import type { AppliedStoreItem } from '@/features/home/user/ui/AppliedStoreList'
import { Navbar } from '@/shared/ui/common/Navbar'
import { useNavigate } from 'react-router-dom'

const WORKING_STORES: WorkingStoreItem[] = [
  {
    workspaceId: 1,
    businessName: '스타벅스 강남점',
    employedAt: '2024-01-01',
    nextShiftDateTime: '2025-04-15T09:00:00',
  },
  {
    workspaceId: 2,
    businessName: '맥도날드 홍대점',
    employedAt: '2024-03-01',
    nextShiftDateTime: '2025-04-18T14:00:00',
  },
]

const APPLIED_STORES: AppliedStoreItem[] = [
  { id: 1, storeName: '이디야커피 신촌점', status: 'applied' },
  { id: 2, storeName: '베스킨라빈스 마포점', status: 'rejected' },
  { id: 3, storeName: '파리바게뜨 합정점', status: 'applied' },
]

export function UserHomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light items-center">
      <div className="sticky top-0 z-10 bg-bg-light w-full">
        <Navbar />
      </div>
      <div className="flex flex-col space-y-3 pb-8 mt-4">
        <HomeScheduleCalendar
          mode="monthly"
          baseDate={new Date()}
          data={null}
          isLoading={false}
          onDateChange={() => {}}
        />

        <WorkingStoresList stores={WORKING_STORES} onMoreClick={() => navigate('/workspace')} />

        <AppliedStoreList stores={APPLIED_STORES} onMoreClick={() => {}} />
      </div>
    </div>
  )
}
