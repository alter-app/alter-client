import type { Meta, StoryObj } from '@storybook/react-vite'
import { StoreWorkerListItem } from '@/features/manager/home/ui/StoreWorkerListItem'

const meta = {
  title: 'features/home/manager/StoreWorkerListItem',
  component: StoreWorkerListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-[320px] bg-[#efefef] p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StoreWorkerListItem>

export default meta

type Story = StoryObj<typeof meta>

export const Staff: Story = {
  args: {
    name: '이름임',
    role: 'staff',
    nextWorkDate: '2025. 1. 1.',
  },
}

export const Manager: Story = {
  args: {
    name: '이름임',
    role: 'manager',
    nextWorkDate: '2025. 1. 1.',
  },
}
