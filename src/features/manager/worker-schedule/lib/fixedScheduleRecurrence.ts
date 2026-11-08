import { MANAGER_WEEKDAY_KO_ORDER } from '@/features/manager/home/constants/managerWeekdayKo'
import type { WorkerFixedSlotByWeekday } from '@/features/manager/worker-schedule/lib/fixedScheduleForWorker'
import type {
  FixedScheduleRecurrenceType,
  FixedWorkerScheduleRecurrenceInput,
} from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'

export const WEEK_OF_MONTH_OPTIONS = [1, 2, 3, 4, 5] as const

/**
 * 고정 근무 폼의 반복·적용 기간. 날짜는 `yyyy-MM-dd`이다.
 * - `startDate`가 null이면 반복·기간 도입 전의 무기한 매주 규칙을 그대로 보여주는 상태다.
 * - `dirty`는 사용자가 반복·기간을 바꿨는지 나타내며, 기존 슬롯 수정 시 반복·기간을 보낼지 결정한다.
 */
export type FixedScheduleRecurrenceForm = {
  recurrenceType: FixedScheduleRecurrenceType
  weekOfMonth: number | null
  startDate: string | null
  endDate: string | null
  dirty: boolean
}

export function defaultRecurrenceForm(
  today: string
): FixedScheduleRecurrenceForm {
  return {
    recurrenceType: 'WEEKLY',
    weekOfMonth: null,
    startDate: today,
    endDate: null,
    dirty: false,
  }
}

/** 시간 표시와 같은 기준(가장 이른 요일의 슬롯)으로 폼 값을 채운다. 슬롯이 없으면 오늘부터 무기한 매주다. */
export function recurrenceFormFromSlots(
  slots: WorkerFixedSlotByWeekday[],
  today: string
): FixedScheduleRecurrenceForm {
  const primary = MANAGER_WEEKDAY_KO_ORDER.map(day =>
    slots.find(slot => slot.weekdayKo === day)
  ).find(slot => slot !== undefined)
  if (!primary) return defaultRecurrenceForm(today)
  return {
    recurrenceType: primary.recurrenceType,
    weekOfMonth:
      primary.recurrenceType === 'MONTHLY' ? primary.weekOfMonth : null,
    startDate: primary.startDate,
    endDate: primary.endDate,
    dirty: false,
  }
}

/** 저장할 수 없으면 사용자에게 보여줄 문구를, 저장할 수 있으면 null을 돌려준다. */
export function validateRecurrenceForm(
  form: FixedScheduleRecurrenceForm
): string | null {
  if (form.dirty && form.startDate === null) {
    return '적용 시작일을 선택해 주세요.'
  }
  if (form.recurrenceType === 'MONTHLY' && form.weekOfMonth === null) {
    return '매월 몇 번째 주에 근무하는지 선택해 주세요.'
  }
  if (
    form.startDate !== null &&
    form.endDate !== null &&
    form.endDate < form.startDate
  ) {
    return '종료일은 시작일보다 빠를 수 없어요.'
  }
  return null
}

/** 새 슬롯 등록용 필드. 기존 무기한 매주 규칙을 그대로 보여주는 폼이면 생략해 같은 규칙으로 등록한다. */
export function recurrenceFieldsForCreate(
  form: FixedScheduleRecurrenceForm
): FixedWorkerScheduleRecurrenceInput | Record<string, never> {
  if (form.startDate === null) return {}
  return {
    recurrenceType: form.recurrenceType,
    weekOfMonth: form.recurrenceType === 'MONTHLY' ? form.weekOfMonth : null,
    startDate: form.startDate,
    endDate: form.endDate,
  }
}

/** 기존 슬롯 수정용 필드. 반복·기간을 바꾸지 않았으면 생략해 슬롯마다 기존 값을 보존한다. */
export function recurrenceFieldsForUpdate(
  form: FixedScheduleRecurrenceForm
): ReturnType<typeof recurrenceFieldsForCreate> {
  return form.dirty ? recurrenceFieldsForCreate(form) : {}
}

export function slotRecurrenceDiffers(
  slot: WorkerFixedSlotByWeekday,
  form: FixedScheduleRecurrenceForm
): boolean {
  if (!form.dirty) return false
  const fields = recurrenceFieldsForCreate(form)
  if (!('recurrenceType' in fields)) return false
  return (
    slot.recurrenceType !== fields.recurrenceType ||
    slot.weekOfMonth !== fields.weekOfMonth ||
    slot.startDate !== fields.startDate ||
    slot.endDate !== fields.endDate
  )
}
