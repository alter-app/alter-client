import axiosInstance from '@/shared/lib/axiosInstance'
import type { PostingListResponse } from '@/features/job-lookup-map/types/posting'

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
