import { describe, expect, it } from 'vitest'

import type {
  ReceivedSubstituteRequestDto,
  SentSubstituteRequestDetailApiDto,
  SentSubstituteRequestDetailDto,
  SentSubstituteRequestListItemDto,
  SubstituteEnumValueDto,
  SubstituteTargetDto,
} from '@/features/user/substitute/types'

import {
  adaptReceivedSubstituteDetail,
  adaptSentSubstituteDetail,
  adaptUserSubstituteListItem,
  mapApiStatusToUi,
  normalizeSentSubstituteDetailDto,
  statusLabelForApi,
  unwrapSubstituteEnum,
} from './adaptUserSubstituteRequest'
import { resolveApiStatuses } from './substituteListFilters'

const schedule = {
  scheduleId: 1,
  startDateTime: '2026-04-05T09:00:00',
  endDateTime: '2026-04-05T13:00:00',
  position: 'STAFF',
}
const workspace = { workspaceId: 10, workspaceName: '카페' }

function received(
  profileImageUrl?: string | null
): ReceivedSubstituteRequestDto {
  return {
    id: 1,
    schedule,
    workspace,
    requester: { workerId: 5, workerName: '요청자', profileImageUrl },
    requestType: 'SPECIFIC',
    status: 'PENDING',
    createdAt: '2026-04-01T00:00:00',
  }
}

function target(profileImageUrl?: string | null): SubstituteTargetDto {
  return {
    targetId: 7,
    workerName: '대상자',
    profileImageUrl,
    status: 'PENDING',
  }
}

function sentList(opts: {
  acceptedWorker?: {
    workerId: number
    workerName: string
    profileImageUrl?: string | null
  } | null
  targets?: SubstituteTargetDto[]
}): SentSubstituteRequestListItemDto {
  return {
    id: 2,
    schedule,
    workspace,
    requestType: 'SPECIFIC',
    status: 'PENDING',
    createdAt: '2026-04-01T00:00:00',
    targets: opts.targets,
    acceptedWorker: opts.acceptedWorker ?? null,
  }
}

function sentDetail(opts: {
  acceptedWorker?: {
    workerId: number
    workerName: string
    profileImageUrl?: string | null
  } | null
  targets?: SubstituteTargetDto[]
}): SentSubstituteRequestDetailDto {
  return {
    id: 3,
    schedule,
    workspace,
    requester: { workerId: 5, workerName: '요청자' },
    requestType: 'SPECIFIC',
    targets: opts.targets ?? [],
    acceptedWorker: opts.acceptedWorker ?? null,
    status: 'PENDING',
    createdAt: '2026-04-01T00:00:00',
  }
}

describe('대타요청 프로필 이미지 데이터 흐름', () => {
  it('RECEIVED 목록은 요청자의 profileImageUrl을 imageUrl로 매핑한다', () => {
    const item = adaptUserSubstituteListItem(
      received('https://img/requester.png'),
      'RECEIVED'
    )
    expect(item.imageUrl).toBe('https://img/requester.png')
  })

  it('RECEIVED 상세는 요청자의 profileImageUrl을 imageUrl로 매핑한다', () => {
    const detail = adaptReceivedSubstituteDetail(
      received('https://img/requester.png')
    )
    expect(detail.imageUrl).toBe('https://img/requester.png')
  })

  it('SENT은 수락자가 있으면 수락자의 이미지를 사용한다', () => {
    const accepted = {
      workerId: 9,
      workerName: '수락자',
      profileImageUrl: 'https://img/accepted.png',
    }
    const targets = [target('https://img/target.png')]

    expect(
      adaptUserSubstituteListItem(
        sentList({ acceptedWorker: accepted, targets }),
        'SENT'
      ).imageUrl
    ).toBe('https://img/accepted.png')
    expect(
      adaptSentSubstituteDetail(
        sentDetail({ acceptedWorker: accepted, targets })
      ).imageUrl
    ).toBe('https://img/accepted.png')
  })

  it('SENT은 수락자가 없으면 첫 대상자의 이미지를 사용한다', () => {
    const targets = [target('https://img/target.png')]

    expect(
      adaptUserSubstituteListItem(sentList({ targets }), 'SENT').imageUrl
    ).toBe('https://img/target.png')
    expect(adaptSentSubstituteDetail(sentDetail({ targets })).imageUrl).toBe(
      'https://img/target.png'
    )
  })

  it('이미지 필드가 없으면 null로 정규화한다', () => {
    expect(
      adaptUserSubstituteListItem(received(), 'RECEIVED').imageUrl
    ).toBeNull()
    expect(adaptReceivedSubstituteDetail(received()).imageUrl).toBeNull()
    expect(
      adaptUserSubstituteListItem(sentList({ targets: [target()] }), 'SENT')
        .imageUrl
    ).toBeNull()
  })

  it('RECEIVED 목록은 enum 래퍼 status를 언래핑한다', () => {
    const item = adaptUserSubstituteListItem(
      {
        ...received(),
        status: { value: 'PENDING', description: '대기중' },
        requestType: { value: 'SPECIFIC', description: '특정 대상' },
      },
      'RECEIVED'
    )
    expect(item.rawStatus).toBe('PENDING')
    expect(item.uiStatus).toBe('pending')
    expect(item.statusLabel).toBe('확인중')
  })

  it('RECEIVED 상세는 enum 래퍼 status로 canRespond를 판단한다', () => {
    const detail = adaptReceivedSubstituteDetail({
      ...received(),
      status: { value: 'PENDING', description: '대기중' },
    })
    expect(detail.rawStatus).toBe('PENDING')
    expect(detail.canRespond).toBe(true)
  })

  it('normalize는 API target의 profileImageUrl을 정규화 target으로 전달한다', () => {
    const api: SentSubstituteRequestDetailApiDto = {
      id: 4,
      schedule,
      workspace,
      requester: { workerId: 5, workerName: '요청자' },
      requestType: 'SPECIFIC',
      targets: [
        {
          target: {
            workerId: 7,
            workerName: '대상자',
            profileImageUrl: 'https://img/target.png',
          },
          status: 'PENDING',
        },
      ],
      status: 'PENDING',
      createdAt: '2026-04-01T00:00:00',
    }

    expect(
      normalizeSentSubstituteDetailDto(api).targets[0].profileImageUrl
    ).toBe('https://img/target.png')
  })
})

