import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  CalendarEvent,
  CalendarViewData,
} from '@/features/home/user/schedule/types/schedule'
import {
  toDateKey,
  toTimeLabel,
  getDurationHours,
  formatScheduleTimeRange,
} from '@/features/home/user/schedule/lib/date'
import type {
  WorkspaceScheduleApiResponse,
  WorkspaceScheduleQueryParams,
  WorkspaceShiftItem,
  WorkspaceWorkerItem,
} from '@/features/home/user/workspace/types/workspaceSchedule'

async function fetchWorkspaceScheduleByMonth(
  workspaceId: number,
  year?: number,
  month?: number,
  day?: number
): Promise<WorkspaceScheduleApiResponse> {
  const response = await axiosInstance.get<WorkspaceScheduleApiResponse>(
    `/app/schedules/workspaces/${workspaceId}`,
    {
      params: {
        ...(year !== undefined && { year }),
        ...(month !== undefined && { month }),
        ...(day !== undefined && { day }),
      },
    }
  )
  return response.data
}

export async function getWorkspaceSchedule(
  workspaceId: number,
  params?: WorkspaceScheduleQueryParams
): Promise<WorkspaceScheduleApiResponse> {
  if (params?.fromYear !== undefined) {
    const sameMonth =
      params.fromYear === params.toYear && params.fromMonth === params.toMonth
    if (sameMonth) {
      return fetchWorkspaceScheduleByMonth(
        workspaceId,
        params.fromYear,
        params.fromMonth
      )
    }
    const [fromData, toData] = await Promise.all([
      fetchWorkspaceScheduleByMonth(workspaceId, params.fromYear, params.fromMonth),
      fetchWorkspaceScheduleByMonth(workspaceId, params.toYear, params.toMonth),
    ])
    return { ...fromData, data: [...fromData.data, ...toData.data] }
  }
  return fetchWorkspaceScheduleByMonth(
    workspaceId,
    params?.year,
    params?.month,
    params?.day
  )
}

export function adaptWorkspaceScheduleToCalendar(
  response: WorkspaceScheduleApiResponse
): CalendarViewData {
  const shifts = response.data

  const events: CalendarEvent[] = shifts.map(shift => ({
    shiftId: shift.shiftId,
    workspaceName: shift.assignedWorker.workerName,
    position: shift.position,
    status: shift.status,
    startDateTime: shift.startDateTime,
    endDateTime: shift.endDateTime,
    dateKey: toDateKey(shift.startDateTime),
    startTimeLabel: toTimeLabel(shift.startDateTime),
    endTimeLabel: toTimeLabel(shift.endDateTime),
    durationHours: getDurationHours(shift.startDateTime, shift.endDateTime),
  }))

  const totalWorkHours = events.reduce((acc, e) => acc + e.durationHours, 0)

  return {
    summary: { totalWorkHours, eventCount: events.length },
    events,
  }
}

export function adaptWorkspaceScheduleToShifts(
  response: WorkspaceScheduleApiResponse
): WorkspaceShiftItem[] {
  return response.data.map(shift => {
    const { time } = formatScheduleTimeRange(
      shift.startDateTime,
      shift.endDateTime
    )
    return {
      shiftId: shift.shiftId,
      workerId: shift.assignedWorker.workerId,
      workerName: shift.assignedWorker.workerName,
      position: shift.position,
      status: shift.status,
      startDateTime: shift.startDateTime,
      endDateTime: shift.endDateTime,
      timeRange: time,
      durationHours: getDurationHours(shift.startDateTime, shift.endDateTime),
    }
  })
}

export function deriveWorkerList(
  response: WorkspaceScheduleApiResponse
): WorkspaceWorkerItem[] {
  const workerMap = new Map<number, WorkspaceWorkerItem>()

  const sorted = [...response.data].sort(
    (a, b) =>
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  )

  for (const shift of sorted) {
    const { workerId, workerName } = shift.assignedWorker
    if (!workerMap.has(workerId)) {
      const { time } = formatScheduleTimeRange(
        shift.startDateTime,
        shift.endDateTime
      )
      workerMap.set(workerId, {
        workerId,
        workerName,
        nextShiftDateTime: shift.startDateTime,
        nextShiftTimeRange: time,
      })
    }
  }

  return Array.from(workerMap.values())
}
