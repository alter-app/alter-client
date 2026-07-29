export interface PostingListResponse {
  page: Page
  data: Posting[]
}

export interface PostingDetailResponse {
  id: number
  workspace: Workspace
  title: string
  description: string
  payAmount: number
  paymentType: string
  createdAt: string
  keywords: Keyword[]
  schedules: Schedule[]
  scrapped: boolean
}

export interface AddressItem {
  code: string
  name: string
}

export interface AddressesResponse {
  addresses: AddressItem[]
}

export interface PostingSortOption {
  value: string
  description: string
}

export interface Page {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export interface Posting {
  id: number
  title: string
  payAmount: number
  paymentType: string
  createdAt: string
  keywords: Keyword[]
  schedules: Schedule[]
  workspace: Workspace
  scrapped: boolean
}

export interface Keyword {
  id: number
  name: string
}

export interface Schedule {
  id: number
  workingDays: string[]
  startTime: string
  endTime: string
  positionsNeeded: number
  positionsAvailable: number
  position: string
}

export interface Workspace {
  businessName: string
  name: string
  id: number
  latitude: number
  longitude: number
  fullAddress: string
  town: string
}

export interface ApplyPostingRequest {
  postingScheduleId: number
  description: string
}

/** `GET /app/users/me/postings/favorites` 응답의 공고 요약 */
export interface FavoritePostingSummary {
  id: number
  businessName: string
  title: string
  payAmount: number
  paymentType: string
}

/** 스크랩(즐겨찾기) 한 건 */
export interface FavoritePostingItem {
  id: number
  posting: FavoritePostingSummary
  createdAt: string
}

export interface FavoritePostingListResponse {
  page: Page
  data: FavoritePostingItem[]
}
