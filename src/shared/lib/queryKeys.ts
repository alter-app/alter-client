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
  manager: {
    schedules: (workspaceId: number, year: number, month: number) =>
      ['manager', 'schedules', workspaceId, year, month] as const,
    todaySchedules: (workspaceId: number) =>
      ['manager', 'schedules', 'today', workspaceId] as const,
  },
  user: {
    me: () => ['user', 'me'] as const,
  },
} as const
