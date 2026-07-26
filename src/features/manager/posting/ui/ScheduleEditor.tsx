import CloseIcon from '@/assets/icons/posting/Close.svg?react'
import PlusIcon from '@/assets/icons/posting/Plus.svg?react'
import type { PostingFormViewModel } from '@/features/manager/posting/hooks/usePostingForm'
import {
  WORKING_DAYS,
  WORKING_DAY_LABEL,
  type PostingFormSchedule,
} from '@/features/manager/posting/types/posting'
import { cn } from '@/shared/lib/utils'

interface ScheduleEditorProps {
  form: PostingFormViewModel
}

function ScheduleCard({
  schedule,
  index,
  form,
  canRemove,
}: {
  schedule: PostingFormSchedule
  index: number
  form: PostingFormViewModel
  canRemove: boolean
}) {
  const isExisting = schedule.id !== null

  return (
    <div
      className={cn(
        'rounded-xl border p-3.5',
        isExisting ? 'border-line-1' : 'border-main'
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="typography-body02-semibold text-text-100">
            일정 {index + 1}
          </span>
          {/* 수정 화면에서 기존 일정과 신규 추가분을 구분 */}
          {form.isEditMode ? (
            <span
              className={cn(
                'rounded-[50px] px-1.5 py-0.5 typography-bg',
                isExisting ? 'bg-bg-dark text-text-70' : 'bg-main-100 text-sub'
              )}
            >
              {isExisting ? '기존' : '신규'}
            </span>
          ) : null}
        </div>
        {canRemove ? (
          <button
            type="button"
            onClick={() => form.removeSchedule(schedule.key)}
            aria-label={`일정 ${index + 1} 삭제`}
            className="flex size-7 items-center justify-center rounded-lg text-text-50 transition-colors hover:bg-bg-light"
          >
            <CloseIcon className="size-4" />
          </button>
        ) : null}
      </div>

      <p className="mb-2 typography-body03-regular text-text-70">근무요일</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {WORKING_DAYS.map(day => {
          const isSelected = schedule.workingDays.includes(day)
          return (
            <button
              key={day}
              type="button"
              aria-pressed={isSelected}
              onClick={() => form.toggleScheduleDay(schedule.key, day)}
              className={cn(
                'size-9 rounded-lg typography-body02-semibold transition-colors',
                isSelected
                  ? 'bg-main text-white'
                  : 'border border-line-1 bg-white text-text-70'
              )}
            >
              {WORKING_DAY_LABEL[day]}
            </button>
          )
        })}
      </div>

      <div className="mb-3 flex gap-2">
        <label className="flex-1">
          <span className="mb-1 block typography-body03-regular text-text-70">
            시작
          </span>
          <input
            type="time"
            value={schedule.startTime}
            onChange={e =>
              form.updateSchedule(schedule.key, { startTime: e.target.value })
            }
            className="h-11 w-full rounded-xl border border-line-1 bg-white px-3 typography-body02-regular text-text-100 focus:border-main focus:outline-none"
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block typography-body03-regular text-text-70">
            종료
          </span>
          <input
            type="time"
            value={schedule.endTime}
            onChange={e =>
              form.updateSchedule(schedule.key, { endTime: e.target.value })
            }
            className="h-11 w-full rounded-xl border border-line-1 bg-white px-3 typography-body02-regular text-text-100 focus:border-main focus:outline-none"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <label className="flex-1">
          <span className="mb-1 block typography-body03-regular text-text-70">
            포지션
          </span>
          <input
            type="text"
            value={schedule.position}
            placeholder="예: 홀서빙"
            onChange={e =>
              form.updateSchedule(schedule.key, { position: e.target.value })
            }
            className="h-11 w-full rounded-xl border border-line-1 bg-white px-3 typography-body02-regular text-text-100 placeholder:text-text-50 focus:border-main focus:outline-none"
          />
        </label>
        <label className="w-[96px]">
          <span className="mb-1 block typography-body03-regular text-text-70">
            모집 인원
          </span>
          <input
            type="number"
            min={1}
            value={schedule.positionsNeeded}
            onChange={e =>
              form.updateSchedule(schedule.key, {
                positionsNeeded: Math.max(1, Number(e.target.value) || 1),
              })
            }
            className="h-11 w-full rounded-xl border border-line-1 bg-white px-3 typography-body02-regular text-text-100 focus:border-main focus:outline-none"
          />
        </label>
      </div>
    </div>
  )
}

/** 근무일정 편집기 — 일정 카드 추가/삭제, 요일 토글, 시간·포지션·인원 입력 */
export function ScheduleEditor({ form }: ScheduleEditorProps) {
  const { schedules } = form.values

  return (
    <div className="flex flex-col gap-3">
      {schedules.map((schedule, index) => (
        <ScheduleCard
          key={schedule.key}
          schedule={schedule}
          index={index}
          form={form}
          canRemove={schedules.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={form.addSchedule}
        className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-main text-main transition-colors hover:bg-main-100"
      >
        <PlusIcon className="size-4" />
        <span className="typography-bt">일정 추가</span>
      </button>
    </div>
  )
}
