export type DrawerHandleBarProps = {
  className?: string
  size?: 'sm' | 'md'
}

export function DrawerHandleBar({
  className,
  size = 'md',
}: DrawerHandleBarProps) {
  return (
    <div
      className={`mx-auto shrink-0 rounded-full bg-line-2 ${size === 'sm' ? 'h-1.5 w-10' : 'h-2 w-[100px]'} ${className ?? ''}`.trim()}
      aria-hidden
    />
  )
}
