import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  ApplyPostingRequest,
  FavoritePostingItem,
  FavoritePostingListResponse,
  PostingDetailResponse,
  AddressesResponse,
  AddressItem,
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

function normalizePageCursor(cursor: unknown): string | null {
  if (typeof cursor === 'string') {
    return cursor !== '' ? cursor : null
  }
  if (cursor == null) return null
  const asString = String(cursor)
  return asString !== '' ? asString : null
}

function parsePostingListItem(
  value: unknown
): PostingListResponse['data'][number] | null {
  if (value === null || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const workspaceRaw = record.workspace

  // 목록 렌더에 필수인 필드만 엄격 검사. 나머지는 기본값으로 보정.
  if (
    typeof record.id !== 'number' ||
    typeof record.title !== 'string' ||
    typeof record.payAmount !== 'number' ||
    workspaceRaw === null ||
    typeof workspaceRaw !== 'object'
  ) {
    return null
  }

  const workspace = workspaceRaw as Record<string, unknown>
  if (typeof workspace.id !== 'number') return null

  const businessName =
    typeof workspace.businessName === 'string'
      ? workspace.businessName
      : typeof workspace.name === 'string'
        ? workspace.name
        : ''

  return {
    id: record.id,
    title: record.title,
    payAmount: record.payAmount,
    paymentType:
      typeof record.paymentType === 'string' ? record.paymentType : 'HOURLY',
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : '',
    keywords: Array.isArray(record.keywords)
      ? (record.keywords as PostingListResponse['data'][number]['keywords'])
      : [],
    schedules: Array.isArray(record.schedules)
      ? (record.schedules as PostingListResponse['data'][number]['schedules'])
      : [],
    workspace: {
      id: workspace.id,
      businessName,
      name: typeof workspace.name === 'string' ? workspace.name : businessName,
      latitude: typeof workspace.latitude === 'number' ? workspace.latitude : 0,
      longitude:
        typeof workspace.longitude === 'number' ? workspace.longitude : 0,
      fullAddress:
        typeof workspace.fullAddress === 'string' ? workspace.fullAddress : '',
      town: typeof workspace.town === 'string' ? workspace.town : '',
    },
    scrapped: typeof record.scrapped === 'boolean' ? record.scrapped : false,
  }
}

function parseFavoritePostingItem(value: unknown): FavoritePostingItem | null {
  if (value === null || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const posting = record.posting
  if (posting === null || typeof posting !== 'object') return null
  const postingRecord = posting as Record<string, unknown>

  if (
    typeof record.id !== 'number' ||
    typeof postingRecord.id !== 'number' ||
    typeof postingRecord.title !== 'string' ||
    typeof postingRecord.payAmount !== 'number'
  ) {
    return null
  }

  return {
    id: record.id,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : '',
    posting: {
      id: postingRecord.id,
      businessName:
        typeof postingRecord.businessName === 'string'
          ? postingRecord.businessName
          : '',
      title: postingRecord.title,
      payAmount: postingRecord.payAmount,
      paymentType:
        typeof postingRecord.paymentType === 'string'
          ? postingRecord.paymentType
          : 'HOURLY',
    },
  }
}

function normalizePage(
  pageRaw: unknown,
  fallbackCount: number
): PostingListResponse['page'] {
  if (pageRaw === null || typeof pageRaw !== 'object') {
    return {
      cursor: null,
      pageSize: fallbackCount,
      totalCount: fallbackCount,
    }
  }

  const page = pageRaw as Record<string, unknown>
  return {
    cursor: normalizePageCursor(page.cursor),
    pageSize: typeof page.pageSize === 'number' ? page.pageSize : fallbackCount,
    totalCount:
      typeof page.totalCount === 'number' ? page.totalCount : fallbackCount,
  }
}

function normalizePostingListResponse(value: unknown): PostingListResponse {
  const payload = isCommonApiEnvelope(value) ? value.data : value
  if (payload === null || typeof payload !== 'object') {
    throw new Error('공고 목록을 불러오지 못했습니다.')
  }

  const record = payload as Record<string, unknown>
  if (!Array.isArray(record.data)) {
    throw new Error('공고 목록 응답 형식이 올바르지 않습니다.')
  }

  const data = record.data
    .map(parsePostingListItem)
    .filter((item): item is PostingListResponse['data'][number] => item != null)

  // 항목이 있는데 전부 파싱 실패하면 스키마 문제로 보고 에러 처리
  if (record.data.length > 0 && data.length === 0) {
    throw new Error('공고 목록 응답 형식이 올바르지 않습니다.')
  }

  return {
    data,
    page: normalizePage(record.page, data.length),
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
  if (!Array.isArray(record.data)) {
    throw new Error('스크랩 목록 응답 형식이 올바르지 않습니다.')
  }

  const data = record.data
    .map(parseFavoritePostingItem)
    .filter((item): item is FavoritePostingItem => item != null)

  if (record.data.length > 0 && data.length === 0) {
    throw new Error('스크랩 목록 응답 형식이 올바르지 않습니다.')
  }

  return {
    data,
    page: normalizePage(record.page, data.length),
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

/** DELETE /app/users/me/postings/favorites/{postingId} — 사용자 공고 스크랩 삭제 */
export async function removeFavoritePosting(postingId: number): Promise<void> {
  await axiosInstance.delete<CommonApiResponse<Record<string, never>>>(
    `/app/users/me/postings/favorites/${postingId}`
  )
}

/** GET /app/addresses — 단계별 행정구역 주소 조회 */
export async function fetchAddresses(code?: string): Promise<AddressItem[]> {
  const response = await axiosInstance.get<
    CommonApiResponse<AddressesResponse>
  >('/app/addresses', {
    params: code ? { code } : undefined,
  })

  const addresses = response.data.data?.addresses
  return Array.isArray(addresses) ? addresses : []
}
