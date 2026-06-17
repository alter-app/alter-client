import type { WorkspaceRequestDetailDto } from '@/features/store-register/types/workspaceRequests'

type Props = {
  detail: WorkspaceRequestDetailDto
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="shrink-0 typography-body02-regular text-text-70">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-right typography-body02-semibold text-text-100">
        {value || '-'}
      </span>
    </div>
  )
}

/** 업장 정보 — 업장명·대표자성명·사업자번호·형태·연락처·주소 */
export function RequestInfoSection({ detail }: Props) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="typography-headline03 text-text-100">업장 정보</h2>
      <div className="rounded-xl border border-line-1 bg-white px-4 py-1">
        <InfoRow label="업장명" value={detail.businessName} />
        <div className="border-t border-line-1" />
        <InfoRow label="대표자 성명" value={detail.ownerName} />
        <div className="border-t border-line-1" />
        <InfoRow label="사업자등록번호" value={detail.businessRegistrationNo} />
        <div className="border-t border-line-1" />
        <InfoRow label="업종" value={detail.businessType} />
        <div className="border-t border-line-1" />
        <InfoRow label="연락처" value={detail.contact} />
        <div className="border-t border-line-1" />
        <InfoRow label="주소" value={detail.fullAddress} />
      </div>
    </section>
  )
}
