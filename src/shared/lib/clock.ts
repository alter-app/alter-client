/** "9:0", "09:00:00" 등 → 시·분 두 자리 */
export function splitClockToParts(clock: string | null | undefined): {
  hour: string
  minute: string
} {
  const [hRaw = '0', mRaw = '0'] = (clock ?? '').trim().split(':')
  const hourNum = Number.parseInt(hRaw, 10)
  const minuteNum = Number.parseInt(mRaw, 10)
  const hour = Number.isFinite(hourNum)
    ? String(hourNum).padStart(2, '0')
    : '00'
  const minute = Number.isFinite(minuteNum)
    ? String(minuteNum).padStart(2, '0')
    : '00'
  return { hour, minute }
}
