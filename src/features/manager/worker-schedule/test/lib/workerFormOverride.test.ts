import { describe, expect, it } from 'vitest'

import { patchWorkerForm, selectWorkerForm } from '../../lib/workerFormOverride'

type Form = { days: string[]; startHour: string }

const serverForm: Form = { days: ['월'], startHour: '09' }

describe('근무자별 폼 수정 보관', () => {
  it('수정한 값은 서버 데이터가 다시 조회돼도 유지된다', () => {
    const override = patchWorkerForm(serverForm, 7, { startHour: '10' }, false)
    const refetchedServerForm: Form = { days: ['화'], startHour: '08' }

    expect(selectWorkerForm(override, 7, refetchedServerForm)).toEqual({
      days: ['월'],
      startHour: '10',
    })
  })

  it('다른 근무자를 보면 서버 데이터를 보여준다', () => {
    const override = patchWorkerForm(serverForm, 7, { startHour: '10' }, false)

    expect(selectWorkerForm(override, 8, serverForm)).toBe(serverForm)
  })

  it('서버 데이터를 불러오는 중에는 수정을 무시한다', () => {
    expect(patchWorkerForm(serverForm, 7, { startHour: '10' }, true)).toBeNull()
  })

  it('수정한 값이 없으면 서버 데이터를 보여준다', () => {
    expect(selectWorkerForm(null, 7, serverForm)).toBe(serverForm)
  })
})
