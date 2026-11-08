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
  slotRecurrenceDiffers,
  type FixedScheduleRecurrenceForm,
} from '@/features/manager/worker-schedule/lib/fixedScheduleRecurrence'
import type { ManagerWeekdayKo } from '@/features/manager/home/constants/managerWeekdayKo'
import type { FixedWorkerScheduleSlotInput } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'

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
 * 요청이 여러 번이라 원자적이지 않으며, 실패 시 일부 요청은 이미 반영됐을 수 있다.
 * 호출자는 실패 후 목록을 다시 조회해 남은 차이를 다시 계산해야 한다.
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
  } = args

  const selectedSet = new Set(selectedDays)
  const loadedByDay = new Map(loadedSlots.map(s => [s.weekdayKo, s] as const))

  const toDelete = loadedSlots.filter(s => !selectedSet.has(s.weekdayKo))

  const toCreate: FixedWorkerScheduleSlotInput[] = []
  const toUpdate: { id: number; body: FixedWorkerScheduleSlotInput }[] = []

  for (const day of selectedDays) {
    const existing = loadedByDay.get(day)
    const slotInput = buildSlotInputForWeekday(
      day,
      startHour,
      startMinute,
      endHour,
      endMinute
    )
    if (!existing) {
      toCreate.push({ ...slotInput, ...recurrenceFieldsForCreate(recurrence) })
      continue
    }
    if (slotNeedsUpdate(existing, slotInput, recurrence)) {
      toUpdate.push({
        id: existing.id,
        body: { ...slotInput, ...recurrenceFieldsForUpdate(recurrence) },
      })
    }
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
