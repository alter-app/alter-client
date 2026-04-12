import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import {
  WorkingStoreCard,
  type WorkingStoreItem,
} from '@/features/home/user/ui/WorkingStoreCard'

const DUMMY_STORES: WorkingStoreItem[] = [
  {
    workspaceId: 1,
    businessName: '출근하기 싫은 가게 부천점',
    employedAt: '2024-01-01',
    nextShiftDateTime: '2026-01-09T09:00:00',
  },
  {
    workspaceId: 2,
    businessName: '일하기 싫은 가게 고척점',
    employedAt: '2024-03-01',
    nextShiftDateTime: '2026-01-11T14:00:00',
  },
  {
    workspaceId: 3,
    businessName: '초 메가커피 신용산 레미안',
    employedAt: '2024-06-01',
    nextShiftDateTime: '2026-02-09T10:00:00',
  },
  {
    workspaceId: 4,
    businessName: '동양미래대학교 서비스',
    employedAt: '2024-09-01',
    nextShiftDateTime: '2026-02-09T10:00:00',
  },
  {
    workspaceId: 5,
    businessName: '집게리아',
    employedAt: '2025-01-01',
    nextShiftDateTime: '2026-02-09T10:00:00',
  },
]

export function WorkspacePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light">
      <Navbar variant="detail" title="근무중인 가게" />
      <div className="flex flex-col gap-3 w-full max-w-[390px] mx-auto px-4 py-4">
        {DUMMY_STORES.map(store => (
          <button
            key={store.workspaceId}
            type="button"
            className="rounded-2xl bg-white py-[11px] text-left"
            onClick={() => navigate(`/workspace/${store.workspaceId}`)}
          >
            <WorkingStoreCard store={store} />
          </button>
        ))}
      </div>
    </div>
  )
}
