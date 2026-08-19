import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  DocbarView,
  type DocbarSelectedTab,
} from '../../src/shared/ui/common/Docbar'
import type { TabKey } from '../../src/shared/types/tab'

const createSelectedTab = (activeTab: TabKey): DocbarSelectedTab => ({
  home: activeTab === 'home',
  my: activeTab === 'my',
  search: activeTab === 'search',
  substitute: activeTab === 'substitute',
  applicant: activeTab === 'applicant',
})

/** 사장님(MANAGER) 탭 구성 — 지원자 탭 포함 5탭 */
const MANAGER_TABS: TabKey[] = [
  'home',
  'search',
  'applicant',
  'substitute',
  'my',
]

const meta = {
  title: 'shared/ui/common/Docbar',
  component: DocbarView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocbarView>

export default meta
type Story = StoryObj<typeof meta>

export const HomeSelected: Story = {
  args: {
    selectedTab: createSelectedTab('home'),
    onTabClick: () => {},
    tabs: ['home', 'search', 'substitute', 'my'],
  },
}

export const SearchSelected: Story = {
  args: {
    selectedTab: createSelectedTab('search'),
    onTabClick: () => {},
    tabs: ['home', 'search', 'substitute', 'my'],
  },
}

export const SubstituteSelected: Story = {
  args: {
    selectedTab: createSelectedTab('substitute'),
    onTabClick: () => {},
    tabs: ['home', 'search', 'substitute', 'my'],
  },
}

export const MySelected: Story = {
  args: {
    selectedTab: createSelectedTab('my'),
    onTabClick: () => {},
    tabs: ['home', 'search', 'substitute', 'my'],
  },
}

/** 사장님 5탭 — '알바 찾기'가 '내 공고'로 노출되고 지원자 탭이 추가됩니다 */
export const ManagerApplicantSelected: Story = {
  args: {
    selectedTab: createSelectedTab('applicant'),
    onTabClick: () => {},
    tabs: MANAGER_TABS,
    labelByTab: { search: '내 공고' },
  },
}

export const ManagerPostingsSelected: Story = {
  args: {
    selectedTab: createSelectedTab('search'),
    onTabClick: () => {},
    tabs: MANAGER_TABS,
    labelByTab: { search: '내 공고' },
  },
}
