import type { InputHTMLAttributes } from 'react'
import searchIcon from '@/assets/icons/search.svg'

export type SearchBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> & {
  className?: string
  wrapperClassName?: string
}

export function SearchBar({
  className = '',
  wrapperClassName = '',
  placeholder = '',
  ...props
}: SearchBarProps) {
  return (
    <div
      className={`relative flex h-12 w-full items-center rounded-[16px] border border-line-2 bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.08)] ${wrapperClassName}`}
    >
      <img
        src={searchIcon}
        alt=""
        className="pointer-events-none absolute left-4 h-[22px] w-[22px] shrink-0"
        aria-hidden
      />
      <input
        type="search"
        placeholder={placeholder}
        className={`h-full w-full rounded-full bg-transparent py-0 pl-11 pr-4 typography-body03-regular text-text-100 placeholder:text-text-50 outline-none ${className}`}
        {...props}
      />
    </div>
  )
}
