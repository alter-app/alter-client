import type { PostingFilterOptions } from '@/features/job-lookup-map/types/posting'

export type RegionStep = 'sido' | 'sigungu' | 'dong'

export type RegionSelection = {
  sido: string | null
  sigungu: string | null
  dong: string | null
}

export const EMPTY_REGION_SELECTION: RegionSelection = {
  sido: null,
  sigungu: null,
  dong: null,
}

export const REGION_STEPS: { key: RegionStep; label: string }[] = [
  { key: 'sido', label: '시/도' },
  { key: 'sigungu', label: '시/군/구' },
  { key: 'dong', label: '읍/면/동' },
]

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
  filterOptions: Pick<PostingFilterOptions, 'provinces' | 'districts' | 'towns'>
): string[] {
  if (step === 'sido') return ['전국(전체)', ...filterOptions.provinces]
  if (step === 'sigungu') return ['전체', ...filterOptions.districts]
  return ['전체', ...filterOptions.towns]
}
