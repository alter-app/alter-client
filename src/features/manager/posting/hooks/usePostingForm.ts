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

export function validatePostingForm(
  values: PostingFormValues,
  isEditMode: boolean
): PostingFormErrors {
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
  if (!isEditMode && values.schedules.length === 0) {
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
  const [serverErrors, setServerErrors] = useState<PostingFormErrors>({})

  const clientErrors = useMemo(
    () => validatePostingForm(values, isEditMode),
    [isEditMode, values]
  )
  const hasServerErrors = Object.keys(serverErrors).length > 0
  const isValid = Object.keys(clientErrors).length === 0 && !hasServerErrors
  const errors = {
    ...serverErrors,
    ...(isSubmitAttempted ? clientErrors : {}),
  }
  const isSubmitDisabled =
    hasServerErrors ||
    (isSubmitAttempted && Object.keys(clientErrors).length > 0)

  const clearServerError = useCallback((field: keyof PostingFormErrors) => {
    setServerErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const setWorkspaceId = useCallback(
    (workspaceId: number) => {
      clearServerError('workspaceId')
      setValues(prev => ({ ...prev, workspaceId }))
    },
    [clearServerError]
  )

  const setTitle = useCallback(
    (title: string) => {
      clearServerError('title')
      setValues(prev => ({ ...prev, title }))
    },
    [clearServerError]
  )

  const setPaymentType = useCallback(
    (paymentType: PaymentType) => {
      clearServerError('paymentType')
      setValues(prev => ({ ...prev, paymentType }))
    },
    [clearServerError]
  )

  const setPayAmount = useCallback(
    (payAmount: string) => {
      clearServerError('payAmount')
      setValues(prev => ({
        ...prev,
        payAmount: payAmount.replace(/[^0-9]/g, ''),
      }))
    },
    [clearServerError]
  )

  const setDescription = useCallback(
    (description: string) => {
      clearServerError('description')
      setValues(prev => ({ ...prev, description }))
    },
    [clearServerError]
  )

  const addSchedule = useCallback(() => {
    clearServerError('schedules')
    setValues(prev => ({
      ...prev,
      schedules: [...prev.schedules, createEmptySchedule()],
    }))
  }, [clearServerError])

  const removeSchedule = useCallback(
    (key: string) => {
      clearServerError('schedules')
      setValues(prev => ({
        ...prev,
        schedules: prev.schedules.filter(schedule => schedule.key !== key),
      }))
    },
    [clearServerError]
  )

  const updateSchedule = useCallback(
    (key: string, patch: Partial<Omit<PostingFormSchedule, 'key'>>) => {
      clearServerError('schedules')
      setValues(prev => ({
        ...prev,
        schedules: prev.schedules.map(schedule =>
          schedule.key === key ? { ...schedule, ...patch } : schedule
        ),
      }))
    },
    [clearServerError]
  )

  const toggleScheduleDay = useCallback(
    (key: string, day: WorkingDay) => {
      clearServerError('schedules')
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
    },
    [clearServerError]
  )

  const attemptSubmit = useCallback(() => {
    setIsSubmitAttempted(true)
    return (
      Object.keys(validatePostingForm(values, isEditMode)).length === 0 &&
      Object.keys(serverErrors).length === 0
    )
  }, [isEditMode, serverErrors, values])

  return {
    values,
    errors,
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
    setServerErrors,
  }
}

export type PostingFormViewModel = ReturnType<typeof usePostingForm>
