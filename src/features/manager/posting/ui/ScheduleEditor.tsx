import CloseIcon from '@/assets/icons/posting/Close.svg?react'
import PlusIcon from '@/assets/icons/posting/Plus.svg?react'
import { useState } from 'react'

import type { PostingFormViewModel } from '@/features/manager/posting/hooks/usePostingForm'
import { formatKoreanTimePart } from '@/shared/lib/formatKoreanWorkTime'
import type { WorkTimeEditorState } from '@/shared/types/workTime'
import { WorkTimePickerDrawer } from '@/shared/ui/common/WorkTimePickerDrawer'
import {
  WORKING_DAYS,
  WORKING_DAY_LABEL,
  type PostingFormSchedule,
} from '@/features/manager/posting/types/posting'
import { cn } from '@/shared/lib/utils'

interface ScheduleEditorProps {
  form: PostingFormViewModel
}

type TimeTarget = 'start' | 'end'

/** 'HH:MM' → { hour, minute }. 미입력이면 빈 문자열 */
function splitTime(time: string) {
  const [hour = '', minute = ''] = time.split(':')
  return { hour, minute }
}

/** 시간 선택 버튼 — 미입력 시 플레이스홀더를 노출합니다 */
function TimeField({
  label,
  value,
  onOpen,
}: {
  label: string
  value: string
  onOpen: () => void
}) {
  const { hour, minute } = splitTime(value)
  const isEmpty = value === ''

  return (
    <div className="flex-1">
      <span className="mb-1 block typography-body03-regular text-text-70">
        {label}
      </span>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`${label} 시간 선택`}
        className={cn(
          'h-11 w-full rounded-xl border border-line-1 bg-white px-3 text-left typography-body02-regular transition-colors hover:border-main',
          isEmpty ? 'text-text-50' : 'text-text-100'
        )}
      >
        {isEmpty ? '시간 선택' : formatKoreanTimePart(hour, minute)}
      </button>
    </div>
  )
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
  const [pickerTarget, setPickerTarget] = useState<TimeTarget | null>(null)

  /**
   * 픽커는 휠 조작 시에만 onChange를 발생시키므로, 빈 값인 채로 열면
   * 하이라이트된 '오전 12시 00분'을 그대로 닫아도 아무것도 기록되지 않습니다.
   * 열기 전에 기본값(00:00)을 먼저 커밋해 보이는 값과 기록 값을 일치시킵니다.
   */
  const openPicker = (target: TimeTarget) => {
    if (target === 'start' && schedule.startTime === '') {
      form.updateSchedule(schedule.key, { startTime: '00:00' })
    }
    if (target === 'end' && schedule.endTime === '') {
      form.updateSchedule(schedule.key, { endTime: '00:00' })
    }
    setPickerTarget(target)
  }

  const start = splitTime(schedule.startTime)
  const end = splitTime(schedule.endTime)

  /**
   * 폼의 'HH:MM' 문자열을 픽커가 요구하는 시/분 단위 상태로 어댑트합니다.
   * 한쪽만 선택된 경우 나머지는 '00'으로 채웁니다.
   */
  const workTime: WorkTimeEditorState = {
    startHour: start.hour,
    startMinute: start.minute,
    endHour: end.hour,
    endMinute: end.minute,
    setStartHour: hour =>
      form.updateSchedule(schedule.key, {
        startTime: `${hour}:${start.minute || '00'}`,
      }),
    setStartMinute: minute =>
      form.updateSchedule(schedule.key, {
        startTime: `${start.hour || '00'}:${minute}`,
      }),
    setEndHour: hour =>
      form.updateSchedule(schedule.key, {
        endTime: `${hour}:${end.minute || '00'}`,
      }),
    setEndMinute: minute =>
      form.updateSchedule(schedule.key, {
        endTime: `${end.hour || '00'}:${minute}`,
      }),
  }

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
        <TimeField
          label="시작"
          value={schedule.startTime}
          onOpen={() => openPicker('start')}
        />
        <TimeField
          label="종료"
          value={schedule.endTime}
          onOpen={() => openPicker('end')}
        />
      </div>

      <WorkTimePickerDrawer
        open={pickerTarget !== null}
        target={pickerTarget}
        workTime={workTime}
        onOpenChange={open => {
          if (!open) setPickerTarget(null)
        }}
      />

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
          {/* 편집 중에는 빈 값(0)을 허용하고 blur 시점에 최소 1로 보정 */}
          <input
            type="number"
            min={1}
            value={
              schedule.positionsNeeded === 0 ? '' : schedule.positionsNeeded
            }
            onChange={e =>
              form.updateSchedule(schedule.key, {
                positionsNeeded: Math.max(
                  0,
                  Number(e.target.value.replace(/[^0-9]/g, '')) || 0
                ),
              })
            }
            onBlur={() =>
              form.updateSchedule(schedule.key, {
                positionsNeeded: Math.max(1, schedule.positionsNeeded),
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
