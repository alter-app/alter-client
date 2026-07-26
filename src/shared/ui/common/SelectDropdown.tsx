import { useEffect, useId, useRef, useState } from 'react'

import DownIcon from '@/assets/icons/home/chevron-down.svg?react'
import { cn } from '@/shared/lib/utils'

export interface SelectOption<T extends string | number> {
  value: T
  label: string
}

interface SelectDropdownProps<T extends string | number> {
  options: SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  /** 접근성 라벨 (예: '업장 필터') */
  ariaLabel: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * 박스형 Select — FilterBar(업장·상태), 공고 등록 폼(업장 선택) 등에 사용.
 * 외부 클릭·Escape로 닫히며, 옵션은 문자열/숫자 값을 지원합니다.
 */
export function SelectDropdown<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  placeholder = '선택',
  disabled = false,
  className,
}: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!isOpen) return

    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const selected = options.find(option => option.value === value)

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-line-1 bg-white px-3.5 text-left transition-colors',
          'disabled:cursor-not-allowed disabled:bg-bg-light disabled:text-text-50',
          isOpen && 'border-main'
        )}
      >
        <span
          className={cn(
            'truncate typography-body02-regular',
            selected ? 'text-text-100' : 'text-text-50'
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <DownIcon
          className={cn(
            'size-4 shrink-0 text-text-70 transition-transform',
            isOpen && 'rotate-180'
          )}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-full z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-line-1 bg-white py-1 shadow-md"
        >
          {options.map(option => {
            const isSelected = option.value === value
            return (
              <li key={String(option.value)} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full px-3.5 py-2.5 text-left transition-colors hover:bg-main-100',
                    isSelected
                      ? 'typography-body02-semibold text-main'
                      : 'typography-body02-regular text-text-100'
                  )}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
