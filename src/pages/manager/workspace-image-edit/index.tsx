import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import { useWorkspaceImageEditViewModel } from '@/features/manager/workspace-image'
import { ROUTES } from '@/shared/constants/routes'

export function WorkspaceImageEditPage() {
  const navigate = useNavigate()
  const { workspaceId: workspaceIdParam } = useParams()
  const workspaceId = Number(workspaceIdParam)
  const isValidWorkspace = Number.isFinite(workspaceId) && workspaceId > 0

  const goHome = () => navigate(ROUTES.MANAGER.HOME)

  if (!isValidWorkspace) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <Navbar
          variant="detail"
          title="대표 이미지 수정"
          onBackClick={goHome}
        />
        <div className="flex flex-1 items-center justify-center px-4">
          <p className="typography-body02-regular text-text-70">
            업장 정보를 찾을 수 없습니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <WorkspaceImageEditContent workspaceId={workspaceId} onClose={goHome} />
  )
}

function WorkspaceImageEditContent({
  workspaceId,
  onClose,
}: {
  workspaceId: number
  onClose: () => void
}) {
  const {
    items,
    maxCount,
    canAddMore,
    fileInputRef,
    accept,
    error,
    isLoading,
    isLoadError,
    refetch,
    isUploading,
    isSaving,
    openPicker,
    onFileChange,
    removeImage,
    setAsMain,
    save,
  } = useWorkspaceImageEditViewModel(workspaceId)

  const handleSave = async () => {
    const ok = await save()
    if (ok) onClose()
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <Navbar variant="detail" title="대표 이미지 수정" onBackClick={onClose} />

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : isLoadError ? (
          <div
            className="flex flex-col items-center justify-center gap-2 py-16 text-center"
            role="alert"
          >
            <p className="typography-body01-semibold text-text-100">
              대표 이미지를 불러오지 못했어요
            </p>
            <p className="max-w-[240px] typography-body02-regular text-text-70">
              네트워크 연결을 확인한 뒤 다시 시도해 주세요.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3.5 h-12 rounded-xl border border-line-2 bg-white px-6 typography-body02-semibold text-text-90"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <>
            <p className="mb-1.5 typography-body02-regular text-text-50">
              등록된 대표 이미지 <b className="text-main">{items.length}</b>장
            </p>
            <p className="mb-[18px] typography-body02-regular text-text-50">
              첫 번째 이미지가 홈 카드의 메인으로 노출됩니다.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* 추가 타일 */}
              {canAddMore && (
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={isUploading}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-2 bg-bg-light text-text-50 disabled:opacity-60"
                >
                  <span className="leading-none text-main">
                    {isUploading ? <Spinner size={28} /> : <PlusGlyph />}
                  </span>
                  <span className="typography-body02-semibold">
                    {isUploading ? '업로드 중' : '이미지 업로드'}
                  </span>
                </button>
              )}

              {items.map((image, index) => (
                <div
                  key={image.fileId}
                  className="relative aspect-square overflow-hidden rounded-xl bg-bg-light"
                >
                  <img
                    src={image.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label="제거"
                    onClick={() => removeImage(image.fileId)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <CloseGlyph />
                  </button>
                  {index === 0 ? (
                    <span className="absolute bottom-2 left-2 inline-flex h-[22px] items-center rounded-full bg-main px-[9px] text-0 font-bold text-white">
                      메인
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAsMain(image.fileId)}
                      className="absolute bottom-2 left-1/2 inline-flex h-[26px] -translate-x-1/2 items-center rounded-full bg-black/60 px-3 text-0 font-semibold text-white"
                    >
                      메인으로 설정
                    </button>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <p
                role="alert"
                className="mt-3 typography-body02-regular text-error"
              >
                {error}
              </p>
            )}

            <p className="mt-[18px] typography-body03-regular text-text-50">
              JPG, PNG 형식 · 최대 {maxCount}장까지 등록할 수 있어요. ‘메인으로
              설정’을 누르면 홈 카드에 노출되는 메인 이미지를 변경할 수
              있습니다.
            </p>
          </>
        )}
      </div>

      {/* 푸터 */}
      <div className="flex gap-2.5 border-t border-line-2 px-5 pb-6 pt-3.5">
        <button
          type="button"
          onClick={onClose}
          className="h-[52px] w-24 flex-none rounded-xl bg-bg-dark typography-body01-semibold text-text-90"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isUploading || isLoading || isLoadError}
          className="h-[52px] flex-1 rounded-xl bg-main typography-body01-semibold text-white disabled:opacity-60"
        >
          {isSaving ? '저장 중…' : '저장'}
        </button>
      </div>
    </div>
  )
}

/** 추가 타일의 + 아이콘 (currentColor) */
function PlusGlyph() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 이미지 제거 버튼의 ✕ 아이콘 (currentColor) */
function CloseGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
