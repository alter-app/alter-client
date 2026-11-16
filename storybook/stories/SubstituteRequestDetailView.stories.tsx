import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import { SubstituteRequestDetailView } from '../../src/pages/user/substitute-request/components/SubstituteRequestDetailView'
import type { ReceivedSubstituteRequestDto } from '../../src/features/user/substitute/types'
import { MobileLayoutWithDocbar } from '../../src/shared/ui/MobileLayoutWithDocbar'

function received(
  overrides: Partial<ReceivedSubstituteRequestDto> = {}
): ReceivedSubstituteRequestDto {
  return {
    id: 1,
    schedule: {
      scheduleId: 1,
      startDateTime: '2026-10-08T09:00:00',
      endDateTime: '2026-10-08T18:30:00',
      position: 'STAFF',
    },
    workspace: { workspaceId: 10, workspaceName: '알터 카페 강남역점' },
    requester: { workerId: 5, workerName: '김알바' },
    requestType: 'SPECIFIC',
    status: 'PENDING',
    requestReason: '개인 사정으로 근무가 어려워 대타를 요청합니다.',
    createdAt: '2026-10-01T00:00:00',
    ...overrides,
  }
}

const meta = {
  title: 'pages/user/substitute-request/SubstituteRequestDetailView',
  component: SubstituteRequestDetailView,
  parameters: { layout: 'fullscreen' },
  args: {
    requestId: 1,
    directionTab: 'received',
    receivedFallback: received(),
    onBack: () => {},
  },
  decorators: [
    Story => (
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/user/substitute-request/1']}>
          <MobileLayoutWithDocbar>
            <Story />
          </MobileLayoutWithDocbar>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof SubstituteRequestDetailView>

export default meta
type Story = StoryObj<typeof meta>

export const ReceivedPending: Story = {}

export const LongReason: Story = {
  args: {
    receivedFallback: received({
      requestReason:
        '갑작스러운 가족 행사로 해당 날짜 근무가 어렵습니다. 자세한 내용은 https://example.com/very/long/url/without/any/break/points/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa 를 참고해 주세요.\n\n'.repeat(
          4
        ),
    }),
  },
}

export const ReceivedApproved: Story = {
  args: {
    receivedFallback: received({ status: 'APPROVED' }),
  },
}

/** 전체 요청은 PENDING이지만 본인이 이미 거절한 ALL 요청 */
export const ReceivedRejectedByMe: Story = {
  args: {
    receivedFallback: received({
      requestType: 'ALL',
      status: { value: 'PENDING', description: '대기 중' },
      myTargetStatus: { value: 'REJECTED', description: '거절됨' },
    }),
  },
}

/** 다른 근무자가 먼저 수락하고 사장님 승인까지 끝난 ALL 요청 */
export const ReceivedAcceptedByOthers: Story = {
  args: {
    receivedFallback: received({
      requestType: 'ALL',
      status: { value: 'APPROVED', description: '승인됨' },
      myTargetStatus: {
        value: 'ACCEPTED_BY_OTHERS',
        description: '다른 사람에게 수락됨',
      },
    }),
  },
}
