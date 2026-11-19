import { describe, expect, it } from 'vitest'
import { adaptWorkspaceScheduleToCalendar } from '@/features/user/home/workspace/api/workspaceSchedule'
import type { WorkspaceScheduleApiResponse } from '@/features/user/home/workspace/types/workspaceSchedule'
import { StatusEnum } from '@/shared/types/enums'

const ownShiftResponse: WorkspaceScheduleApiResponse = {
  timestamp: '2026-11-04T12:00:00',
  data: {
    totalWorkHours: 9,
    estimatedSalary: 92880,
    schedules: [
      {
        shiftId: 101,
        assignedWorker: { workerId: 7, workerName: '본인 이름' },
        startDateTime: '2026-10-05T09:00:00',
        endDateTime: '2026-10-05T18:00:00',
        position: '홀',
        status: StatusEnum.CONFIRMED,
      },
    ],
  },
}

describe('adaptWorkspaceScheduleToCalendar', () => {
  it('본인 근무를 업장명 라벨로 그리고 합계·예상 급여는 응답 값을 쓴다', () => {
    const result = adaptWorkspaceScheduleToCalendar(ownShiftResponse, '카페 A')
    expect(result.summary).toEqual({
      totalWorkHours: 9,
      eventCount: 1,
      estimatedLaborCost: 92880,
    })
    expect(result.events).toHaveLength(1)
    expect(result.events[0]).toMatchObject({
      shiftId: 101,
      workspaceName: '카페 A',
      dateKey: '2026-10-05',
      durationHours: 9,
    })
  })

  it('업장명을 모르면 근무자 이름 대신 포지션을 라벨로 쓴다', () => {
    const result = adaptWorkspaceScheduleToCalendar(ownShiftResponse)
    expect(result.events[0].workspaceName).toBe('홀')
  })

  it('본인 근무가 없는 달은 빈 일정·0시간·0원이다', () => {
    const result = adaptWorkspaceScheduleToCalendar(
      {
        timestamp: '2026-11-04T12:00:00',
        data: { totalWorkHours: 0, estimatedSalary: 0, schedules: [] },
      },
      '카페 A'
    )
    expect(result).toEqual({
      summary: { totalWorkHours: 0, eventCount: 0, estimatedLaborCost: 0 },
      events: [],
    })
  })
})
