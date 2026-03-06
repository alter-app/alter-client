import { create } from 'zustand'

export interface ScheduleItem {
  id: string
  day: string
  date: string
  workplace: string
  time: string
  hours: string
}

export interface ScheduleState {
  schedules: ScheduleItem[]
  isLoading: boolean
  hasMore: boolean
  nextCursor: string | null
  isLoadingMore: boolean
  currentYear: number
  currentMonth: number
  setSchedules: (schedules: ScheduleItem[]) => void
  setLoading: (loading: boolean) => void
  setHasMore: (hasMore: boolean) => void
  setNextCursor: (cursor: string | null) => void
  setIsLoadingMore: (loading: boolean) => void
  setCurrentYear: (year: number) => void
  setCurrentMonth: (month: number) => void
  goPrevMonth: () => { year: number; month: number }
  goNextMonth: () => { year: number; month: number }
  setYearMonth: (year: number, month: number) => void
}

export const useScheduleStore = create<ScheduleState>((set, get) => {
  return {
    schedules: [],
    isLoading: true,
    hasMore: true,
    nextCursor: null,
    isLoadingMore: false,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    setSchedules: schedules => set({ schedules }),
    setLoading: loading => set({ isLoading: loading }),
    setHasMore: hasMore => set({ hasMore }),
    setNextCursor: nextCursor => set({ nextCursor }),
    setIsLoadingMore: isLoadingMore => set({ isLoadingMore }),
    setCurrentYear: currentYear => set({ currentYear }),
    setCurrentMonth: currentMonth => {
      if (currentMonth < 1 || currentMonth > 12) {
        throw new RangeError('month must be between 1 and 12')
      }
      set({ currentMonth })
    },

    goPrevMonth: () => {
      const { currentYear, currentMonth } = get()
      const month = currentMonth === 1 ? 12 : currentMonth - 1
      const year = currentMonth === 1 ? currentYear - 1 : currentYear
      set({ currentYear: year, currentMonth: month })
      return { year, month }
    },

    goNextMonth: () => {
      const { currentYear, currentMonth } = get()
      const month = currentMonth === 12 ? 1 : currentMonth + 1
      const year = currentMonth === 12 ? currentYear + 1 : currentYear
      set({ currentYear: year, currentMonth: month })
      return { year, month }
    },

    setYearMonth: (year, month) => {
      if (month < 1 || month > 12) {
        throw new RangeError('month must be between 1 and 12')
      }
      set({ currentYear: year, currentMonth: month })
    },
  }
})
