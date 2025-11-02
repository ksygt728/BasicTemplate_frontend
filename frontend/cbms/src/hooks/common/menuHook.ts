"use client";

import { useState, useEffect } from "react";
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
 */

export interface UseMenuReturn {
  menuData: MenuResDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * @기능 메뉴 데이터를 관리하는 커스텀 Hook
 * @returns {UseMenuReturn} 메뉴 데이터, 로딩 상태, 에러 상태, 재조회 함수
 */
export const useMenu = (): UseMenuReturn => {
  const [menuData, setMenuData] = useState<MenuResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * @기능 API에서 메뉴 데이터 가져오기
   */
  const fetchMenuData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

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

          setMenuData(level1Menus);
        } else {
          setMenuData([]);
        }
      } else {
        setMenuData([]);
      }
    } catch (error) {
      console.error("메뉴 데이터 로딩 실패:", error);
      setError(
        error instanceof Error
          ? error.message
          : "메뉴 데이터를 불러오는 중 오류가 발생했습니다."
      );
      setMenuData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @기능 메뉴 데이터 재조회
   */
  const refetch = async (): Promise<void> => {
    await fetchMenuData();
  };

  // 컴포넌트 마운트 시 메뉴 데이터 로드
  useEffect(() => {
    fetchMenuData();
  }, []);

  return {
    menuData,
    loading,
    error,
    refetch,
  };
};

/**
 * @기능 네비게이션 바 전용 메뉴 Hook
 * @설명 네비게이션 바에서 사용하는 특정 로직을 포함
 * @returns {UseMenuReturn} 메뉴 데이터, 로딩 상태, 에러 상태, 재조회 함수
 */
export const useNavBarMenu = (): UseMenuReturn => {
  return useMenu();
};

/**
 * @기능 사이드바 전용 메뉴 Hook
 * @설명 사이드바에서 사용하는 특정 로직을 포함 (향후 확장 가능)
 * @returns {UseMenuReturn} 메뉴 데이터, 로딩 상태, 에러 상태, 재조회 함수
 */
export const useSideBarMenu = (): UseMenuReturn => {
  return useMenu();
};
