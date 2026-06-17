import type { CommonApiResponse } from '@/shared/types/common'

export interface WorkspaceRequestStatusDto {
  value: string
  description: string
}

/** 신청 상태 — PENDING(검토 중) → ACTIVATED | REVOKED | CANCELLED */
export type WorkspaceRequestStatusValue =
  | 'PENDING'
  | 'ACTIVATED'
  | 'REVOKED'
  | 'CANCELLED'

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
  /** 대표자 성명 */
  ownerName: string
  businessType: string
  contact: string
  status: WorkspaceRequestStatusDto
  fullAddress: string
  latitude: number
  longitude: number
  /** 서버가 presigned URL로 변환해 줌 → 그대로 열기만 함 */
  workspaceCertFileUrl: string
  workspaceOwnIdentityFileUrl: string
  /** 위임장은 선택 — 미첨부 시 null */
  workspaceWarrantFileUrl: string | null
  createdAt: string
  updatedAt: string
}

export type WorkspaceRequestDetailApiResponse =
  CommonApiResponse<WorkspaceRequestDetailDto>

/** POST `/{scope}/workspace-requests` JSON 본문 */
export type WorkspaceRegistrationCreateBody = {
  bizName: string
  /** 대표자 성명 (신규·필수) */
  ownerName: string
  brn: string
  address: string
  province: string
  district: string
  town: string
  type: string
  contact: string
  workspaceCertFileId: string
  workspaceOwnIdentityFileId: string
  /** 위임장 — 선택/nullable */
  workspaceWarrantFileId: string | null
} & Partial<{ latitude: number; longitude: number }>

export interface WorkspaceRequestCommentFileDto {
  fileId: string
  url: string
}

export type WorkspaceRequestCommentOwner = 'USER' | 'ADMIN'

/** 신청 1건에 매달리는 단일 스레드 댓글 (관리자 첫 댓글 = 반려 사유) */
export interface WorkspaceRequestCommentDto {
  id: number
  userId: number
  commentOwner: WorkspaceRequestCommentOwner
  comment: string
  files: WorkspaceRequestCommentFileDto[]
  createdAt: string
}

export type WorkspaceRequestCommentsApiResponse = CommonApiResponse<
  WorkspaceRequestCommentDto[]
>

/** POST 댓글 본문 — comment ≤ 255자, fileIds 선택 */
export interface CreateWorkspaceRequestCommentBody {
  comment: string
  fileIds?: string[]
}
