import { useMemo, useState } from 'react'
import { Drawer } from 'vaul'

import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon'
import { usePostingFilterOptions } from '@/features/job-lookup-map/hooks/usePostingFilterOptions'
import {
  EMPTY_REGION_SELECTION,
  REGION_STEPS,
  getRegionOptionsForStep,
  isRegionSelectionComplete,
  type RegionSelection,
  type RegionStep,
} from '@/features/job-lookup-map/lib/regionOptions'

type RegionSelectDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: RegionSelection
  onApply: (selection: RegionSelection) => void
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3.5 9.5L7 13l7.5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RegionSelectDrawerBody({
  value,
  onOpenChange,
  onApply,
}: {
  value: RegionSelection
  onOpenChange: (open: boolean) => void
  onApply: (selection: RegionSelection) => void
}) {
  const { provinces, districts, towns, isLoading, isError } =
    usePostingFilterOptions()

  const [draft, setDraft] = useState<RegionSelection>(value)
  const [step, setStep] = useState<RegionStep>('sido')

  const options = useMemo(
    () =>
      getRegionOptionsForStep(step, {
        provinces,
        districts,
        towns,
      }),
    [step, provinces, districts, towns]
  )

  const handleSelect = (option: string) => {
    if (step === 'sido') {
      const next: RegionSelection = {
        sido: option,
        sigungu: null,
        dong: null,
      }
      setDraft(next)
      if (option === '전국(전체)') return
      setStep('sigungu')
      return
    }

    if (step === 'sigungu') {
      const next: RegionSelection = {
        ...draft,
        sigungu: option,
        dong: null,
      }
      setDraft(next)
      if (option === '전체') return
      setStep('dong')
      return
    }

    setDraft({ ...draft, dong: option })
  }

  const handleReset = () => {
    setDraft(EMPTY_REGION_SELECTION)
    setStep('sido')
  }

  const handleApply = () => {
    onApply(draft)
    onOpenChange(false)
  }

  const canGoToStep = (target: RegionStep) => {
    if (target === 'sido') return true
    if (target === 'sigungu') {
      return draft.sido != null && draft.sido !== '전국(전체)'
    }
    return (
      draft.sido != null &&
      draft.sido !== '전국(전체)' &&
      draft.sigungu != null &&
      draft.sigungu !== '전체'
    )
  }

  const selectedForStep =
    step === 'sido'
      ? draft.sido
      : step === 'sigungu'
        ? draft.sigungu
        : draft.dong

  const canApply = isRegionSelectionComplete(draft)

  return (
    <>
      <div className="mx-auto mt-4 h-1 w-[50px] shrink-0 rounded-full bg-line-2" />

      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <Drawer.Title className="typography-headline03 text-text-100">
          지역 선택
        </Drawer.Title>
        <button
          type="button"
          aria-label="닫기"
          onClick={() => onOpenChange(false)}
          className="flex size-8 items-center justify-center text-text-100"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex items-end gap-2 border-b border-line-1 px-4">
        {REGION_STEPS.map((item, index) => {
          const active = step === item.key
          const enabled = canGoToStep(item.key)
          return (
            <div key={item.key} className="flex items-center gap-2">
              {index > 0 ? (
                <ChevronRightIcon
                  width={14}
                  height={14}
                  className="mb-3  text-text-50"
                />
              ) : null}
              <button
                type="button"
                disabled={!enabled}
                onClick={() => enabled && setStep(item.key)}
                className={`pb-3 typography-body02-semibold transition-colors ${
                  active
                    ? 'border-b-2 border-main text-main'
                    : enabled
                      ? 'border-b-2 border-transparent text-text-50'
                      : 'border-b-2 border-transparent text-text-50 opacity-50'
                }`}
              >
                {item.label}
              </button>
            </div>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-1">
        {isLoading ? (
          <p className="py-8 text-center typography-body02-regular text-text-50">
            지역 정보를 불러오는 중…
          </p>
        ) : isError ? (
          <p className="py-8 text-center typography-body02-regular text-text-50">
            지역 정보를 불러오지 못했습니다.
          </p>
        ) : options.length === 0 ? (
          <p className="py-8 text-center typography-body02-regular text-text-50">
            선택 가능한 지역이 없습니다.
          </p>
        ) : (
          <ul>
            {options.map(option => {
              const selected = selectedForStep === option
              return (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="flex h-14 w-full items-center justify-between text-left"
                  >
                    <span
                      className={`typography-body01-regular ${
                        selected
                          ? 'typography-body01-semibold text-main'
                          : 'text-text-100'
                      }`}
                    >
                      {option}
                    </span>
                    {step === 'dong' && selected ? (
                      <CheckIcon className=" text-main" />
                    ) : (
                      <ChevronRightIcon
                        width={18}
                        height={18}
                        className=" text-text-50"
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="flex gap-2 border-t border-line-1 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          onClick={handleReset}
          className="h-12 rounded-2xl border border-line-2 px-5 typography-body01-semibold text-text-100"
        >
          초기화
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={!canApply}
          className="h-12 flex-1 rounded-2xl bg-main typography-body01-semibold text-text-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          적용하기
        </button>
      </div>
    </>
  )
}

export function RegionSelectDrawer({
  open,
  onOpenChange,
  value = EMPTY_REGION_SELECTION,
  onApply,
}: RegionSelectDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[60] flex items-end justify-center outline-none">
          <div className="flex w-full max-w-[428px] flex-col overflow-hidden rounded-t-[32px] bg-white">
            {open ? (
              <RegionSelectDrawerBody
                key={`${value.sido ?? ''}-${value.sigungu ?? ''}-${value.dong ?? ''}`}
                value={value}
                onOpenChange={onOpenChange}
                onApply={onApply}
              />
            ) : null}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
