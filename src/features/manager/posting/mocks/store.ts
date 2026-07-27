/**
 * 목업 인메모리 스토어.
 *
 * API 연동 전까지 화면 간 상태(등록/수정/마감/채용 결정)를 유지하기 위한 임시 저장소입니다.
 * 실제 API 연동 시 이 파일과 `mocks/data.ts`는 삭제하고,
 * 각 view-model 훅을 react-query(useQuery/useMutation)로 교체하면 됩니다.
 */
import { create } from 'zustand'

import {
  MOCK_APPLICATIONS,
  MOCK_POSTINGS,
} from '@/features/manager/posting/mocks/data'
import type {
  Application,
  ApplicationStatus,
  Posting,
  PostingFormSchedule,
  PostingFormValues,
  PostingSchedule,
} from '@/features/manager/posting/types/posting'

/** 네트워크 지연 흉내 — 스켈레톤/로딩 상태를 확인하기 위함 */
export const MOCK_LATENCY = 400

interface MockPostingState {
  postings: Posting[]
  applications: Application[]
  createPosting: (values: PostingFormValues, workspaceName: string) => number
  updatePosting: (postingId: number, values: PostingFormValues) => void
  closePosting: (postingId: number) => void
  updateApplicationStatus: (
    applicationId: number,
    status: ApplicationStatus
  ) => void
}

let nextPostingId = MOCK_POSTINGS.length + 1

function toPayAmount(payAmount: string): number {
  const parsed = Number(payAmount.replace(/[^0-9]/g, ''))
  return Number.isNaN(parsed) ? 0 : parsed
}

/** 폼 전용 필드(key)를 제거해 저장용 일정으로 변환 */
function toPostingSchedules(
  schedules: PostingFormSchedule[]
): PostingSchedule[] {
  return schedules.map(schedule => ({
    id: schedule.id,
    workingDays: schedule.workingDays,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    position: schedule.position,
    positionsNeeded: schedule.positionsNeeded,
  }))
}

export const useMockPostingStore = create<MockPostingState>((set, get) => ({
  postings: MOCK_POSTINGS,
  applications: MOCK_APPLICATIONS,

  createPosting: (values, workspaceName) => {
    nextPostingId += 1
    const id = nextPostingId
    const posting: Posting = {
      id,
      workspaceId: values.workspaceId ?? 0,
      workspaceName,
      businessType: '카페',
      title: values.title.trim(),
      description: values.description.trim(),
      paymentType: values.paymentType,
      payAmount: toPayAmount(values.payAmount),
      status: 'OPEN',
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      schedules: toPostingSchedules(values.schedules),
    }
    set(state => ({ postings: [posting, ...state.postings] }))
    return id
  },

  updatePosting: (postingId, values) => {
    set(state => ({
      postings: state.postings.map(posting =>
        posting.id === postingId
          ? {
              ...posting,
              title: values.title.trim(),
              description: values.description.trim(),
              paymentType: values.paymentType,
              payAmount: toPayAmount(values.payAmount),
              schedules: toPostingSchedules(values.schedules),
            }
          : posting
      ),
    }))
  },

  closePosting: postingId => {
    set(state => ({
      postings: state.postings.map(posting =>
        posting.id === postingId ? { ...posting, status: 'CLOSED' } : posting
      ),
    }))
  },

  updateApplicationStatus: (applicationId, status) => {
    const { applications } = get()
    set({
      applications: applications.map(application =>
        application.id === applicationId
          ? { ...application, status }
          : application
      ),
    })
  },
}))
