import type { ReactNode } from 'react'
import { FileIcon, IdCardIcon } from '@/features/store-register/ui/icons'
import type { WorkspaceRequestDetailDto } from '@/features/store-register/types/workspaceRequests'

type DocItem = {
  label: string
  url: string | null
  icon: ReactNode
}

/** 첨부된 서류 — 탭하면 presigned URL 을 새 탭에서 연다 */
function AttachedDoc({
  label,
  url,
  icon,
}: {
  label: string
  url: string
  icon: ReactNode
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-line-1 bg-white p-3"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-main-100 text-main">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="typography-body02-semibold text-text-100">{label}</p>
        <p className="truncate typography-body03-regular text-text-50">
          탭하여 새 탭에서 열기
        </p>
      </div>
    </a>
  )
}

/** 미첨부 서류 — 점선 보더 + 회색 아이콘 */
function MissingDoc({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-line-2 p-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-bg-light text-text-50">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="typography-body02-semibold text-text-70">{label}</p>
        <p className="typography-body03-regular text-text-50">미첨부</p>
      </div>
    </div>
  )
}

type Props = {
  detail: WorkspaceRequestDetailDto
}

/** 증빙 서류 — 사업자등록증명원 / 대표자 신분증 / 위임장 */
export function RequestDocumentsSection({ detail }: Props) {
  const docs: DocItem[] = [
    {
      label: '사업자등록증명원',
      url: detail.workspaceCertFileUrl,
      icon: <FileIcon className="size-5" />,
    },
    {
      label: '대표자 신분증',
      url: detail.workspaceOwnIdentityFileUrl,
      icon: <IdCardIcon className="size-5" />,
    },
    {
      label: '위임장',
      url: detail.workspaceWarrantFileUrl,
      icon: <FileIcon className="size-5" />,
    },
  ]

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="typography-headline03 text-text-100">증빙 서류</h2>
      <div className="flex flex-col gap-2.5">
        {docs.map(doc =>
          doc.url ? (
            <AttachedDoc
              key={doc.label}
              label={doc.label}
              url={doc.url}
              icon={doc.icon}
            />
          ) : (
            <MissingDoc key={doc.label} label={doc.label} icon={doc.icon} />
          )
        )}
      </div>
    </section>
  )
}
