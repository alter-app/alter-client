import { colors } from '@/shared/lib/tokens'

interface MonthlyDateGaugeProps {
  gaugeRatio: number
  size?: number
  strokeWidth?: number
  backgroundStroke?: string
  progressStroke?: string
}

export function MonthlyDateGauge({
  gaugeRatio,
  size = 32,
  strokeWidth = 4,
  backgroundStroke = colors.bgDark,
  progressStroke = colors.main.DEFAULT,
}: MonthlyDateGaugeProps) {
  const normalizedRatio = Math.min(Math.max(gaugeRatio, 0), 1)
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progressLength = circumference * normalizedRatio

  return (
    <svg
      className="absolute inset-0"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      <g transform={`rotate(35 ${center} ${center})`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundStroke}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressStroke}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          strokeDasharray={`${progressLength} ${circumference}`}
          transform={`translate(${size} 0) scale(-1 1)`}
        />
      </g>
    </svg>
  )
}
