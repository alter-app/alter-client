import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

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
  chat: activeTab === 'chat',
})

/** 현재 Docbar 구성 — 채팅은 USER·MANAGER 공용 5탭 */
const TABS: TabKey[] = ['home', 'search', 'substitute', 'chat', 'my']

const meta = {
  title: 'shared/ui/common/Docbar',
  component: DocbarView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onTabClick: () => {},
    tabs: TABS,
  },
} satisfies Meta<typeof DocbarView>

export default meta
type Story = StoryObj<typeof meta>

export const HomeSelected: Story = {
  args: { selectedTab: createSelectedTab('home') },
}

export const SearchSelected: Story = {
  args: { selectedTab: createSelectedTab('search') },
}

export const SubstituteSelected: Story = {
  args: { selectedTab: createSelectedTab('substitute') },
}

export const MySelected: Story = {
  args: { selectedTab: createSelectedTab('my') },
}

export const ChatSelected: Story = {
  args: { selectedTab: createSelectedTab('chat') },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('채팅')).toBeVisible()
  },
}

/** 채팅 뱃지는 개인+전체 미읽음 합산값입니다 */
export const ChatWithUnreadBadge: Story = {
  args: {
    selectedTab: createSelectedTab('home'),
    badgeCountByTab: { chat: 4 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByLabelText('읽지 않은 메시지 4개')).toBeVisible()
  },
}

export const ChatWithOverflowBadge: Story = {
  args: {
    selectedTab: createSelectedTab('home'),
    badgeCountByTab: { chat: 150 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('99+')).toBeVisible()
  },
}

/** 사장님은 '알바 찾기'가 '내 공고'로 노출됩니다 */
export const ManagerPostingsSelected: Story = {
  args: {
    selectedTab: createSelectedTab('search'),
    labelByTab: { search: '내 공고' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('내 공고')).toBeVisible()
  },
}
