import { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'

/** API 기본 근무자 색상 — 업장 내 중복 허용 */
export const WORKER_DEFAULT_COLOR_CODE = '#9CA3AF'

export type UpdateWorkspaceWorkerColorRequest = {
  colorCode: string
}

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/

export function isValidWorkerColorCode(colorCode: string): boolean {
  return HEX_COLOR.test(colorCode)
}

/** 서버 `colorCode` → 색상 선택 UI 팔레트 값 */
export function resolveSchedulePickerColor(colorCode: string): ScheduleColor {
  const upper = colorCode.trim().toUpperCase()
  const palette = Object.values(ScheduleColor) as string[]
  const match = palette.find(c => c.toUpperCase() === upper)
  if (match) return match as ScheduleColor
  if (upper === WORKER_DEFAULT_COLOR_CODE.toUpperCase()) {
    return ScheduleColor.Gray
  }
  return ScheduleColor.Pink
}

export function normalizeColorCodeForApi(color: ScheduleColor): string {
  return color.toUpperCase()
}

export function colorCodesEqual(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase()
}
