/** ISO 문자열 → YYYY.MM.DD (유효하지 않으면 '-') */
export function formatRequestDate(iso?: string | null): string {
  if (!iso) return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

/** ISO 문자열 → YYYY.MM.DD HH:mm (유효하지 않으면 '-') */
export function formatRequestDateTime(iso?: string | null): string {
  if (!iso) return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  const base = formatRequestDate(iso)
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${base} ${hh}:${min}`
}
