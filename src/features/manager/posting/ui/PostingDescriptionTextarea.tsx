import { useLayoutEffect, useRef } from 'react'

import { cn } from '@/shared/lib/utils'

interface PostingDescriptionTextareaProps {
  value: string
  hasError: boolean
  onChange: (value: string) => void
}

export function PostingDescriptionTextarea({
  value,
  hasError,
  onChange,
}: PostingDescriptionTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const borderHeight = textarea.offsetHeight - textarea.clientHeight
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight + borderHeight}px`
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      rows={5}
      placeholder="근무 조건, 우대 사항 등을 자유롭게 작성해 주세요"
      onChange={event => onChange(event.target.value)}
      className={cn(
        'w-full resize-none overflow-hidden rounded-xl border bg-white p-3.5 typography-body02-regular text-text-100 placeholder:text-text-50 focus:outline-none',
        hasError ? 'border-error' : 'border-line-1 focus:border-main'
      )}
    />
  )
}
