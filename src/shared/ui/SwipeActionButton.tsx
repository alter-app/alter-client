import { cn } from '@/shared/lib/utils'

interface SwipeActionButtonProps {
  icon: string
  label: string
  onClick: () => void
  variant: 'edit' | 'delete'
}

const VARIANT_STYLES = {
  edit: 'bg-main',
  delete: 'bg-error shadow-[0px_0px_10px_0px_rgba(0,0,0,0.2)]',
} as const

export function SwipeActionButton({
  icon,
  label,
  onClick,
  variant,
}: SwipeActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex shrink-0 size-12 items-center justify-center rounded-2xl',
        VARIANT_STYLES[variant]
      )}
    >
      <img
        src={icon}
        alt=""
        className="size-6 brightness-0 invert"
        aria-hidden
      />
    </button>
  )
}
