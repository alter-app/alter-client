import type { Meta, StoryObj } from '@storybook/react-vite'

import { DocbarView, type DocbarSelectedTab } from '../../src/shared/ui/common/Docbar'
import type { TabKey } from '../../src/shared/types/tab'

const createSelectedTab = (activeTab: TabKey): DocbarSelectedTab => ({
  home: activeTab === 'home',
  my: activeTab === 'my',
  message: activeTab === 'message',
  repute: activeTab === 'repute',
  search: activeTab === 'search',
})

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
  },
}

export const SearchSelected: Story = {
  args: {
    selectedTab: createSelectedTab('search'),
    onTabClick: () => {},
  },
}

export const MessageSelected: Story = {
  args: {
    selectedTab: createSelectedTab('message'),
    onTabClick: () => {},
  },
}
