import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  ApplyPostingRequest,
  FavoritePostingItem,
  FavoritePostingListResponse,
  PostingDetailResponse,
  PostingFilterOptions,
  PostingListResponse,
} from '@/features/job-lookup-map/types/posting'

import type { PostingsListFilters } from '@/features/job-lookup-map/lib/postingFilters'

export type FetchPostingsParams = {
  pageSize: number
  cursor?: string
  searchKeyword?: string
} & PostingsListFilters

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

function normalizePostingListResponse(value: unknown): PostingListResponse {
  const payload = isCommonApiEnvelope(value) ? value.data : value
  if (payload === null || typeof payload !== 'object') {
    throw new Error('공고 목록을 불러오지 못했습니다.')
  }

  const record = payload as Record<string, unknown>
  const data = Array.isArray(record.data)
    ? (record.data as PostingListResponse['data'])
    : []
  const pageRaw = record.page

  if (pageRaw !== null && typeof pageRaw === 'object') {
    const page = pageRaw as Record<string, unknown>
    const cursor = page.cursor
    return {
      data,
      page: {
        cursor:
          typeof cursor === 'string'
            ? cursor
            : cursor == null
              ? null
              : String(cursor),
        pageSize:
          typeof page.pageSize === 'number' ? page.pageSize : data.length,
        totalCount:
          typeof page.totalCount === 'number' ? page.totalCount : data.length,
      },
    }
  }

  return {
    data,
    page: {
      cursor: null,
      pageSize: data.length,
      totalCount: data.length,
    },
  }
}

function unwrapPostingListBody(body: unknown): PostingListResponse {
  return normalizePostingListResponse(body)
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
  const {
    pageSize,
    cursor,
    searchKeyword,
    province,
    district,
    town,
    minPayAmount,
    maxPayAmount,
    payAmountSort,
  } = params

  const response = await axiosInstance.get<unknown>('/app/postings', {
    params: {
      pageSize,
      ...(cursor !== undefined && cursor !== '' && { cursor }),
      ...(searchKeyword?.trim() && {
        searchKeyword: searchKeyword.trim(),
      }),
      ...(province && { province }),
      ...(district && { district }),
      ...(town && { town }),
      ...(minPayAmount != null && { minPayAmount }),
      ...(maxPayAmount != null && { maxPayAmount }),
      ...(payAmountSort != null && { payAmountSort }),
    },
  })
  return unwrapPostingListBody(response.data)
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

function normalizeFavoritePostingListResponse(
  value: unknown
): FavoritePostingListResponse {
  const payload = isCommonApiEnvelope(value) ? value.data : value
  if (payload === null || typeof payload !== 'object') {
    throw new Error('스크랩 목록을 불러오지 못했습니다.')
  }

  const record = payload as Record<string, unknown>
  const data = Array.isArray(record.data)
    ? (record.data as FavoritePostingItem[])
    : []
  const pageRaw = record.page

  if (pageRaw !== null && typeof pageRaw === 'object') {
    const page = pageRaw as Record<string, unknown>
    const cursor = page.cursor
    return {
      data,
      page: {
        cursor:
          typeof cursor === 'string'
            ? cursor
            : cursor == null
              ? null
              : String(cursor),
        pageSize:
          typeof page.pageSize === 'number' ? page.pageSize : data.length,
        totalCount:
          typeof page.totalCount === 'number' ? page.totalCount : data.length,
      },
    }
  }

  return {
    data,
    page: {
      cursor: null,
      pageSize: data.length,
      totalCount: data.length,
    },
  }
}

/** GET /app/users/me/postings/favorites — 사용자 공고 스크랩 목록 조회 */
export async function fetchFavoritePostings(params: {
  pageSize: number
  cursor?: string
}): Promise<FavoritePostingListResponse> {
  const { pageSize, cursor } = params

  const response = await axiosInstance.get<unknown>(
    '/app/users/me/postings/favorites',
    {
      params: {
        pageSize,
        ...(cursor !== undefined && cursor !== '' && { cursor }),
      },
    }
  )
  return normalizeFavoritePostingListResponse(response.data)
}

/** POST /app/users/me/postings/favorites/{postingId} — 사용자 공고 스크랩 등록 */
export async function addFavoritePosting(postingId: number): Promise<void> {
  await axiosInstance.post<CommonApiResponse<Record<string, never>>>(
    `/app/users/me/postings/favorites/${postingId}`
  )
}

/** GET /app/postings/filter-options — 공고 목록 필터 옵션 조회 */
export async function fetchPostingFilterOptions(): Promise<PostingFilterOptions> {
  const response = await axiosInstance.get<
    CommonApiResponse<PostingFilterOptions>
  >('/app/postings/filter-options')
  return response.data.data
}
