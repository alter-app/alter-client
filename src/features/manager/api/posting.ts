import axiosInstance from '@/shared/lib/axiosInstance'
import { unwrapCursorPage, type CursorPage } from '@/shared/lib/cursorPage'
import type {
  PostingDto,
  PostingListApiResponse,
  ManagedPostingsQueryParams,
} from '@/features/manager/home/types/posting'

export async function fetchManagedPostings(
  params: ManagedPostingsQueryParams
): Promise<CursorPage<PostingDto>> {
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
  return unwrapCursorPage(response.data)
}
