import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { AxiosError, type AxiosAdapter } from 'axios'
import { useRef } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { SubstituteRequestDetailView } from '../../src/pages/user/substitute-request/components/SubstituteRequestDetailView'
import type { ReceivedSubstituteRequestDto } from '../../src/features/user/substitute/types'
import axiosInstance from '../../src/shared/lib/axiosInstance'
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

/** 스토리 동안 모든 요청을 주어진 오류 응답으로 실패시키고, 끝나면 원래 adapter로 되돌린다. */
function failRequestsWith(status: number, data: unknown) {
  return () => {
    const original = axiosInstance.defaults.adapter
    const adapter: AxiosAdapter = async config => {
      throw new AxiosError(
        `Request failed with status code ${status}`,
        String(status),
        config,
        null,
        { status, statusText: '', data, headers: {}, config }
      )
    }
    axiosInstance.defaults.adapter = adapter
    return () => {
      axiosInstance.defaults.adapter = original
    }
  }
}

/** 스토리 동안 모든 요청을 응답 없이 대기시켜 처리 중 상태를 유지하고, 끝나면 원래 adapter로 되돌린다. */
function holdRequests() {
  const original = axiosInstance.defaults.adapter
  axiosInstance.defaults.adapter = () => new Promise(() => {})
  return () => {
    axiosInstance.defaults.adapter = original
  }
}

/** 받은 목록 쿼리를 활성으로 두되 첫 조회 뒤의 재조회는 끝나지 않게 해, 실패 안내가 재조회를 기다리는지 드러낸다. */
function ListQueryWithStalledRefetch() {
  const calls = useRef(0)
  useQuery({
    queryKey: ['userSubstitute', 'list', { direction: 'RECEIVED' }],
    queryFn: () =>
      calls.current++ === 0 ? Promise.resolve(null) : new Promise(() => {}),
  })
  return null
}

const withStalledListRefetch: NonNullable<Story['decorators']> = [
  Story => (
    <>
      <ListQueryWithStalledRefetch />
      <Story />
    </>
  ),
]

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

/** 다른 업장 근무와 겹쳐 수락이 409 B020으로 막히면 서버 문구를 보여 주고, 확인하면 목록으로 돌아간다 */
export const ReceivedAcceptConflict: Story = {
  args: { onBack: fn() },
  beforeEach: failRequestsWith(409, {
    code: 'B020',
    message: '해당 시간대에 이미 다른 근무 일정이 있습니다.',
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: '수락' }))

    const dialog = await canvas.findByRole('dialog')
    await expect(within(dialog).getByText('처리할 수 없어요')).toBeVisible()
    await expect(
      within(dialog).getByText('해당 시간대에 이미 다른 근무 일정이 있습니다.')
    ).toBeVisible()

    await userEvent.click(within(dialog).getByRole('button', { name: '확인' }))
    await expect(args.onBack).toHaveBeenCalled()
  },
}

/** 409 B020에 서버 문구가 없으면 "존재하지 않는 스케줄입니다." 대신 기존 기본 문구를 보여 준다 */
export const ReceivedAcceptConflictWithoutMessage: Story = {
  args: { onBack: fn() },
  beforeEach: failRequestsWith(409, { code: 'B020', message: '' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: '수락' }))

    const dialog = await canvas.findByRole('dialog')
    await expect(
      within(dialog).getByText('요청 처리에 실패했습니다.')
    ).toBeVisible()
    await expect(canvas.queryByText('존재하지 않는 스케줄입니다.')).toBeNull()
  },
}

/** 충돌이 아닌 수락 실패는 지금처럼 상세 화면 안에 문구를 보여 주고 머무른다 */
export const ReceivedAcceptOtherFailure: Story = {
  args: { onBack: fn() },
  beforeEach: failRequestsWith(403, {
    code: 'A002',
    message: '권한이 없습니다.',
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: '수락' }))

    await expect(await canvas.findByText('권한이 없습니다.')).toBeVisible()
    await expect(canvas.queryByRole('dialog')).toBeNull()
    await expect(args.onBack).not.toHaveBeenCalled()
  },
}

