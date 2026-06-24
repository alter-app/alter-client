import { describe, expect, it } from 'vitest'

import type {
  ReceivedSubstituteRequestDto,
  SentSubstituteRequestDetailApiDto,
  SentSubstituteRequestDetailDto,
  SentSubstituteRequestListItemDto,
  SubstituteTargetDto,
} from '@/features/user/substitute/types'

import {
  adaptReceivedSubstituteDetail,
  adaptSentSubstituteDetail,
  adaptUserSubstituteListItem,
  normalizeSentSubstituteDetailDto,
} from './adaptUserSubstituteRequest'

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
