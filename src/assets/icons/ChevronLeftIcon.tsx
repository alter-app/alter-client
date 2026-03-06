interface ChevronLeftIconProps {
  width?: number
  height?: number
  className?: string
}

export function ChevronLeftIcon({
  width = 20,
  height = 20,
  className = '',
}: ChevronLeftIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
