import { useState } from 'react'
import {
  usePhoneVerification,
  RECAPTCHA_CONTAINER_ID,
} from './hooks/usePhoneVerification'
import { useEmailVerification } from './hooks/useEmailVerification'
import { useSignupForm } from './hooks/useSignupForm'
import { Step1UserInfo } from './components/Step1UserInfo'
import { Step2AccountInfo } from './components/Step2AccountInfo'

export function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1)

  const phoneVerification = usePhoneVerification()
  const emailVerification = useEmailVerification()
  const form = useSignupForm()

  const isStep1Valid = form.isStep1Valid(phoneVerification.verified)
  const isStep2Valid = form.isStep2Valid(
    emailVerification.email,
    emailVerification.verified
  )

  const handleSubmit = () =>
    form.handleSubmit({
      phone: phoneVerification.phone,
      firebaseIdToken: phoneVerification.firebaseIdToken,
      emailSessionId: emailVerification.sessionId,
    })

  return (
    <>
      {/* Invisible reCAPTCHA 마운트 포인트 */}
      <div id={RECAPTCHA_CONTAINER_ID} />

      <div className="relative box-border flex min-h-[calc(100dvh-48px)] flex-col items-center justify-center overflow-x-hidden bg-white px-5 py-6 sm:px-4 sm:py-5 xs:px-3 xs:py-4">
        {step === 1 && (
          <Step1UserInfo
            name={form.name}
            gender={form.gender}
            birth={form.birth}
            birthError={form.birthError}
            onNameChange={form.setName}
            onGenderChange={form.setGender}
            onBirthChange={form.handleBirthChange}
            phoneVerification={phoneVerification}
            isValid={isStep1Valid}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2AccountInfo
            form={form}
            emailVerification={emailVerification}
            isValid={isStep2Valid}
            onBack={() => setStep(1)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </>
  )
}

export default SignupPage
