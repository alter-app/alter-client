import { cn } from '@/shared/lib/utils'

interface Props {
  agreed: boolean
  adAgreed: boolean
  onAgreeChange: (checked: boolean) => void
  onAdAgreeChange: (checked: boolean) => void
}

const checkboxClassName = cn(
  'appearance-none h-[18px] w-[18px] flex-shrink-0 rounded-[4px] border border-[#d9d9d9] bg-white',
  'mt-[1px] inline-block cursor-pointer align-middle transition-all duration-200',
  'checked:border-main checked:bg-main hover:border-main',
  'sm:h-4 sm:w-4 xs:h-[14px] xs:w-[14px]',
)

const labelClassName = cn(
  'flex items-start gap-2 font-pretendard font-regular text-[13px] leading-[19px] text-[#767676]',
  'sm:text-[12px] sm:leading-[18px] xs:text-[11px] xs:leading-[17px]',
)

/**
 * 약관 동의 체크박스 그룹
 * - (필수) 이용약관 및 개인정보 보호정책
 * - (선택) 광고성 정보 수신
 */
export function SignupTerms({
  agreed,
  adAgreed,
  onAgreeChange,
  onAdAgreeChange,
}: Props) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3',
        'sm:gap-[10px] xs:gap-2.5',
      )}
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
          <span className="font-medium text-[#111111]">이용약관</span>과{' '}
          <span className="font-medium text-[#111111]">개인정보 보호정책</span>
          에 동의합니다.
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
    </div>
  )
}