/** 거절 실패는 거절 사유 모달을 닫지 않고 모달 안에 문구를 보여 준다 */
export const ReceivedRejectOtherFailure: Story = {
  args: { onBack: fn() },
  beforeEach: failRequestsWith(403, {
    code: 'A002',
    message: '권한이 없습니다.',
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: '거절' }))

    const dialog = await canvas.findByRole('dialog')
    await userEvent.type(within(dialog).getByRole('textbox'), '일정이 있어요')
    await userEvent.click(
      within(dialog).getByRole('button', { name: '거절하기' })
    )

    await expect(
      await within(dialog).findByText('권한이 없습니다.')
    ).toBeVisible()
    await expect(within(dialog).getByRole('textbox')).toHaveValue(
      '일정이 있어요'
    )
    await expect(args.onBack).not.toHaveBeenCalled()
  },
}

/** 이미 처리된 요청을 거절해 400 B001이 오면 거절 모달 대신 확인 모달을 보여 주고, 확인하면 목록으로 돌아간다 */
export const ReceivedRejectConflict: Story = {
  args: { onBack: fn() },
  beforeEach: failRequestsWith(400, {
    code: 'B001',
    message: '이미 처리된 대타 요청입니다.',
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: '거절' }))

    const rejectDialog = await canvas.findByRole('dialog')
    await userEvent.type(
      within(rejectDialog).getByRole('textbox'),
      '일정이 있어요'
    )
    await userEvent.click(
      within(rejectDialog).getByRole('button', { name: '거절하기' })
    )

    await waitFor(() =>
      expect(canvas.getByText('처리할 수 없어요')).toBeVisible()
    )
    await expect(canvas.getAllByRole('dialog')).toHaveLength(1)
    await expect(canvas.getByText('이미 처리된 대타 요청입니다.')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: '확인' }))
    await expect(args.onBack).toHaveBeenCalled()
  },
}

/** 거절 처리 중에는 Escape·배경 클릭으로 거절 모달이 닫히지 않는다 */
export const ReceivedRejectPendingKeepsModal: Story = {
  args: { onBack: fn() },
  beforeEach: holdRequests,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: '거절' }))

    const dialog = await canvas.findByRole('dialog')
    await userEvent.type(within(dialog).getByRole('textbox'), '일정이 있어요')
    await userEvent.click(
      within(dialog).getByRole('button', { name: '거절하기' })
    )
    await expect(
      await within(dialog).findByRole('button', { name: '처리 중…' })
    ).toBeDisabled()

    await userEvent.keyboard('{Escape}')
    await userEvent.click(canvas.getByRole('button', { name: '닫기' }))

    await expect(canvas.getByRole('dialog')).toBeVisible()
    await expect(within(dialog).getByRole('textbox')).toHaveValue(
      '일정이 있어요'
    )
  },
}

/** 실패 후 목록 재조회가 늦어도 충돌 안내는 바로 보인다 */
export const ReceivedAcceptConflictDuringSlowRefetch: Story = {
  args: { onBack: fn() },
  decorators: withStalledListRefetch,
  beforeEach: failRequestsWith(409, {
    code: 'B020',
    message: '해당 시간대에 이미 다른 근무 일정이 있습니다.',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: '수락' }))

    const dialog = await canvas.findByRole('dialog')
    await expect(within(dialog).getByText('처리할 수 없어요')).toBeVisible()
  },
}

/** 실패 후 목록 재조회가 늦어도 거절 오류가 바로 보이고 거절 모달을 닫을 수 있다 */
export const ReceivedRejectFailureDuringSlowRefetch: Story = {
  args: { onBack: fn() },
  decorators: withStalledListRefetch,
  beforeEach: failRequestsWith(403, {
    code: 'A002',
    message: '권한이 없습니다.',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: '거절' }))

    const dialog = await canvas.findByRole('dialog')
    await userEvent.type(within(dialog).getByRole('textbox'), '일정이 있어요')
    await userEvent.click(
      within(dialog).getByRole('button', { name: '거절하기' })
    )
    await expect(
      await within(dialog).findByText('권한이 없습니다.')
    ).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull())
  },
}