describe('unwrapSubstituteEnum', () => {
  it('enum 래퍼에서 value 문자열을 반환한다', () => {
    expect(
      unwrapSubstituteEnum({ value: 'PENDING', description: '대기중' })
    ).toBe('PENDING')
  })

  it('value가 null·undefined·빈 문자열이면 빈 문자열을 반환한다', () => {
    expect(
      unwrapSubstituteEnum({
        value: null as unknown as string,
        description: '대기중',
      })
    ).toBe('')
    expect(
      unwrapSubstituteEnum({
        value: undefined as unknown as string,
        description: '대기중',
      })
    ).toBe('')
    expect(unwrapSubstituteEnum({ value: '', description: '대기중' })).toBe('')
    expect(unwrapSubstituteEnum({ value: '   ', description: '대기중' })).toBe(
      ''
    )
  })

  it('value 키가 없는 객체면 빈 문자열을 반환한다', () => {
    expect(
      unwrapSubstituteEnum({
        description: '대기중',
      } as unknown as SubstituteEnumValueDto)
    ).toBe('')
  })

  it('비정상 enum 래퍼여도 목록 어댑터가 에러 없이 동작한다', () => {
    const item = adaptUserSubstituteListItem(
      {
        ...received(),
        status: {
          value: null,
          description: '대기중',
        } as unknown as ReceivedSubstituteRequestDto['status'],
      },
      'RECEIVED'
    )
    expect(item.rawStatus).toBe('')
    expect(item.uiStatus).toBe('pending')
  })
})

describe('알바생 수락과 사장님 승인 상태 구분', () => {
  it('ACCEPTED는 accepted, APPROVED는 approved로 매핑한다', () => {
    expect(mapApiStatusToUi('ACCEPTED')).toBe('accepted')
    expect(mapApiStatusToUi('APPROVED')).toBe('approved')
  })

  it('ACCEPTED는 수락됨, APPROVED는 승인됨으로 표시한다', () => {
    expect(statusLabelForApi('ACCEPTED', 'accepted')).toBe('수락됨')
    expect(statusLabelForApi('APPROVED', 'approved')).toBe('승인됨')
  })

  it('APPROVED 목록 항목은 승인됨 상태로 변환한다', () => {
    const item = adaptUserSubstituteListItem(
      { ...sentList({}), status: { value: 'APPROVED', description: '승인' } },
      'SENT'
    )
    expect(item.uiStatus).toBe('approved')
    expect(item.statusLabel).toBe('승인됨')
  })

  it('APPROVED 보낸 상세는 승인됨을 표시하고 취소할 수 없다', () => {
    const detail = adaptSentSubstituteDetail({
      ...sentDetail({}),
      status: 'APPROVED',
    })
    expect(detail.uiStatus).toBe('approved')
    expect(detail.statusLabel).toBe('승인됨')
    expect(detail.canCancel).toBe(false)
  })

  it('ACCEPTED 보낸 상세는 수락됨을 표시하고 취소할 수 있다', () => {
    const detail = adaptSentSubstituteDetail({
      ...sentDetail({}),
      status: 'ACCEPTED',
    })
    expect(detail.uiStatus).toBe('accepted')
    expect(detail.statusLabel).toBe('수락됨')
    expect(detail.canCancel).toBe(true)
  })

  it('수락됨·승인됨 필터는 각각 하나의 API 상태만 요청한다', () => {
    expect(resolveApiStatuses('accepted')).toEqual(['ACCEPTED'])
    expect(resolveApiStatuses('approved')).toEqual(['APPROVED'])
  })
})
