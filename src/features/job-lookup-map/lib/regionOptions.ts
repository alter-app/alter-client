import type { AddressItem } from '@/features/job-lookup-map/types/posting'

export type RegionStep = 'sido' | 'sigungu' | 'dong'

export type RegionSelection = {
  sido: string | null
  sigungu: string | null
  dong: string | null
  sidoCode: string | null
  sigunguCode: string | null
  dongCode: string | null
}

export const EMPTY_REGION_SELECTION: RegionSelection = {
  sido: null,
  sigungu: null,
  dong: null,
  sidoCode: null,
  sigunguCode: null,
  dongCode: null,
}

export const REGION_STEPS: { key: RegionStep; label: string }[] = [
  { key: 'sido', label: '시/도' },
  { key: 'sigungu', label: '시/군/구' },
  { key: 'dong', label: '읍/면/동' },
]

export type RegionOption = {
  code: string | null
  name: string
}

export function formatRegionLabel(selection: RegionSelection): string {
  if (!selection.sido || selection.sido === '전국(전체)') return '지역 선택'
  if (!selection.sigungu || selection.sigungu === '전체') return selection.sido
  if (!selection.dong || selection.dong === '전체') {
    return `${selection.sido} ${selection.sigungu}`
  }
  return `${selection.sigungu} ${selection.dong}`
}

export function isRegionSelectionComplete(selection: RegionSelection): boolean {
  return (
    selection.sido != null &&
    selection.sigungu != null &&
    selection.dong != null
  )
}

export function getRegionOptionsForStep(
  step: RegionStep,
  addresses: AddressItem[]
): RegionOption[] {
  const allOption: RegionOption =
    step === 'sido'
      ? { code: null, name: '전국(전체)' }
      : { code: null, name: '전체' }

  return [
    allOption,
    ...addresses.map(address => ({
      code: address.code,
      name: address.name,
    })),
  ]
}
