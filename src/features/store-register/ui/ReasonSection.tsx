import { useStoreRegisterReasonsViewModel } from '@/features/store-register/hooks/useStoreRegisterReasonsViewModel'
import { ReasonCard } from '@/features/store-register/ui/ReasonCard'

type Props = {
  requestId: number
}

/** REVOKED 상태에서 노출되는 반려 사유 + 댓글 스레드 섹션 */
export function ReasonSection({ requestId }: Props) {
  const { reasons, isLoading, isError } = useStoreRegisterReasonsViewModel(
    requestId,
    true
  )

  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-1 typography-headline03 text-text-100">반려 사유</h2>

      {isLoading ? (
        <p className="px-1 typography-body02-regular text-text-50">
          반려 사유를 불러오는 중입니다.
        </p>
      ) : null}

      {isError ? (
        <p className="px-1 typography-body02-regular text-error">
          반려 사유를 불러오지 못했습니다.
        </p>
      ) : null}

      {!isLoading && !isError && reasons.length === 0 ? (
        <p className="px-1 typography-body02-regular text-text-50">
          등록된 반려 사유가 없습니다.
        </p>
      ) : null}

      {reasons.map(reason => (
        <ReasonCard key={reason.id} requestId={requestId} reason={reason} />
      ))}
    </section>
  )
}
