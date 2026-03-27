interface WorkCategoryBadgeProps {
  label?: string
  className?: string
}

export function WorkCategoryBadge({
  label = '',
  className = '',
}: WorkCategoryBadgeProps) {
  return (
    <div
      className={`inline-flex h-6 items-center justify-center rounded-[50px] border border-line-1 bg-white px-2 py-1 shadow-[1px_1px_4px_0px_rgba(0,0,0,0.16)] ${className}`}
    >
      <span className="typography-bg text-text-100 whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}

export type { WorkCategoryBadgeProps }
