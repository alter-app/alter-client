# Alter Client

React + Vite + TypeScript + Tailwind CSS + Zustand를 사용하는 클라이언트 애플리케이션입니다.

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 🛠️ 기술 스택

- **React 18** - UI 라이브러리 (안정적인 18 버전 사용)
- **Vite** - 빌드 도구 및 개발 서버
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Zustand** - 상태 관리 라이브러리
- **FSD** - Feature-Sliced Design 아키텍처
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅
- **Path Alias** - `@/` 경로로 import

## 📁 프로젝트 구조 (FSD - Feature-Sliced Design)

```
alter-client/
├── src/
│   ├── app/                    # 앱 초기화 및 설정
│   │   ├── providers/          # 전역 providers
│   │   ├── styles/             # 글로벌 스타일
│   │   ├── App.tsx             # 루트 앱 컴포넌트
│   │   └── main.tsx            # 진입점
│   ├── pages/                  # 페이지 컴포넌트
│   │   └── home/               # 홈 페이지
│   ├── widgets/                # 독립적인 UI 블록
│   ├── features/               # 사용자 상호작용 기능
│   │   └── counter/            # 카운터 기능
│   │       ├── ui/             # UI 컴포넌트
│   │       └── index.ts        # Public API
│   ├── entities/               # 비즈니스 엔티티
│   └── shared/                 # 재사용 가능한 코드
│       ├── stores/             # Zustand 스토어
│       ├── ui/                 # 공통 UI 컴포넌트
│       └── lib/                # 유틸리티 함수
├── public/                     # 공개 정적 파일
├── tailwind.config.js          # Tailwind CSS 설정
├── postcss.config.js           # PostCSS 설정
├── vite.config.ts              # Vite 설정 (path alias 포함)
├── tsconfig.json               # TypeScript 설정
└── eslint.config.js            # ESLint 설정
```

### FSD 레이어 설명

- **app** - 앱 초기화, 전역 설정, providers
- **pages** - 라우트별 페이지 컴포넌트
- **widgets** - 복합적인 UI 블록 (여러 features 조합)
- **features** - 사용자 상호작용 기능 (비즈니스 로직 포함)
- **entities** - 비즈니스 엔티티 (사용자, 상품 등)
- **shared** - 재사용 가능한 코드 (UI, 유틸, 스토어 등)

## 📝 스크립트

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run lint` - ESLint 검사
- `npm run lint:fix` - ESLint 자동 수정
- `npm run format` - Prettier 포맷팅
- `npm run format:check` - Prettier 검사

## 🎨 상태 관리 (Zustand)

Zustand를 사용한 간단하고 강력한 상태 관리입니다.

```typescript
import { useStore } from '@/shared/stores/useStore'

function MyComponent() {
  const { count, increment, decrement } = useStore()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

## 📦 Path Alias

`@/` 경로를 사용하여 src 폴더를 기준으로 import 할 수 있습니다.

```typescript
// ✅ Good
import { Counter } from '@/features/counter'
import { useStore } from '@/shared/stores/useStore'
import { HomePage } from '@/pages/home'

// ❌ Bad
import { Counter } from '../../../features/counter'
```

## 🎯 스타일링 (Tailwind CSS)

Tailwind CSS의 유틸리티 클래스를 사용하여 빠르게 스타일링할 수 있습니다.

```tsx
<div className="flex items-center justify-center min-h-screen bg-gray-100">
  <h1 className="text-4xl font-bold text-blue-600">Hello World</h1>
</div>
```

## 📚 추가 리소스

- [React 문서](https://react.dev)
- [Vite 문서](https://vite.dev)
- [TypeScript 문서](https://www.typescriptlang.org)
- [Tailwind CSS 문서](https://tailwindcss.com)
- [Zustand 문서](https://zustand-demo.pmnd.rs)
