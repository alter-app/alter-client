import type { RegionSelection } from '@/features/job-lookup-map/lib/regionOptions'
import {
  hasRegionFilterApplied,
  isRegionSelectionComplete,
} from '@/features/job-lookup-map/lib/regionOptions'

export type AlbaFindMode = 'nearby' | 'region'

export type SalaryPreset = 'all' | '12000' | '15000' | 'custom'

export type SalaryFilterSelection = {
  preset: SalaryPreset
  min: number | null
  max: number | null
}

export const EMPTY_SALARY_FILTER: SalaryFilterSelection = {
  preset: 'all',
  min: null,
  max: null,
}

export const DEFAULT_SORT_VALUE = 'LATEST'

export function formatSortOptionLabel(option: {
  value: string
  description: string
}): string {
  if (option.value === 'LATEST') return '최신순'
  if (option.value === 'PAY_AMOUNT') return '급여순'
  return option.description
}

export const SALARY_PRESETS: {
  preset: SalaryPreset
  label: string
  min: number | null
}[] = [
  { preset: 'all', label: '전체', min: null },
  { preset: '12000', label: '1.2만원 이상', min: 12000 },
  { preset: '15000', label: '1.5만원 이상', min: 15000 },
]

export function formatSalaryChipLabel(
  selection: SalaryFilterSelection
): string {
  if (selection.preset === '12000') return '1.2만원 이상'
  if (selection.preset === '15000') return '1.5만원 이상'
  if (selection.preset === 'custom') {
    if (selection.min != null && selection.max != null) {
      return `${selection.min.toLocaleString('ko-KR')}~${selection.max.toLocaleString('ko-KR')}원`
    }
    if (selection.min != null) {
      return `${selection.min.toLocaleString('ko-KR')}원 이상`
    }
    if (selection.max != null) {
      return `${selection.max.toLocaleString('ko-KR')}원 이하`
    }
  }
  return '급여'
}

export function isSalaryFilterApplied(
  selection: SalaryFilterSelection
): boolean {
  return (
    selection.preset !== 'all' || selection.min != null || selection.max != null
  )
}

export function formatSortChipLabel(
  value: string,
  options: { value: string; description: string }[]
): string {
  const option = options.find(item => item.value === value)
  if (option) return formatSortOptionLabel(option)
  return '최신순'
}

export function isSortFilterApplied(value: string): boolean {
  return value !== DEFAULT_SORT_VALUE
}

export function countActiveFilters(params: {
  regionSelection: RegionSelection
  sortValue: string
  salaryFilter: SalaryFilterSelection
  mode: AlbaFindMode
}): number {
  const { regionSelection, sortValue, salaryFilter, mode } = params
  let count = 0
  if (mode === 'region' && hasRegionFilterApplied(regionSelection)) count += 1
  if (isSortFilterApplied(sortValue)) count += 1
  if (isSalaryFilterApplied(salaryFilter)) count += 1
  return count
}

export function isListFilterApplied(params: {
  mode: AlbaFindMode
  regionSelection: RegionSelection
  sortValue: string
  salaryFilter: SalaryFilterSelection
}): boolean {
  return countActiveFilters(params) > 0
}

export function parseSalaryInput(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return null
  const parsed = Number(digits)
  return Number.isFinite(parsed) ? parsed : null
}

export function formatSalaryInput(value: number | null): string {
  if (value == null) return ''
  return value.toLocaleString('ko-KR')
}

export type PostingsListFilters = {
  province?: string
  district?: string
  town?: string
  minPayAmount?: number
  maxPayAmount?: number
  payAmountSort?: boolean
}

export function buildPostingsListFilters(params: {
  mode: AlbaFindMode
  regionSelection: RegionSelection
  sortValue: string
  salaryFilter: SalaryFilterSelection
}): PostingsListFilters {
  const { mode, regionSelection, sortValue, salaryFilter } = params
  const filters: PostingsListFilters = {}

  if (mode === 'region' && isRegionSelectionComplete(regionSelection)) {
    if (regionSelection.sido && regionSelection.sido !== '전국(전체)') {
      filters.province = regionSelection.sido
    }
    if (regionSelection.sigungu && regionSelection.sigungu !== '전체') {
      filters.district = regionSelection.sigungu
    }
    if (regionSelection.dong && regionSelection.dong !== '전체') {
      filters.town = regionSelection.dong
    }
  }

  if (sortValue === 'PAY_AMOUNT') {
    filters.payAmountSort = true
  }

  if (salaryFilter.min != null) {
    filters.minPayAmount = salaryFilter.min
  }
  if (salaryFilter.max != null) {
    filters.maxPayAmount = salaryFilter.max
  }

  return filters
}
