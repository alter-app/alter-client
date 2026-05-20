import type { WorkerRole } from '@/shared/types/workerRole'

interface WorkerRoleBadgeProps {
  role: WorkerRole
  className?: string
}

const ROLE_STYLE_MAP = {
  staff: {
    label: '알바',
    containerClassName: 'bg-main-300',
  },
  manager: {
    label: '매니저',
    containerClassName: 'bg-main-700',
  },
  owner: {
    label: '사장님',
    containerClassName: 'bg-main-700',
  },
} as const

export function WorkerRoleBadge({
  role,
  className = '',
}: WorkerRoleBadgeProps) {
  const style = ROLE_STYLE_MAP[role]

  return (
    <div
      className={`inline-flex h-5 shrink-0 items-center rounded-[80px] px-2 py-0.5 ${style.containerClassName} ${className}`}
    >
      <span className="typography-bg text-text-90">{style.label}</span>
    </div>
  )
}

export type { WorkerRoleBadgeProps, WorkerRole }
