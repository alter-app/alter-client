import { beforeEach, describe, expect, it, vi } from 'vitest'

import axiosInstance from '@/shared/lib/axiosInstance'
import { queryKeys } from '@/shared/lib/queryKeys'

import { fetchPostingApplications } from '../../api/application'

vi.mock('@/shared/lib/axiosInstance', () => ({
  default: { get: vi.fn() },
}))

const get = vi.mocked(axiosInstance.get)
const emptyPage = {
  page: { cursor: null, pageSize: 10, totalCount: 0 },
  data: [],
}

describe('공고 지원자 목록 API', () => {
  beforeEach(() => {
    get.mockReset()
    get.mockResolvedValue({ data: emptyPage })
  })

  it('공고별 목록 요청과 쿼리 키에 postingId를 포함한다', async () => {
    await expect(
      fetchPostingApplications({ pageSize: 10, postingId: 7 })
    ).resolves.toEqual(emptyPage)

    expect(get).toHaveBeenCalledWith('/manager/postings/applications', {
      params: { pageSize: 10, postingId: 7 },
    })
    expect(
      queryKeys.posting.applicationList({ postingId: 7, pageSize: 10 })
    ).toEqual([
      'posting',
      'application',
      'list',
      { postingId: 7, pageSize: 10 },
    ])
  })

  it('전체 목록 요청에는 postingId를 포함하지 않는다', async () => {
    await fetchPostingApplications({ pageSize: 10 })

    expect(get).toHaveBeenCalledWith('/manager/postings/applications', {
      params: { pageSize: 10 },
    })
  })
})
