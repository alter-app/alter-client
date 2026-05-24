import { useState } from 'react'
import { useWithdrawUserFlow } from '@/features/user/me'
import useAuthStore from '@/shared/stores/useAuthStore'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { Navbar } from '@/shared/ui/common/Navbar'

export function WithdrawPage() {
  const scope = useAuthStore(state => state.scope)
  const [checked, setChecked] = useState(false)
  const withdrawFlow = useWithdrawUserFlow()

  const handleWithdraw = async () => {
    withdrawFlow.setMessage('')
    if (!checked) {
      withdrawFlow.setMessage('탈퇴 안내를 확인해 주세요.')
      return
    }
    await withdrawFlow.performWithdraw()
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar variant="detail" title="회원 탈퇴" />
      </div>

      <main className="flex flex-1 flex-col px-5 pt-8">
        <h1 className="text-text-100 typography-headline02">
          탈퇴 전 확인해 주세요
        </h1>
        <div className="mt-5 rounded-2xl bg-bg-dark px-4 py-4 text-text-70 typography-body02-regular">
          <p>탈퇴하면 현재 계정으로 서비스를 이용할 수 없습니다.</p>
          {scope === 'MANAGER' ? (
            <p className="mt-2">
              운영 중인 업장이 있다면 먼저 업장 운영을 종료해야 탈퇴할 수
              있습니다.
            </p>
          ) : (
            <p className="mt-2">활성 근무지는 탈퇴 시 자동 퇴직 처리됩니다.</p>
          )}
        </div>

        <label className="mt-6 flex items-center gap-3 text-text-100 typography-body02-regular">
          <input
            type="checkbox"
            checked={checked}
            onChange={event => setChecked(event.target.checked)}
            className="size-5 accent-main"
          />
          안내 사항을 확인했습니다.
        </label>

        {withdrawFlow.message && (
          <p role="alert" className="mt-4 text-error typography-body03-regular">
            {withdrawFlow.message}
          </p>
        )}

        <div className="mt-auto pb-8">
          <AuthButton
            disabled={!checked || withdrawFlow.isPending}
            onClick={handleWithdraw}
            className="bg-error shadow-none hover:shadow-none"
          >
            회원 탈퇴
          </AuthButton>
        </div>
      </main>
    </div>
  )
}
