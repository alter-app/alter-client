import { AuthInput } from '@/shared/ui/common/AuthInput'

type Props = {
  storeName: string
  businessType: string
  addressLine: string
  onStoreNameChange: (v: string) => void
  onBusinessTypeChange: (v: string) => void
  onAddressLineChange: (v: string) => void
}

export function StoreBasicInfoFields({
  storeName,
  businessType,
  addressLine,
  onStoreNameChange,
  onBusinessTypeChange,
  onAddressLineChange,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-4">
      <AuthInput
        type="text"
        placeholder="상호(업장 이름)"
        value={storeName}
        onChange={e => onStoreNameChange(e.target.value)}
        autoComplete="organization"
      />
      <AuthInput
        type="text"
        placeholder="업종 (예: 음식점)"
        value={businessType}
        onChange={e => onBusinessTypeChange(e.target.value)}
      />
      <AuthInput
        type="text"
        placeholder="주소"
        value={addressLine}
        onChange={e => onAddressLineChange(e.target.value)}
        autoComplete="street-address"
      />
    </div>
  )
}
