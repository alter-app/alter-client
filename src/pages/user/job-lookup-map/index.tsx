import { MobileLayout } from '@/shared/ui/MobileLayout'

export function JobLookupMapPage() {
  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center min-h-screen min-h-[100dvh] px-5 py-6 box-border bg-white">
        <div className="w-full max-w-[400px] text-center">
          <h1 className="font-pretendard font-semibold text-[24px] leading-8 text-[#111111] mb-4">
            알바/일자리 조회
          </h1>
          <p className="font-pretendard text-[14px] leading-5 text-[#767676] mb-6">
            아직 지도 화면은 준비 중이에요.
            <br />
            추후 이 페이지에서 주변 알바/일자리 정보를 확인할 수 있어요.
          </p>
        </div>
      </div>
    </MobileLayout>
  )
}

export default JobLookupMapPage
