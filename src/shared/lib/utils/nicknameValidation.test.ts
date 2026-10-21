import { describe, expect, it } from 'vitest'
import { isNicknameFormatValid } from './nicknameValidation'

describe('신규 닉네임 규칙', () => {
  it.each(['가나', 'ab', '12', '가A1', '가나다라마바사아자차', 'Ab12345678'])(
    '%s를 허용한다',
    value => expect(isNicknameFormatValid(value)).toBe(true)
  )

  it.each([
    '',
    '가',
    'a',
    '1',
    '가나다라마바사아자차카',
    '12345678901',
    'ㅋㅋ',
    '가ㅋ',
    'ㅏㅣ',
    '가ㅏ',
    ' 가나',
    '가나 ',
    '가 나',
    '가\t나',
    '가나\n',
    '가_나',
    '가!나',
    '가😀',
    '😀😀',
    'éa',
    '가',
  ])('%s를 요청 전에 차단한다', value => {
    expect(isNicknameFormatValid(value)).toBe(false)
  })
})
