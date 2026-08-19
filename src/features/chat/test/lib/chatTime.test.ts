import { describe, expect, it } from 'vitest'

import {
  formatChatListTime,
  formatDateDivider,
  formatMessageTime,
  isSameDay,
} from '../../lib/chatTime'

describe('채팅 시각 표기', () => {
  it('말풍선 옆 시각은 오전·오후 12시간제로 표기한다', () => {
    expect(formatMessageTime('2026-08-19T11:02:00')).toBe('오전 11:02')
    expect(formatMessageTime('2026-08-19T13:05:00')).toBe('오후 1:05')
  })

  it('자정과 정오는 12로 표기한다', () => {
    expect(formatMessageTime('2026-08-19T00:07:00')).toBe('오전 12:07')
    expect(formatMessageTime('2026-08-19T12:00:00')).toBe('오후 12:00')
  })

  it('잘못된 값은 빈 문자열을 반환한다', () => {
    expect(formatMessageTime('not-a-date')).toBe('')
    expect(formatDateDivider('not-a-date')).toBe('')
    expect(formatChatListTime('not-a-date')).toBe('')
  })
})

describe('날짜 구분선', () => {
  const now = new Date('2026-08-19T09:00:00')

  it('올해 날짜는 연도를 생략한다', () => {
    expect(formatDateDivider('2026-08-19T09:00:00', now)).toBe('8월 19일 (수)')
  })

  it('다른 해 날짜는 연도를 붙인다', () => {
    expect(formatDateDivider('2025-12-25T09:00:00', now)).toBe(
      '2025년 12월 25일 (목)'
    )
  })
})

describe('같은 날 판별', () => {
  it('시각이 달라도 같은 날이면 true', () => {
    expect(isSameDay('2026-08-19T00:01:00', '2026-08-19T23:59:00')).toBe(true)
  })

  it('하루라도 다르면 false', () => {
    expect(isSameDay('2026-08-19T23:59:00', '2026-08-20T00:01:00')).toBe(false)
  })

  it('잘못된 값이 섞이면 false', () => {
    expect(isSameDay('nope', '2026-08-19T00:01:00')).toBe(false)
  })
})

describe('채팅 목록 상대 시각', () => {
  const now = new Date('2026-08-19T15:00:00')

  it('오늘은 시각으로 표기한다', () => {
    expect(formatChatListTime('2026-08-19T09:10:00', now)).toBe('오전 9:10')
  })

  it('어제는 어제로 표기한다', () => {
    expect(formatChatListTime('2026-08-18T22:00:00', now)).toBe('어제')
  })

  it('올해의 지난 날짜는 월·일로 표기한다', () => {
    expect(formatChatListTime('2026-07-02T22:00:00', now)).toBe('7월 2일')
  })

  it('작년 날짜는 연도를 포함한다', () => {
    expect(formatChatListTime('2025-11-03T22:00:00', now)).toBe('2025. 11. 3.')
  })
})
