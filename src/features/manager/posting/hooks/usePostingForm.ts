import { useCallback, useMemo, useState } from 'react'

import {
  type PaymentType,
  type Posting,
  type PostingFormErrors,
  type PostingFormSchedule,
  type PostingFormValues,
  type WorkingDay,
} from '@/features/manager/posting/types/posting'

let scheduleKeySeq = 0

function createEmptySchedule(): PostingFormSchedule {
  scheduleKeySeq += 1
  return {
    key: `new-${scheduleKeySeq}`,
    id: null,
    workingDays: [],
    startTime: '',
    endTime: '',
    position: '',
    positionsNeeded: 1,
  }
}

function createInitialValues(posting?: Posting | null): PostingFormValues {
  if (!posting) {
    return {
      workspaceId: null,
      title: '',
      schedules: [createEmptySchedule()],
      paymentType: 'HOURLY',
      payAmount: '',
      description: '',
    }
  }

  return {
    workspaceId: posting.workspaceId,
    title: posting.title,
    schedules: posting.schedules.map(schedule => {
      scheduleKeySeq += 1
      return {
        ...schedule,
        workingDays: [...schedule.workingDays],
        key: `existing-${schedule.id ?? scheduleKeySeq}`,
      }
    }),
    paymentType: posting.paymentType,
    payAmount: String(posting.payAmount),
    description: posting.description,
  }
}

function validate(values: PostingFormValues): PostingFormErrors {
  const errors: PostingFormErrors = {}

  if (values.workspaceId === null) {
    errors.workspaceId = '업장을 선택해 주세요'
  }
  if (values.title.trim() === '') {
    errors.title = '공고 제목을 입력해 주세요'
  }
  const hasIncompleteSchedule = values.schedules.some(
    schedule =>
      schedule.workingDays.length === 0 ||
      schedule.startTime === '' ||
      schedule.endTime === ''
  )
  if (values.schedules.length === 0) {
    errors.schedules = '근무일정을 1개 이상 추가해 주세요'
  } else if (hasIncompleteSchedule) {
    errors.schedules = '근무요일과 시작·종료 시간을 모두 입력해 주세요'
  }

  const payAmount = Number(values.payAmount.replace(/[^0-9]/g, ''))
  if (values.payAmount.trim() === '' || payAmount <= 0) {
    errors.payAmount = '급여를 입력해 주세요'
  }

  // 서버가 description을 필수(minLength 1)로 받습니다
  if (values.description.trim() === '') {
    errors.description = '상세내용을 입력해 주세요'
  }

  return errors
}

interface UsePostingFormOptions {
  posting?: Posting | null
}

export function usePostingForm({ posting }: UsePostingFormOptions = {}) {
  const isEditMode = Boolean(posting)
  const [values, setValues] = useState<PostingFormValues>(() =>
    createInitialValues(posting)
  )
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const isValid = Object.keys(errors).length === 0
  const visibleErrors: PostingFormErrors = isSubmitAttempted ? errors : {}
  const isSubmitDisabled = isSubmitAttempted && !isValid

  const setWorkspaceId = useCallback((workspaceId: number) => {
    setValues(prev => ({ ...prev, workspaceId }))
  }, [])

  const setTitle = useCallback((title: string) => {
    setValues(prev => ({ ...prev, title }))
  }, [])

  const setPaymentType = useCallback((paymentType: PaymentType) => {
    setValues(prev => ({ ...prev, paymentType }))
  }, [])

  const setPayAmount = useCallback((payAmount: string) => {
    setValues(prev => ({
      ...prev,
      payAmount: payAmount.replace(/[^0-9]/g, ''),
    }))
  }, [])

  const setDescription = useCallback((description: string) => {
    setValues(prev => ({ ...prev, description }))
  }, [])

  const addSchedule = useCallback(() => {
    setValues(prev => ({
      ...prev,
      schedules: [...prev.schedules, createEmptySchedule()],
    }))
  }, [])

  const removeSchedule = useCallback((key: string) => {
    setValues(prev => ({
      ...prev,
      schedules: prev.schedules.filter(schedule => schedule.key !== key),
    }))
  }, [])

  const updateSchedule = useCallback(
    (key: string, patch: Partial<Omit<PostingFormSchedule, 'key'>>) => {
      setValues(prev => ({
        ...prev,
        schedules: prev.schedules.map(schedule =>
          schedule.key === key ? { ...schedule, ...patch } : schedule
        ),
      }))
    },
    []
  )

  const toggleScheduleDay = useCallback((key: string, day: WorkingDay) => {
    setValues(prev => ({
      ...prev,
      schedules: prev.schedules.map(schedule => {
        if (schedule.key !== key) return schedule
        const workingDays = schedule.workingDays.includes(day)
          ? schedule.workingDays.filter(item => item !== day)
          : [...schedule.workingDays, day]
        return { ...schedule, workingDays }
      }),
    }))
  }, [])

  const attemptSubmit = useCallback(() => {
    setIsSubmitAttempted(true)
    return Object.keys(validate(values)).length === 0
  }, [values])

  return {
    values,
    errors: visibleErrors,
    isValid,
    isSubmitDisabled,
    isEditMode,
    setWorkspaceId,
    setTitle,
    setPaymentType,
    setPayAmount,
    setDescription,
    addSchedule,
    removeSchedule,
    updateSchedule,
    toggleScheduleDay,
    attemptSubmit,
  }
}

export type PostingFormViewModel = ReturnType<typeof usePostingForm>
