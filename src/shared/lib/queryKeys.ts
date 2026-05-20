import type { SelfScheduleQueryParams } from '@/shared/types/schedule'

export const queryKeys = {
  schedules: {
    all: ['schedules'] as const,
    self: (params: SelfScheduleQueryParams) =>
      ['schedules', 'self', params] as const,
  },
  workspace: {
    workers: (workspaceId?: number) =>
      ['workspace', 'workers', workspaceId] as const,
    managers: (workspaceId?: number) =>
      ['workspace', 'managers', workspaceId] as const,
    list: (params?: { pageSize: number }) =>
      ['workspace', 'list', params] as const,
    schedules: (
      workspaceId: number,
      params?: { year?: number; month?: number; day?: number }
    ) => ['workspace', 'schedules', workspaceId, params] as const,
    /** 선택 스케줄(shift)에 대한 교환 가능 근무자 */
    exchangeableWorkers: (scheduleId: number, pageSize: number) =>
      ['workspace', 'exchangeableWorkers', scheduleId, pageSize] as const,
    exchangeableSchedules: (
      workspaceId: number,
      params?: { year?: number; month?: number; day?: number }
    ) => ['workspace', 'exchangeableSchedules', workspaceId, params] as const,
  },
  application: {
    list: (params?: { status?: string[]; pageSize?: number }) =>
      ['application', 'list', params] as const,
  },
  managerWorkspace: {
    list: () => ['managerWorkspace', 'list'] as const,
    detail: (workspaceId: number) =>
      ['managerWorkspace', 'detail', workspaceId] as const,
    workers: (
      workspaceId: number,
      params?: { status?: string; name?: string; pageSize?: number }
    ) => ['managerWorkspace', 'workers', workspaceId, params] as const,
    workerFixedSchedule: (workspaceId: number, workerId: number) =>
      [
        'managerWorkspace',
        'workerFixedSchedule',
        workspaceId,
        workerId,
      ] as const,
  },
  posting: {
    list: (params?: {
      workspaceId?: number
      status?: string
      pageSize?: number
    }) => ['posting', 'list', params] as const,
  },
  substitute: {
    list: (params?: {
      workspaceId?: number
      status?: string
      pageSize?: number
    }) => ['substitute', 'list', params] as const,
  },
  userSubstitute: {
    list: (params: { direction: string; pageSize: number }) =>
      ['userSubstitute', 'list', params] as const,
    sentDetail: (requestId: number) =>
      ['userSubstitute', 'sentDetail', requestId] as const,
  },
  manager: {
    schedules: (workspaceId: number, year: number, month: number) =>
      ['manager', 'schedules', workspaceId, year, month] as const,
    todaySchedules: (workspaceId: number) =>
      ['manager', 'schedules', 'today', workspaceId] as const,
  },
  workspaceMembership: {
    all: ['workspaceMembership'] as const,
    invitations: (params?: {
      pageSize?: number
      status?: string
      cursor?: string
    }) => ['workspaceMembership', 'invitations', params] as const,
  },
  user: {
    me: () => ['user', 'me'] as const,
  },
  fixedWorkerSchedule: {
    list: (workspaceId: number) =>
      ['fixedWorkerSchedule', 'list', workspaceId] as const,
  },
} as const
