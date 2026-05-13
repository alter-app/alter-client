import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  PostingListResponse,
  PostingDetailResponse,
} from '@/features/job-lookup-map/types/posting'

export type FetchPostingsParams = {
  pageSize: number
  cursor?: string
}

export async function fetchPostings(
  params: FetchPostingsParams
): Promise<PostingListResponse> {
  const response = await axiosInstance.get<PostingListResponse>(
    '/app/postings',
    {
      params: {
        pageSize: params.pageSize,
        ...(params.cursor !== undefined &&
          params.cursor !== '' && { cursor: params.cursor }),
      },
    }
  )
  return response.data
}

export async function fetchPostingDetail(
  postingId: number
): Promise<PostingDetailResponse> {
  const response = await axiosInstance.get<
    PostingDetailResponse | CommonApiResponse<PostingDetailResponse>
  >(`/app/postings/${postingId}`)
  const body = response.data
  if (
    body &&
    typeof body === 'object' &&
    'timestamp' in body &&
    'data' in body &&
    body.data != null &&
    typeof body.data === 'object'
  ) {
    return (body as CommonApiResponse<PostingDetailResponse>).data
  }
  return body as PostingDetailResponse
}
