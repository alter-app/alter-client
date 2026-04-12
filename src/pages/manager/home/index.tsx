import { Navbar } from '@/shared/ui/common/Navbar'
import { TodayWorkerList } from '@/features/home/manager/ui/TodayWorkerList'
import type { TodayWorkerItem } from '@/features/home/manager/ui/TodayWorkerList'
import { StoreWorkerListItem } from '@/features/home/manager/ui/StoreWorkerListItem'
import type { StoreWorkerRole } from '@/features/home/manager/ui/StoreWorkerListItem'
import {
  OngoingPostingCard,
  type JobPostingItem,
} from '@/shared/ui/manager/OngoingPostingCard'
import {
  SubstituteApprovalCard,
  type SubstituteRequestItem,
} from '@/shared/ui/manager/SubstituteApprovalCard'

import homeBanner from '@/assets/home.png'

// 더미 데이터
const TODAY_WORKERS: TodayWorkerItem[] = [
  { id: '1', name: '알바생1', workTime: '00:00 ~ 00:00' },
  { id: '2', name: '알바생2', workTime: '00:00 ~ 00:00' },
]

interface StoreWorkerData {
  id: string
  name: string
  role: StoreWorkerRole
  nextWorkDate: string
  profileImageUrl?: string
}

const STORE_WORKERS: StoreWorkerData[] = [
  { id: '1', name: '이름임', role: 'manager', nextWorkDate: '2025. 1. 1.' },
  { id: '2', name: '이름임', role: 'staff', nextWorkDate: '2025. 1. 1.' },
  { id: '3', name: '이름임', role: 'staff', nextWorkDate: '2025. 1. 1.' },
]

const ONGOING_POSTINGS: JobPostingItem[] = [
  {
    id: '1',
    dDay: 'D-3',
    title: '[가게이름] 평일 저녁 마감 근무자 모집',
    wage: '시급 10,030원',
    workHours: '17:00 ~ 21:00',
    workDays: '수, 목, 금',
  },
  {
    id: '2',
    dDay: 'D-7',
    title: '[가게이름] 평일 저녁 마감 근무자 모집',
    wage: '시급 10,030원',
    workHours: '07:00 ~ 13:00',
    workDays: '월, 화, 수',
  },
  {
    id: '3',
    dDay: 'D-27',
    title: '[가게이름] 평일 저녁 마감 근무자 모집',
    wage: '시급 10,030원',
    workHours: '07:00 ~ 13:00',
    workDays: '월, 화, 수',
  },
]

const SUBSTITUTE_REQUESTS: SubstituteRequestItem[] = [
  {
    id: '1',
    name: '나영채',
    role: '알바',
    dateRange: '1월 1일 ↔ 1월 10일',
    status: 'accepted',
  },
  {
    id: '2',
    name: '나영채',
    role: '알바',
    dateRange: '1월 1일 ↔ 1월 10일',
    status: 'pending',
  },
  {
    id: '3',
    name: '나영채',
    role: '알바',
    dateRange: '1월 1일 ↔ 1월 10일',
    status: 'pending',
  },
]

export function ManagerHomePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col box-border bg-[#EFEFEF]">
      <Navbar />

      <div className=" h-50">
        <img
          src={homeBanner}
          alt="logo"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-white pt-3 px-8 pb-5">
        <div className="flex items-center justify-between">
          <div className="typography-headline02">MM월 dd일</div>
          <div className="typography-bg">전체 보기</div>
        </div>
        <div className="pt-6">
          <TodayWorkerList workers={TODAY_WORKERS} />
        </div>
      </div>
      <div className="pt-6 pb-8">
        <h2 className="px-5 mb-3 typography-headline01 text-gray-900">
          우리 매장 근무자
        </h2>

        <div className="bg-white mx-4 py-8  rounded-[16px] shadow-sm overflow-hidden flex flex-col">
          <div className="px-4">
            {STORE_WORKERS.map(worker => (
              <StoreWorkerListItem
                key={worker.id}
                name={worker.name}
                role={worker.role}
                nextWorkDate={worker.nextWorkDate}
                profileImageUrl={worker.profileImageUrl}
                onOptions={() => {}}
              />
            ))}
          </div>
          <div className="px-4 pb-4 pt-1">
            <button
              type="button"
              className="w-full py-3 rounded-[8px] border border-gray-200 bg-white typography-body02-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              더보기
            </button>
          </div>
        </div>
      </div>
      <div className="pt-6 pb-8">
        <h2 className="px-5 mb-3 typography-headline01 text-gray-900">
          진행 중인 공고 <span className="text-sub">10</span>건
        </h2>
        <div className="mx-4">
          <OngoingPostingCard
            postings={ONGOING_POSTINGS}
            onViewMore={() => {}}
            onPostingClick={() => {}}
          />
        </div>
      </div>
      <div className="pt-6 pb-8">
        <h2 className="px-5 mb-3 typography-headline01 text-gray-900">
          대타 승인 요청 <span className="text-sub">10</span>건
        </h2>
        <div className="mx-4">
          <SubstituteApprovalCard
            requests={SUBSTITUTE_REQUESTS}
            onViewMore={() => {}}
            onRequestClick={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
