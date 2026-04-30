import { initializeApp } from 'firebase/app'
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

let recaptchaVerifier: RecaptchaVerifier | null = null

/**
 * Invisible reCAPTCHA 초기화
 * @param containerId - reCAPTCHA를 마운트할 DOM 요소 id
 */
export function initRecaptcha(containerId: string): RecaptchaVerifier {
  // 이미 생성된 인스턴스가 있으면 재사용
  if (recaptchaVerifier) {
    return recaptchaVerifier
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
  })
  return recaptchaVerifier
}

/**
 * reCAPTCHA 인스턴스 초기화 (에러 복구 시 재생성용)
 */
export function clearRecaptcha(): void {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear()
    recaptchaVerifier = null
  }
}

/**
 * Firebase 전화번호 인증 SMS 발송
 * @param phoneNumber - 국제 형식 전화번호 (예: +821012345678)
 * @param containerId - reCAPTCHA 컨테이너 id
 */
export async function sendPhoneVerification(
  phoneNumber: string,
  containerId: string
): Promise<ConfirmationResult> {
  const verifier = initRecaptcha(containerId)
  return await signInWithPhoneNumber(auth, phoneNumber, verifier)
}

/**
 * 국내 전화번호를 Firebase 국제 형식(+82)으로 변환
 * 예: 01012345678 → +821012345678
 */
export function toInternationalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) {
    return '+82' + digits.slice(1)
  }
  return '+82' + digits
}

/**
 * 전화 인증 직후 저장된 토큰과 달리, 백엔드 signup-session 직전에 갱신해
 * 만료·재사용 오류를 줄입니다.
 */
export async function getFreshFirebaseIdToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken(true)
}
