import { Navbar } from '@/shared/ui/common/Navbar'
import { HomeScheduleCalendar } from '@/features/home'
import { StoreWorkerListItem } from '@/features/home/manager/ui/StoreWorkerListItem'
import type { StoreWorkerRole } from '@/features/home/manager/ui/StoreWorkerListItem'
import CrownIcon from '@/assets/icons/home/crown-solid.svg'
import UsersIcon from '@/assets/icons/home/users.svg'

interface WorkspaceMember {
  id: string
  name: string
  role: StoreWorkerRole
  nextWorkDate: string
  profileImageUrl?: string
}

const DUMMY_STORE_NAME = '집게리아'

const DUMMY_MANAGERS: WorkspaceMember[] = [
  { id: '1', name: '이름임', role: 'owner', nextWorkDate: '2025. 1. 1.' },
]

const DUMMY_WORKERS: WorkspaceMember[] = [
  { id: '2', name: '이름임', role: 'manager', nextWorkDate: '2025. 1. 1.' },
  { id: '3', name: '이름임', role: 'staff', nextWorkDate: '2025. 1. 1.' },
]

export function WorkspaceDetailPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light">
      <Navbar variant="detail" title="근무중인 가게" />
      <div className="flex flex-col gap-4 w-full max-w-[390px] mx-auto px-4 py-4">
        <HomeScheduleCalendar
          mode="monthly"
          baseDate={new Date()}
          data={null}
          isLoading={false}
          workspaceName={DUMMY_STORE_NAME}
          onDateChange={() => {}}
        />

        <section className="w-full">
          <div className="flex items-center gap-2 px-3 mb-[10px]">
            <img src={CrownIcon} alt="" className="size-5" />
            <span className="typography-body02-semibold text-sub">
              관리자 ({DUMMY_MANAGERS.length}명)
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {DUMMY_MANAGERS.map(member => (
              <div key={member.id} className="rounded-2xl bg-white">
                <StoreWorkerListItem
                  name={member.name}
                  role={member.role}
                  nextWorkDate={member.nextWorkDate}
                  profileImageUrl={member.profileImageUrl}
                  onOptions={() => {}}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="w-full">
          <div className="flex items-center gap-2 px-3 mb-[10px]">
            <img src={UsersIcon} alt="" className="size-5" />
            <span className="typography-body02-semibold text-sub">
              근무자 ({DUMMY_WORKERS.length}명)
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {DUMMY_WORKERS.map(member => (
              <div key={member.id} className="rounded-2xl bg-white">
                <StoreWorkerListItem
                  name={member.name}
                  role={member.role}
                  nextWorkDate={member.nextWorkDate}
                  profileImageUrl={member.profileImageUrl}
                  onOptions={() => {}}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
