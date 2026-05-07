import { getMonth, getYear } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'

interface UseMonthYearPickerViewModelParams {
  currentDate: Date
  onMonthChange?: (date: Date) => void
}

export function useMonthYearPickerViewModel({
  currentDate,
  onMonthChange,
}: UseMonthYearPickerViewModelParams) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(getYear(currentDate))
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate))

  const years = useMemo(() => {
    const base = getYear(new Date())
    return Array.from({ length: 11 }, (_, i) => base - 5 + i)
  }, [])

  const yearItems = useMemo(() => years.map(y => `${y}년`), [years])
  const yearIndex = useMemo(
    () => Math.max(0, years.indexOf(selectedYear)),
    [years, selectedYear]
  )

  const openPicker = useCallback(() => {
    setSelectedYear(getYear(currentDate))
    setSelectedMonth(getMonth(currentDate))
    setIsPickerOpen(true)
  }, [currentDate])
  const closePicker = useCallback(() => setIsPickerOpen(false), [])

  const onYearIndexChange = useCallback(
    (index: number) => setSelectedYear(years[index]),
    [years]
  )
  const onMonthIndexChange = useCallback(
    (index: number) => setSelectedMonth(index),
    []
  )

  const onPickerConfirm = useCallback(() => {
    onMonthChange?.(new Date(selectedYear, selectedMonth, 1))
    setIsPickerOpen(false)
  }, [onMonthChange, selectedYear, selectedMonth])

  return {
    isPickerOpen,
    openPicker,
    closePicker,
    yearItems,
    yearIndex,
    monthIndex: selectedMonth,
    onYearIndexChange,
    onMonthIndexChange,
    onPickerConfirm,
  }
}
