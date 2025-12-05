/\*\*

- @파일명 : README.md
- @설명 : Redux 사용 가이드
- @작성자 : 김승연
- @작성일 : 2025.12.01
  \*/

# Redux 사용 가이드

## 📁 폴더 구조

```
src/store/
├── store.ts                    # Redux Store 설정
├── hooks.ts                    # 타입 안전 hooks (useAppDispatch, useAppSelector)
├── providers/
│   └── ReduxProvider.tsx       # Redux Provider (Client Component)
└── slices/
    └── authSlice.ts           # 인증 관련 Slice
```

## 🚀 사용 방법

### 1. State 읽기

```typescript
"use client";

import { useAppSelector } from "@/store/hooks";

export default function UserProfile() {
  // Redux state 읽기
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <h1>환영합니다, {user?.name}님!</h1>
      <p>이메일: {user?.email}</p>
    </div>
  );
}
```

### 2. State 업데이트 (Dispatch)

```typescript
"use client";

import { useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/slices/authSlice";

export default function LoginButton() {
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    // 로그인 액션 dispatch
    dispatch(
      login({
        user: {
          userId: "user123",
          name: "홍길동",
          email: "hong@example.com",
          role: "admin",
        },
        token: "jwt-token-here",
      })
    );
  };

  const handleLogout = () => {
    // 로그아웃 액션 dispatch
    dispatch(logout());
  };

  return (
    <div>
      <button onClick={handleLogin}>로그인</button>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}
```

### 3. 비동기 처리 (Thunk)

```typescript
// store/slices/authSlice.ts에 추가
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (credentials: { username: string; password: string }) => {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
  }
);

// 컴포넌트에서 사용
const dispatch = useAppDispatch();
dispatch(loginAsync({ username: "user", password: "pass" }));
```

## 📝 새로운 Slice 추가 방법

### 1. Slice 파일 생성 (`store/slices/menuSlice.ts`)

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  menus: any[];
  loading: boolean;
}

const initialState: MenuState = {
  menus: [],
  loading: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (state, action: PayloadAction<any[]>) => {
      state.menus = action.payload;
    },
  },
});

export const { setMenus } = menuSlice.actions;
export default menuSlice.reducer;
```

### 2. Store에 등록 (`store/store.ts`)

```typescript
import menuReducer from "./slices/menuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer, // 추가
  },
});
```

## 🎯 언제 Redux를 사용할까?

### ✅ Redux 사용 추천

- 사용자 인증 정보 (여러 컴포넌트에서 사용)
- 전역 메뉴 데이터
- 앱 전체 설정 (테마, 언어 등)
- 복잡한 상태 관리 로직

### ❌ Redux 사용 비추천

- 단일 페이지에서만 사용하는 상태 → useState
- 간단한 폼 상태 → useState
- 서버 데이터 캐싱 → React Query (또는 SWR)

## 🔍 디버깅

Redux DevTools 브라우저 확장 프로그램 설치:

- Chrome: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- Firefox: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

설치 후 개발자 도구에서 Redux 탭으로 상태 변화 확인 가능
