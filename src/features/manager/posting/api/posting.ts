import axiosInstance from '@/shared/lib/axiosInstance'
import { unwrapCursorPage, type CursorPage } from '@/shared/lib/cursorPage'
import type { CommonApiResponse } from '@/shared/types/common'
import type { PostingStatus } from '@/features/manager/posting/types/posting'
import type {
  CreatePostingRequestDto,
  ManagerPostingDetailDto,
  ManagerPostingListItemDto,
  UpdatePostingRequestDto,
} from '@/features/manager/posting/types/dto'

export interface ManagerPostingsQueryParams {
  pageSize: number
  workspaceId?: number
  status?: PostingStatus
  cursor?: string
}

type PostingListBody =
  | CursorPage<ManagerPostingListItemDto>
  | CommonApiResponse<CursorPage<ManagerPostingListItemDto>>

export async function fetchManagerPostings(
  params: ManagerPostingsQueryParams
): Promise<CursorPage<ManagerPostingListItemDto>> {
  const response = await axiosInstance.get<PostingListBody>(
    '/manager/postings',
    {
      params: {
        pageSize: params.pageSize,
        ...(params.workspaceId !== undefined && {
          workspaceId: params.workspaceId,
        }),
        ...(params.status && { status: params.status }),
        ...(params.cursor !== undefined && { cursor: params.cursor }),
      },
    }
  )
  return unwrapCursorPage(response.data)
}

export async function fetchManagerPostingDetail(
  postingId: number
): Promise<ManagerPostingDetailDto> {
  const response = await axiosInstance.get<
    CommonApiResponse<ManagerPostingDetailDto>
  >(`/manager/postings/${postingId}`)
  return response.data.data
}

export async function postManagerPosting(
  body: CreatePostingRequestDto
): Promise<void> {
  await axiosInstance.post('/manager/postings', body)
}

export async function putManagerPosting(
  postingId: number,
  body: UpdatePostingRequestDto
): Promise<void> {
  await axiosInstance.put(`/manager/postings/${postingId}`, body)
}

export async function patchManagerPostingStatus(
  postingId: number,
  status: PostingStatus
): Promise<void> {
  await axiosInstance.patch(`/manager/postings/${postingId}/status`, { status })
}
