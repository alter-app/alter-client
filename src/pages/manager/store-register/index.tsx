import { Navbar } from '@/shared/ui/common/Navbar'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { useStoreRegisterWizard } from '@/features/store-register/hooks/useStoreRegisterWizard'
import { StoreBasicInfoFields } from '@/features/store-register/ui/StoreBasicInfoFields'
import { CertificateUploader } from '@/features/store-register/ui/CertificateUploader'

export function StoreRegisterPage() {
  const w = useStoreRegisterWizard()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="업장 등록 신청" />

      <div className="mx-auto w-full max-w-[400px] flex-1 px-4 pb-10 pt-4">
        <ol
          className="mb-6 flex items-center gap-2"
          aria-label="등록 신청 진행 단계"
        >
          <li className="flex flex-1 items-center gap-2">
            <span
              className={`whitespace-nowrap rounded-full px-3 py-1 typography-body02-semibold ${
                w.step === 'info'
                  ? 'bg-main text-white'
                  : 'bg-main/15 text-main'
              }`}
            >
              ① 정보
            </span>
            <div className="h-px flex-1 bg-line-2" aria-hidden />
          </li>
          <li className="flex flex-[1.2] items-center gap-2">
            <span
              className={`whitespace-nowrap rounded-full px-3 py-1 typography-body02-semibold ${
                w.step === 'certificate'
                  ? 'bg-main text-white'
                  : w.step === 'done'
                    ? 'bg-main/15 text-main'
                    : 'bg-line-2 text-text-50'
              }`}
            >
              ② 증빙
            </span>
          </li>
        </ol>

        {w.step === 'info' ? (
          <>
            <header className="mb-6">
              <h1 className="mb-2 typography-headline01 text-text-100">
                업장 기본 정보
              </h1>
              <p className="typography-body02-regular text-text-70">
                사업자 등록번호, 연락처와 주소(시도·구·동·상세 주소)를 입력해
                주세요. 증명 서류를 올린 뒤 운영자 검토까지 1~2영업일이 걸릴 수
                있어요.
              </p>
            </header>
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
            <div className="mt-8 flex flex-col gap-3">
              <AuthButton
                type="button"
                disabled={!w.infoValid}
                style={{
                  opacity: w.infoValid ? 1 : 0.45,
                  width: '100%',
                  cursor: w.infoValid ? 'pointer' : 'not-allowed',
                }}
                onClick={() => w.goCertificate()}
              >
                다음
              </AuthButton>
            </div>
          </>
        ) : null}

        {w.step === 'certificate' ? (
          <>
            <header className="mb-6">
              <h1 className="mb-2 typography-headline01 text-text-100">
                증빙 파일
              </h1>
              <p className="typography-body02-regular text-text-70">
                각 서류를 선택하면 먼저 서버에 올린 뒤, 신청 정보와 함께
                제출돼요. 증명원은 발급 7일 이내 원본을 올려 주세요. 모바일
                신분증은 인정되지 않아요. 운영자 검토는 1영업일 이내 진행돼요.
              </p>
            </header>
            <div className="flex flex-col gap-8">
              <CertificateUploader
                certificate={w.certFile}
                headline="사업자등록증명원"
                hint="JPG·PNG 이미지 또는 PDF · 최대 10MB"
              />
              <CertificateUploader
                certificate={w.identityFile}
                headline="대표자 신분증"
                hint="JPG·PNG 이미지 · 최대 5MB · 모바일 신분증 불가"
              />
              <CertificateUploader
                certificate={w.warrantFile}
                headline="위임장"
                hint="대리 신청 시에만 · JPG·PNG·PDF · 최대 5MB"
                optional
              />
            </div>
            {w.submitError ? (
              <p className="mt-4 typography-body02-regular text-red-600">
                {w.submitError}
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3">
              <AuthButton
                type="button"
                disabled={!w.certificateValid || w.isSubmitting}
                style={{
                  opacity: w.certificateValid && !w.isSubmitting ? 1 : 0.45,
                  width: '100%',
                  cursor:
                    w.certificateValid && !w.isSubmitting
                      ? 'pointer'
                      : 'not-allowed',
                }}
                onClick={() => w.submit()}
              >
                {w.isSubmitting ? '제출 중...' : '검토 요청 보내기'}
              </AuthButton>
              <button
                type="button"
                className="typography-body02-semibold text-text-70 underline"
                onClick={() => w.goInfo()}
              >
                이전 단계
              </button>
            </div>
          </>
        ) : null}

        {w.step === 'done' ? (
          <>
            <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-sm">
              <h1 className="mb-3 typography-headline01 text-text-100">
                신청을 접수했어요
              </h1>
              <p className="typography-body02-regular text-text-70">
                운영자 검토 후 승인되면 사장님 계정으로 전환돼요. 진행 상태는
                신청 내역에서 확인할 수 있어요.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <AuthButton
                type="button"
                style={{ width: '100%' }}
                onClick={() => w.goRequests()}
              >
                신청 내역 보기
              </AuthButton>
              <button
                type="button"
                className="typography-body02-semibold text-text-70 underline"
                onClick={() => w.exitToHome()}
              >
                홈으로
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default StoreRegisterPage
