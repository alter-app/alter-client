import { useScheduleStore } from '@/shared/stores/useScheduleStore'

/**
 * 스케줄 페이지의 UI 상태(연·월)와 핸들러만 제공.
 * 데이터 조회(useSelfScheduleQuery)는 데이터를 소비하는 페이지에서 호출.
 */
export function useSchedule() {
  const currentYear = useScheduleStore(state => state.currentYear)
  const currentMonth = useScheduleStore(state => state.currentMonth)
  const goPrevMonth = useScheduleStore(state => state.goPrevMonth)
  const goNextMonth = useScheduleStore(state => state.goNextMonth)

  const handlePreviousMonth = () => {
    goPrevMonth()
  }

  const handleNextMonth = () => {
    goNextMonth()
  }

  const handleScheduleClick = (id: string) => {
    console.log('스케줄 클릭:', id)
    // 스케줄 상세 페이지 이동 (필요시 구현)
  }

  return {
    currentYear,
    currentMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleScheduleClick,
  }
}
