import { useEffect } from 'react'
import {
  useScheduleStore,
  type ScheduleItem as ScheduleItemType,
  type ScheduleState,
} from '@/shared/stores/useScheduleStore'

type ScheduleStoreHook = () => ScheduleState

// TODO: ScheduleItem 렌더 확인용 임시 데이터 - API 연동 시 제거
const MOCK_SCHEDULES: ScheduleItemType[] = [
  { id: '1', day: '월', date: '3', workplace: '스타벅스 강남점', time: '09:00 ~ 14:00', hours: '5시간' },
  { id: '2', day: '토', date: '8', workplace: '맥도날드 홍대점', time: '14:00 ~ 22:00', hours: '8시간' },
  { id: '3', day: '일', date: '9', workplace: '이디야 역삼점', time: '10:00 ~ 18:00', hours: '8시간' },
  { id: '4', day: '수', date: '12', workplace: 'GS25 논현점', time: '18:00 ~ 23:00', hours: '5시간' },
]

export function useSchedule() {
  const store = (useScheduleStore as unknown as ScheduleStoreHook)()
  const {
    schedules,
    isLoading,
    currentYear,
    currentMonth,
    setSchedules,
    setLoading,
    goPrevMonth,
    goNextMonth,
  } = store

  // 초기 로드 (API 연동 시 getUserScheduleSelf(currentYear, currentMonth) 호출 후 setSchedules)
  useEffect(() => {
    // TODO: API 연동 시 스케줄 조회 후 setSchedules, 아래 MOCK_SCHEDULES 제거
    setSchedules(MOCK_SCHEDULES)
    setLoading(false)
  }, [setSchedules, setLoading])

  const handlePreviousMonth = () => {
    goPrevMonth()
    setLoading(true)
    // TODO: API 연동 시 getUserScheduleSelf(year, month) 호출 후 setSchedules
    setSchedules(MOCK_SCHEDULES)
    setLoading(false)
  }

  const handleNextMonth = () => {
    goNextMonth()
    setLoading(true)
    // TODO: API 연동 시 getUserScheduleSelf(year, month) 호출 후 setSchedules
    setSchedules(MOCK_SCHEDULES)
    setLoading(false)
  }

  const handleScheduleClick = (schedule: ScheduleItemType) => {
    console.log('스케줄 클릭:', schedule)
    // 스케줄 상세 페이지 이동 (필요시 구현)
  }

  return {
    schedules,
    isLoading,
    currentYear,
    currentMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleScheduleClick,
  }
}
