import type { CommonApiResponse } from '@/shared/types/common'

export interface WorkspaceRequestStatusDto {
  value: string
  description: string
}

export interface WorkspaceRequestListItemDto {
  id: number
  businessName: string
  fullAddress: string
  createdAt: string
  status: WorkspaceRequestStatusDto
}

export type WorkspaceRequestsListApiResponse = CommonApiResponse<
  WorkspaceRequestListItemDto[]
>

export interface WorkspaceRequestDetailDto {
  id: number
  businessRegistrationNo: string
  businessName: string
  businessType: string
  contact: string
  status: WorkspaceRequestStatusDto
  fullAddress: string
  latitude: number
  longitude: number
  workspaceCertFileUrl: string
  workspaceOwnIdentityFileUrl: string
  workspaceWarrantFileUrl: string
  createdAt: string
  updatedAt: string
}

export type WorkspaceRequestDetailApiResponse =
  CommonApiResponse<WorkspaceRequestDetailDto>

/** POST `/app/workspace-requests` JSON 본문 (위·경도는 백엔드 요건에 따라 생략 가능) */
export type WorkspaceRegistrationCreateBody = {
  bizName: string
  brn: string
  address: string
  province: string
  district: string
  town: string
  type: string
  contact: string
  workspaceCertFileId: string
  workspaceOwnIdentityFileId: string
  workspaceWarrantFileId: string
} & Partial<{ latitude: number; longitude: number }>
