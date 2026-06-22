import {
  getDurationHours,
  toDateKey,
  toTimeLabel,
} from '@/shared/lib/calendarUtils'
import type { CalendarViewData } from '@/features/home/common/schedule/types/calendarView'
import type {
  ExchangeableSchedulesApiResponse,
  MyScheduleItemDto,
} from '@/features/user/substitute/types'

function normalizeScheduleItems(
  payload: ExchangeableSchedulesApiResponse['data']
): MyScheduleItemDto[] {
  if (payload == null) return []
  if (Array.isArray(payload)) return payload
  if (typeof payload === 'object' && Array.isArray(payload.schedules)) {
    return payload.schedules
  }
  return []
}

export function adaptExchangeableSchedulesToCalendar(
  response: ExchangeableSchedulesApiResponse
): CalendarViewData {
  const schedules = normalizeScheduleItems(response.data)

  const events = schedules.map(item => ({
    shiftId: item.shiftId,
    workspaceName: item.workspace.workspaceName,
    position: item.position,
    status: item.status,
    startDateTime: item.startDateTime,
    endDateTime: item.endDateTime,
    dateKey: toDateKey(item.startDateTime),
    startTimeLabel: toTimeLabel(item.startDateTime),
    endTimeLabel: toTimeLabel(item.endDateTime),
    durationHours: getDurationHours(item.startDateTime, item.endDateTime),
  }))

  const totalWorkHours = events.reduce((acc, e) => acc + e.durationHours, 0)

  return {
    summary: {
      totalWorkHours,
      eventCount: events.length,
    },
    events,
  }
}
