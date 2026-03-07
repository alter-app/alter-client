interface ChevronRightIconProps {
  width?: number
  height?: number
  className?: string
}

export function ChevronRightIcon({
  width = 20,
  height = 20,
  className = '',
}: ChevronRightIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
