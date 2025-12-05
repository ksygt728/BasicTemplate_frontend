import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * @파일명 : authSlice.ts
 * @설명 : 인증 관련 Redux Slice
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

/**
 * @interface User
 * @description 사용자 정보 타입
 */
export interface User {
  userId: string;
  name: string;
  email?: string;
  role?: string;
  phoneNum?: string;
  [key: string]: any;
}

/**
 * @interface AuthState
 * @description 인증 상태 타입
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

/**
 * @constant initialState
 * @description 초기 상태값
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

/**
 * @slice authSlice
 * @description 인증 관련 Redux Slice
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * @action setUser
     * @description 사용자 정보 설정
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    /**
     * @action setToken
     * @description 인증 토큰 설정
     */
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    /**
     * @action login
     * @description 로그인 처리
     */
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },

    /**
     * @action logout
     * @description 로그아웃 처리
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    /**
     * @action setLoading
     * @description 로딩 상태 설정
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setToken, login, logout, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
