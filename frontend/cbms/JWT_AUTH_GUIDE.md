# JWT 인증 시스템 사용 가이드

## 개요

이 프로젝트는 JWT(AccessToken, RefreshToken) 기반 인증 시스템을 구현했습니다. 모든 API 요청에 자동으로 인증 토큰이 포함되며, 응답 코드에 따라 토큰 갱신, 로그아웃 등이 자동으로 처리됩니다.

## 주요 파일

### 1. `/src/utils/authFetch.ts`

JWT 인증이 포함된 공통 fetch wrapper 함수입니다.

**주요 기능:**

- 자동으로 AccessToken을 헤더에 추가
- 응답 코드별 자동 처리
- 토큰 갱신 로직
- 인증 실패 시 자동 로그아웃

**사용 가능한 함수:**

```typescript
authFetch(url, options); // 기본 fetch wrapper
authGet(url, options); // GET 요청
authPost(url, body, options); // POST 요청
authPut(url, body, options); // PUT 요청
authDelete(url, options); // DELETE 요청
```

### 2. `/src/store/providers/AuthProvider.tsx`

authFetch 초기화를 위한 Provider입니다. Redux dispatch, Alert, Router를 authFetch에 주입합니다.

### 3. `/src/api/admin/codeApiV2.example.ts`

authFetch를 사용하는 API 클래스 예시입니다.

## 응답 코드별 처리 로직

### 1010 - 잘못된 요청

- **동작**: Alert로 백엔드 에러 메시지 표시
- **예시**: 필수 파라미터 누락, 유효하지 않은 데이터 형식

### 1006 - AccessToken 만료

- **동작**:
  1. RefreshToken만 헤더에 추가하여 동일한 API 재요청
  2. 성공 시: 새 AccessToken, RefreshToken을 쿠키에 저장
  3. Redux에 사용자 정보 업데이트
  4. 원래 요청 결과 반환
- **자동 처리**: 사용자는 토큰 만료를 인지하지 못함

### 1008 - AccessToken 인증 불가

- **동작**:
  1. 쿠키에서 모든 토큰 삭제
  2. Redux 상태 초기화 (로그아웃)
  3. 로그인 페이지로 리다이렉트
- **Alert**: "인증 오류 - 다시 로그인해주세요."

### 1007 - RefreshToken 만료

- **동작**: 1008과 동일 (로그아웃 처리)

### 1009 - RefreshToken 인증 불가

- **동작**: 1008과 동일 (로그아웃 처리)

### 1001 - 로그인 안됨

- **동작**: 로그인 페이지로 즉시 리다이렉트
- **Alert 없음**: 조용히 로그인 페이지로 이동

### 1003 - 접근 권한 없음

- **동작**:
  1. Alert로 백엔드 메시지 표시
  2. 이전 페이지로 자동 이동 (router.back())
- **예시**: "이 기능을 사용할 권한이 없습니다."

## 사용 방법

### 1. 기존 API 클래스 변경

**Before (기존 방식):**

```typescript
public async findAllCodeMWithConditions(
  reqDto: CodeSearchFormReqDto,
  page: number = 0,
  size: number = 2000
): Promise<ResponseApi<Map<string, object>>> {
  const url = `${this.ADMIN_CODE_BASE_URL}/search?${params}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
```

**After (authFetch 사용):**

```typescript
import { authGet } from "@/utils/authFetch";

public async findAllCodeMWithConditions(
  reqDto: CodeSearchFormReqDto,
  page: number = 0,
  size: number = 2000
): Promise<ResponseApi<Map<string, object>>> {
  const url = `${this.ADMIN_CODE_BASE_URL}/search?${params}`;

  // authGet 사용 - JWT 토큰이 자동으로 헤더에 추가됨
  const response = await authGet(url);
  return response.json();
}
```

### 2. POST/PUT 요청 예시

```typescript
import { authPost, authPut } from "@/utils/authFetch";

// POST 요청
public async insertGroupCode(data: ComCodeMReqDto) {
  const url = `${this.ADMIN_CODE_BASE_URL}/group`;
  const response = await authPost(url, data);
  return response.json();
}

// PUT 요청
public async updateGroupCode(data: ComCodeMReqDto) {
  const url = `${this.ADMIN_CODE_BASE_URL}/group`;
  const response = await authPut(url, data);
  return response.json();
}
```

### 3. 인증이 필요 없는 API 호출

```typescript
import { authFetch } from "@/utils/authFetch";

