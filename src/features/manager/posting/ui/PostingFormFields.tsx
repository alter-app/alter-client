import type { ReactNode } from 'react'

import type { PostingFormViewModel } from '@/features/manager/posting/hooks/usePostingForm'
import { useWorkspaceSelectOptions } from '@/features/manager/posting/hooks/query/useWorkspaceFilterOptions'
import AlertIcon from '@/assets/icons/posting/Alert.svg?react'
import { ScheduleEditor } from '@/features/manager/posting/ui/ScheduleEditor'
import {
  PAYMENT_TYPES,
  PAYMENT_TYPE_LABEL,
} from '@/features/manager/posting/types/posting'
import { cn } from '@/shared/lib/utils'
import { SelectDropdown } from '@/shared/ui/common/SelectDropdown'

interface PostingFormFieldsProps {
  form: PostingFormViewModel
}

function Section({
  label,
  required = false,
  error,
  hint,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        'rounded-2xl bg-white p-4 shadow-sm',
        error && 'border border-error'
      )}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="typography-body02-semibold text-text-100">
          {label}
          {required ? <span className="ml-0.5 text-error">*</span> : null}
        </h2>
        {hint}
      </div>
      {children}
      {error ? (
        <p className="mt-2 flex items-center gap-1 typography-body03-regular text-error">
          <AlertIcon className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </section>
  )
}

const inputClassName =
  'h-12 w-full rounded-xl border bg-white px-3.5 typography-body02-regular text-text-100 placeholder:text-text-50 focus:outline-none'

export function PostingFormFields({ form }: PostingFormFieldsProps) {
  const { values, errors } = form
  const { workspaceOptions } = useWorkspaceSelectOptions()

  return (
    <div className="flex flex-col gap-3">
      <Section label="업장 선택" required error={errors.workspaceId}>
        {/* 공고의 소속 업장은 등록 시 확정 — 수정 화면에서는 변경 불가 */}
        <SelectDropdown
          ariaLabel="업장 선택"
          placeholder="업장을 선택해 주세요"
          options={workspaceOptions}
          value={values.workspaceId ?? -1}
          onChange={form.setWorkspaceId}
          disabled={form.isEditMode}
        />
      </Section>

      <Section label="공고 제목" required error={errors.title}>
        <input
          type="text"
          value={values.title}
          placeholder="예: 주말 홀서빙 구합니다"
          onChange={e => form.setTitle(e.target.value)}
          className={cn(
            inputClassName,
            errors.title ? 'border-error' : 'border-line-1 focus:border-main'
          )}
        />
      </Section>

      <Section label="근무일정" required error={errors.schedules}>
        <ScheduleEditor form={form} />
      </Section>

      <Section
        label="급여"
        required
        error={errors.paymentType ?? errors.payAmount}
      >
        <div className="mb-2 flex gap-1.5">
          {PAYMENT_TYPES.map(paymentType => {
            const isSelected = values.paymentType === paymentType
            return (
              <button
                key={paymentType}
                type="button"
                aria-pressed={isSelected}
                onClick={() => form.setPaymentType(paymentType)}
                className={cn(
                  'h-9 flex-1 rounded-lg typography-body02-semibold transition-colors',
                  isSelected
                    ? 'bg-main text-white'
                    : 'border border-line-1 bg-white text-text-70'
                )}
              >
                {PAYMENT_TYPE_LABEL[paymentType]}
              </button>
            )
          })}
        </div>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={
              values.payAmount === ''
                ? ''
                : Number(values.payAmount).toLocaleString('ko-KR')
            }
            placeholder="예: 12,000"
            onChange={e => form.setPayAmount(e.target.value)}
            className={cn(
              inputClassName,
              'pr-10',
              errors.payAmount
                ? 'border-error'
                : 'border-line-1 focus:border-main'
            )}
          />
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 typography-body02-regular text-text-70">
            원
          </span>
        </div>
      </Section>

      <Section label="상세내용" required error={errors.description}>
        <textarea
          value={values.description}
          rows={5}
          placeholder="근무 조건, 우대 사항 등을 자유롭게 작성해 주세요"
          onChange={e => form.setDescription(e.target.value)}
          className={cn(
            'w-full resize-none rounded-xl border bg-white p-3.5 typography-body02-regular text-text-100 placeholder:text-text-50 focus:outline-none',
            errors.description
              ? 'border-error'
              : 'border-line-1 focus:border-main'
          )}
        />
      </Section>
    </div>
  )
}
