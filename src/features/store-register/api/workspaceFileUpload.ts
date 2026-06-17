import {
  uploadAppFile,
  type AppFileBucketType,
  type AppFileUploadTargetType,
} from '@/shared/api/appFileUpload'

export { uploadAppFile }
export type { AppFileBucketType, AppFileUploadTargetType }

/** 증빙 서류는 비공개 버킷 권장(백엔드 요구 시 PUBLIC 로 바꿀 수 있음) */
export const WORKSPACE_REGISTRATION_BUCKET: AppFileBucketType = 'PRIVATE'

export type WorkspaceRegistrationAttachmentKind =
  | 'CERTIFICATE'
  | 'OWN_IDENTITY'
  | 'WARRANT'

const KIND_TO_TARGET: Record<
  WorkspaceRegistrationAttachmentKind,
  AppFileUploadTargetType
> = {
  CERTIFICATE: 'WORKSPACE_CERTIFICATE',
  OWN_IDENTITY: 'WORKSPACE_OWN_IDENTITY',
  WARRANT: 'WORKSPACE_WARRANT',
}

/** 업장 등록 신청용 파일 업로드 (targetType·bucket 고정 조합). */
export async function uploadWorkspaceRegistrationFile(
  file: File,
  kind: WorkspaceRegistrationAttachmentKind,
  scope?: 'MANAGER' | 'USER' | null
): Promise<string> {
  return uploadAppFile({
    file,
    targetType: KIND_TO_TARGET[kind],
    bucketType: WORKSPACE_REGISTRATION_BUCKET,
    scope,
  })
}

/** 신청 댓글 첨부 파일 업로드 (targetType=WORKSPACE_REQUEST_COMMENT). */
export async function uploadWorkspaceRequestCommentFile(
  file: File,
  scope?: 'MANAGER' | 'USER' | null
): Promise<string> {
  return uploadAppFile({
    file,
    targetType: 'WORKSPACE_REQUEST_COMMENT',
    bucketType: WORKSPACE_REGISTRATION_BUCKET,
    scope,
  })
}
