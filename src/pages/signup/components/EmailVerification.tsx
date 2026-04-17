import { AuthInput } from '@/shared/ui/common/AuthInput'
import { VerifyActionButton } from './VerifyActionButton'
import type { useEmailVerification } from '../hooks/useEmailVerification'

type Props = ReturnType<typeof useEmailVerification>

/**
 * 이메일 인증 UI (선택 항목)
 * - 이메일 입력 + 인증 코드 발송 버튼
 * - 인증 코드 입력 + 확인 버튼 (발송 후 노출)
 * - 상태 메시지 (성공 초록 / 실패 빨강)
 */
export function EmailVerification({
  email,
  codeSent,
  code,
  setCode,
  verified,
  message,
  isSending,
  isVerifying,
  resendCooldown,
  handleEmailChange,
  sendCode,
  verifyCode,
}: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="font-pretendard font-regular text-[12px] leading-[18px] text-[#767676] sm:text-[11px] xs:text-[10px]">
        <span className="mr-1">(선택)</span>
        이메일 — 인증 후 알림 수신 및 비밀번호 찾기에 활용돼요.
      </p>

      {/* 이메일 입력 + 발송 버튼 */}
      <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
        <div className="flex-1">
          <AuthInput
            type="email"
            placeholder="이메일 (선택)"
            value={email}
            disabled={verified}
            onChange={e => handleEmailChange(e.target.value)}
            borderColor={
              verified
                ? '1px solid main'
                : message && !codeSent
                  ? '1px solid error'
                  : undefined
            }
          />
        </div>
        {!verified && (
          <VerifyActionButton
            onClick={sendCode}
            disabled={!email.trim() || isSending || resendCooldown > 0}
          >
            {isSending
              ? '발송 중...'
              : resendCooldown > 0
                ? `${resendCooldown}초 후 재발송`
                : codeSent
                  ? '재발송'
                  : '인증 코드 발송'}
          </VerifyActionButton>
        )}
      </div>

      {/* 인증 코드 입력 + 확인 버튼 */}
      {codeSent && !verified && (
        <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
          <div className="flex-1">
            <AuthInput
              type="text"
              placeholder="인증 코드 6자리"
              value={code}
              maxLength={6}
              onChange={e => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }}
            />
          </div>
          <VerifyActionButton
            onClick={verifyCode}
            disabled={code.length !== 6 || isVerifying}
          >
            {isVerifying ? '확인 중...' : '확인'}
          </VerifyActionButton>
        </div>
      )}

      {/* 상태 메시지 */}
      {message && (
        <p
          className="font-pretendard font-regular text-[12px] leading-[18px] text-left w-full sm:text-[11px] xs:text-[10px]"
          style={{ color: verified ? 'main' : 'error' }}
        >
          {message}
        </p>
      )}
    </div>
  )
}
