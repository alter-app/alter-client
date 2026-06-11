import { Avatar } from '@/shared/ui/common/Avatar'

interface TodayWorkerItem {
  id: number | string
  name: string
  workTime: string
  profileImageUrl?: string
}

interface TodayWorkerListProps {
  workers: TodayWorkerItem[]
  className?: string
}

function TodayWorkerCard({ worker }: { worker: TodayWorkerItem }) {
  return (
    <div className="h-[188px] w-[148px] rounded-2xl border border-line-1 bg-white px-[30px] py-6">
      <Avatar src={worker.profileImageUrl} alt={worker.name} size={88} />
      <p className="mt-3 text-center typography-body02-semibold text-text-100">
        {worker.name}
      </p>
      <p className="mt-1 text-center typography-body03-regular text-text-70">
        {worker.workTime}
      </p>
    </div>
  )
}

export function TodayWorkerList({
  workers,
  className = '',
}: TodayWorkerListProps) {
  return (
    <section className={className}>
      <h3 className="typography-headline01 text-text-100">
        오늘 근무자는 <span className="text-sub">{workers.length}</span>명이에요
      </h3>

      <div className="mt-3 min-h-[188px] overflow-x-auto scrollbar-hide">
        {workers.length === 0 ? (
          <div className="flex h-[188px] items-center justify-center">
            <p className="typography-body02-regular text-text-50">
              오늘 등록된 스케줄이 없어요
            </p>
          </div>
        ) : (
          <div className="flex min-w-max gap-3">
            {workers.map(worker => (
              <TodayWorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export type { TodayWorkerItem, TodayWorkerListProps }
