import { useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/utils'

export interface ActionMenuItem {
  icon: string
  label: string
  iconColor?: string
  onClick: () => void
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ActionMenu({
  items,
  isOpen,
  onClose,
  className = '',
}: ActionMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={`absolute z-50 w-[121px] overflow-hidden rounded-2xl bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] ${className}`}
    >
      {items.map((item, index) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            item.onClick()
            onClose()
          }}
          className={cn(
            'flex h-[39px] w-full items-center gap-[10px] px-4',
            index < items.length - 1 && 'border-b border-line-2'
          )}
        >
          <img src={item.icon} alt="" aria-hidden className="size-5 shrink-0" />
          <span
            className="typography-body02-regular"
            style={{ color: item.iconColor ?? '#232323' }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}
