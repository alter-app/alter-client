import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  PostingListApiResponse,
  ManagedPostingsQueryParams,
} from '@/features/manager/home/types/posting'

export async function fetchManagedPostings(
  params: ManagedPostingsQueryParams
): Promise<PostingListApiResponse> {
  const response = await axiosInstance.get<PostingListApiResponse>(
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
  return response.data
}
