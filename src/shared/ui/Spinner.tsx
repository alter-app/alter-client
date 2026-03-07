interface SpinnerProps {
  size?: number
  className?: string
}

export function Spinner({ size = 40, className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={`rounded-full border-[3px] border-black/20 border-t-black animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
