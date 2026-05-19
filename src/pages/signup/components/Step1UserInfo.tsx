import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { PhoneVerification } from './PhoneVerification'
import type { usePhoneVerification } from '../hooks/usePhoneVerification'

interface Props {
  name: string
  gender: '남' | '여' | ''
  birth: string
  birthError: string
  onNameChange: (value: string) => void
  onGenderChange: (value: '남' | '여') => void
  onBirthChange: (value: string) => void
  phoneVerification: ReturnType<typeof usePhoneVerification>
  isValid: boolean
  onNext: () => void
}

/**
 * 회원가입 1단계 — 기본 정보
 * 이름 · 성별 · 전화번호(SMS 인증) · 생년월일
 */
export function Step1UserInfo({
  name,
  gender,
  birth,
  birthError,
  onNameChange,
  onGenderChange,
  onBirthChange,
  phoneVerification,
  isValid,
  onNext,
}: Props) {
  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      {/* 헤더 */}
      <div className="w-full mb-8 sm:mb-7 xs:mb-6">
        <h1 className="font-pretendard font-semibold text-[24px] leading-8 text-text-100 text-left mb-4 sm:text-[22px] sm:leading-[30px] xs:text-[20px] xs:leading-[28px]">
          회원님의 정보를 알려주세요!
        </h1>
        <p className="font-pretendard font-regular text-[14px] leading-5 text-text-70 text-left sm:text-[13px] sm:leading-[19px] xs:text-[12px] xs:leading-[18px]">
          알터가 회원님이 동의해 주신 내용을 바탕으로 작성했어요.
          <br />
          틀리거나 빈 정보가 있다면 알려주시겠어요?
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full mb-6 sm:gap-[14px] sm:mb-5 xs:gap-3 xs:mb-4">
        {/* 이름 + 성별 */}
        <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
          <div className="flex-1">
            <AuthInput
              type="text"
              placeholder="이름"
              value={name}
              onChange={e => onNameChange(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <div className="flex border border-line-2 rounded-xl h-14 overflow-hidden sm:h-[52px] xs:h-12">
              <button
                type="button"
                className={`px-4 font-pretendard text-4 ${gender === '남' ? 'bg-main text-white font-semibold' : 'bg-white text-text-70'}`}
                onClick={() => onGenderChange('남')}
              >
                남
              </button>
              <button
                type="button"
                className={`px-4 font-pretendard text-4 border-l border-line-2 ${gender === '여' ? 'bg-main text-white font-semibold' : 'bg-white text-text-70'}`}
                onClick={() => onGenderChange('여')}
              >
                여
              </button>
            </div>
          </div>
        </div>

        {/* 전화번호 SMS 인증 */}
        <PhoneVerification {...phoneVerification} />

        {/* 생년월일 */}
        <AuthInput
          type="text"
          placeholder="생년월일 8자리"
          value={birth}
          maxLength={8}
          onChange={e => onBirthChange(e.target.value)}
        />
      </div>

      <p className="font-pretendard font-regular text-[12px] leading-[18px] text-text-70 text-center w-full mb-6 sm:text-[11px] sm:mb-5 xs:text-[10px] xs:mb-4">
        만약 내용이 없다면 모든 내용을 기입해 주세요!
      </p>

      {birthError && (
        <p className="font-pretendard font-regular text-[12px] leading-[18px] text-error text-center w-full mb-4 sm:text-[11px] sm:mb-3 xs:text-[10px] xs:mb-3">
          {birthError}
        </p>
      )}

      <AuthButton disabled={!isValid} onClick={onNext}>
        완료
      </AuthButton>
    </div>
  )
}
