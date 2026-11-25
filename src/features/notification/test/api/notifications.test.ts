import { beforeEach, describe, expect, it, vi } from 'vitest'

import axiosInstance from '@/shared/lib/axiosInstance'

import {
  fetchManagerNotifications,
  fetchUserNotifications,
} from '../../api/notifications'

vi.mock('@/shared/lib/axiosInstance', () => ({
  default: { get: vi.fn() },
}))

const get = vi.mocked(axiosInstance.get)

describe('알림 목록 API 요청 파라미터', () => {
  beforeEach(() => {
    get.mockReset()
    get.mockResolvedValue({
      data: { page: { cursor: null, pageSize: 20, totalCount: 0 }, data: [] },
    })
  })

  it.each([
    ['알바생', fetchUserNotifications, '/app/users/me/notifications'],
    ['사장님', fetchManagerNotifications, '/manager/notifications/me'],
  ])(
    '%s 목록 API는 type이 없으면 type 파라미터를 빼고 요청한다',
    async (_, fetcher, path) => {
      await fetcher({ type: undefined })

      expect(get).toHaveBeenCalledWith(path, { params: { pageSize: 20 } })
    }
  )

  it('type이 있으면 요청 파라미터에 담는다', async () => {
    await fetchUserNotifications({ type: 'GENERAL' })

    expect(get).toHaveBeenCalledWith('/app/users/me/notifications', {
      params: { pageSize: 20, type: 'GENERAL' },
    })
  })
})
