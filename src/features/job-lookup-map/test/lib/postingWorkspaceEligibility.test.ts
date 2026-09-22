import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMyWorkspaces } from '@/entities/workspace'
import { isEmployedAtWorkspace } from '../../lib/postingWorkspaceEligibility'

vi.mock('@/entities/workspace', () => ({
  getMyWorkspaces: vi.fn(),
}))

const getWorkspaces = vi.mocked(getMyWorkspaces)

function page(workspaceIds: number[], cursor: string) {
  return {
    timestamp: '2026-09-16T00:00:00Z',
    data: {
      page: { cursor, pageSize: 10, totalCount: workspaceIds.length },
      data: workspaceIds.map(workspaceId => ({
        workspaceId,
        businessName: '업장',
        employedAt: '2026-09-16',
      })),
    },
  }
}

describe('공고 업장 근무 여부 확인', () => {
  beforeEach(() => {
    getWorkspaces.mockReset()
  })

  it('첫 페이지에서 근무 업장을 찾으면 추가 요청 없이 차단한다', async () => {
    getWorkspaces.mockResolvedValue(page([10, 20], 'next'))

    await expect(isEmployedAtWorkspace(20)).resolves.toBe(true)
    expect(getWorkspaces).toHaveBeenCalledTimes(1)
    expect(getWorkspaces).toHaveBeenCalledWith({
      pageSize: 10,
      cursor: undefined,
    })
  })

  it('첫 페이지에 없으면 다음 커서까지 조회해 근무 업장을 찾는다', async () => {
    getWorkspaces
      .mockResolvedValueOnce(page([10], 'next'))
      .mockResolvedValueOnce(page([20], ''))

    await expect(isEmployedAtWorkspace(20)).resolves.toBe(true)
    expect(getWorkspaces).toHaveBeenNthCalledWith(2, {
      pageSize: 10,
      cursor: 'next',
    })
  })

  it('마지막 페이지까지 없을 때만 지원 가능으로 판단한다', async () => {
    getWorkspaces
      .mockResolvedValueOnce(page([10], 'next'))
      .mockResolvedValueOnce(page([30], ''))

    await expect(isEmployedAtWorkspace(20)).resolves.toBe(false)
    expect(getWorkspaces).toHaveBeenCalledTimes(2)
  })

  it('다음 페이지 조회에 실패하면 지원 가능으로 판단하지 않는다', async () => {
    getWorkspaces
      .mockResolvedValueOnce(page([10], 'next'))
      .mockRejectedValueOnce(new Error('network'))

    await expect(isEmployedAtWorkspace(20)).rejects.toThrow('network')
  })

  it('반복되는 커서는 종료 실패로 처리한다', async () => {
    getWorkspaces
      .mockResolvedValueOnce(page([10], 'next'))
      .mockResolvedValueOnce(page([30], 'next'))

    await expect(isEmployedAtWorkspace(20)).rejects.toThrow(
      '근무 업장 목록을 끝까지 확인하지 못했습니다.'
    )
    expect(getWorkspaces).toHaveBeenCalledTimes(2)
  })
})
