"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMenuData, setLoading, setError } from "@/store/slices/menuSlice";
import { MenuApi } from "@/api/admin/menuApi";
import type { MenuReqDto } from "@/types/requestDto/MenuReqDto";
import type { MenuResDto } from "@/types/responseDto/MenuResDto";
import type { ResponseApi } from "@/types/commonDto/ResponseApi";
import type { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : menuHook.ts
 * @설명 : 메뉴 관련 비즈니스 로직을 처리하는 커스텀 Hook
 * @작성자 : 김승연
 * @작성일 : 2025.10.08
 * @변경이력 :
 *       2025.10.08 김승연 최초 생성
 *       2025.12.04 김승연 Redux 사용으로 변경 (중복 API 호출 방지)
 */

export interface UseMenuReturn {
  menuData: MenuResDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * @기능 메뉴 데이터를 관리하는 커스텀 Hook (API 호출 포함)
 * @description NavBar에서만 사용 - API를 호출하여 Redux에 저장
 * @returns {UseMenuReturn} 메뉴 데이터, 로딩 상태, 에러 상태, 재조회 함수
 */
export const useMenu = (): UseMenuReturn => {
  const dispatch = useAppDispatch();
  const { menuData, loading, error } = useAppSelector((state) => state.menu);
  const isFetched = useRef(false); // 중복 호출 방지

  /**
   * @기능 API에서 메뉴 데이터 가져오기
   */
  const fetchMenuData = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const menuApi = MenuApi.getInstance();
      const menuReqDto: MenuReqDto = {
        menuNm: "",
        upperMenu: "",
        menuLv: 0,
        useYn: "Y",
        orderNum: 0,
      };

      const pageable: Pageable = {
        page: 0,
        size: 2000,
        sort: "orderNum",
        direction: "ASC",
      };

      const response: ResponseApi<Map<string, object>> =
        await menuApi.findAllMenuForAdmin(menuReqDto, pageable);

      if (response.success && response.data) {
        const responseData = response.data as any;
        if (responseData.data && responseData.data.length > 0) {
          // menuLv = 0인 최상위 메뉴를 제외하고 menuLv = 1인 메뉴들만 추출
          const rootMenu = responseData.data[0]; // 최상위 메뉴 (menuLv = 0)
          const level1Menus = rootMenu.childMenus || [];

          dispatch(setMenuData(level1Menus));
        } else {
          dispatch(setMenuData([]));
        }
      } else {
        dispatch(setMenuData([]));
      }
    } catch (error) {
      console.error("메뉴 데이터 로딩 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "메뉴 데이터를 불러오는 중 오류가 발생했습니다.";
      dispatch(setError(errorMessage));
      dispatch(setMenuData([]));
    }
  };

  /**
   * @기능 메뉴 데이터 재조회
   */
  const refetch = async (): Promise<void> => {
    isFetched.current = false; // 재조회 시 플래그 리셋
    await fetchMenuData();
  };

  // 컴포넌트 마운트 시 메뉴 데이터 로드 (한 번만)
  useEffect(() => {
    // 이미 데이터가 있거나 이미 fetch했으면 스킵
    if (isFetched.current || menuData.length > 0) {
      return;
    }

    isFetched.current = true;
    fetchMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    menuData,
    loading,
    error,
    refetch,
  };
};

/**
 * @기능 Redux에서 메뉴 데이터만 읽는 Hook (API 호출 없음)
 * @description Breadcrumb 등에서 사용 - Redux 데이터만 읽음
 * @returns {UseMenuReturn} 메뉴 데이터, 로딩 상태, 에러 상태
 */
export const useMenuData = (): Omit<UseMenuReturn, "refetch"> => {
  const { menuData, loading, error } = useAppSelector((state) => state.menu);

  return {
    menuData,
    loading,
    error,
  };
};

/**
 * @기능 네비게이션 바 전용 메뉴 Hook
 * @설명 네비게이션 바에서 사용 - API를 호출하여 Redux에 저장
 * @returns {UseMenuReturn} 메뉴 데이터, 로딩 상태, 에러 상태, 재조회 함수
 */
export const useNavBarMenu = (): UseMenuReturn => {
  return useMenu(); // API 호출 포함
};

/**
 * @기능 브레드크럼 전용 메뉴 Hook
 * @설명 브레드크럼에서 사용 - Redux에서 데이터만 읽음 (API 호출 없음)
 * @returns 메뉴 데이터, 로딩 상태, 에러 상태
 */
export const useBreadcrumbMenu = (): Omit<UseMenuReturn, "refetch"> => {
  return useMenuData(); // Redux에서만 읽음
};

/**
 * @기능 사이드바 전용 메뉴 Hook
 * @설명 사이드바에서 사용 - Redux에서 데이터만 읽음 (API 호출 없음)
 * @returns 메뉴 데이터, 로딩 상태, 에러 상태
 */
export const useSideBarMenu = (): Omit<UseMenuReturn, "refetch"> => {
  return useMenuData(); // Redux에서만 읽음
};
