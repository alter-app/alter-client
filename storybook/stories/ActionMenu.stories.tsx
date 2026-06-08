import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

import {
  ActionMenu,
  type ActionMenuItem,
} from '../../src/shared/ui/common/ActionMenu'

import EditIcon from '../../src/assets/icons/my/edit.svg?react'
import AlertCircleIcon from '../../src/assets/icons/my/alert-circle.svg?react'
import MoreVerticalIcon from '../../src/assets/icons/home/more-vertical.svg?react'

const meta = {
  title: 'shared/ui/common/ActionMenu',
  component: ActionMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ActionMenu>

export default meta
type Story = StoryObj<typeof meta>

const defaultItems: ActionMenuItem[] = [
  {
    icon: <EditIcon width={20} height={20} />,
    label: '수정하기',
    onClick: () => {},
  },
  {
    icon: <AlertCircleIcon width={20} height={20} />,
    label: '삭제하기',
    iconColor: '#FF4444',
    onClick: () => {},
  },
]

export const Default: Story = {
  args: {
    items: defaultItems,
    isOpen: true,
    onClose: () => {},
  },
}

export const SingleItem: Story = {
  args: {
    items: [
      {
        icon: <AlertCircleIcon width={20} height={20} />,
        label: '퇴사하기',
        iconColor: '#FF4444',
        onClick: () => {},
      },
    ],
    isOpen: true,
    onClose: () => {},
  },
}

function WithTriggerExample() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2"
      >
        <MoreVerticalIcon width={20} height={20} />
      </button>
      <ActionMenu
        items={defaultItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="right-0 top-full mt-1"
      />
    </div>
  )
}

export const WithTrigger: Story = {
  args: {
    items: defaultItems,
    isOpen: false,
    onClose: () => {},
  },
  render: () => <WithTriggerExample />,
}
