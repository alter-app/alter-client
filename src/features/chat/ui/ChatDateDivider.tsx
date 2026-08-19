interface ChatDateDividerProps {
  label: string
}

export function ChatDateDivider({ label }: ChatDateDividerProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="h-px flex-1 bg-line-1" aria-hidden />
      <span className="typography-body03-regular text-text-50">{label}</span>
      <span className="h-px flex-1 bg-line-1" aria-hidden />
    </div>
  )
}
