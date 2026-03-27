import type { ButtonHTMLAttributes } from 'react'

interface MoreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export function MoreButton({
  label = '더보기',
  className = '',
  ...props
}: MoreButtonProps) {
  return (
    <button
      type="button"
      className={`h-12 w-full rounded-lg border border-line-2 typography-bt text-text-70 ${className}`}
      {...props}
    >
      {label}
    </button>
  )
}
