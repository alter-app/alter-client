import type { SelfScheduleQueryParams } from '@/features/home/user/schedule/api/schedule'

export const queryKeys = {
  schedules: {
    all: ['schedules'] as const,
    self: (params: SelfScheduleQueryParams) =>
      ['schedules', 'self', params] as const,
  },
  workspace: {
    workers: (workspaceId?: number, cursor?: string, pageSize?: number) =>
      ['workspace', 'workers', workspaceId, cursor, pageSize] as const,
    managers: (workspaceId?: number, cursor?: string, pageSize?: number) =>
      ['workspace', 'managers', workspaceId, cursor, pageSize] as const,
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
} as const
