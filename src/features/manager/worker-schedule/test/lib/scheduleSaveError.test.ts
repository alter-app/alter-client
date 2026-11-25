import { describe, expect, it } from 'vitest'

import {
  CreatedScheduleNotFoundError,
  ScheduleAssignPendingError,
} from '../../lib/saveGeneralWorkerSchedule'
import {
  resolveFixedScheduleSaveError,
  resolveGeneralScheduleSaveError,
} from '../../lib/scheduleSaveError'

function axiosError(status: number, data: unknown) {
  return {
    isAxiosError: true,
    message: `Request failed with status code ${status}`,
    response: { status, data },
  }
}

const TOO_MANY_REQUESTS = {
  code: 'E001',
  message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  data: null,
}

describe('resolveGeneralScheduleSaveError', () => {
  it('400 B001이면 서버 안내를 보여준다', () => {
    expect(
      resolveGeneralScheduleSaveError(
        axiosError(400, {
          code: 'B001',
          message: '해당 근무자가 이미 같은 시간대에 배정된 스케줄이 있습니다.',
          data: null,
        })
      )
    ).toBe('해당 근무자가 이미 같은 시간대에 배정된 스케줄이 있습니다.')
  })

  it('400 B001에 메시지가 없으면 기본 안내를 보여준다', () => {
    expect(
      resolveGeneralScheduleSaveError(axiosError(400, { code: 'B001' }))
    ).toContain('시간을 확인해 주세요')
  })

  it('배정 실패는 서버 원인 뒤에 재저장 방법을 붙인다', () => {
    expect(
      resolveGeneralScheduleSaveError(
        new ScheduleAssignPendingError(
          30,
          axiosError(400, {
            code: 'B001',
            message:
              '해당 근무자가 이미 같은 시간대에 배정된 스케줄이 있습니다.',
          })
        )
      )
    ).toBe(
      '해당 근무자가 이미 같은 시간대에 배정된 스케줄이 있습니다. 시간을 바꿔 다시 저장해 주세요.'
    )
  })

  it('서버 원인에 마침표가 없으면 붙여서 문장을 나눈다', () => {
    expect(
      resolveGeneralScheduleSaveError(
        new ScheduleAssignPendingError(
          30,
          axiosError(400, { code: 'B001', message: '겹치는 근무가 있습니다' })
        )
      )
    ).toBe('겹치는 근무가 있습니다. 시간을 바꿔 다시 저장해 주세요.')
  })

  it('서버 원인이 없으면 기본 배정 실패 문구를 보여준다', () => {
    expect(
      resolveGeneralScheduleSaveError(
        new ScheduleAssignPendingError(30, new Error('Network Error'))
      )
    ).toBe('근무자를 배정하지 못했어요. 시간을 바꿔 다시 저장해 주세요.')
  })

  it('배정이 잠금 대기 초과(429 E001)로 실패하면 시간 변경 안내 없이 서버 안내만 보여준다', () => {
    expect(
      resolveGeneralScheduleSaveError(
        new ScheduleAssignPendingError(30, axiosError(429, TOO_MANY_REQUESTS))
      )
    ).toBe('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
  })

  it('다른 배정이 먼저 반영돼(409 B020) 실패하면 시간 변경 안내 없이 서버 안내만 보여준다', () => {
    expect(
      resolveGeneralScheduleSaveError(
        new ScheduleAssignPendingError(
          30,
          axiosError(409, {
            code: 'B020',
            message: '이미 근무자가 배정된 스케줄입니다.',
          })
        )
      )
    ).toBe('이미 근무자가 배정된 스케줄입니다.')
  })

  it('동시 배정 409 B020에 서버 안내가 없으면 일반 저장 실패로 안내한다', () => {
    expect(
      resolveGeneralScheduleSaveError(
        new ScheduleAssignPendingError(30, axiosError(409, { code: 'B020' }))
      )
    ).toBe('저장에 실패했습니다.')
  })

  it('근무 생성·시간 변경이 429 E001로 실패하면 서버 안내를 보여준다', () => {
    expect(
      resolveGeneralScheduleSaveError(axiosError(429, TOO_MANY_REQUESTS))
    ).toBe('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
    expect(
      resolveGeneralScheduleSaveError(axiosError(429, { code: 'E001' }))
    ).toBe('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
  })

  it('생성한 근무를 찾지 못하면 일반 저장 실패로 안내한다', () => {
    expect(
      resolveGeneralScheduleSaveError(new CreatedScheduleNotFoundError())
    ).toBe('저장에 실패했습니다.')
  })

  it('그 밖의 오류는 기존 오류 문구 규칙을 따른다', () => {
    expect(
      resolveGeneralScheduleSaveError(
        axiosError(404, { code: 'B019', message: '없는 근무입니다.' })
      )
    ).toBe('없는 근무입니다.')
  })
})

describe('resolveFixedScheduleSaveError', () => {
  it('409 B020이면 겹치는 고정 근무를 안내한다', () => {
    expect(
      resolveFixedScheduleSaveError(
        axiosError(409, {
          code: 'B020',
          message: '겹치는 근무 시간이 존재합니다.',
        })
      )
    ).toBe('겹치는 근무 시간이 존재합니다.')
    expect(
      resolveFixedScheduleSaveError(axiosError(409, { code: 'B020' }))
    ).toBe('겹치는 고정 근무 시간이 있어요. 요일이나 시간을 확인해 주세요.')
  })

  it('400 B001이면 서버의 근무 시간 안내를 보여준다', () => {
    expect(
      resolveFixedScheduleSaveError(
        axiosError(400, {
          code: 'B001',
          message: '근무 시간은 0시간 초과, 7일 미만이어야 합니다.',
        })
      )
    ).toBe('근무 시간은 0시간 초과, 7일 미만이어야 합니다.')
  })
})
