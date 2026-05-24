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
    STORE_REGISTER: '/manager/store-register',
    SUBSTITUTE_REQUEST: '/manager/substitute-request',
    WORKER_INVITE: '/manager/worker-invite',
    SOCIAL: '/manager/social',
    SOCIAL_CHAT: '/manager/social/chat',
  },
  MY: {
    ROOT: '/my',
    PROFILE: '/my/profile',
    PROFILE_NICKNAME: '/my/profile/nickname',
    PROFILE_PASSWORD: '/my/profile/password',
    PROFILE_EMAIL: '/my/profile/email',
    PROFILE_SOCIAL: '/my/profile/social',
    WITHDRAW: '/my/withdraw',
  },
} as const

export function managerWorkerSchedulePath(
  workspaceId: number,
  workerId: number
) {
  return `/manager/workspaces/${workspaceId}/workers/${workerId}/schedule`
}
