import {
  HIRING_DECISIONS,
  type HiringDecision,
} from '@/features/manager/posting/lib/applicationStatus'
import { LockIcon } from '@/features/manager/posting/ui/icons'
import { cn } from '@/shared/lib/utils'

interface HiringActionBarProps {
  /** false면 '상태 변경 불가' 안내를 표시하고 액션을 숨깁니다 */
  canDecide: boolean
  onDecide: (decision: HiringDecision) => void
}

const DECISION_CLASS: Record<HiringDecision, string> = {
  SHORTLISTED: 'border border-main bg-white text-main',
  ACCEPTED: 'border border-main bg-main text-white',
  REJECTED: 'border border-error bg-white text-error',
}

/** 채용 결정 하단 고정 바 — [서류합격][최종합격][불합격] */
export function HiringActionBar({ canDecide, onDecide }: HiringActionBarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[428px] -translate-x-1/2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
      {canDecide ? (
        <div className="flex items-center gap-2">
          {HIRING_DECISIONS.map(decision => (
            <button
              key={decision.status}
              type="button"
              onClick={() => onDecide(decision.status)}
              className={cn(
                'h-12 flex-1 rounded-xl typography-bt transition-all',
                'hover:brightness-[0.96] active:brightness-[0.9]',
                DECISION_CLASS[decision.status]
              )}
            >
              {decision.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-bg-dark">
          <LockIcon className="size-4 text-text-50" />
          <span className="typography-body02-regular text-text-50">
            상태 변경 불가 (종료된 지원서)
          </span>
        </div>
      )}
    </div>
  )
}
