import { useState } from 'react'
import type { NotificationItemProps } from '@/shared/ui/notification/NotificationItem'

export type NotificationTab = 'substitute' | 'reputation'

type RawItem = Omit<NotificationItemProps, 'onDelete'>

const SUBSTITUTE_DATA: RawItem[] = [
  {
    isRead: false,
    category: '대타 요청',
    timeAgo: '10시간 전',
    message: '2월 4일 CU 서구가정로점에서\n대타 요청이 도착했어요',
    highlightedWord: 'CU 서구가정로',
    subLabel: '자세히 보기',
  },
  {
    isRead: false,
    category: '대타 요청',
    timeAgo: '10시간 전',
    message: '2월 4일 동양미래대에서 대타 요청이 도착했어요',
    highlightedWord: '동양미래대',
    subLabel: '자세히 보기',
  },
  {
    isRead: true,
    category: '대타 요청',
    timeAgo: '2일 전',
    message: '3월 30일 KFC 잠실 롯데월드점 대타 요청을 거절했어요',
    highlightedWord: 'KFC 잠실 롯데월드',
  },
  {
    isRead: true,
    category: '대타 요청',
    timeAgo: '3일 전',
    message: '3월 28일 스타벅스 강남점 대타 요청이 만료됐어요',
    highlightedWord: '스타벅스 강남',
  },
]

const REPUTATION_DATA: RawItem[] = [
  {
    isRead: false,
    category: '평판',
    timeAgo: '1일 전',
    message: '김철수님이 회원님에게 평판을 남겼어요',
    highlightedWord: '김철수',
    subLabel: '자세히 보기',
  },
  {
    isRead: true,
    category: '평판',
    timeAgo: '5일 전',
    message: '이영희님이 회원님에게 평판을 남겼어요',
    highlightedWord: '이영희',
    subLabel: '자세히 보기',
  },
]

// TODO: 로그인 계정 타입에 따라 다른 API 호출
export function useNotificationViewModel() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('substitute')
  const [substituteItems, setSubstituteItems] =
    useState<RawItem[]>(SUBSTITUTE_DATA)
  const [reputationItems, setReputationItems] =
    useState<RawItem[]>(REPUTATION_DATA)

  const deleteSubstitute = (idx: number) =>
    setSubstituteItems(prev => prev.filter((_, i) => i !== idx))

  const deleteReputation = (idx: number) =>
    setReputationItems(prev => prev.filter((_, i) => i !== idx))

  const currentItems: NotificationItemProps[] = (
    activeTab === 'substitute' ? substituteItems : reputationItems
  ).map((item, idx) => ({
    ...item,
    onDelete:
      activeTab === 'substitute'
        ? () => deleteSubstitute(idx)
        : () => deleteReputation(idx),
  }))

  const hasUnreadSubstitute = substituteItems.some(item => !item.isRead)
  const hasUnreadReputation = reputationItems.some(item => !item.isRead)

  return {
    activeTab,
    setActiveTab,
    currentItems,
    hasUnreadSubstitute,
    hasUnreadReputation,
  }
}
