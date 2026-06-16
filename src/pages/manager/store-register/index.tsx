import type { ReactNode } from 'react'
import { Navbar } from '@/shared/ui/common/Navbar'
import { useStoreRegisterWizard } from '@/features/store-register/hooks/useStoreRegisterWizard'
import { StoreBasicInfoFields } from '@/features/store-register/ui/StoreBasicInfoFields'
import { CertificateUploader } from '@/features/store-register/ui/CertificateUploader'
import {
  CheckCircleIcon,
  ClockIcon,
  IdCardIcon,
} from '@/features/store-register/ui/icons'

/** ① 정보 ② 증빙 — 2단계 인디케이터 (완료 화면에서는 숨김) */
function StepIndicator({ step }: { step: 'info' | 'certificate' }) {
  const onInfo = step === 'info'
  return (
    <div className="mx-auto w-full max-w-[400px] px-4 pb-1 pt-4">
      <ol className="flex items-center gap-2" aria-label="등록 신청 진행 단계">
        <li className="flex flex-1 items-center gap-2">
          <span
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 typography-body02-semibold ${
              onInfo ? 'bg-main text-white' : 'bg-main-100 text-main'
            }`}
          >
            ① 정보
          </span>
          <div className="h-px flex-1 bg-line-2" aria-hidden />
        </li>
        <li className="flex items-center">
          <span
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 typography-body02-semibold ${
              onInfo ? 'bg-bg-dark text-text-50' : 'bg-main text-white'
            }`}
          >
            ② 증빙
          </span>
        </li>
      </ol>
    </div>
  )
}

/** 위저드 공용 기본 CTA — 비활성 시 main 유지 + opacity 0.45 (디자인 토큰) */
function PrimaryCta({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-main typography-body01-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
    >
      {children}
    </button>
  )
}

export function StoreRegisterPage() {
  const w = useStoreRegisterWizard()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar
        variant="detail"
        title="업장 등록 신청"
        onBackClick={w.step === 'certificate' ? w.goInfo : undefined}
      />

      {w.step !== 'done' ? <StepIndicator step={w.step} /> : null}

      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-28 pt-4">
        {w.step === 'info' ? (
          <StoreBasicInfoFields
            bizName={w.bizName}
            ownerName={w.ownerName}
            brn={w.brn}
            province={w.province}
            district={w.district}
            town={w.town}
            address={w.address}
            type={w.type}
            contact={w.contact}
            onBizNameChange={w.setBizName}
            onOwnerNameChange={w.setOwnerName}
            onBrnChange={w.setBrn}
            onProvinceChange={w.setProvince}
            onDistrictChange={w.setDistrict}
            onTownChange={w.setTown}
            onAddressChange={w.setAddress}
            onTypeChange={w.setType}
            onContactChange={w.setContact}
          />
        ) : null}

        {w.step === 'certificate' ? (
          <div className="flex flex-col gap-5">
            <CertificateUploader
              certificate={w.certFile}
              headline="사업자등록증명원"
              hint="7일 이내 발급본, JPG·PNG·PDF 10MB 이하"
            />
            <CertificateUploader
              certificate={w.identityFile}
              headline="대표자 신분증"
              hint="JPG·PNG 5MB 이하, 모바일 신분증 불가"
              icon={<IdCardIcon className="size-5" />}
            />
            <CertificateUploader
              certificate={w.warrantFile}
              headline="위임장"
              hint="위탁 관리 시에만 첨부"
              optional
            />
            <div className="flex items-center gap-2 rounded-xl bg-warning-100 px-4 py-3.5">
              <ClockIcon className="size-[18px] shrink-0 text-warning" />
              <span className="typography-body02-regular text-text-100">
                운영자 검토까지 영업일 1일 정도 걸려요.
              </span>
            </div>
            {w.submitError ? (
              <p className="typography-body02-regular text-error" role="alert">
                {w.submitError}
              </p>
            ) : null}
          </div>
        ) : null}

        {w.step === 'done' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5 px-2 text-center">
            <span className="mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-main-100 text-main">
              <CheckCircleIcon className="size-11" />
            </span>
            <h1 className="typography-headline01 text-text-100">
              신청을 접수했어요
            </h1>
            <p className="max-w-[260px] typography-body02-regular text-text-70">
              운영자 검토 후 승인되면 사장님 계정으로 전환할 수 있어요. 영업일
              1일 이내에 결과를 알려드릴게요.
            </p>
          </div>
        ) : null}
      </main>

      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[428px] -translate-x-1/2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
        {w.step === 'info' ? (
          <PrimaryCta disabled={!w.infoValid} onClick={() => w.goCertificate()}>
            다음
          </PrimaryCta>
        ) : null}

        {w.step === 'certificate' ? (
          <div className="flex flex-col gap-2.5">
            <PrimaryCta
              disabled={!w.certificateValid || w.isSubmitting}
              onClick={() => w.submit()}
            >
              {w.isSubmitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  제출 중...
                </>
              ) : (
                '검토 요청 보내기'
              )}
            </PrimaryCta>
            <button
              type="button"
              className="self-center typography-body02-semibold text-text-70 underline"
              onClick={() => w.goInfo()}
            >
              이전 단계
            </button>
          </div>
        ) : null}

        {w.step === 'done' ? (
          <PrimaryCta onClick={() => w.goRequests()}>신청 내역 보기</PrimaryCta>
        ) : null}
      </div>
    </div>
  )
}

export default StoreRegisterPage
