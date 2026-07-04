import { useEffect, useRef, useState } from 'react'

import DownIcon from '@/assets/icons/home/chevron-down.svg?react'

import {
  SUBSTITUTE_STATUS_FILTER_OPTIONS,
  statusFilterLabel,
  type SubstituteListStatusFilter,
} from '@/shared/types/substituteListFilters'

interface SubstituteStatusFilterDropdownProps {
  value: SubstituteListStatusFilter
  onChange: (value: SubstituteListStatusFilter) => void
}

export function SubstituteStatusFilterDropdown({
  value,
  onChange,
}: SubstituteStatusFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 typography-body02-regular text-text-50"
        aria-label="상태 필터"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {statusFilterLabel(value)}
        <DownIcon
          className={`size-4 text-text-50 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <ul className="absolute right-0 top-full z-20 mt-1 min-w-[120px] overflow-hidden rounded-xl border border-line-1 bg-white shadow-md">
          {SUBSTITUTE_STATUS_FILTER_OPTIONS.map(option => (
            <li key={option.key}>
              <button
                type="button"
                className={`w-full px-4 py-2.5 text-left typography-body02-regular transition-colors hover:bg-main-100 ${
                  option.key === value
                    ? 'text-main typography-body02-medium'
                    : 'text-text-100'
                }`}
                onClick={() => {
                  onChange(option.key)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
