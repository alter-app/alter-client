import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'
import { chromium } from 'playwright'

// 실제 화면과 훅을 사용하되 인증과 서버 데이터만 모의한다.
const fixture = await mkdtemp(path.join(process.cwd(), '.nickname-qa-'))
let server
let browser
try {
  await writeFile(
    path.join(fixture, 'index.html'),
    '<div id="root"></div><script type="module" src="./main.tsx"></script>'
  )
  await writeFile(
    path.join(fixture, 'main.tsx'),
    `
import React from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSignupForm } from '@/pages/signup/hooks/useSignupForm'
import { useEmailVerification } from '@/pages/signup/hooks/useEmailVerification'
import { Step2AccountInfo } from '@/pages/signup/components/Step2AccountInfo'
import { NicknameEditPage } from '@/pages/my/profile/nickname'
import useAuthStore from '@/shared/stores/useAuthStore'
import '@/app/styles/index.css'
const mode = new URLSearchParams(location.search).get('mode')
useAuthStore.setState({isLoggedIn:true, scope:'USER', token:'qa-only'})
function Signup() {
  const form = useSignupForm(mode === 'social' ? {socialLoginData:{provider:'APPLE',platformType:'WEB',oauthToken:'qa-only'}} : undefined)
  const email = useEmailVerification()
  window.__nicknameQa = form
  return <Step2AccountInfo form={form} isSocialSignup={form.isSocialSignup} emailVerification={email} isValid={form.isStep2Valid(email.email,email.verified)} onBack={()=>{}} onSubmit={()=>form.handleSubmit({phone:'',firebaseIdToken:'',emailSessionId:''})}/>
}
createRoot(document.getElementById('root')).render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter>{mode==='edit' ? <NicknameEditPage/> : <Signup/>}</MemoryRouter></QueryClientProvider>)
`
  )
  server = await createServer({ server: { port: 0, host: '127.0.0.1' } })
  await server.listen()
  const base = server.resolvedUrls.local[0]
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const requests = []
  let duplicate = false
  let delayed = false
  let release
  let legacy = '기존 닉네임ㅋㅋ12345678901'
  await page.route('**/*', async route => {
    const request = route.request()
    const url = new URL(request.url())
    const headers = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': '*',
    }
    if (request.method() === 'OPTIONS')
      return route.fulfill({ status: 204, headers })
    if (url.pathname.includes('/exists/nickname')) {
      requests.push({ type: 'check', ...request.postDataJSON() })
      if (delayed)
        await new Promise(resolve => {
          release = resolve
        })
      return route.fulfill({
        json: { data: { duplicated: duplicate } },
        headers,
      })
    }
    if (url.pathname.endsWith('/app/users/me/nickname')) {
      requests.push({ type: 'save', ...request.postDataJSON() })
      return route.fulfill({ json: { data: null }, headers })
    }
    if (url.pathname.endsWith('/app/users/me')) {
      return route.fulfill({
        json: { data: { id: 1, nickname: legacy } },
        headers,
      })
    }
    if (url.origin === new URL(base).origin) return route.continue()
    return route.abort()
  })
  const open = async mode => {
    await page.goto(base + path.basename(fixture) + '/index.html?mode=' + mode)
    await page
      .getByPlaceholder(mode === 'edit' ? '닉네임을 입력해 주세요' : '닉네임', {
        exact: true,
      })
      .waitFor()
  }
  const invalid = [
    '가',
    '12345678901',
    'ㅋㅋ',
    '가ㅋ',
    'ㅏㅣ',
    ' 가나',
    '가나 ',
    '가 나',
    '가!나',
    '가😀',
  ]
  for (const mode of ['normal', 'social']) {
    await open(mode)
    const input = page.getByPlaceholder('닉네임', { exact: true })
    const check = page.getByRole('button', { name: '중복 확인', exact: true })
    await page.getByRole('checkbox').first().check()
    if (mode === 'normal') {
      await page
        .getByPlaceholder('8~16자 영문, 숫자, 특수문자')
        .fill('Password1!')
      await page.getByPlaceholder('비밀번호 확인').fill('Password1!')
    }
    for (const value of invalid) {
      await input.fill(value)
      assert(await check.isDisabled(), mode + ': invalid check ' + value)
      const count = requests.length
      await page.evaluate(async () => {
        await window.__nicknameQa.handleNicknameCheck()
        await window.__nicknameQa.handleSubmit({
          phone: '',
          firebaseIdToken: '',
          emailSessionId: '',
        })
      })
      assert.equal(requests.length, count)
      assert(
        await page
          .getByRole('button', { name: '가입하기', exact: true })
          .isDisabled()
      )
    }
    for (const value of ['가나', 'Ab12345678', '한A1']) {
      await input.fill(value)
      await check.click()
      await page
        .getByText('사용 가능한 닉네임입니다!', { exact: true })
        .waitFor()
      assert.equal(
        await page
          .getByRole('button', { name: '가입하기', exact: true })
          .isEnabled(),
        true
      )
    }
    duplicate = true
    await input.fill('중복닉네임')
    await check.click()
    await page
      .getByText('이미 사용 중인 닉네임입니다.', { exact: true })
      .waitFor()
    assert(
      await page
        .getByRole('button', { name: '가입하기', exact: true })
        .isDisabled()
    )
    duplicate = false
    delayed = true
    await input.fill('이전닉네임')
    await check.click()
    await page.waitForFunction(() =>
      document.body.textContent.includes('확인 중...')
    )
    await input.fill('가ㅋ')
    // 요청 수신 시점까지 기다린 뒤 이전 성공 응답을 반환한다.
    const deadline = Date.now() + 5000
    while (!release) {
      assert(Date.now() < deadline, '중복확인 요청 수신 시간 초과')
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    release()
    release = undefined
    delayed = false
    await page.getByRole('button', { name: '중복 확인', exact: true }).waitFor()
    await page.waitForFunction(() => !window.__nicknameQa.isCheckingNickname)
    assert.equal(
      await page
        .getByText('사용 가능한 닉네임입니다!', { exact: true })
        .count(),
      0
    )
    assert(
      await page
        .getByRole('button', { name: '가입하기', exact: true })
        .isDisabled()
    )
    console.log(
      'PASS ' +
        mode +
        ': boundaries, characters, pre-request guards, duplicates, stale response'
    )
  }
  for (const old of ['12345678901234567890', '기존 닉네임ㅋㅋ😀']) {
    legacy = old
    await open('edit')
    const input = page.getByPlaceholder('닉네임을 입력해 주세요')
    await page.waitForFunction(
      value => document.querySelector('input')?.value === value,
      old
    )
    assert.equal(await input.inputValue(), old)
    const save = page.getByRole('button', { name: '변경하기', exact: true })
    assert(await save.isDisabled())
    for (const value of invalid) {
      const count = requests.length
      await input.fill(value)
      assert(await save.isDisabled())
      assert.equal(requests.length, count)
    }
    duplicate = true
    await input.fill('중복닉네임')
    await save.click()
    await page
      .getByRole('alert')
      .filter({ hasText: '이미 사용 중인 닉네임입니다.' })
      .waitFor()
    assert.equal(requests.at(-1).type, 'check')
    duplicate = false
    for (const value of ['가나', 'Ab12345678', '한글Ab12']) {
      await input.fill(value)
      await save.click()
      await page.waitForFunction(
        () => !document.querySelector('input')?.disabled
      )
      assert.deepEqual(requests.at(-1), { type: 'save', nickname: value })
    }
  }
  assert.deepEqual(errors, [])
  console.log(
    'PASS edit: legacy display, invalid inputs, duplicates, valid save; no browser errors'
  )
} finally {
  await browser?.close()
  await server?.close()
  await rm(fixture, { recursive: true, force: true })
}
