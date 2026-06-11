import { AuthInput } from '@/shared/ui/common/AuthInput'

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
  return (
    <div className="flex w-full flex-col gap-4">
      <AuthInput
        type="text"
        placeholder="상호·매장 이름"
        value={bizName}
        onChange={e => onBizNameChange(e.target.value)}
        autoComplete="organization"
      />
      <div className="flex flex-col gap-1">
        <AuthInput
          type="text"
          placeholder="대표자 성명"
          value={ownerName}
          onChange={e => onOwnerNameChange(e.target.value)}
          autoComplete="name"
        />
        <p className="px-1 typography-body02-regular text-text-70">
          제출하는 신분증의 성명과 동일하게 입력해 주세요.
        </p>
      </div>
      <AuthInput
        type="text"
        placeholder="사업자등록번호 (예: 123-45-67890)"
        value={brn}
        onChange={e => onBrnChange(e.target.value)}
        inputMode="numeric"
        maxLength={12}
      />
      <AuthInput
        type="text"
        placeholder="업종 유형 (예: 음식점)"
        value={type}
        onChange={e => onTypeChange(e.target.value)}
      />
      <AuthInput
        type="tel"
        placeholder="매장 연락처 (유선 또는 휴대폰)"
        value={contact}
        onChange={e => onContactChange(e.target.value)}
        inputMode="numeric"
        maxLength={13}
        autoComplete="tel"
      />
      <AuthInput
        type="text"
        placeholder="시·도 (예: 서울특별시)"
        value={province}
        onChange={e => onProvinceChange(e.target.value)}
      />
      <AuthInput
        type="text"
        placeholder="시·군·구 (예: 강남구)"
        value={district}
        onChange={e => onDistrictChange(e.target.value)}
      />
      <AuthInput
        type="text"
        placeholder="읍·면·동 (예: 역삼동)"
        value={town}
        onChange={e => onTownChange(e.target.value)}
      />
      <AuthInput
        type="text"
        placeholder="나머지 주소 (도로명·지번 등 상세 주소 전체)"
        value={address}
        onChange={e => onAddressChange(e.target.value)}
        autoComplete="street-address"
      />
    </div>
  )
}
