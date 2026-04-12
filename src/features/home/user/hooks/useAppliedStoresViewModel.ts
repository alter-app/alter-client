import { useEffect, useRef, useState } from 'react'
import type {
  ApplicationStatus,
  FilterType,
  AppliedStoreData,
} from '@/features/home/user/types/appliedStore'

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'completed', label: '지원 완료' },
  { key: 'viewed', label: '열람' },
  { key: 'not_viewed', label: '미열람' },
  { key: 'cancelled', label: '지원 취소' },
]

const STATUS_SECTIONS: { key: ApplicationStatus; label: string }[] = [
  { key: 'submitted', label: '제출됨' },
  { key: 'accepted', label: '수락됨' },
  { key: 'cancelled', label: '취소됨' },
]

function getCardStatus(status: ApplicationStatus): 'applied' | 'rejected' {
  return status === 'cancelled' ? 'rejected' : 'applied'
}

function getFilterLabel(filter: FilterType): string {
  if (filter === 'all') return '전체'
  return FILTER_OPTIONS.find(o => o.key === filter)?.label ?? '전체'
}

export function useAppliedStoresViewModel(stores: AppliedStoreData[]) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  const filteredStores =
    selectedFilter === 'all'
      ? stores
      : stores.filter(s => s.filterType === selectedFilter)

  const grouped = STATUS_SECTIONS.map(section => ({
    ...section,
    stores: filteredStores.filter(s => s.status === section.key),
  })).filter(section => section.stores.length > 0)

  const filterLabel = getFilterLabel(selectedFilter)

  function toggleDropdown() {
    setIsDropdownOpen(prev => !prev)
  }

  function selectFilter(filter: FilterType) {
    setSelectedFilter(filter)
    setIsDropdownOpen(false)
  }

  return {
    filterLabel,
    isDropdownOpen,
    dropdownRef,
    filterOptions: FILTER_OPTIONS,
    grouped,
    toggleDropdown,
    selectFilter,
    getCardStatus,
  }
}
