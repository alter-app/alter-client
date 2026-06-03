const EMPTY_COLOR = '#efefef'
const MIN_SECTORS = 4
const SIZE = 32
const STROKE_WIDTH = 4
const GAP = 0

interface WorkerScheduleGaugeProps {
  workerColors: string[]
}

export function WorkerScheduleGauge({
  workerColors,
}: WorkerScheduleGaugeProps) {
  const totalSectors = Math.max(MIN_SECTORS, workerColors.length)
  const center = SIZE / 2
  const radius = (SIZE - STROKE_WIDTH) / 2
  const circumference = 2 * Math.PI * radius
  const segmentArc = circumference / totalSectors
  const dashLength = segmentArc - GAP
  const gapLength = circumference - dashLength

  return (
    <svg
      className="absolute inset-0"
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden
    >
      <g transform={`rotate(-90 ${center} ${center})`}>
        {Array.from({ length: totalSectors }, (_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={workerColors[i] ?? EMPTY_COLOR}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${dashLength} ${gapLength}`}
            strokeDashoffset={-(i * segmentArc)}
          />
        ))}
      </g>
    </svg>
  )
}
