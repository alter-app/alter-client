import CloseIcon from '@/assets/icons/posting/Close.svg?react'
import PlusIcon from '@/assets/icons/posting/Plus.svg?react'
import { useState } from 'react'

import type { PostingFormViewModel } from '@/features/manager/posting/hooks/usePostingForm'
import type { WorkTimeEditorState } from '@/shared/types/workTime'
import { WorkTimePickerDrawer } from '@/shared/ui/common/WorkTimePickerDrawer'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
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

function splitTime(time: string) {
  const [hour = '', minute = ''] = time.split(':')
  return { hour, minute }
}

function formatTime(time: string) {
  const { hour, minute } = splitTime(time)
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
}

function TimeField({
  label,
  value,
  onOpen,
}: {
  label: string
  value: string
  onOpen: () => void
}) {
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
        {isEmpty ? '시간 선택' : formatTime(value)}
      </button>
    </div>
  )
}

function ScheduleCard({
  schedule,
  index,
  form,
  canRemove,
  onRemove,
}: {
  schedule: PostingFormSchedule
  index: number
  form: PostingFormViewModel
  canRemove: boolean
  onRemove: () => void
}) {
  const isExisting = schedule.id !== null
  const [pickerTarget, setPickerTarget] = useState<TimeTarget | null>(null)

  // 픽커는 휠 조작 시에만 onChange가 발생하므로, 열기 전에 기본값을 먼저 커밋해야
  // 보이는 값 그대로 닫아도 기록된다
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
            onClick={onRemove}
            aria-label={`일정 ${index + 1} 삭제`}
            className="flex size-7 items-center justify-center rounded-lg border border-line-1 text-text-50 transition-colors hover:bg-bg-light"
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
                  : 'border border-bg-dark bg-transparent text-text-50'
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

export function ScheduleEditor({ form }: ScheduleEditorProps) {
  const { schedules } = form.values
  const [pendingRemovalKey, setPendingRemovalKey] = useState<string | null>(
    null
  )
  const pendingRemoval = schedules.find(
    schedule => schedule.key === pendingRemovalKey
  )
  const willRemoveLastSchedule = Boolean(
    pendingRemoval && schedules.length === 1
  )

  const requestRemoval = (schedule: PostingFormSchedule) => {
    if (schedule.id === null && schedules.length > 1) {
      form.removeSchedule(schedule.key)
      return
    }
    setPendingRemovalKey(schedule.key)
  }

  const confirmRemoval = () => {
    if (pendingRemovalKey) form.removeSchedule(pendingRemovalKey)
    setPendingRemovalKey(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {schedules.length === 0 ? (
        <p className="rounded-xl bg-bg-light px-3 py-4 text-center typography-body03-regular text-text-70">
          등록된 근무일정이 없어요.
        </p>
      ) : null}

      {schedules.map((schedule, index) => (
        <ScheduleCard
          key={schedule.key}
          schedule={schedule}
          index={index}
          form={form}
          canRemove={form.isEditMode || schedules.length > 1}
          onRemove={() => requestRemoval(schedule)}
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

      <ConfirmModal
        isOpen={pendingRemoval !== undefined}
        title="근무일정을 삭제할까요?"
        description={
          willRemoveLastSchedule
            ? '모든 근무일정을 삭제한 상태로 수정 완료하면 공고가 자동으로 모집 마감됩니다.'
            : '삭제한 일정은 수정 완료 후 복구할 수 없어요.'
        }
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmRemoval}
        onClose={() => setPendingRemovalKey(null)}
      />
    </div>
  )
}
