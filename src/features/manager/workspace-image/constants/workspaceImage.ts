/** 대표 이미지는 최대 5장까지 등록 가능 (백엔드 제약과 동일) */
export const MAX_WORKSPACE_IMAGE_COUNT = 5

/** 업로드 허용 형식 — JPG, PNG */
export const WORKSPACE_IMAGE_ACCEPT = 'image/jpeg,image/png'
export const WORKSPACE_IMAGE_ALLOWED_TYPES = ['image/jpeg', 'image/png']

/** 파일 최대 용량 — 20MB (백엔드 제약과 동일) */
export const WORKSPACE_IMAGE_MAX_BYTES = 20 * 1024 * 1024
