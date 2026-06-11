import type { WorkspaceRequestDetailDto } from '@/features/store-register/types/workspaceRequests'

type DocItem = {
  label: string
  url: string | null
}

/** presigned URL 의 경로 확장자가 이미지인지 (쿼리스트링 제외) */
function looksLikeImage(url: string): boolean {
  const path = url.split('?')[0].toLowerCase()
  return /\.(jpg|jpeg|png|webp|heic|gif)$/.test(path)
}

function DocCard({ label, url }: DocItem) {
  if (!url) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <p className="typography-body02-semibold text-text-100">{label}</p>
        <div className="flex h-[120px] items-center justify-center rounded-xl bg-bg-light">
          <span className="typography-body02-regular text-text-50">미첨부</span>
        </div>
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm"
    >
      <p className="typography-body02-semibold text-text-100">{label}</p>
      {looksLikeImage(url) ? (
        <img
          src={url}
          alt={`${label} 미리보기`}
          className="h-[120px] w-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-[120px] flex-col items-center justify-center gap-1 rounded-xl bg-bg-light">
          <span className="typography-body01-semibold text-text-90">파일</span>
          <span className="typography-body02-regular text-text-50">
            탭하면 새 탭에서 열려요
          </span>
        </div>
      )}
      <span className="typography-body02-semibold text-main underline">
        새 탭에서 열기
      </span>
    </a>
  )
}

type Props = {
  detail: WorkspaceRequestDetailDto
}

/** 증빙 서류 — presigned URL 그대로 새 탭/이미지로 열기 */
export function RequestDocumentsSection({ detail }: Props) {
  const docs: DocItem[] = [
    { label: '사업자등록증명원', url: detail.workspaceCertFileUrl },
    { label: '대표자 신분증', url: detail.workspaceOwnIdentityFileUrl },
    { label: '위임장', url: detail.workspaceWarrantFileUrl },
  ]

  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-1 typography-headline03 text-text-100">증빙 서류</h2>
      {docs.map(doc => (
        <DocCard key={doc.label} label={doc.label} url={doc.url} />
      ))}
    </section>
  )
}
