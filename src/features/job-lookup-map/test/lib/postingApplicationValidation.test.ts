import { describe, expect, it } from 'vitest'
import { isPostingIntroductionValid } from '../../lib/postingApplicationValidation'

describe('공고 지원 자기소개 검증', () => {
  it.each(['', ' ', '   \n\t'])(
    '빈 값과 공백만 있는 값은 거부한다',
    introduction => {
      expect(isPostingIntroductionValid(introduction)).toBe(false)
    }
  )

  it('공백을 제외한 내용이 있으면 허용한다', () => {
    expect(isPostingIntroductionValid('  성실하게 일하겠습니다.  ')).toBe(true)
  })
})
