import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  ApplyPostingRequest,
  PostingListResponse,
  PostingDetailResponse,
} from '@/features/job-lookup-map/types/posting'

export type FetchPostingsParams = {
  pageSize: number
  cursor?: string
}

function isCommonApiEnvelope(
  value: unknown
): value is CommonApiResponse<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'timestamp' in value &&
    'data' in value
  )
}

function isPostingDetailResponse(
  value: unknown
): value is PostingDetailResponse {
  if (value === null || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  const workspace = record.workspace
  return (
    typeof record.id === 'number' &&
    typeof record.title === 'string' &&
    typeof record.description === 'string' &&
    typeof record.payAmount === 'number' &&
    typeof record.paymentType === 'string' &&
    typeof record.createdAt === 'string' &&
    typeof record.scrapped === 'boolean' &&
    Array.isArray(record.keywords) &&
    Array.isArray(record.schedules) &&
    workspace !== null &&
    typeof workspace === 'object' &&
    typeof (workspace as { id?: unknown }).id === 'number'
  )
}

function unwrapPostingDetailBody(body: unknown): PostingDetailResponse {
  if (isCommonApiEnvelope(body)) {
    if (!isPostingDetailResponse(body.data)) {
      throw new Error('공고 상세 응답 형식이 올바르지 않습니다.')
    }
    return body.data
  }

  if (isPostingDetailResponse(body)) {
    return body
  }

  throw new Error('공고 상세를 불러오지 못했습니다.')
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
  const response = await axiosInstance.get<unknown>(
    `/app/postings/${postingId}`
  )
  return unwrapPostingDetailBody(response.data)
}

/** POST /app/postings/apply/{postingId} — 공고 지원 */
export async function applyPosting(
  postingId: number,
  body: ApplyPostingRequest
): Promise<void> {
  await axiosInstance.post<CommonApiResponse<Record<string, never>>>(
    `/app/postings/apply/${postingId}`,
    body
  )
}
