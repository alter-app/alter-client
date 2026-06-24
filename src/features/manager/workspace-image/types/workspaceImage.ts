import type { CommonApiResponse } from '@/shared/types/common'

/** GET /manager/workspaces/{workspaceId}/images 응답 아이템 */
export interface WorkspaceImageDto {
  fileId: string
  url: string
  sortOrder: number
}

export type WorkspaceImagesApiResponse = CommonApiResponse<WorkspaceImageDto[]>

/** PUT /manager/workspaces/{workspaceId}/images 요청 아이템 */
export interface UpdateWorkspaceImageItem {
  fileId: string
  sortOrder: number
}

export interface UpdateWorkspaceImagesRequest {
  images: UpdateWorkspaceImageItem[]
}
