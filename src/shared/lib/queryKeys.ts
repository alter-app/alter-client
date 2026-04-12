import type { SelfScheduleQueryParams } from '@/features/home/user/api/schedule'

export const queryKeys = {
  schedules: {
    all: ['schedules'] as const,
    self: (params: SelfScheduleQueryParams) =>
      ['schedules', 'self', params] as const,
  },
  workspace: {
    workers: (
      workspaceId?: number,
      cursor?: string,
      pageSize?: number
    ) => ['workspace', 'workers', workspaceId, cursor, pageSize] as const,
    managers: (
      workspaceId?: number,
      cursor?: string,
      pageSize?: number
    ) => ['workspace', 'managers', workspaceId, cursor, pageSize] as const,
  },
} as const
