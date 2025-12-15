/**
 * @파일명 : useMenuApi.ts
 * @설명 : 메뉴 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

import { useState, useCallback } from "react";
import { MenuApi } from "@/api/admin/menuApi";
import { MenuReqDto } from "@/types/requestDto/MenuReqDto";
import { MenuResDto } from "@/types/responseDto/MenuResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * 메뉴 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 메뉴 관리에 필요한 상태와 함수들을 반환
 * @returns {MenuResDto[]} menuList - 메뉴 리스트 데이터
 * @returns {MenuResDto[]} menuTree - 메뉴 트리 구조 데이터
 * @returns {MenuResDto | null} selectedMenu - 선택된 메뉴 상세 정보
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchMenuList - 메뉴 리스트 조회 함수
 * @returns {Function} fetchMenuTree - 메뉴 트리 조회 함수 (/search API 사용)
 * @returns {Function} fetchMenuDetail - 메뉴 상세 조회 함수
 * @returns {Function} insertMenu - 메뉴 추가 함수
 * @returns {Function} updateMenu - 메뉴 수정 함수
 * @returns {Function} deleteMenu - 메뉴 삭제 함수
 * @returns {Function} refetch - 데이터 새로고침 함수
 */
export const useMenuApi = () => {
  const [menuList, setMenuList] = useState<MenuResDto[]>([]);
  const [menuTree, setMenuTree] = useState<MenuResDto[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuResDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleApiCall } = useCommonApi();

  /**
   * @기능 메뉴 리스트 조회
   * @param menuReqDto 메뉴 검색 조건 DTO
   * @param pageable 페이지네이션 정보
   * @returns Promise<void>
   */
  const fetchMenuList = useCallback(
    async (
      menuReqDto: MenuReqDto = {
        menuNm: "",
        upperMenu: "",
        menuLv: 0,
        useYn: "",
        orderNum: 0,
      },
      pageable?: Pageable
    ): Promise<void> => {
      const result = await handleApiCall(
        async () => {
          const menuApi = MenuApi.getInstance();
          return await menuApi.findAllMenuForAdmin(menuReqDto, pageable);
        },
        (response) => {
          const responseData = response as any;
          if (responseData.data && Array.isArray(responseData.data)) {
            setMenuList(responseData.data);
          } else {
            setMenuList([]);
          }
        }
      );

      if (!result) {
        setMenuList([]);
      }
    },
    [handleApiCall]
  );

  /**
   * @기능 메뉴 트리 조회 (계층 구조) - /search API 사용
   * @returns Promise<void>
   */
  const fetchMenuTree = useCallback(async (): Promise<void> => {
    const result = await handleApiCall(
      async () => {
        const menuApi = MenuApi.getInstance();
        const searchDto: MenuReqDto = {
          menuNm: "",
          upperMenu: "",
          menuLv: 0,
          useYn: "",
          orderNum: 0,
        };
        return await menuApi.findAllMenuForAdmin(searchDto);
      },
      (response) => {
        const responseData = response as any;
        // 응답 구조: response.data.data[0].childMenus
        if (
          responseData.data &&
          responseData.data.data &&
          Array.isArray(responseData.data.data) &&
          responseData.data.data.length > 0
        ) {
          // 최상위 메뉴(MENU00000)의 childMenus를 트리로 설정
          const rootMenu = responseData.data.data[0];
          setMenuTree(rootMenu.childMenus || []);
        } else {
          setMenuTree([]);
        }
      }
    );

    if (!result) {
      setMenuTree([]);
    }
  }, [handleApiCall]);

  /**
   * @기능 메뉴 상세 조회
   * @param menuCd 메뉴 코드
   * @returns Promise<void>
   */
  const fetchMenuDetail = useCallback(
    async (menuCd: string): Promise<void> => {
      const result = await handleApiCall(
        async () => {
          const menuApi = MenuApi.getInstance();
          return await menuApi.findByMenuForAdmin(menuCd);
        },
        (response) => {
          const responseData = response as any;
          if (responseData.data) {
            setSelectedMenu(responseData.data);
          } else {
            setSelectedMenu(null);
          }
        }
      );

      if (!result) {
        setSelectedMenu(null);
      }
    },
    [handleApiCall]
  );

  /**
   * @기능 메뉴 추가
   * @param menuReqDto 메뉴 정보 DTO
   * @returns Promise<boolean> 성공 여부
   */
  const insertMenu = useCallback(
    async (menuReqDto: MenuReqDto): Promise<boolean> => {
      const result = await handleApiCall(async () => {
        const menuApi = MenuApi.getInstance();
        return await menuApi.insertMenuForAdmin(menuReqDto);
      });

      return result !== null;
    },
    [handleApiCall]
  );

  /**
   * @기능 메뉴 수정
   * @param menuReqDto 메뉴 정보 DTO
   * @returns Promise<boolean> 성공 여부
   */
  const updateMenu = useCallback(
    async (menuReqDto: MenuReqDto): Promise<boolean> => {
      const result = await handleApiCall(async () => {
        const menuApi = MenuApi.getInstance();
        return await menuApi.updateMenuForAdmin(menuReqDto);
      });

      return result !== null;
    },
    [handleApiCall]
  );

  /**
   * @기능 메뉴 삭제
   * @param menuCd 메뉴 코드
   * @returns Promise<boolean> 성공 여부
   */
  const deleteMenu = useCallback(
    async (menuCd: string): Promise<boolean> => {
      const result = await handleApiCall(async () => {
        const menuApi = MenuApi.getInstance();
        return await menuApi.deleteMenuForAdmin(menuCd);
      });

      return result !== null;
    },
    [handleApiCall]
  );

  /**
   * @기능 메뉴 트리 데이터 새로고침
   * @returns Promise<void>
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchMenuTree();
  }, [fetchMenuTree]);

  return {
    menuList,
    menuTree,
    selectedMenu,
    loading,
    error,
    fetchMenuList,
    fetchMenuTree,
    fetchMenuDetail,
    insertMenu,
    updateMenu,
    deleteMenu,
    refetch,
    setSelectedMenu, // 외부에서 직접 메뉴 선택 가능
  };
};
