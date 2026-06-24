import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  UpdateWorkspaceImagesRequest,
  WorkspaceImagesApiResponse,
} from '@/features/manager/workspace-image/types/workspaceImage'

/** 매니저 - 업장 대표 이미지 목록 조회 */
export async function fetchWorkspaceImages(
  workspaceId: number
): Promise<WorkspaceImagesApiResponse> {
  const response = await axiosInstance.get<WorkspaceImagesApiResponse>(
    `/manager/workspaces/${workspaceId}/images`
  )
  return response.data
}

/** 매니저 - 업장 대표 이미지 수정 (전체 교체) */
export async function updateWorkspaceImages(
  workspaceId: number,
  body: UpdateWorkspaceImagesRequest
): Promise<void> {
  await axiosInstance.put(`/manager/workspaces/${workspaceId}/images`, body)
}
