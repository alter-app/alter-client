import type { ReactNode } from 'react'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { SelectDropdown } from '@/shared/ui/common/SelectDropdown'
import { AlertCircleIcon } from '@/features/store-register/ui/icons'
import type { BusinessTypeDto } from '@/features/store-register/types/workspaceRequests'

type Props = {
  bizName: string
  brn: string
  province: string
  district: string
  town: string
  address: string
  /** 선택 전에는 null */
  businessTypeId: number | null
  /** 업종 상세 — 선택한 업종이 requiresDetail 이면 필수 */
  businessTypeDetail: string
  /** 서버에서 받은 업종 목록 ('기타'가 마지막) */
  businessTypes: BusinessTypeDto[]
  isBusinessTypesLoading: boolean
  isBusinessTypesError: boolean
  onRetryBusinessTypes: () => void
  contact: string
  onBizNameChange: (v: string) => void
  onBrnChange: (v: string) => void
  onProvinceChange: (v: string) => void
  onDistrictChange: (v: string) => void
  onTownChange: (v: string) => void
  onAddressChange: (v: string) => void
  onBusinessTypeIdChange: (v: number) => void
  onBusinessTypeDetailChange: (v: string) => void
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
  brn,
  province,
  district,
  town,
  address,
  businessTypeId,
  businessTypeDetail,
  businessTypes,
  isBusinessTypesLoading,
  isBusinessTypesError,
  onRetryBusinessTypes,
  contact,
  onBizNameChange,
  onBrnChange,
  onProvinceChange,
  onDistrictChange,
  onTownChange,
  onAddressChange,
  onBusinessTypeIdChange,
  onBusinessTypeDetailChange,
  onContactChange,
}: Props) {
  const brnDigits = brn.replace(/\D/g, '').length
  const brnError = brnDigits > 0 && brnDigits < 10

  const businessTypeOptions = businessTypes.map(({ id, name }) => ({
    value: id,
    label: name,
  }))
  const selectedBusinessType =
    businessTypes.find(type => type.id === businessTypeId) ?? null
  const detailRequired = selectedBusinessType?.requiresDetail ?? false

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

      <Field label="업종" hint={selectedBusinessType?.description ?? undefined}>
        <SelectDropdown
          options={businessTypeOptions}
          value={businessTypeId ?? 0}
          onChange={onBusinessTypeIdChange}
          ariaLabel="업종 선택"
          placeholder={
            isBusinessTypesLoading
              ? '업종 목록 불러오는 중...'
              : '업종을 선택해 주세요'
          }
          disabled={isBusinessTypesLoading || businessTypeOptions.length === 0}
        />
        {isBusinessTypesError ? (
          <p className="flex items-center gap-1 typography-body03-regular text-error">
            <AlertCircleIcon className="size-3.5 shrink-0" />
            업종 목록을 불러오지 못했어요.
            <button
              type="button"
              className="underline"
              onClick={onRetryBusinessTypes}
            >
              다시 시도
            </button>
          </p>
        ) : null}
      </Field>

      <Field
        label={detailRequired ? '업종 상세' : '업종 상세 (선택)'}
        hint={
          detailRequired
            ? '선택한 업종은 상세 입력이 필요해요.'
            : '업종을 더 구체적으로 적어주세요.'
        }
        htmlFor="businessTypeDetail"
      >
        <AuthInput
          id="businessTypeDetail"
          type="text"
          placeholder="예) 떡볶이 전문점"
          value={businessTypeDetail}
          onChange={e => onBusinessTypeDetailChange(e.target.value)}
          maxLength={50}
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
