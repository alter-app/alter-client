import { AuthInput } from '@/shared/ui/common/AuthInput'
import { VerifyActionButton } from './VerifyActionButton'
type PhoneVerificationProps = {
  phone: string
  smsSent: boolean
  smsCode: string
  setSmsCode: (value: string) => void
  verified: boolean
  message: string
  isSending: boolean
  isVerifying: boolean
  resendCooldown: number
  handlePhoneChange: (value: string) => void
  sendSms: () => void | Promise<void>
  verifySms: () => void | Promise<void>
}

type Props = PhoneVerificationProps

/**
 * 전화번호 SMS 인증 UI
 * - 전화번호 입력 + 인증번호 발송 버튼
 * - 인증번호 입력 + 확인 버튼 (발송 후 노출)
 * - 상태 메시지 (성공 초록 / 실패 빨강)
 */
export function PhoneVerification({
  phone,
  smsSent,
  smsCode,
  setSmsCode,
  verified,
  message,
  isSending,
  isVerifying,
  resendCooldown,
  handlePhoneChange,
  sendSms,
  verifySms,
}: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 전화번호 입력 + 발송 버튼 */}
      <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
        <div className="flex-1">
          <AuthInput
            type="tel"
            maxLength={13}
            placeholder="전화번호"
            value={phone}
            disabled={verified}
            onChange={e => handlePhoneChange(e.target.value)}
            borderColor={
              verified
                ? '1px solid main'
                : message && !smsSent
                  ? '1px solid error'
                  : undefined
            }
          />
        </div>
        {!verified && (
          <VerifyActionButton
            onClick={sendSms}
            disabled={!phone.trim() || isSending || resendCooldown > 0}
          >
            {isSending
              ? '발송 중...'
              : resendCooldown > 0
                ? `${resendCooldown}초 후 재발송`
                : smsSent
                  ? '재발송'
                  : '인증번호 발송'}
          </VerifyActionButton>
        )}
      </div>

      {/* 인증번호 입력 + 확인 버튼 */}
      {smsSent && !verified && (
        <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
          <div className="flex-1">
            <AuthInput
              type="text"
              placeholder="인증번호 6자리"
              value={smsCode}
              maxLength={6}
              onChange={e => {
                setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }}
            />
          </div>
          <VerifyActionButton
            onClick={verifySms}
            disabled={smsCode.length !== 6 || isVerifying}
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
