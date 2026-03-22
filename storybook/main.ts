import type { StorybookConfig } from '@storybook/react-vite'

// 스토리: storybook/stories/ 또는 src/ 옆 *.stories.*
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    './stories/**/*.mdx',
    './stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
}

export default config
