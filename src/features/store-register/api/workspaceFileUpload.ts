import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'

/**
 * 업로드 후 반환되는 파일 ID (UUID). 엔드포인트가 다르면 Swagger와 맞추거나
 * 환경 변수 `VITE_APP_FILE_UPLOAD_PATH`로 교체할 수 있습니다.
 */
export const APP_FILE_UPLOAD_PATH =
  (import.meta.env.VITE_APP_FILE_UPLOAD_PATH as string | undefined)?.trim() ||
  '/app/files'

function extractUploadedFileId(data: unknown): string {
  if (typeof data !== 'object' || data === null) {
    throw new Error('파일 업로드 응답이 올바르지 않습니다.')
  }
  const envelope = data as { data?: unknown }
  const inner = envelope.data
  if (typeof inner === 'object' && inner !== null) {
    const o = inner as Record<string, unknown>
    if (typeof o.id === 'string' && o.id.length > 0) return o.id
    if (typeof o.fileId === 'string' && o.fileId.length > 0) return o.fileId
  }
  throw new Error('파일 업로드 응답에 파일 ID가 없습니다.')
}

export async function uploadWorkspaceRegistrationFile(
  file: File
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.post<
    CommonApiResponse<{ id?: string; fileId?: string } | unknown>
  >(APP_FILE_UPLOAD_PATH, formData)

  return extractUploadedFileId(response.data)
}
