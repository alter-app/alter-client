import { cn } from '@/shared/lib/utils'
import { Toggle } from '@/shared/ui/common/Toggle'

interface Props {
  agreed: boolean
  adAgreed: boolean
  notificationConsent: boolean
  nightNotificationConsent: boolean
  onAgreeChange: (checked: boolean) => void
  onAdAgreeChange: (checked: boolean) => void
  onNotificationConsentChange: (checked: boolean) => void
  onNightNotificationConsentChange: (checked: boolean) => void
}

const checkboxClassName = cn(
  'appearance-none h-[18px] w-[18px] flex-shrink-0 rounded-[4px] border border-line-2 bg-white',
  'mt-[1px] inline-block cursor-pointer align-middle transition-all duration-200',
  'checked:border-main checked:bg-main hover:border-main',
  'sm:h-4 sm:w-4 xs:h-[14px] xs:w-[14px]'
)

const labelClassName = cn(
  'flex items-start gap-2 font-pretendard font-regular text-[13px] leading-[19px] text-text-70',
  'sm:text-[12px] sm:leading-[18px] xs:text-[11px] xs:leading-[17px]'
)

/**
 * 약관·알림 동의
 * - (필수) 이용약관 및 개인정보 보호정책
 * - (선택) 광고성 정보 수신
 * - (선택) 알림 수신 / 야간 알림
 */
export function SignupTerms({
  agreed,
  adAgreed,
  notificationConsent,
  nightNotificationConsent,
  onAgreeChange,
  onAdAgreeChange,
  onNotificationConsentChange,
  onNightNotificationConsentChange,
}: Props) {
  return (
    <div
      className={cn('flex w-full flex-col gap-3', 'sm:gap-[10px] xs:gap-2.5')}
    >
      <label className={labelClassName}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => onAgreeChange(e.target.checked)}
          className={checkboxClassName}
        />
        <span>
          <span className="text-error mr-1">(필수)</span>
          <span className="font-medium text-text-100">이용약관</span>과{' '}
          <span className="font-medium text-text-100">개인정보 보호정책</span>에
          동의합니다.
        </span>
      </label>

      <label className={labelClassName}>
        <input
          type="checkbox"
          checked={adAgreed}
          onChange={e => onAdAgreeChange(e.target.checked)}
          className={checkboxClassName}
        />
        <span>(선택) 이메일 및 SMS 광고성 정보 수신에 동의합니다.</span>
      </label>

      <div className="mt-1 flex w-full flex-col gap-4 border-t border-line-1 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-pretendard font-regular text-[13px] leading-[19px] text-text-100 sm:text-[12px] sm:leading-[18px]">
              알림 수신 동의
            </span>
            <span className="font-pretendard font-regular text-[12px] leading-[18px] text-text-70 sm:text-[11px]">
              대타·평판 등 서비스 알림을 받습니다.
            </span>
          </div>
          <Toggle
            checked={notificationConsent}
            onChange={onNotificationConsentChange}
            ariaLabel="알림 수신 동의"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-pretendard font-regular text-[13px] leading-[19px] text-text-100 sm:text-[12px] sm:leading-[18px]">
              야간 알림 동의
            </span>
            <span className="font-pretendard font-regular text-[12px] leading-[18px] text-text-70 sm:text-[11px]">
              21:00 ~ 08:00
            </span>
          </div>
          <Toggle
            checked={nightNotificationConsent}
            onChange={onNightNotificationConsentChange}
            disabled={!notificationConsent}
            ariaLabel="야간 알림 동의"
          />
        </div>
      </div>
    </div>
  )
}
