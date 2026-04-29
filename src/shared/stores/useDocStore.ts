import { create } from 'zustand'
import type { TabKey } from '@/shared/types/tab'

const PATHNAME_TAB_MAP: Array<{ matcher: RegExp; tab: TabKey }> = [
  { matcher: /(^|\/)home(\/|$)/, tab: 'home' },
  { matcher: /(^|\/)my(\/|$)/, tab: 'my' },
  { matcher: /^\/manager\/social(?:\/|$)/, tab: 'message' },
  { matcher: /(^|\/)message(\/|$)/, tab: 'message' },
  { matcher: /(^|\/)repute(\/|$)/, tab: 'repute' },
  { matcher: /(^|\/)search(\/|$)/, tab: 'search' },
  { matcher: /^\/manager\/home/, tab: 'home' },
  { matcher: /^\/user\/job-lookup-map/, tab: 'search' },
]

const createSelectedTab = (activeTab?: TabKey) => ({
  home: activeTab === 'home',
  my: activeTab === 'my',
  message: activeTab === 'message',
  repute: activeTab === 'repute',
  search: activeTab === 'search',
})

interface DocStoreState {
  selectedTab: {
    home: boolean
    my: boolean
    message: boolean
    repute: boolean
    search: boolean
  }
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
