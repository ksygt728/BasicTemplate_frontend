import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MenuResDto } from "@/types/responseDto/MenuResDto";

/**
 * @파일명 : menuSlice.ts
 * @설명 : 메뉴 관련 Redux Slice
 * @작성자 : 김승연
 * @작성일 : 2025.12.04
 * @변경이력 :
 *       2025.12.04 김승연 최초 생성
 */

/**
 * @interface MenuState
 * @description 메뉴 상태 타입
 */
interface MenuState {
  menuData: MenuResDto[];
  loading: boolean;
  error: string | null;
}

/**
 * @constant initialState
 * @description 초기 상태값
 */
const initialState: MenuState = {
  menuData: [],
  loading: false,
  error: null,
};

/**
 * @slice menuSlice
 * @description 메뉴 관련 Redux Slice
 */
const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    /**
     * @action setMenuData
     * @description 메뉴 데이터 설정
     */
    setMenuData: (state, action: PayloadAction<MenuResDto[]>) => {
      state.menuData = action.payload;
      state.loading = false;
      state.error = null;
    },

    /**
     * @action setLoading
     * @description 로딩 상태 설정
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * @action setError
     * @description 에러 상태 설정
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * @action clearMenu
     * @description 메뉴 데이터 초기화
     */
    clearMenu: (state) => {
      state.menuData = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setMenuData, setLoading, setError, clearMenu } =
  menuSlice.actions;

export default menuSlice.reducer;
