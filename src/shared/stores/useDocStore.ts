import { create } from 'zustand'
import type { TabKey } from '@/shared/types/tab'

const PATHNAME_TAB_MAP: Array<{ matcher: RegExp; tab: TabKey }> = [
  { matcher: /(^|\/)home(\/|$)/, tab: 'home' },
  { matcher: /(^|\/)my(\/|$)/, tab: 'my' },
  { matcher: /(^|\/)search(\/|$)/, tab: 'search' },
  { matcher: /^\/user\/substitute-request/, tab: 'substitute' },
  { matcher: /^\/manager\/home/, tab: 'home' },
  { matcher: /^\/user\/job-lookup-map/, tab: 'search' },
  // 사장님 구인구직 — 지원자 경로가 아래 내 공고 패턴보다 먼저 매칭돼야 합니다
  { matcher: /^\/manager\/postings\/applications/, tab: 'applicant' },
  // 사장님 구인구직 — 알바찾기(내 공고) 탭 하이라이트
  { matcher: /^\/manager\/postings/, tab: 'search' },
]

const createSelectedTab = (activeTab?: TabKey): Record<TabKey, boolean> => ({
  home: activeTab === 'home',
  my: activeTab === 'my',
  search: activeTab === 'search',
  substitute: activeTab === 'substitute',
  applicant: activeTab === 'applicant',
})

interface DocStoreState {
  selectedTab: Record<TabKey, boolean>
  setSelectedTab: (selectedTab: DocStoreState['selectedTab']) => void
  setSelectedTabByPathname: (pathname: string) => void
}

export const useDocStore = create<DocStoreState>(set => ({
  selectedTab: createSelectedTab(),
  setSelectedTab: selectedTab => set({ selectedTab }),
  setSelectedTabByPathname: pathname => {
    const matchedTab = PATHNAME_TAB_MAP.find(({ matcher }) =>
      matcher.test(pathname)
    )?.tab
    set({ selectedTab: createSelectedTab(matchedTab) })
  },
}))
