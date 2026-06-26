export function formatTotalWorkHoursText(totalWorkHours?: number): string {
  return String(Math.round(totalWorkHours ?? 0)).padStart(2, '0')
}

export function formatEstimatedEarningsText(
  estimatedLaborCost?: number
): string | undefined {
  if (estimatedLaborCost == null) return undefined
  return `약 ${estimatedLaborCost.toLocaleString()}원`
}
