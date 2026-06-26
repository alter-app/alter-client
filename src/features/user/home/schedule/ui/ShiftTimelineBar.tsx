interface ShiftTimelineBarProps {
  startDateTime: string
  endDateTime: string
  colorClassName: string
}

const TICK_HOURS = [6, 12, 18]
const LABEL_HOURS = [0, 6, 12, 18, 24]

export function ShiftTimelineBar({
  startDateTime,
  endDateTime,
  colorClassName,
}: ShiftTimelineBarProps) {
  const startDate = new Date(startDateTime)
  const endDate = new Date(endDateTime)

  let start = startDate.getHours() + startDate.getMinutes() / 60
  let end = endDate.getHours() + endDate.getMinutes() / 60

  if (end <= start) {
    end += 24
  }

  start = Math.min(Math.max(start, 0), 24)
  end = Math.min(Math.max(end, 0), 24)

  const leftPct = (start / 24) * 100
  const widthPct = ((end - start) / 24) * 100

  return (
    <div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-bg-light">
        {TICK_HOURS.map(hour => (
          <span
            key={hour}
            aria-hidden
            className="absolute top-0 h-full w-px bg-line-2"
            style={{ left: `${(hour / 24) * 100}%` }}
          />
        ))}
        <span
          className={`absolute top-0 h-full rounded-full ${colorClassName}`}
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between typography-doc-non text-text-50">
        {LABEL_HOURS.map(hour => (
          <span key={hour}>{hour}</span>
        ))}
      </div>
    </div>
  )
}
