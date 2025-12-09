import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CommonCodeState, CommonCodeData } from "@/types/code.types";

/**
 * @파일명 : commonCodeSlice.ts
 * @설명 : 공통코드 Redux Slice
 * @작성자 : 김승연
 * @작성일 : 2025.12.09
 * @변경이력 :
 *       2025.12.09 김승연 최초 생성
 */

const initialState: CommonCodeState = {
  data: null,
  isLoaded: false,
  lastUpdated: null,
  error: null,
};

const commonCodeSlice = createSlice({
  name: "commonCode",
  initialState,
  reducers: {
    /**
     * 공통코드 데이터 설정
     */
    setCommonCodes: (state, action: PayloadAction<CommonCodeData>) => {
      state.data = action.payload;
      state.isLoaded = true;
      state.lastUpdated = Date.now();
      state.error = null;
    },

    /**
     * 에러 설정
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    /**
     * 공통코드 초기화
     */
    clearCommonCodes: (state) => {
      state.data = null;
      state.isLoaded = false;
      state.lastUpdated = null;
      state.error = null;
    },

    /**
     * 특정 그룹코드의 상세코드 업데이트
     */
    updateGroupCodes: (
      state,
      action: PayloadAction<{
        grpCd: string;
        codes: any[];
      }>
    ) => {
      if (state.data) {
        state.data.detailsByGroup[action.payload.grpCd] = action.payload.codes;
        state.lastUpdated = Date.now();
      }
    },
  },
});

export const { setCommonCodes, setError, clearCommonCodes, updateGroupCodes } =
  commonCodeSlice.actions;

export default commonCodeSlice.reducer;
