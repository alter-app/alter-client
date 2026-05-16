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
export interface Page {
  cursor: string
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
}

export interface ApplyPostingRequest {
  postingScheduleId: number
  description: string
}
