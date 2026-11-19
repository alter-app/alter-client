import type { MonthlyIncome } from '@/features/user/home/schedule/types/schedule'

interface MonthlyIncomeCardProps {
  month: number
  income: MonthlyIncome | null
  isLoading?: boolean
  isError?: boolean
}

function formatWon(amount: number) {
  return `${amount.toLocaleString()}원`
}

function formatHours(hours: number) {
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}시간`
}

export function MonthlyIncomeCard({
  month,
  income,
  isLoading = false,
  isError = false,
}: MonthlyIncomeCardProps) {
  return (
    <section className="w-[358px] rounded-2xl bg-white py-6">
      <div className="flex items-end justify-between px-6">
        <h3 className="typography-headline01 text-text-100">
          {month}월 예상 수입
        </h3>
        {income ? (
          <p className="typography-body01-semibold text-sub">
            약 {formatWon(income.estimatedSalary)}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <p className="mt-4 px-6 typography-body03-regular text-text-50">
          예상 수입을 불러오는 중...
        </p>
      ) : isError ? (
        <p className="mt-4 px-6 typography-body03-regular text-text-50">
          예상 수입을 불러오지 못했어요
        </p>
      ) : !income || income.workspaces.length === 0 ? (
        <p className="mt-4 px-6 typography-body03-regular text-text-50">
          예정된 근무가 없어요
        </p>
      ) : (
        <ul className="mt-4">
          {income.workspaces.map((workspace, index) => (
            <li key={workspace.workspaceId}>
              <div className="flex items-center justify-between gap-3 px-6 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate typography-body02-semibold text-text-90">
                    {workspace.workspaceName}
                  </p>
                  <p className="typography-body03-regular text-text-50">
                    {formatHours(workspace.totalWorkHours)} 근무
                  </p>
                </div>
                <p className="shrink-0 typography-body02-semibold text-text-90">
                  {formatWon(workspace.estimatedSalary)}
                </p>
              </div>
              {index < income.workspaces.length - 1 ? (
                <div className="mx-1 h-px bg-line-1" />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
