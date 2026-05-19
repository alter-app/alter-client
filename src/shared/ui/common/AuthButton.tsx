import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function AuthButton({
  className = '',
  children,
  disabled,
  ...props
}: AuthButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'w-full h-14 cursor-pointer rounded-xl border-none bg-main font-pretendard text-5 font-semibold text-white',
        'transition-all duration-200 shadow-[0_2px_8px_rgba(7,192,121,0.3)]',
        'hover:brightness-[0.92] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(7,192,121,0.4)]',
        'active:translate-y-0 active:brightness-[0.85] active:shadow-[0_2px_6px_rgba(7,192,121,0.3)]',
        'disabled:transform-none disabled:cursor-not-allowed disabled:bg-text-50 disabled:shadow-none',
        'sm:h-[52px] sm:rounded-[10px]',
        'xs:h-12 xs:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
