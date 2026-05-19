import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import chevronDownIcon from '@/assets/icons/home/chevron-down.svg'
import type { ManagerWorkerItem } from '@/features/manager/home/types/worker'
import { cn } from '@/shared/lib/utils'

interface WorkerSelectSectionProps {
  worker: ManagerWorkerItem
  workers: ManagerWorkerItem[]
  isOpen: boolean
  onToggle: () => void
  onSelectWorker: (workerId: number) => void
}

function WorkerAvatar() {
  return (
    <div
      className="size-[38px] shrink-0 rounded-full bg-[repeating-conic-gradient(#ececec_0%_25%,transparent_0%_50%)] [background-size:8px_8px]"
      aria-hidden="true"
    />
  )
}

function WorkerRow({
  worker,
  isSelected,
  onClick,
}: {
  worker: ManagerWorkerItem
  isSelected?: boolean
  onClick?: () => void
}) {
  const content = (
    <>
      <WorkerAvatar />
      <div className="flex min-w-0 items-center gap-1">
        <p className="typography-body01-semibold text-text-100">
          {worker.name}
        </p>
        <WorkerRoleBadge role={worker.role} />
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isSelected}
        className={cn(
          'flex h-[70px] w-full items-center gap-4 rounded-2xl px-3 transition-colors',
          isSelected ? 'bg-main/10' : 'hover:bg-bg-light'
        )}
      >
        {content}
      </button>
    )
  }

  return (
    <div className="flex h-[70px] w-full items-center gap-4 px-3">
      {content}
    </div>
  )
}

export function WorkerSelectSection({
  worker,
  workers,
  isOpen,
  onToggle,
  onSelectWorker,
}: WorkerSelectSectionProps) {
  const canExpand = workers.length >= 2

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="typography-headline03 text-text-100">근무자 선택</h2>
      <button
        type="button"
        onClick={canExpand ? onToggle : undefined}
        aria-expanded={isOpen}
        aria-label="근무자 펼치기"
        className="flex h-[70px] w-full items-center rounded-2xl bg-white px-3"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <WorkerAvatar />
          <div className="flex min-w-0 items-center gap-1">
            <p className="typography-body01-semibold text-text-100">
              {worker.name}
            </p>
            <WorkerRoleBadge role={worker.role} />
          </div>
        </div>
        {canExpand ? (
          <img
            src={chevronDownIcon}
            alt=""
            aria-hidden="true"
            className={cn(
              'size-6 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        ) : null}
      </button>
      {isOpen && canExpand ? (
        <div className="flex flex-col rounded-2xl bg-white p-0">
          {workers.map(w => (
            <WorkerRow
              key={w.id}
              worker={w}
              isSelected={w.id === worker.id}
              onClick={() => onSelectWorker(w.id)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
