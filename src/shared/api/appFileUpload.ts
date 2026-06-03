import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'

/** POST /app/files — query `targetType` (Swagger) */
export type AppFileUploadTargetType =
  | 'USER_PROFILE'
  | 'USER_CERTIFICATE'
  | 'POSTING'
  | 'WORKSPACE'
  | 'WORKSPACE_CERTIFICATE'
  | 'WORKSPACE_OWN_IDENTITY'
  | 'WORKSPACE_WARRANT'
  | 'WORKSPACE_REASON_COMMENT'
  | 'CHAT_MESSAGE'

export type AppFileBucketType = 'PUBLIC' | 'PRIVATE'

const APP_FILES_PATH = '/app/files'

function extractUploadedFileId(data: unknown): string {
  if (typeof data !== 'object' || data === null) {
    throw new Error('파일 업로드 응답이 올바르지 않습니다.')
  }
  const envelope = data as { data?: unknown }
  const inner = envelope.data
  if (typeof inner === 'object' && inner !== null) {
    const o = inner as Record<string, unknown>
    if (typeof o.fileId === 'string' && o.fileId.length > 0) return o.fileId
    if (typeof o.id === 'string' && o.id.length > 0) return o.id
  }
  throw new Error('파일 업로드 응답에 파일 ID가 없습니다.')
}

/**
 * POST /app/files
 * multipart 파트 이름 `file` + query targetType, bucketType
 * (Swagger 의 application/json 예시는 실제 업로드와 다를 수 있음)
 */
export async function uploadAppFile(options: {
  file: File
  targetType: AppFileUploadTargetType
  bucketType: AppFileBucketType
}): Promise<string> {
  const formData = new FormData()
  formData.append('file', options.file)

  const response = await axiosInstance.post<
    CommonApiResponse<{ fileId?: string; id?: string } | unknown>
  >(APP_FILES_PATH, formData, {
    params: {
      targetType: options.targetType,
      bucketType: options.bucketType,
    },
  })

  return extractUploadedFileId(response.data)
}
