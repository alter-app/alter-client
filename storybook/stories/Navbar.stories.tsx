import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Navbar } from '../../src/shared/ui/common/Navbar'

const meta = {
  title: 'shared/ui/common/Navbar',
  component: Navbar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
