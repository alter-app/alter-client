import type {
  CreatePostingRequestDto,
  CreatePostingScheduleRequestDto,
  UpdatePostingRequestDto,
  UpdatePostingScheduleRequestDto,
} from '@/features/manager/posting/types/dto'
import type {
  PostingFormSchedule,
  PostingFormValues,
} from '@/features/manager/posting/types/posting'

export function toPayAmount(payAmount: string): number {
  return Number(payAmount.replace(/[^0-9]/g, '')) || 0
}

function toScheduleBody(
  schedule: PostingFormSchedule
): CreatePostingScheduleRequestDto {
  const position = schedule.position.trim()
  return {
    workingDays: schedule.workingDays,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    positionsNeeded: Math.max(1, schedule.positionsNeeded),
    // 서버가 빈 문자열을 거부함
    ...(position && { position }),
  }
}

export function toCreatePostingRequest(
  values: PostingFormValues,
  workspaceId: number
): CreatePostingRequestDto {
  return {
    workspaceId,
    title: values.title.trim(),
    description: values.description.trim(),
    payAmount: toPayAmount(values.payAmount),
    paymentType: values.paymentType,
    schedules: values.schedules.map(toScheduleBody),
  }
}

export function toUpdatePostingRequest(
  values: PostingFormValues,
  originalScheduleIds: number[]
): UpdatePostingRequestDto {
  const createSchedules: CreatePostingScheduleRequestDto[] = []
  const updateSchedules: UpdatePostingScheduleRequestDto[] = []

  for (const schedule of values.schedules) {
    const body = toScheduleBody(schedule)
    if (schedule.id === null) {
      createSchedules.push(body)
    } else {
      updateSchedules.push({ ...body, id: schedule.id })
    }
  }

  const remainingIds = new Set(
    values.schedules
      .map(schedule => schedule.id)
      .filter((id): id is number => id !== null)
  )

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    payAmount: toPayAmount(values.payAmount),
    paymentType: values.paymentType,
    createSchedules,
    updateSchedules,
    deleteScheduleIds: originalScheduleIds.filter(id => !remainingIds.has(id)),
  }
}
