import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

/**
 * 인증 관련 인라인 액션 버튼 (인증번호 발송 / 확인 / 중복 확인 등)
 * AuthButton(전체 너비)과 달리 입력 필드 옆에 붙는 고정 너비 버튼입니다.
 */
export function VerifyActionButton({ children, ...props }: Props) {
  return (
    <button
      type="button"
      className="
        min-w-[100px] h-14 border-none
        bg-main text-white text-[14px] font-pretendard font-medium
        rounded-xl cursor-pointer transition-all duration-200
        hover:brightness-[0.92] hover:-translate-y-px
        active:brightness-[0.85] active:translate-y-0
        disabled:bg-text-50 disabled:cursor-not-allowed disabled:transform-none
        sm:h-[52px] sm:text-[13px] sm:rounded-[10px] sm:min-w-[90px]
        xs:h-12 xs:text-[12px] xs:rounded-lg xs:min-w-[80px]
      "
      {...props}
    >
      {children}
    </button>
  )
}
