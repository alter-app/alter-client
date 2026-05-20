export interface NotificationDto {
  id: number
  title: string
  body: string
  createdAt: string
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
}
