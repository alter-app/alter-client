/**
 * 업장 등록 신청 플로우 전용 라인 아이콘 — viewBox 24, stroke 1.5px(currentColor).
 * 색상은 부모의 text-* 클래스로 제어한다.
 */
import type { ReactNode } from 'react'

type IconProps = {
  width?: number
  height?: number
  className?: string
}

function Svg({
  width = 24,
  height = 24,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

/** 업로드(트레이로 향하는 화살표) */
export function UploadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 16V4M12 4l-4 4M12 4l4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 16v3a1 1 0 001 1h12a1 1 0 001-1v-3" strokeLinecap="round" />
    </Svg>
  )
}

/** 문서 */
export function FileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" strokeLinejoin="round" />
    </Svg>
  )
}

/** 신분증 */
export function IdCardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="8.5" cy="12" r="2" />
      <path d="M14 10.5h4M14 13.5h4" strokeLinecap="round" />
    </Svg>
  )
}

/** 전송(종이비행기) */
export function SendIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/** 클립(파일 첨부) */
export function PaperclipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M20.5 11.5l-8 8a4.5 4.5 0 01-6.4-6.4l8.5-8.5a3 3 0 014.2 4.2l-8.5 8.5a1.5 1.5 0 01-2.1-2.1l7.8-7.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/** 체크 표시가 든 원(승인·완료) */
export function CheckCircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path
        d="M8.5 12l2.2 2.2L15.5 9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/** 시계(검토 중·소요 안내) */
export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l2.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

/** 경고 삼각형(반려 사유) */
export function WarningTriangleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4l9 16H3l9-16z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" strokeLinecap="round" />
    </Svg>
  )
}

/** X가 든 원(취소) */
export function XCircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" strokeLinecap="round" />
    </Svg>
  )
}

/** 느낌표가 든 원(오류·검증) */
export function AlertCircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16h.01" strokeLinecap="round" />
    </Svg>
  )
}

/** 새로고침(다시 시도) */
export function RefreshIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M20 12a8 8 0 11-2.3-5.6M20 4v4h-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/** 문서 + 플러스(빈 신청 내역) */
export function DocPlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" strokeLinejoin="round" />
      <path d="M12 11v6M9 14h6" strokeLinecap="round" />
    </Svg>
  )
}

/** 말풍선(재심사 문의 안내) */
export function ChatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 10h8M8 14h5" strokeLinecap="round" />
      <path
        d="M21 12a9 9 0 11-3.5-7.1L21 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/** 닫기(파일 삭제) */
export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </Svg>
  )
}

/** 더하기(새 신청) — 굵은 1.8 */
export function PlusIcon({ width = 20, height = 20, className }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
