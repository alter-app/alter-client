/** 사업자등록증명원 등 업장 증빙 첨부에 사용할 MIME 타입 검사 */

export const CERTIFICATE_ACCEPT_ATTR =
  'image/jpeg,image/png,image/heic,image/webp,.pdf,application/pdf'

const DEFAULT_MAX_BYTES = 15 * 1024 * 1024

export function validateCertificateFile(
  file: File,
  options?: { maxBytes?: number }
): string | null {
  const maxBytes = options?.maxBytes ?? DEFAULT_MAX_BYTES
  const isImage = file.type.startsWith('image/')
  const isPdf = file.type === 'application/pdf'

  if (!(isImage || isPdf)) {
    return 'JPEG, PNG, WEBP 이미지 또는 PDF만 업로드할 수 있어요.'
  }

  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024))
    return `파일 크기는 ${mb}MB 이하여야 해요.`
  }

  return null
}

export function isPdfCertificateFile(file: File): boolean {
  return file.type === 'application/pdf'
}
