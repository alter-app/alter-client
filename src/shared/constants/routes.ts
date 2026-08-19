/**
 * 앱 라우트 단일 정의 — 경로 문자열 하드코딩·오타 방지 및 변경 시 추적 용이
 */
export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    FIND_PASSWORD: '/find-password',
  },
  OAUTH: {
    KAKAO_CALLBACK: '/oauth/kakao/callback',
  },
  USER: {
    HOME: '/user/home',
    SCHEDULE: '/user/schedule',
    JOB_LOOKUP_MAP: '/user/job-lookup-map',
    JOB_LOOKUP_MAP_DETAIL: '/user/job-lookup-map-detail/:postingId',
    JOB_LOOKUP_MAP_APPLY: '/user/job-lookup-map-apply/:postingId',
    WORKSPACE: '/user/workspace',
    WORKSPACE_JOIN: '/user/workspace/join',
    APPLIED_STORES: '/user/applied-stores',
    SUBSTITUTE_REQUEST: '/user/substitute-request',
    SUBSTITUTE_REQUEST_DETAIL_PATTERN: '/user/substitute-request/:requestId',
    WORKSPACE_MEMBERS_PATTERN: '/user/workspaces/:workspaceId/members',
    WORKSPACE_DETAIL_PATTERN: '/user/workspace/:workspaceId',
  },
  MANAGER: {
    HOME: '/manager/home',
    /** @deprecated 신규 화면은 WORKER_SCHEDULE_PATTERN + managerWorkerSchedulePath 사용 */
    WORKER_SCHEDULE: '/manager/worker-schedule',
    WORKER_SCHEDULE_PATTERN:
      '/manager/workspaces/:workspaceId/workers/:workerId/schedule',
    WORKSPACE_IMAGES_EDIT_PATTERN:
      '/manager/workspaces/:workspaceId/images/edit',
    STORE_REGISTER: '/manager/store-register',
    SUBSTITUTE_REQUEST: '/manager/substitute-request',
    WORKER_INVITE: '/manager/worker-invite',
    SOCIAL: '/manager/social',
    SOCIAL_CHAT: '/manager/social/chat',
    /** 구인구직 — 내 공고 목록 (사장님 알바찾기 탭 진입점) */
    POSTINGS: '/manager/postings',
    /** 공고 등록 */
    POSTING_NEW: '/manager/postings/new',
    /** 지원자 목록 — Docbar 탭 진입점(전체 지원자) */
    POSTING_APPLICATIONS: '/manager/postings/applications',
    /** 특정 공고의 지원자 목록 — 공고 상세에서 진입(Docbar 없음) */
    POSTING_APPLICATIONS_BY_POSTING_PATTERN:
      '/manager/postings/:postingId/applications',
    /** 지원자 상세·채용 결정 (파라미터) */
    POSTING_APPLICATION_DETAIL_PATTERN:
      '/manager/postings/applications/:applicationId',
    /** 공고 상세·마감 (파라미터) */
    POSTING_DETAIL_PATTERN: '/manager/postings/:postingId',
    /** 공고 수정 (파라미터) */
    POSTING_EDIT_PATTERN: '/manager/postings/:postingId/edit',
  },
  MY: {
    ROOT: '/my',
    PROFILE: '/my/profile',
    PROFILE_NICKNAME: '/my/profile/nickname',
    PROFILE_PASSWORD: '/my/profile/password',
    SCRAPPED_POSTINGS: '/my/profile/scrapped',
    PROFILE_EMAIL: '/my/profile/email',
    PROFILE_SOCIAL: '/my/profile/social',
    WITHDRAW: '/my/withdraw',
  },
  /** 업장 등록 신청(승급 신청) — USER·MANAGER 공용, MANAGER 전용 가드 없음 */
  STORE_REGISTER: {
    /** 신청 내역 목록 */
    REQUESTS: '/store-register/requests',
    /** 신청 상세 (파라미터) */
    REQUEST_DETAIL_PATTERN: '/store-register/requests/:requestId',
  },
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_SETTINGS: '/notifications/settings',
} as const

export function storeRegisterRequestDetailPath(requestId: number) {
  return `/store-register/requests/${requestId}`
}

export function managerWorkerSchedulePath(
  workspaceId: number,
  workerId: number
) {
  return `/manager/workspaces/${workspaceId}/workers/${workerId}/schedule`
}

export function managerWorkspaceImagesEditPath(workspaceId: number) {
  return `/manager/workspaces/${workspaceId}/images/edit`
}

export function managerPostingDetailPath(postingId: number) {
  return `/manager/postings/${postingId}`
}

export function managerPostingEditPath(postingId: number) {
  return `/manager/postings/${postingId}/edit`
}

export function managerPostingApplicationsPath(postingId?: number) {
  // 공고 지정 시 Docbar 없는 하위 경로로, 미지정 시 탭 진입점으로
  return postingId === undefined
    ? '/manager/postings/applications'
    : `/manager/postings/${postingId}/applications`
}

export function managerPostingApplicationDetailPath(applicationId: number) {
  return `/manager/postings/applications/${applicationId}`
}
