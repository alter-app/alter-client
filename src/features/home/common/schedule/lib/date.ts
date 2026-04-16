const ISO_DATE_LENGTH = 10
const ISO_TIME_START = 11
const ISO_TIME_END = 16

export function toDateKey(iso: string) {
  return iso.slice(0, ISO_DATE_LENGTH)
}

export function toTimeLabel(iso: string) {
  return iso.slice(ISO_TIME_START, ISO_TIME_END)
}

export function getDurationHours(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  const diffHours = Math.max((end - start) / (1000 * 60 * 60), 0)
  return Number(diffHours.toFixed(1))
}
