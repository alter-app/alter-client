/**
 * 공고 지원서 상태 — 서버 enum.
 * 유저(내 지원 현황)와 매니저(지원자 관리) 양쪽에서 사용하는 크로스 롤 타입입니다.
 */
export type ApplicationApiStatus =
  | 'SUBMITTED'
  | 'SHORTLISTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'DELETED'
