# 🚀 CBMS (Code Base Management System) - Frontend

> **Next.js 기반의 프론트엔드 솔루션**  
> 업무 관리 시스템의 사용자 인터페이스

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.11.0-764ABC?style=flat-square&logo=redux)
![React Query](https://img.shields.io/badge/React%20Query-5.90.12-FF4154?style=flat-square&logo=react-query)
![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?style=flat-square&logo=docker)
![Jenkins](https://img.shields.io/badge/Jenkins-Pipeline-D24939?style=flat-square&logo=jenkins)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## � 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [빠른 시작](#빠른-시작)
- [환경 설정](#환경-설정)
- [Docker 배포](#-docker-배포)
- [CI/CD 파이프라인](#-cicd-파이프라인-jenkins)
- [개발 가이드](#개발-가이드)
- [테스트](#-테스트)
- [보안](#-보안)
- [지원 및 문의](#-지원-및-문의)

---

## 🎯 프로젝트 개요

**CBMS(Code Base Management System)**는 모든 엔터프라이즈 애플리케이션에 필수적인 관리자 기능 및 기반 모듈을 구현한 **프론트엔드 클라이언트**입니다.

### 📌 프로젝트 목표

이 프로젝트는 **백엔드 API와 통신하여 사용자 인터페이스를 제공하는 웹 애플리케이션**입니다.
Next.js 기반으로 SEO 최적화, 서버사이드 렌더링, 정적 생성 등의 이점을 모두 활용합니다.

```
┌─────────────────────────────────────────────────┐
│  CBMS Frontend                                  │
│  ├─ ✅ 사용자 인증 (JWT, OAuth 2.0)                │
│  ├─ ✅ 상태 관리 (Redux + React Query)             │
│  ├─ ✅ 관리자 기능 UI                              │
│  ├─ ✅ 반응형 디자인 (Tailwind CSS)                │
│  ├─ ✅ 성능 최적화 (Turbopack, Image 최적화)       │
│  └─ ✅ CI/CD 파이프라인 (Jenkins)                  │
│                                                 │
│  + CBMS Backend API 연동                         │
│  └─ (RESTful API 통신, JWT 토큰 관리)              │
└─────────────────────────────────────────────────┘
```

### 핵심 특징

✅ **Next.js 기술 스택** - React 19 + TypeScript + Turbopack  
✅ **상태관리** - Redux(전역) + React Query(서버 상태)  
✅ **고성능** - Turbopack 기반 빌드, 이미지 최적화  
✅ **보안** - JWT 자동 토큰 관리, CSRF 방지  
✅ **반응형 UI** - Tailwind CSS 활용한 모바일 대응  
✅ **개발 경험** - TypeScript strict mode, ESLint  
✅ **자동 배포** - Jenkins Pipeline 기반 CI/CD  
✅ **다중 환경** - Local, Dev, QA, Prod 환경별 설정

---

## 💡 주요 기능

| 기능             | 설명                                           | 기술 스택               |
| ---------------- | ---------------------------------------------- | ----------------------- |
| **인증/인가**    | JWT 토큰 + OAuth 2.0 (소셜 로그인)             | JWT, Cookies, Next Auth |
| **상태 관리**    | Redux(전역) + React Query(서버) 하이브리드     | Redux Toolkit, TanStack |
| **관리자 UI**    | 사용자, 역할, 메뉴, 부서, 코드 관리 인터페이스 | React Components        |
| **페이지네이션** | 서버 기반 페이징 지원 컴포넌트                 |                         |
| **공통코드**     | 백엔드 공통코드를 캐싱하여 Select로 변환       | Redux                   |
| **폼 검증**      | 클라이언트 입력 유효성 검사                    | ValidationService       |
| **에러 처리**    | 전역 에러 알림 및 사용자 피드백                | AlertContext, Toast     |
| **API 통신**     | JWT 토큰 자동 포함 및 갱신                     | authFetch Utility       |

---

## 🛠️ 기술 스택

### 핵심 프레임워크

| 기술           | 버전   | 설명                    |
| -------------- | ------ | ----------------------- |
| **Next.js**    | 16.1.1 | React 풀스택 프레임워크 |
| **React**      | 19.1.0 | UI 라이브러리           |
| **TypeScript** | 5      | 타입 안전성             |

### 상태 & 데이터 관리

| 기술              | 버전    | 설명                  |
| ----------------- | ------- | --------------------- |
| **Redux Toolkit** | 2.11.0  | 전역 상태 관리        |
| **React Redux**   | 9.2.0   | React-Redux 바인딩    |
| **React Query**   | 5.90.12 | 서버 상태 관리 & 캐싱 |

### UI & 스타일링

| 기술             | 버전 | 설명              |
| ---------------- | ---- | ----------------- |
| **Tailwind CSS** | 4    | 유틸리티 기반 CSS |
| **PostCSS**      | 4    | CSS 처리          |

### 개발 도구

| 기술        | 버전 | 설명           |
| ----------- | ---- | -------------- |
| **ESLint**  | 9    | 코드 품질 검사 |
| **Node.js** | 20   | 런타임 환경    |

### 유틸리티

| 기술          | 버전  | 설명      |
| ------------- | ----- | --------- |
| **js-cookie** | 3.0.5 | 쿠키 관리 |

---

## 📁 프로젝트 구조

```
cbms/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── auth/                     # 인증 페이지
│   │   ├── main/                     # 메인 페이지
│   │   ├── admin/                    # 관리자 페이지
│   │   ├── signIn/                   # 로그인 페이지
│   │   ├── signUp/                   # 회원가입 페이지
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   ├── page.tsx                  # 홈페이지
│   │   └── globals.css               # 전역 스타일
│   │
│   ├── api/                          # API 클라이언트
│   │   ├── admin/                    # 관리 API
│   │   │   ├── userApi.ts
│   │   │   ├── codeApi.ts
│   │   │   ├── departmentApi.ts
│   │   │   ├── bbsApi.ts
│   │   │   ├── logApi.ts
│   │   │   ├── mailApi.ts
│   │   │   ├── smsApi.ts
│   │   │   ├── schedulerApi.ts
│   │   │   └── ... (기타 API)
│   │   └── common/                   # 공통 API
│   │       ├── authApi.ts
│   │       └── sharedApi.ts
│   │
│   ├── components/                   # React 컴포넌트
│   │   ├── common/                   # 공통 컴포넌트
│   │   │   ├── breadcrumb/
│   │   │   ├── error/
│   │   │   ├── logo/
│   │   │   └── themed/
│   │   └── layout/                   # 레이아웃 컴포넌트
│   │       ├── frame/
│   │       └── navBar/
│   │
│   ├── hooks/                        # Custom Hooks
│   │   ├── admin/                    # 관리 기능 Hooks
│   │   │   ├── useUserApi.ts
│   │   │   ├── useCodeApi.ts
│   │   │   ├── useDepartmentApi.ts
│   │   │   └── ... (기타 Hooks)
│   │   └── common/                   # 공통 Hooks
│   │       ├── useAuthApi.ts
│   │       ├── useCommonCode.ts
│   │       ├── useCommonSearch.ts
│   │       └── menuHook.ts
│   │
│   ├── service/                      # 비즈니스 로직
│   │   ├── AuthService.ts            # 인증 서비스
│   │   ├── UserService.ts            # 사용자 서비스
│   │   ├── CodeService.ts            # 코드 서비스
│   │   ├── ValidationService.ts      # 유효성 검사
│   │   ├── mapper/                   # DTO 매핑
│   │   └── transformer/              # 데이터 변환
│   │
│   ├── store/                        # Redux Store
│   │   ├── store.ts                  # 스토어 설정
│   │   ├── hooks.ts                  # Redux Hooks
│   │   ├── slices/                   # Redux Slices
│   │   │   ├── authSlice.ts
│   │   │   ├── menuSlice.ts
│   │   │   └── commonCodeSlice.ts
│   │   └── providers/                # Redux Provider
│   │
│   ├── utils/                        # 유틸리티 함수
│   │   ├── authFetch.ts              # JWT 자동 포함 fetch
│   │   ├── codeUtils.ts
│   │   ├── MapperUtils.ts
│   │   └── TransformerUtils.ts
│   │
│   ├── types/                        # TypeScript 타입 정의
│   │   ├── code.types.ts
│   │   ├── commonDto/
│   │   ├── requestDto/
│   │   └── responseDto/
│   │
│   ├── styles/                       # 스타일 설정
│   │   └── theme.ts
│   │
│   ├── contexts/                     # React Context
│   │   └── AlertContext.tsx
│   │
│   ├── constants/                    # 상수 정의
│   │   └── columns/
│   │       └── codeColumns.ts
│   │
│   ├── config/                       # 설정 파일
│   │   └── temp.tsx
│   │
│   ├── lib/                          # 라이브러리 설정
│   │   └── temp.tsx
│   │
│   └── middleware.ts                 # Next.js Middleware
│
├── 설정 파일
│   ├── package.json                  # 의존성 관리
│   ├── tsconfig.json                 # TypeScript 설정
│   ├── next.config.ts                # Next.js 설정
│   ├── tailwind.config.ts            # Tailwind CSS 설정
│   ├── postcss.config.mjs            # PostCSS 설정
│   ├── eslint.config.mjs             # ESLint 설정
│   └── docker-compose.yml            # Docker Compose 설정
│
├── Docker
│   ├── Dockerfile                    # Docker 이미지 빌드
│   ├── .env.dev                      # 개발 환경 변수
│   ├── .env.QA                  # 스테이징 환경 변수
│   ├── .env.prod                     # 프로덕션 환경 변수
│   └── Jenkinsfile                   # CI/CD 파이프라인
│
└── 문서
    ├── README.md                     # 프로젝트 개요
    ├── JWT_AUTH_GUIDE.md             # JWT 인증 가이드
    ├── COMMON_CODE_GUIDE.md          # 공통코드 관리 가이드
    └── PAGINATION_GUIDE.md           # 페이지네이션 가이드
```

---

## 🚀 빠른 시작

### 필수 사항

- **Node.js** 20.x 이상
- **npm** 10.x+ 또는 **yarn**
- **Docker & Docker Compose** (선택사항)
- **CBMS Backend API** 서버 (로컬: http://localhost:8080)

### 1️⃣ 저장소 클론

```bash
git clone https://github.com/ksygt728/BasicTemplate_frontend.git
cd BasicTemplate_frontend/frontend/cbms
```

### 2️⃣ 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3️⃣ 환경 변수 설정

```bash
# .env.local 파일 생성
cp .env.example .env.local

# 필수 환경 변수 (개발 환경)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000
```

### 4️⃣ 애플리케이션 실행

#### VSCode에서 실행

1. **프로젝트 폴더 열기**
   - VSCode에서 `frontend/cbms` 폴더를 Open

2. **Extension 설치** (필요시)
   - Extension Marketplace에서 "ES7+ React/Redux/React-Native snippets" 설치
   - "Tailwind CSS IntelliSense" 설치 (선택)

3. **애플리케이션 실행**
   - 터미널에서 다음 명령 실행:

   ```bash
   npm run dev
   ```

   - 또는 VSCode의 Terminal 메뉴에서 "New Terminal" 클릭

4. **애플리케이션 확인**
   ```
   ✅ 개발 서버: http://localhost:3000
   ✅ API 서버: http://localhost:8080
   ```

---

## ⚙️ 환경 설정

### 프로필 종류

| 프로필    | 설명      | 용도             | 파일         |
| --------- | --------- | ---------------- | ------------ |
| **local** | 로컬 개발 | 개발자 로컬 머신 | `.env.local` |
| **dev**   | 개발 서버 | 개발 서버 배포   | `.env.dev`   |
| **QA**    | 스테이징  | 사전 배포 테스트 | `.env.QA`    |
| **prod**  | 운영 서버 | 실제 운영 환경   | `.env.prod`  |

### 환경 변수 설정 예시

```bash
# 로컬 개발 환경 (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000

# 개발 환경 (.env.dev)
NEXT_PUBLIC_API_URL=https://dev.cbmsori.com
NEXT_PUBLIC_API_TIMEOUT=30000

# 운영 환경 (.env.prod)
NEXT_PUBLIC_API_URL=https://api.cbmsori.com
NEXT_PUBLIC_API_TIMEOUT=30000
```

---

## 🐳 Docker 배포

### 로컬 환경에서 실행

```bash
# Docker 이미지 빌드 (개발 환경)
docker build -t cbms-front:dev --build-arg ENV_NAME=dev .

# Docker Compose로 실행
docker-compose -f docker-compose.yml up -d

# 로그 확인
docker logs -f cbms-front-dev

# 중지
docker-compose down
```

### 환경별 배포

```bash
# 개발 환경
docker build -t cbms-front:dev --build-arg ENV_NAME=dev .
docker run -p 3000:3000 --env-file .env.dev cbms-front:dev

# 스테이징 환경
docker build -t cbms-front:QA --build-arg ENV_NAME=QA .
docker run -p 3000:3000 --env-file .env.QA cbms-front:QA

# 프로덕션 환경
docker build -t cbms-front:prod --build-arg ENV_NAME=prod .
docker run -p 3000:3000 --env-file .env.prod cbms-front:prod
```

### Docker 이미지 최적화 (다단계 빌드)

프로젝트의 `Dockerfile`은 다단계 빌드를 사용하여 최적화된 프로덕션 이미지를 생성합니다:

```dockerfile
# 1단계: Node.js 빌드
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2단계: 런타임
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
CMD ["npm", "start"]
```

---

## 🔄 CI/CD 파이프라인 (Jenkins)

### 파이프라인 단계

```
┌─────────────────────────────────────────────────────┐
│ 1️⃣ Init Parameters                                  │
│    (ENV, BRANCH, GIT_TAG, SERVER 확인)               │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 2️⃣ Checkout                                         │
│    Git Branch 또는 Tag 선택                           │
│    ✅ Rollback 지원: GIT_TAG 파라미터 활용               │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 3️⃣ Docker Build                                     │
│    docker build -t image:tag .                      │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 4️⃣ Docker Push (Remote Only)                        │
│    docker push image:tag                            │
│    docker image prune -a -f (정리)                   │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 5️⃣ Deploy (Remote Server)                           │
│    SSH로 원격 서버 배포                                 │
│    docker-compose up -d                             │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 6️⃣ Git Tag (버전 기록)                                │
│    git tag -a front-dev-{date}-{buildNum}           │
│    git push origin {TAG}                            │
└─────────────────────────────────────────────────────┘
```

### Jenkins 빌드 파라미터

| 파라미터        | 기본값          | 설명                            |
| --------------- | --------------- | ------------------------------- |
| `ENV`           | dev             | 배포 환경 (dev, QA, prod)       |
| `BRANCH`        | main            | 빌드할 Git 브랜치               |
| `GIT_TAG`       | HEAD            | 롤백할 Tag (비워두면 HEAD 사용) |
| `DEPLOY_SERVER` | dev.cbmsori.com | 대상 서버 IP/호스트명           |

### Rollback 방법

```bash
# 1. Jenkins 대시보드 → CBMS-DEV-FRONT → "Build with Parameters"
# 2. GIT_TAG 파라미터에 원하는 태그 입력
#    예: front-dev-2026-01-23_16-8
# 3. Build 클릭
# ✅ 해당 태그의 코드로 배포 완료
```

---

## 👨‍💻 개발 가이드

### 주요 명령어

```bash
# 개발 서버 실행 (Turbopack 활성화)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 품질 검사
npm run lint

# 코드 포맷팅
npm run format
```

### 코드 작성 규칙

#### 1. TypeScript 활용

모든 새로운 파일은 TypeScript(`.ts`, `.tsx`)로 작성합니다.

```typescript
// ❌ 나쁜 예
const fetchUser = (id) => {
  // ...
};

// ✅ 좋은 예
interface User {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (id: string): Promise<User> => {
  // ...
};
```

#### 2. 컴포넌트 작성

함수형 컴포넌트를 사용하며, 명확한 props 타입을 정의합니다.

```typescript
// ❌ 나쁜 예
const fetchUser = (id) => {
  // ...
};

// ✅ 좋은 예
interface User {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (id: string): Promise<User> => {
  // ...
};
```

#### 2. 컴포넌트 작성

함수형 컴포넌트를 사용하며, 명확한 props 타입을 정의합니다.

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
```

#### 3. 상태 관리

- **Redux**: 전역 상태 (사용자 정보, 메뉴, 공통코드)
- **React Query**: 서버 상태 (API 데이터)
- **useState**: 로컬 상태 (폼 입력, UI 상태)

```typescript
// Redux 사용 예
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return <div>{user?.name}</div>;
};
```

#### 4. API 호출

모든 API 호출은 `authFetch` 유틸을 사용하여 JWT 토큰이 자동으로 포함됩니다.

```typescript
import { authFetch } from "@/utils/authFetch";

const fetchUsers = async () => {
  const response = await authFetch("/api/admin/user", {
    method: "GET",
  });
  return response.json();
};
```

#### 5. 공통코드 사용

```typescript
import { useCommonCode } from '@/hooks/common/useCommonCode';

const MyComponent = () => {
  const { codeOptions } = useCommonCode('DEPT_CODE');

  return (
    <select>
      {codeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
```

### 폴더 구조 규칙

- **Pages** (`src/app/`): 라우트 페이지
- **Components** (`src/components/`): 재사용 가능한 컴포넌트
- **Hooks** (`src/hooks/`): 커스텀 Hooks
- **Services** (`src/service/`): 비즈니스 로직
- **Utils** (`src/utils/`): 유틸리티 함수
- **Types** (`src/types/`): TypeScript 타입 정의
- **Store** (`src/store/`): Redux 상태 관리

---

## 🐳 Docker 배포

### 로컬 환경에서 실행

```bash
# Docker 이미지 빌드
docker build -t cbms-front:dev --build-arg ENV_NAME=dev .

# Docker Compose로 실행
docker-compose -f docker-compose.yml up -d

# 로그 확인
docker logs cbms-front-dev -f

# 중지
docker-compose down
```

### 환경별 배포

```bash
# 개발 환경
docker build -t cbms-front:dev --build-arg ENV_NAME=dev .
docker run -p 3000:3000 --env-file .env.dev cbms-front:dev

# 스테이징 환경
docker build -t cbms-front:QA --build-arg ENV_NAME=QA .
docker run -p 3000:3000 --env-file .env.QA cbms-front:QA

# 프로덕션 환경
docker build -t cbms-front:prod --build-arg ENV_NAME=prod .
docker run -p 3000:3000 --env-file .env.prod cbms-front:prod
```

---

### 1. [JWT 인증 시스템 가이드](./JWT_AUTH_GUIDE.md)

JWT 기반 인증 시스템의 동작 방식, 토큰 갱신, 에러 처리 등을 설명합니다.

**주요 내용:**

- AccessToken & RefreshToken 관리
- 자동 토큰 갱신 로직
- 인증 오류 처리
- 권한 검증

### 2. [공통코드 관리 가이드](./COMMON_CODE_GUIDE.md)

Redux + React Query 하이브리드 방식의 공통코드 관리 시스템을 설명합니다.

**주요 내용:**

- 공통코드 조회 및 캐싱
- Select 옵션 자동 변환
- 커스텀 Hook 사용법
- 캐시 갱신 전략

### 3. [페이지네이션 가이드](./PAGINATION_GUIDE.md)

백엔드 페이지네이션을 활용한 재사용 가능한 Pagination 컴포넌트를 설명합니다.

**주요 내용:**

- 페이지네이션 컴포넌트 사용법
- 페이지 이동 처리
- 페이지 크기 변경
- 상태 관리

---

## 🧪 테스트

### 테스트 전략

이 프로젝트는 **React Testing Library** 기반의 포괄적인 테스트 지원을 제공합니다:

```
┌─────────────────────────────────────────────┐
│         테스트 피라미드 (권장)                   │
├─────────────────────────────────────────────┤
│                    E2E Tests                │
│            (Playwright, Cypress)            │
├─────────────────────────────────────────────┤
│             Integration Tests               │
│       (React Testing Library, MSW)          │
├─────────────────────────────────────────────┤
│            Unit Tests (Jest)                │
│    (Components, Hooks, Utils, Services)     │
└─────────────────────────────────────────────┘
```

### 테스트 실행

```bash
# 모든 테스트 실행
npm test

# Watch 모드로 실행
npm test -- --watch

# 커버리지 리포트
npm test -- --coverage

# 특정 파일만 테스트
npm test UserService
```

### Jest 테스트 예시

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button Component', () => {
  test('버튼 클릭 핸들러가 호출되어야 함', () => {
    const handleClick = jest.fn();

    render(<Button label="Click" onClick={handleClick} />);

    const button = screen.getByRole('button');
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🔒 보안

### 환경 변수 관리

민감한 정보는 절대 소스 코드에 포함시키지 않습니다:

- `.env.local`: 로컬 개발용 (git 무시) ❌ 커밋 금지
- `.env.dev`: 개발 환경 (보안 주의)
- `.env.QA`: 스테이징 환경
- `.env.prod`: 프로덕션 환경 (CI/CD에서만 주입)

```bash
# .env 파일 예시 (.env.local 절대 커밋 금지)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000
# 주의: NEXT_PUBLIC_* 는 브라우저에 노출됨 (민감정보 금지)
```

### JWT 토큰 보안

- **AccessToken**: 30분 만료 (단기 유효)
- **RefreshToken**: 7일 만료 (갱신 용)
- **저장소**: HttpOnly 쿠키에 자동 저장
- **전송**: Authorization 헤더에 Bearer 토큰으로 전달
- **갱신**: 자동 갱신 로직 (`authFetch` 유틸)

```typescript
// authFetch.ts: 자동 토큰 갱신
export const authFetch = async (
  url: string,
  options?: RequestInit,
): Promise<Response> => {
  let token = getAccessToken();

  // 토큰 만료 시 자동 갱신
  if (isTokenExpired(token)) {
    token = await refreshToken();
  }

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
};
```

### 입력 데이터 검증

모든 사용자 입력은 검증하고 sanitize합니다:

```typescript
import { ValidationService } from "@/service/ValidationService";

// 이메일 검증
const email = ValidationService.validateEmail(userInput);

// URL 인코딩
const encoded = encodeURIComponent(userInput);

// XSS 방지 (React가 자동 처리)
const htmlContent = { __html: DOMPurify.sanitize(content) };
```

### CORS & CSRF 방지

- **CORS**: 백엔드에서 화이트리스트 관리
- **CSRF Token**: 상태 변경 요청에 토큰 검증
- **SameSite Cookie**: HttpOnly + Secure + SameSite=Strict

### 보안 헤더 (Next.js)

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
      ],
    },
  ],
};
```

---

## 📞 지원 및 문의

| 항목              | 연락처                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| **GitHub Issues** | [이슈 생성](https://github.com/ksygt728/BasicTemplate_frontend/issues) |
| **이메일**        | ksygt728@gmail.com                                                     |
| **개발자**        | Kim Seung Yeon                                                         |

---
