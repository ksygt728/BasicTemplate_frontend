import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import menuReducer from "./slices/menuSlice";
import commonCodeReducer from "./slices/commonCodeSlice";

/**
 * @파일명 : store.ts
 * @설명 : Redux Store 설정
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 *       2025.12.04 김승연 menuReducer 추가
 *       2025.12.09 김승연 commonCodeReducer 추가
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    commonCode: commonCodeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Date 객체 등 직렬화 불가능한 값 허용
        ignoredActions: ["auth/setUser"],
        ignoredPaths: ["auth.user.lastLogin"],
      },
    }),
});

// TypeScript 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
