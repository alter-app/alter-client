import axiosInstance from '@/shared/lib/axiosInstance'
import { unwrapCursorPage, type CursorPage } from '@/shared/lib/cursorPage'
import type { ApplicationApiStatus } from '@/shared/types/applicationStatus'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  PostingApplicationDetailDto,
  PostingApplicationListItemDto,
} from '@/features/manager/posting/types/dto'

export interface PostingApplicationsQueryParams {
  pageSize: number
  workspaceId?: number
  status?: ApplicationApiStatus[]
  cursor?: string
}

type ApplicationListBody =
  | CursorPage<PostingApplicationListItemDto>
  | CommonApiResponse<CursorPage<PostingApplicationListItemDto>>

export async function fetchPostingApplications(
  params: PostingApplicationsQueryParams
): Promise<CursorPage<PostingApplicationListItemDto>> {
  const response = await axiosInstance.get<ApplicationListBody>(
    '/manager/postings/applications',
    {
      params: {
        pageSize: params.pageSize,
        ...(params.workspaceId !== undefined && {
          workspaceId: params.workspaceId,
        }),
        ...(params.status?.length && { status: params.status }),
        ...(params.cursor !== undefined && { cursor: params.cursor }),
      },
    }
  )
  return unwrapCursorPage(response.data)
}

export async function fetchPostingApplicationDetail(
  postingApplicationId: number
): Promise<PostingApplicationDetailDto> {
  const response = await axiosInstance.get<
    CommonApiResponse<PostingApplicationDetailDto>
  >(`/manager/postings/applications/${postingApplicationId}`)
  return response.data.data
}

export async function patchPostingApplicationStatus(
  postingApplicationId: number,
  status: ApplicationApiStatus
): Promise<void> {
  await axiosInstance.patch(
    `/manager/postings/applications/${postingApplicationId}/status`,
    { status }
  )
}
