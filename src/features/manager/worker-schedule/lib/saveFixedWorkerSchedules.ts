import {
  deleteFixedWorkerSchdule,
  patchFixedWorkerSchdule,
  postFixedWorkerSchdules,
} from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'
import {
  buildSlotInputForWeekday,
  type WorkerFixedSlotByWeekday,
} from '@/features/manager/worker-schedule/lib/fixedScheduleForWorker'
import {
  recurrenceFieldsForCreate,
  recurrenceFieldsForUpdate,
  isRecurrencePeriodEnded,
  slotRecurrenceDiffers,
  type FixedScheduleRecurrenceForm,
} from '@/features/manager/worker-schedule/lib/fixedScheduleRecurrence'
import type { ManagerWeekdayKo } from '@/features/manager/home/constants/managerWeekdayKo'
import type { FixedWorkerScheduleSlotInput } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'

export const ENDED_RECURRENCE_PERIOD_MESSAGE =
  '이미 종료된 기간이에요. 적용 기간을 다시 설정해 주세요.'

export const MULTI_SLOT_RECURRENCE_CHANGE_MESSAGE =
  '같은 요일에 고정 근무가 여러 개라 반복 규칙을 한 번에 바꿀 수 없어요.'

function slotNeedsUpdate(
  existing: WorkerFixedSlotByWeekday,
  desired: FixedWorkerScheduleSlotInput,
  recurrence: FixedScheduleRecurrenceForm
): boolean {
  return (
    desired.startTime !== existing.startTime ||
    desired.endTime !== existing.endTime ||
    desired.startDayOfWeek !== existing.startDayOfWeek ||
    desired.endDayOfWeek !== existing.endDayOfWeek ||
    slotRecurrenceDiffers(existing, recurrence)
  )
}

/**
 * 선택한 요일·시간·반복 규칙에 맞게 근무자의 고정 근무 슬롯을 삭제·수정·등록한다.
 * 같은 요일에 슬롯이 여럿이면(예: 매월 다른 주차) 모두 같은 시간으로 수정하고, 각자의 반복·기간은 보존한다.
 * 그런 요일의 반복·기간을 바꾸면 슬롯들이 같은 규칙이 되어 겹치므로 요청 전에 막는다.
 * 요청이 여러 번이라 원자적이지 않으며, 실패 시 일부 요청은 이미 반영됐을 수 있다.
 * 호출자는 실패 후 목록을 다시 조회해 남은 차이를 다시 계산해야 한다.
 * @throws {Error} 같은 요일에 슬롯이 여럿인데 반복·기간을 바꿨거나, 끝난 적용 기간으로 등록·변경하려는 경우.
 * 이때는 요청을 보내지 않는다.
 */
export async function saveFixedWorkerSchedules(args: {
  workspaceId: number
  workspaceWorkerId: number
  loadedSlots: WorkerFixedSlotByWeekday[]
  selectedDays: ManagerWeekdayKo[]
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
  recurrence: FixedScheduleRecurrenceForm
  /** `yyyy-MM-dd`. 적용 기간이 끝났는지 판단하는 기준일이다. */
  today: string
}): Promise<void> {
  const {
    workspaceId,
    workspaceWorkerId,
    loadedSlots,
    selectedDays,
    startHour,
    startMinute,
    endHour,
    endMinute,
    recurrence,
    today,
  } = args

  const selectedSet = new Set(selectedDays)
  const loadedByDay = new Map<ManagerWeekdayKo, WorkerFixedSlotByWeekday[]>()
  for (const slot of loadedSlots) {
    loadedByDay.set(slot.weekdayKo, [
      ...(loadedByDay.get(slot.weekdayKo) ?? []),
      slot,
    ])
  }

  const hasMultiSlotDay = selectedDays.some(
    day => (loadedByDay.get(day)?.length ?? 0) > 1
  )
  if (recurrence.dirty && hasMultiSlotDay) {
    throw new Error(MULTI_SLOT_RECURRENCE_CHANGE_MESSAGE)
  }

  const toDelete = loadedSlots.filter(s => !selectedSet.has(s.weekdayKo))

  const toCreate: FixedWorkerScheduleSlotInput[] = []
  const toUpdate: { id: number; body: FixedWorkerScheduleSlotInput }[] = []

  for (const day of selectedDays) {
    const existingSlots = loadedByDay.get(day) ?? []
    const slotInput = buildSlotInputForWeekday(
      day,
      startHour,
      startMinute,
      endHour,
      endMinute
    )
    if (existingSlots.length === 0) {
      toCreate.push({ ...slotInput, ...recurrenceFieldsForCreate(recurrence) })
      continue
    }
    for (const existing of existingSlots) {
      if (slotNeedsUpdate(existing, slotInput, recurrence)) {
        toUpdate.push({
          id: existing.id,
          body: { ...slotInput, ...recurrenceFieldsForUpdate(recurrence) },
        })
      }
    }
  }

  // 끝난 기간으로 새 요일을 등록하거나 반복·기간을 바꾸면 실제 근무가 생기지 않으므로 막는다.
  // 삭제와 기간을 건드리지 않는 시간 수정은 끝난 근무를 정리할 수 있도록 허용한다.
  const writesEndedPeriod =
    isRecurrencePeriodEnded(recurrence, today) &&
    (toCreate.length > 0 || (recurrence.dirty && toUpdate.length > 0))
  if (writesEndedPeriod) {
    throw new Error(ENDED_RECURRENCE_PERIOD_MESSAGE)
  }

  await Promise.all([
    ...toDelete.map(slot => deleteFixedWorkerSchdule(workspaceId, slot.id)),
    ...toUpdate.map(({ id, body }) =>
      patchFixedWorkerSchdule(workspaceId, id, body)
    ),
  ])

  if (toCreate.length > 0) {
    await postFixedWorkerSchdules(workspaceId, {
      workspaceWorkerId,
      schedules: toCreate,
    })
  }
}
