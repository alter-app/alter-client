export interface NotificationDto {
  id: number
  type: {
    value: string
    description: string
  }
  title: string
  body: string
  createdAt: string
  read: boolean
}

export interface NotificationPage {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export interface NotificationListResponse {
  page: NotificationPage
  data: NotificationDto[]
}

export interface NotificationQueryParams {
  cursor?: string
  pageSize?: number
  type?: string
}
