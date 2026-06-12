interface ApplicationStatusBadgeProps {
  status: 'applied' | 'accepted' | 'rejected'
  className?: string
}

const BADGE_STYLE_MAP = {
  applied: {
    label: '지원중',
    containerClassName: 'bg-white border border-line-1',
    textClassName: 'text-text-50',
  },
  accepted: {
    label: '합격',
    containerClassName: 'bg-main border border-main',
    textClassName: 'text-white',
  },
  rejected: {
    label: '불합격',
    containerClassName: 'bg-error border border-error',
    textClassName: 'text-white',
  },
} as const

export function ApplicationStatusBadge({
  status,
  className = '',
}: ApplicationStatusBadgeProps) {
  const style = BADGE_STYLE_MAP[status]

  return (
    <div
      className={`inline-flex items-center justify-center rounded-[50px] px-2 py-1 shadow-[1px_1px_4px_0px_rgba(0,0,0,0.16)] ${style.containerClassName} ${className}`}
    >
      <span className={`typography-bg ${style.textClassName}`}>
        {style.label}
      </span>
    </div>
  )
}

export type { ApplicationStatusBadgeProps }