// 로그인, 회원가입 등 인증이 필요 없는 API
public async signIn(user: AuthReqDto) {
  const url = `${this.API_AUTH_BASE_URL}/signIn`;

  // skipAuth: true 옵션 사용
  const response = await authFetch(url, {
    method: "POST",
    body: JSON.stringify(user),
    skipAuth: true,  // JWT 토큰을 헤더에 추가하지 않음
  });

  return response.json();
}
```

## 프로바이더 구조

```
RootLayout
└── ReduxProvider (Redux Store)
    └── AlertProvider (Alert Context)
        └── AuthProvider (authFetch 초기화)
            └── 앱 컴포넌트들
```

이 구조를 통해 authFetch가 Redux dispatch, showAlert, router를 사용할 수 있습니다.

## 쿠키 관리

**저장되는 쿠키:**

- `accessToken`: 만료 1일
- `refreshToken`: 만료 7일

**자동 관리:**

- 로그인 성공 시: 자동 저장
- 토큰 갱신 시: 자동 업데이트
- 로그아웃 시: 자동 삭제

## Redux 상태 관리

**authSlice 상태:**

```typescript
{
  user: User | null,        // 사용자 정보
  token: string | null,     // AccessToken
  isAuthenticated: boolean, // 로그인 여부
  loading: boolean          // 로딩 상태
}
```

**자동 업데이트:**

- 로그인 성공: `login` 액션
- 토큰 갱신: `login` 액션 (새 사용자 정보)
- 로그아웃: `logout` 액션

## 환경 변수

`.env` 파일에서 토큰 헤더명을 환경별로 설정:

```env
# Development
NEXT_ACCESS_TOKEN_HEADER=Authorization-AccessToken-DEV
NEXT_REFRESH_TOKEN_HEADER=Authorization-RefreshToken-DEV

# Production
NEXT_ACCESS_TOKEN_HEADER=Authorization-AccessToken-PROD
NEXT_REFRESH_TOKEN_HEADER=Authorization-RefreshToken-PROD
```

## 마이그레이션 가이드

### 기존 API 클래스를 authFetch로 변경하는 방법

1. **import 추가**

```typescript
import { authGet, authPost, authPut, authDelete } from "@/utils/authFetch";
```

2. **fetch 호출 변경**

```typescript
// GET 요청
const response = await fetch(url, { method: "GET", headers: {...} });
↓
const response = await authGet(url);

// POST 요청
const response = await fetch(url, {
  method: "POST",
  headers: {...},
  body: JSON.stringify(data)
});
↓
const response = await authPost(url, data);

// PUT 요청
const response = await fetch(url, {
  method: "PUT",
  headers: {...},
  body: JSON.stringify(data)
});
↓
const response = await authPut(url, data);

// DELETE 요청
const response = await fetch(url, { method: "DELETE", headers: {...} });
↓
const response = await authDelete(url);
```

3. **response.json() 유지**

```typescript
return response.json(); // 변경 없음
```

## 디버깅

**콘솔 로그 확인:**

- "authFetch 오류": fetch 실패
- "토큰 갱신 실패": RefreshToken으로 재요청 실패

**Redux DevTools:**

- `auth` 상태 확인
- `login`, `logout` 액션 추적

**브라우저 개발자 도구:**

- Application > Cookies: 토큰 확인
- Network > Headers: 요청 헤더 확인

## 주의사항

1. **authFetch는 클라이언트 컴포넌트에서만 사용**

   - 쿠키와 Redux를 사용하므로 서버 컴포넌트에서는 사용 불가

2. **로그인/회원가입 API는 skipAuth 옵션 필수**

   ```typescript
   authFetch(url, { skipAuth: true });
   ```

3. **토큰 갱신은 자동으로 처리됨**

   - 개발자가 별도로 토큰 갱신 로직을 작성할 필요 없음

4. **에러 핸들링은 authFetch가 처리**
   - 1001~1010 응답 코드는 authFetch에서 자동 처리
   - 비즈니스 로직 에러만 추가로 처리하면 됨

## 테스트 시나리오

1. **정상 로그인**: 토큰 저장 확인
2. **API 호출**: AccessToken 헤더 확인
3. **AccessToken 만료**: 자동 갱신 확인 (1006)
4. **RefreshToken 만료**: 로그아웃 확인 (1007)
5. **권한 없음**: Alert 및 이전 페이지 이동 확인 (1003)
6. **잘못된 요청**: Alert 표시 확인 (1010)

## 문의 및 지원

JWT 인증 시스템 관련 문의사항은 개발팀에 문의해주세요.
