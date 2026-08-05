import { describe, expect, it } from 'vitest'

import { resolvePostingFormError } from '../../lib/postingErrorMessage'

function axiosError(data: unknown) {
  return {
    isAxiosError: true,
    message: 'Request failed with status code 400',
    response: { status: 400, data },
  }
}

describe('공고 폼 서버 오류', () => {
  it('필드 오류 배열을 폼 오류로 매핑한다', () => {
    expect(
      resolvePostingFormError(
        axiosError({
          code: 'B001',
          message: '잘못된 요청입니다.',
          data: [
            { field: 'workspaceId', message: '널이어서는 안됩니다' },
            { field: 'schedules[0].workingDays', message: '필수입니다' },
          ],
        }),
        '공고를 등록하지 못했어요.'
      )
    ).toEqual({
      fieldErrors: {
        workspaceId: '널이어서는 안됩니다',
        schedules: '필수입니다',
      },
      message: null,
    })
  })

  it('알 수 없는 필드가 있으면 일반 메시지도 반환한다', () => {
    expect(
      resolvePostingFormError(
        axiosError({
          code: 'B001',
          message: '잘못된 요청입니다.',
          data: [{ field: 'unknown', message: '잘못된 값입니다' }],
        }),
        '공고를 등록하지 못했어요.'
      )
    ).toEqual({
      fieldErrors: {},
      message: '잘못된 요청입니다.',
    })
  })
})
