export interface PostingListResponse {
  page: Page
  data: Posting[]
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
  id: number
  businessName: string
  latitude: number
  longitude: number
}
