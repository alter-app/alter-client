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

  it('배정 대기 오류는 근무가 생성됐다는 사실과 재저장 방법을 함께 안내한다', () => {
    const message = resolveGeneralScheduleSaveError(
      new ScheduleAssignPendingError(
        30,
        axiosError(400, { code: 'B001', message: '겹치는 근무가 있습니다.' })
      )
    )

    expect(message).toContain('근무는 만들어졌지만 근무자를 배정하지 못했어요.')
    expect(message).toContain('겹치는 근무가 있습니다.')
    expect(message).toContain('다시 저장하면 같은 근무에 배정해요.')
  })

  it('생성한 근무를 찾지 못하면 캘린더 확인을 안내한다', () => {
    expect(
      resolveGeneralScheduleSaveError(new CreatedScheduleNotFoundError())
    ).toContain('캘린더에서 근무를 확인해 주세요')
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
