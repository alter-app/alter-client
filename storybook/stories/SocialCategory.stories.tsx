import type { Meta, StoryObj } from '@storybook/react-vite'

import { SocialCategory } from '../../src/shared/ui/manager/social/SocialCategory'

const meta = {
  title: 'shared/ui/social/SocialCategory',
  component: SocialCategory,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof SocialCategory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: '전체',
    active: false,
  },
}

export const Active: Story = {
  args: {
    label: '전체',
    active: true,
  },
}
