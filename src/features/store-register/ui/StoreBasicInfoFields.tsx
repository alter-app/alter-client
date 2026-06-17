import type { ReactNode } from 'react'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AlertCircleIcon } from '@/features/store-register/ui/icons'

type Props = {
  bizName: string
  ownerName: string
  brn: string
  province: string
  district: string
  town: string
  address: string
  type: string
  contact: string
  onBizNameChange: (v: string) => void
  onOwnerNameChange: (v: string) => void
  onBrnChange: (v: string) => void
  onProvinceChange: (v: string) => void
  onDistrictChange: (v: string) => void
  onTownChange: (v: string) => void
  onAddressChange: (v: string) => void
  onTypeChange: (v: string) => void
  onContactChange: (v: string) => void
}

/** 라벨 + 입력 한 묶음 */
function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="typography-body02-semibold text-text-100"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="typography-body03-regular text-text-70">{hint}</p>
      ) : null}
    </div>
  )
}

export function StoreBasicInfoFields({
  bizName,
  ownerName,
  brn,
  province,
  district,
  town,
  address,
  type,
  contact,
  onBizNameChange,
  onOwnerNameChange,
  onBrnChange,
  onProvinceChange,
  onDistrictChange,
  onTownChange,
  onAddressChange,
  onTypeChange,
  onContactChange,
}: Props) {
  const brnDigits = brn.replace(/\D/g, '').length
  const brnError = brnDigits > 0 && brnDigits < 10

  return (
    <div className="flex w-full flex-col gap-[18px]">
      <Field label="업장명" htmlFor="bizName">
        <AuthInput
          id="bizName"
          type="text"
          placeholder="예) 알터 강남점"
          value={bizName}
          onChange={e => onBizNameChange(e.target.value)}
          autoComplete="organization"
        />
      </Field>

      <Field
        label="대표자 성명"
        hint="신분증 성명과 동일하게 입력해 주세요."
        htmlFor="ownerName"
      >
        <AuthInput
          id="ownerName"
          type="text"
          placeholder="대표자 성명"
          value={ownerName}
          onChange={e => onOwnerNameChange(e.target.value)}
          autoComplete="name"
        />
      </Field>

      <Field label="사업자등록번호" htmlFor="brn">
        <AuthInput
          id="brn"
          type="text"
          placeholder="000-00-00000"
          value={brn}
          onChange={e => onBrnChange(e.target.value)}
          inputMode="numeric"
          maxLength={12}
        />
        {brnError ? (
          <p className="flex items-center gap-1 typography-body03-regular text-error">
            <AlertCircleIcon className="size-3.5 shrink-0" />
            10자리 사업자등록번호를 정확히 입력해 주세요.
          </p>
        ) : null}
      </Field>

      <Field label="업종" htmlFor="type">
        <AuthInput
          id="type"
          type="text"
          placeholder="예) 카페 · 음료"
          value={type}
          onChange={e => onTypeChange(e.target.value)}
        />
      </Field>

      <Field label="업장 연락처" htmlFor="contact">
        <AuthInput
          id="contact"
          type="tel"
          placeholder="숫자만 입력 (자동 하이픈)"
          value={contact}
          onChange={e => onContactChange(e.target.value)}
          inputMode="numeric"
          maxLength={13}
          autoComplete="tel"
        />
      </Field>

      <Field label="주소">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <AuthInput
              type="text"
              placeholder="시/도"
              value={province}
              onChange={e => onProvinceChange(e.target.value)}
            />
          </div>
          <div className="w-[84px]">
            <AuthInput
              type="text"
              placeholder="구"
              value={district}
              onChange={e => onDistrictChange(e.target.value)}
            />
          </div>
          <div className="w-[84px]">
            <AuthInput
              type="text"
              placeholder="동"
              value={town}
              onChange={e => onTownChange(e.target.value)}
            />
          </div>
        </div>
        <AuthInput
          type="text"
          placeholder="상세 주소"
          value={address}
          onChange={e => onAddressChange(e.target.value)}
          autoComplete="street-address"
        />
      </Field>
    </div>
  )
}
