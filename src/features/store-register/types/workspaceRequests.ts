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

/** 업장 등록 신청 폼에서 고를 수 있는 업종 — '기타'가 목록 마지막 */
export interface BusinessTypeDto {
  id: number
  name: string
  /** true면 업종 상세 입력이 필수 (예: 기타) */
  requiresDetail: boolean
  /** 업종 설명 — 선택 도움말로 노출 */
  description: string | null
}

export type BusinessTypesApiResponse = CommonApiResponse<BusinessTypeDto[]>

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
/** 대표 이미지 — 배열 순서와 별개로 sortOrder 0이 메인 */
export interface WorkspaceRepresentativeImageBody {
  fileId: string
  sortOrder: number
}

export type WorkspaceRegistrationCreateBody = {
  bizName: string
  brn: string
  address: string
  province: string
  district: string
  town: string
  /** 업종 — 서버 business_type id (필수) */
  businessTypeId: number
  /** 업종 상세 — 선택/nullable (예: 떡볶이 전문점) */
  businessTypeDetail: string | null
  contact: string
  workspaceCertFileId: string
  workspaceOwnIdentityFileId: string
  /** 위임장 — 선택/nullable */
  workspaceWarrantFileId: string | null
  /** 대표 이미지 — 선택, 없으면 빈 배열 */
  representativeImages: WorkspaceRepresentativeImageBody[]
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
