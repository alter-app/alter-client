import type { Meta, StoryObj } from '@storybook/react-vite'
import { WorkspaceChangeList } from '@/features/home/manager/ui/WorkspaceChangeList'

const MOCK_WORKSPACES = [
  {
    id: 1,
    businessName: '세븐일레븐',
    fullAddress: '서울특별시 강남구 테헤란로 123',
    createdAt: '2026-03-27T04:36:44.253Z',
    status: {
      value: 'PENDING',
      description: 'string',
    },
  },
  {
    id: 2,
    businessName: '스타벅스 강남점',
    fullAddress: '서울특별시 강남구 테헤란로 231',
    createdAt: '2026-03-27T04:36:44.253Z',
    status: {
      value: 'APPROVED',
      description: 'string',
    },
  },
]

const meta = {
  title: 'features/home/manager/WorkspaceChangeList',
  component: WorkspaceChangeList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-[320px] bg-white p-2'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkspaceChangeList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    workspaces: MOCK_WORKSPACES,
    selectedWorkspaceId: 1,
    categoryLabel: '카페',
  },
}
