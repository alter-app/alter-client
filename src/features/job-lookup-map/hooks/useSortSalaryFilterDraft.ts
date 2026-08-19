import { useState } from 'react'

import {
  DEFAULT_SORT_VALUE,
  EMPTY_SALARY_FILTER,
  formatSalaryInput,
  parseSalaryInput,
  type SalaryFilterSelection,
} from '@/features/job-lookup-map/lib/postingFilters'

type SortSalaryFilterDraft = {
  sortValue: string
  salaryFilter: SalaryFilterSelection
}

export function useSortSalaryFilterDraft(initial: SortSalaryFilterDraft) {
  const [sortDraft, setSortDraft] = useState(initial.sortValue)
  const [salaryDraft, setSalaryDraft] = useState(initial.salaryFilter)
  const [minInput, setMinInput] = useState(
    formatSalaryInput(initial.salaryFilter.min)
  )
  const [maxInput, setMaxInput] = useState(
    formatSalaryInput(initial.salaryFilter.max)
  )

  const handleSalaryPreset = (preset: 'all' | 'custom') => {
    if (preset === 'all') {
      setSalaryDraft(EMPTY_SALARY_FILTER)
      setMinInput('')
      setMaxInput('')
      return
    }

    setSalaryDraft(prev => ({
      preset: 'custom',
      min: prev.min,
      max: prev.max,
    }))
  }

  const handleMinChange = (raw: string) => {
    const min = parseSalaryInput(raw)
    setMinInput(min != null ? formatSalaryInput(min) : '')
    setSalaryDraft(prev => ({
      preset: 'custom',
      min,
      max: prev.max,
    }))
  }

  const handleMaxChange = (raw: string) => {
    const max = parseSalaryInput(raw)
    setMaxInput(max != null ? formatSalaryInput(max) : '')
    setSalaryDraft(prev => ({
      preset: 'custom',
      min: prev.min,
      max,
    }))
  }

  const resetSortSalary = () => {
    setSortDraft(DEFAULT_SORT_VALUE)
    setSalaryDraft(EMPTY_SALARY_FILTER)
    setMinInput('')
    setMaxInput('')
  }

  const getNormalizedSalary = (): SalaryFilterSelection => {
    if (
      salaryDraft.min != null &&
      salaryDraft.max != null &&
      salaryDraft.min > salaryDraft.max
    ) {
      return {
        ...salaryDraft,
        min: salaryDraft.max,
        max: salaryDraft.min,
      }
    }

    return salaryDraft
  }

  return {
    sortDraft,
    setSortDraft,
    salaryDraft,
    minInput,
    maxInput,
    handleSalaryPreset,
    handleMinChange,
    handleMaxChange,
    resetSortSalary,
    getNormalizedSalary,
  }
}
