import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  CalendarEvent,
  CalendarViewData,
} from '@/features/user/home/schedule/types/schedule'
import {
  getDurationHours,
  toDateKey,
  toTimeLabel,
} from '@/features/home/common/schedule/lib/date'
import { formatScheduleTimeRange } from '@/features/user/home/schedule/lib/date'
import type {
  WorkspaceScheduleApiResponse,
  WorkspaceScheduleDataPayload,
  WorkspaceScheduleQueryParams,
  WorkspaceShiftDto,
  WorkspaceShiftItem,
  WorkspaceWorkerItem,
} from '@/features/user/home/workspace/types/workspaceSchedule'

function normalizeWorkspaceShifts(
  payload: WorkspaceScheduleDataPayload | null | undefined
): WorkspaceShiftDto[] {
  if (payload == null) return []
  if (Array.isArray(payload)) return payload
  if (typeof payload === 'object') {
    const rec = payload as {
      schedules?: WorkspaceShiftDto[]
      shifts?: WorkspaceShiftDto[]
    }
    if (Array.isArray(rec.schedules)) return rec.schedules
    if (Array.isArray(rec.shifts)) return rec.shifts
  }
  return []
}

function extractWorkspaceScheduleTotals(payload: WorkspaceScheduleDataPayload) {
  if (payload == null || Array.isArray(payload)) return {}
  if (typeof payload !== 'object') return {}
  const totalWorkHours =
    typeof payload.totalWorkHours === 'number'
      ? payload.totalWorkHours
      : undefined
  const estimatedSalary =
    typeof payload.estimatedSalary === 'number'
      ? payload.estimatedSalary
      : undefined
  return { totalWorkHours, estimatedSalary }
}

async function fetchWorkspaceScheduleByMonth(
  workspaceId: number,
  year?: number,
  month?: number,
  day?: number
): Promise<WorkspaceScheduleApiResponse> {
  if (year === undefined || month === undefined) {
    throw new Error('업장 스케줄 조회에는 year와 month가 필요합니다.')
  }
  const response = await axiosInstance.get<WorkspaceScheduleApiResponse>(
    `/app/schedules/workspaces/${workspaceId}`,
    {
      params: {
        year,
        month,
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
      fetchWorkspaceScheduleByMonth(
        workspaceId,
        params.fromYear,
        params.fromMonth
      ),
      fetchWorkspaceScheduleByMonth(workspaceId, params.toYear, params.toMonth),
    ])
    const shiftsFrom = normalizeWorkspaceShifts(fromData.data)
    const shiftsTo = normalizeWorkspaceShifts(toData.data)
    const fromTotals = extractWorkspaceScheduleTotals(fromData.data)
    const toTotals = extractWorkspaceScheduleTotals(toData.data)

    const hasHours =
      fromTotals.totalWorkHours !== undefined ||
      toTotals.totalWorkHours !== undefined
    const hasSalary =
      fromTotals.estimatedSalary !== undefined ||
      toTotals.estimatedSalary !== undefined

    return {
      ...fromData,
      data: {
        ...(hasHours
          ? {
              totalWorkHours:
                (fromTotals.totalWorkHours ?? 0) +
                (toTotals.totalWorkHours ?? 0),
            }
          : {}),
        ...(hasSalary
          ? {
              estimatedSalary:
                (fromTotals.estimatedSalary ?? 0) +
                (toTotals.estimatedSalary ?? 0),
            }
          : {}),
        schedules: [...shiftsFrom, ...shiftsTo],
      },
    }
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
  const shifts = normalizeWorkspaceShifts(response.data)
  const apiTotals = extractWorkspaceScheduleTotals(response.data)

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

  const computedHours = events.reduce((acc, e) => acc + e.durationHours, 0)

  return {
    summary: {
      totalWorkHours: apiTotals.totalWorkHours ?? computedHours,
      eventCount: events.length,
      ...(apiTotals.estimatedSalary !== undefined
        ? { estimatedLaborCost: apiTotals.estimatedSalary }
        : {}),
    },
    events,
  }
}

export function adaptWorkspaceScheduleToShifts(
  response: WorkspaceScheduleApiResponse
): WorkspaceShiftItem[] {
  return normalizeWorkspaceShifts(response.data).map(shift => {
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
  const now = Date.now()

  const sorted = normalizeWorkspaceShifts(response.data)
    .filter(shift => new Date(shift.startDateTime).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
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
