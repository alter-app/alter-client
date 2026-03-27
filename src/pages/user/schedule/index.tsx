import type { ScheduleItem as ScheduleItemType } from '@/shared/stores/useScheduleStore'
import { useSelfScheduleQuery } from '@/shared/hooks/useSelfScheduleQuery'
import { ScheduleItem } from './components/ScheduleItem'
import { useSchedule } from './hooks/useSchedule'
import { ChevronLeftIcon } from '@/assets/icons/ChevronLeftIcon'
import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon'
import { CalendarEmptyIcon } from '@/assets/icons/CalendarEmptyIcon'
import { Spinner } from '@/shared/ui/Spinner'

export function SchedulePage() {
  const {
    currentYear,
    currentMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleScheduleClick,
  } = useSchedule()

  const { schedules, isLoading } = useSelfScheduleQuery({
    year: currentYear,
    month: currentMonth,
  })

  return (
    <div className="min-h-screen bg-bg-light">
        <header className="sticky top-0 z-10 bg-white border-b border-line-1 px-4 py-3">
          <h1 className="font-pretendard font-semibold text-5 text-text-100">
            내 일정
          </h1>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        ) : (
          <div className="px-3 pt-5">
            {/* 월별 네비게이션 */}
            <div className="flex justify-between items-center bg-white rounded-xl py-4 px-5 mb-4 shadow-sm border border-line-1">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="flex items-center justify-center w-10 h-10 bg-bg-light rounded-lg border-0 cursor-pointer transition-colors hover:bg-[#e9ecef] active:scale-95"
                aria-label="이전 달"
              >
                <ChevronLeftIcon />
              </button>
              <h2 className="font-pretendard font-semibold text-5 text-text-100 m-0">
                {currentYear}년 {currentMonth}월
              </h2>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex items-center justify-center w-10 h-10 bg-bg-light rounded-lg border-0 cursor-pointer transition-colors hover:bg-[#e9ecef] active:scale-95"
                aria-label="다음 달"
              >
                <ChevronRightIcon />
              </button>
            </div>

            {schedules.length > 0 ? (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-line-1">
                <div className="flex flex-col gap-3">
                  {schedules.map((schedule: ScheduleItemType) => (
                    <ScheduleItem
                      key={schedule.id}
                      id={schedule.id}
                      day={schedule.day}
                      date={schedule.date}
                      workplace={schedule.workplace}
                      time={schedule.time}
                      hours={schedule.hours}
                      onClick={handleScheduleClick}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-[60px] px-5 text-center">
                <div className="mb-4 opacity-60">
                  <CalendarEmptyIcon />
                </div>
                <h3 className="font-pretendard font-semibold text-5 text-text-100 m-0 mb-2">
                  일정이 없습니다
                </h3>
                <p className="font-pretendard font-regular text-3 text-text-50 leading-normal m-0">
                  {currentYear}년 {currentMonth}월에는
                  <br />
                  등록된 일정이 없습니다.
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  )
}

export default SchedulePage
