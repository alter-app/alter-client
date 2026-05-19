import {
  deleteFixedWorkerSchdule,
  patchFixedWorkerSchdule,
  postFixedWorkerSchdules,
} from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'
import {
  buildSlotInputForWeekday,
  type WorkerFixedSlotByWeekday,
} from '@/features/manager/worker-schedule/lib/fixedScheduleForWorker'
import type { ManagerWeekdayKo } from '@/features/manager/home/constants/managerWeekdayKo'
import type { FixedWorkerScheduleSlotInput } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'

function slotNeedsUpdate(
  existing: WorkerFixedSlotByWeekday,
  startHour: string,
  startMinute: string,
  endHour: string,
  endMinute: string
): boolean {
  const desired = buildSlotInputForWeekday(
    existing.weekdayKo,
    startHour,
    startMinute,
    endHour,
    endMinute
  )
  return (
    desired.startTime !== existing.startTime ||
    desired.endTime !== existing.endTime ||
    desired.startDayOfWeek !== existing.startDayOfWeek ||
    desired.endDayOfWeek !== existing.endDayOfWeek
  )
}

export async function saveFixedWorkerSchedules(args: {
  workspaceId: number
  workspaceWorkerId: number
  loadedSlots: WorkerFixedSlotByWeekday[]
  selectedDays: ManagerWeekdayKo[]
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
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
  } = args

  const selectedSet = new Set(selectedDays)
  const loadedByDay = new Map(loadedSlots.map(s => [s.weekdayKo, s] as const))

  const toDelete = loadedSlots.filter(s => !selectedSet.has(s.weekdayKo))
  for (const slot of toDelete) {
    await deleteFixedWorkerSchdule(workspaceId, slot.id)
  }

  const toCreate: FixedWorkerScheduleSlotInput[] = []
  const toUpdate: { id: number; body: FixedWorkerScheduleSlotInput }[] = []

  for (const day of selectedDays) {
    const existing = loadedByDay.get(day)
    const body = buildSlotInputForWeekday(
      day,
      startHour,
      startMinute,
      endHour,
      endMinute
    )
    if (!existing) {
      toCreate.push(body)
      continue
    }
    if (slotNeedsUpdate(existing, startHour, startMinute, endHour, endMinute)) {
      toUpdate.push({ id: existing.id, body })
    }
  }

  for (const { id, body } of toUpdate) {
    await patchFixedWorkerSchdule(workspaceId, id, body)
  }

  if (toCreate.length > 0) {
    await postFixedWorkerSchdules(workspaceId, {
      workspaceWorkerId,
      schedules: toCreate,
    })
  }
}
