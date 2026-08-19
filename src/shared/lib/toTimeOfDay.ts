export function toTimeOfDay(time: string | null | undefined): string {
  if (!time) return ''
  return time.slice(0, 5)
}
