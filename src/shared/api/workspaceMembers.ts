import axios from 'axios'
import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ApiError,
  CommonApiResponse,
  ErrorResponse,
} from '@/shared/types/common'

type PageInfo = {
  cursor: string | null
  pageSize: number
  totalCount: number
}

type PositionDto = {
  type: string
  description: string
  emoji: string
}

export type WorkspaceWorkerDto = {
  id: number
  user: {
    id: number
    name: string
  }
  position: PositionDto
  employedAt: string
  nextShiftDateTime: string
}

export type WorkspaceManagerDto = {
  id: number
  manager: {
    id: number
    name: string
  }
  position: PositionDto
}

export type WorkspaceWorkersResponse = CommonApiResponse<{
  page: PageInfo
  data: WorkspaceWorkerDto[]
}>

export type WorkspaceManagersResponse = CommonApiResponse<{
  page: PageInfo
  data: WorkspaceManagerDto[]
}>

export type WorkspaceMembersParams = {
  workspaceId: number
  cursor?: string
  pageSize?: number
}

export async function getWorkspaceWorkers(
  params: WorkspaceMembersParams
): Promise<WorkspaceWorkersResponse> {
  const { workspaceId, cursor, pageSize } = params

  try {
    const response = await axiosInstance.get<WorkspaceWorkersResponse>(
      `/app/users/me/workspaces/${workspaceId}/workers`,
      {
        params: {
          ...(cursor !== undefined && { cursor }),
          ...(pageSize !== undefined && { pageSize }),
        },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      const message =
        errorData.message ?? '근무자 목록 조회 중 오류가 발생했습니다.'
      const apiError = new Error(message) as ApiError & Error
      apiError.data = errorData
      throw apiError
    }

    throw new Error('근무자 목록 조회 중 오류가 발생했습니다.')
  }
}

export async function getWorkspaceManagers(
  params: WorkspaceMembersParams
): Promise<WorkspaceManagersResponse> {
  const { workspaceId, cursor, pageSize } = params

  try {
    const response = await axiosInstance.get<WorkspaceManagersResponse>(
      `/app/users/me/workspaces/${workspaceId}/managers`,
      {
        params: {
          ...(cursor !== undefined && { cursor }),
          ...(pageSize !== undefined && { pageSize }),
        },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      const message =
        errorData.message ?? '점주/매니저 목록 조회 중 오류가 발생했습니다.'
      const apiError = new Error(message) as ApiError & Error
      apiError.data = errorData
      throw apiError
    }

    throw new Error('점주/매니저 목록 조회 중 오류가 발생했습니다.')
  }
}
