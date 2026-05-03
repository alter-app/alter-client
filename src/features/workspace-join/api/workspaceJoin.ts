import axiosInstance from '@/shared/lib/axiosInstance'
import { postWorkspaceJoinRequest } from '@/features/workspace-join/api/membership'
import type { DiscoverableStoreRow } from '@/features/workspace-join/types'

export async function searchStoresForApply(
  keyword: string
): Promise<DiscoverableStoreRow[]> {
  const q = keyword.trim()
  try {
    const response = await axiosInstance.get<{
      data?: { rows?: DiscoverableStoreRow[] }
    }>(`/public/workspaces/search`, {
      params: { q },
    })

    const rows = response.data?.data?.rows
    if (rows?.length) {
      return rows
    }
  } catch {
    /* 검색 공개 API 미연동 시 아래 목 사용 */
  }

  await new Promise(r => setTimeout(r, 300))
  if (!q) return []

  const seed: DiscoverableStoreRow[] = [
    {
      workspaceId: 101,
      displayName: '알테리아 강남점',
      roadAddressSummary: '서울 강남구 테헤란로',
    },
    {
      workspaceId: 102,
      displayName: '스타커피 종로점',
      roadAddressSummary: '서울 종로구 종로',
    },
  ]

  const lower = q.toLowerCase()
  return seed.filter(
    row =>
      row.displayName.includes(q) ||
      row.roadAddressSummary.includes(q) ||
      row.displayName.toLowerCase().includes(lower)
  )
}

/** POST `/app/workspaces/{workspaceId}/join-requests` */
export async function requestJoinWorkspace(workspaceId: number): Promise<void> {
  await postWorkspaceJoinRequest(workspaceId)
}
