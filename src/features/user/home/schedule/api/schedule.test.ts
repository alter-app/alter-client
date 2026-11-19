import { describe, expect, it } from 'vitest'
import type {
  ScheduleApiResponse,
  ScheduleDataDto,
} from '@/features/user/home/schedule/types/schedule'
import {
  adaptMonthlyIncome,
  adaptScheduleResponse,
} from '@/features/user/home/schedule/api/schedule'

function response(data: ScheduleDataDto): ScheduleApiResponse {
  return { timestamp: '2026-10-21T00:00:00', data }
}

const monthlyResponse = response({
  totalWorkHours: 30,
  estimatedSalary: 300_000,
  workspaceSummaries: [
    {
      workspace: { workspaceId: 1, workspaceName: '카페 A' },
      totalWorkHours: 20,
      estimatedSalary: 200_000,
    },
    {
      workspace: { workspaceId: 2, workspaceName: '편의점 B' },
      totalWorkHours: 10,
      estimatedSalary: 100_000,
    },
  ],
  schedules: [],
})

const dailyResponse = response({
  totalWorkHours: 5,
  estimatedSalary: null,
  workspaceSummaries: null,
  schedules: [],
})

describe('adaptMonthlyIncome', () => {
  it('월 조회 응답으로 합계와 업장별 내역(응답 순서 유지)을 만든다', () => {
    expect(adaptMonthlyIncome(monthlyResponse)).toEqual({
      totalWorkHours: 30,
      estimatedSalary: 300_000,
      workspaces: [
        {
          workspaceId: 1,
          workspaceName: '카페 A',
          totalWorkHours: 20,
          estimatedSalary: 200_000,
        },
        {
          workspaceId: 2,
          workspaceName: '편의점 B',
          totalWorkHours: 10,
          estimatedSalary: 100_000,
        },
      ],
    })
  })

  it('일 조회 응답(estimatedSalary=null)으로는 수입을 만들지 않는다', () => {
    expect(adaptMonthlyIncome(dailyResponse)).toBeNull()
  })

  it('workspaceSummaries가 null이면 빈 업장 목록으로 처리한다', () => {
    const income = adaptMonthlyIncome(
      response({
        totalWorkHours: 0,
        estimatedSalary: 0,
        workspaceSummaries: null,
        schedules: [],
      })
    )
    expect(income).toEqual({
      totalWorkHours: 0,
      estimatedSalary: 0,
      workspaces: [],
    })
  })
})

describe('adaptScheduleResponse', () => {
  it('월 조회 응답의 estimatedSalary를 캘린더 요약에 싣는다', () => {
    expect(
      adaptScheduleResponse(monthlyResponse).summary.estimatedLaborCost
    ).toBe(300_000)
  })

  it('일 조회 응답에는 estimatedLaborCost를 싣지 않는다', () => {
    expect(adaptScheduleResponse(dailyResponse).summary).not.toHaveProperty(
      'estimatedLaborCost'
    )
  })
})
