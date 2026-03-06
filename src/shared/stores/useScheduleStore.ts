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

export const useScheduleStore = create<ScheduleState>(set => {
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
    setCurrentMonth: currentMonth => set({ currentMonth }),

    goPrevMonth: () => {
      let prevYear: number
      let prevMonth: number
      set(state => {
        prevMonth = state.currentMonth === 1 ? 12 : state.currentMonth - 1
        prevYear =
          state.currentMonth === 1 ? state.currentYear - 1 : state.currentYear
        return { currentYear: prevYear, currentMonth: prevMonth }
      })
      return { year: prevYear!, month: prevMonth! }
    },

    goNextMonth: () => {
      let nextYear: number
      let nextMonth: number
      set(state => {
        nextMonth = state.currentMonth === 12 ? 1 : state.currentMonth + 1
        nextYear =
          state.currentMonth === 12 ? state.currentYear + 1 : state.currentYear
        return { currentYear: nextYear, currentMonth: nextMonth }
      })
      return { year: nextYear!, month: nextMonth! }
    },

    setYearMonth: (year, month) =>
      set({ currentYear: year, currentMonth: month }),
  }
})
