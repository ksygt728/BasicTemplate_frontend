import { MenuResDto } from "@/types/responseDto/MenuResDto";
import { useMenuApi } from "@/hooks/admin/useMenuApi";
import { toMenuReqDto } from "@/service/mapper/MenuMapper";
import {
  transformMenuListToTreeNodes,
  createUpperMenuOptions,
  findMenuByCode,
} from "@/service/transformer/MenuTransformer";
import { TreeNode } from "@/components/common/themed/TreeView";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : MenuService.ts
 * @설명 : 메뉴 관리 페이지의 비즈니스 로직을 처리하는 서비스
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface MenuFormData
 * @description 메뉴 폼 데이터 타입
 */
export interface MenuFormData {
  menuCd?: string;
  menuNm: string;
  upperMenu: string;
  menuLv: number;
  useYn: string;
  menuUrl?: string;
  orderNum: number;
}

/**
 * @interface MenuServiceHook
 * @description 메뉴 서비스의 반환 타입
 */
export interface MenuServiceHook {
  // 상태
  loading: boolean;
  error: string | null;
  menuTree: MenuResDto[];
  treeNodes: TreeNode[];
  selectedMenu: MenuResDto | null;
  upperMenuOptions: Array<{ value: string; label: string }>;

  // 비즈니스 로직 함수
  handleLoadMenuTree: () => Promise<void>;
  handleNodeClick: (node: TreeNode) => void;
  handleValidateUpperMenu: (menuCd: string) => Promise<MenuResDto | null>;
  handleInsertMenu: (formData: MenuFormData) => Promise<boolean>;
  handleUpdateMenu: (formData: MenuFormData) => Promise<boolean>;
  handleDeleteMenu: (menuCd: string) => Promise<boolean>;
  handleResetForm: () => void;
  refetch: () => Promise<void>;
}

/**
 * @hook useMenuService
 * @description 메뉴 관리 비즈니스 로직을 처리하는 커스텀 훅
 * @returns {MenuServiceHook} 상태, 데이터, 핸들러 함수들
 */
export const useMenuService = (): MenuServiceHook => {
  const menuApi = useMenuApi();
  const { showAlert } = useAlert();

  // ============================================================================
  // TreeView 노드 변환
  // ============================================================================

  const treeNodes = transformMenuListToTreeNodes(menuApi.menuTree);

  // ============================================================================
  // 상위 메뉴 옵션 생성
  // ============================================================================

  const upperMenuOptions = createUpperMenuOptions(menuApi.menuTree);

  // ============================================================================
  // 메뉴 트리 로드
  // ============================================================================

  /**
   * @function handleLoadMenuTree
   * @description 메뉴 트리 데이터를 로드
   * @returns Promise<void>
   */
  const handleLoadMenuTree = async (): Promise<void> => {
    await menuApi.fetchMenuTree();
  };

  // ============================================================================
  // 트리 노드 클릭 처리
  // ============================================================================

  /**
   * @function handleNodeClick
   * @description TreeView 노드 클릭 시 메뉴 정보를 selectedMenu로 설정 (API 호출 없이 이미 로드된 데이터 사용)
   * @param {TreeNode} node - 클릭된 노드
   */
  const handleNodeClick = (node: TreeNode): void => {
    if (node.data) {
      // API 호출 없이 이미 로드된 데이터를 직접 설정
      menuApi.setSelectedMenu(node.data);
    }
  };

  // ============================================================================
  // 상위 메뉴 유효성 검증
  // ============================================================================

  /**
   * @function handleValidateUpperMenu
   * @description 상위 메뉴 코드가 유효한지 검증
   * @param {string} menuCd - 검증할 메뉴 코드
   * @returns Promise<MenuResDto | null> 유효하면 메뉴 정보, 아니면 null
   */
  const handleValidateUpperMenu = async (
    menuCd: string
  ): Promise<MenuResDto | null> => {
    if (!menuCd || menuCd.trim() === "") {
      return null;
    }

    const foundMenu = findMenuByCode(menuApi.menuTree, menuCd.trim());

    if (!foundMenu) {
      await showAlert({
        type: "warning",
        message: "메뉴 코드를 다시 입력해주세요",
      });
      return null;
    }

    return foundMenu;
  };

  // ============================================================================
  // 메뉴 추가
  // ============================================================================

  /**
   * @function handleInsertMenu
   * @description 메뉴 추가 처리
   * @param {MenuFormData} formData - 메뉴 폼 데이터
   * @returns Promise<boolean> 성공 여부
   */
  const handleInsertMenu = async (formData: MenuFormData): Promise<boolean> => {
    try {
      // 유효성 검사
      if (!formData.menuCd || formData.menuCd.trim() === "") {
        await showAlert({
          type: "warning",
          message: "메뉴 코드를 입력해주세요.",
        });
        return false;
      }

      if (!formData.menuNm || formData.menuNm.trim() === "") {
        await showAlert({
          type: "warning",
          message: "메뉴명을 입력해주세요.",
        });
        return false;
      }

      if (!formData.upperMenu || formData.upperMenu.trim() === "") {
        await showAlert({
          type: "warning",
          message: "상위 메뉴를 입력해주세요.",
        });
        return false;
      }

      if (
        formData.menuLv === undefined ||
        formData.menuLv === null ||
        formData.menuLv < 1
      ) {
        await showAlert({
          type: "warning",
          message: "메뉴 레벨을 올바르게 입력해주세요.",
        });
        return false;
      }

      if (!formData.useYn || formData.useYn.trim() === "") {
        await showAlert({
          type: "warning",
          message: "사용 여부를 선택해주세요.",
        });
        return false;
      }

      if (formData.orderNum === undefined || formData.orderNum === null) {
        await showAlert({
          type: "warning",
          message: "정렬 순서를 입력해주세요.",
        });
        return false;
      }

      // DTO 변환
      const menuReqDto = toMenuReqDto(formData);

      // API 호출
      const success = await menuApi.insertMenu(menuReqDto);

      if (success) {
        await showAlert({
          type: "success",
          message: "메뉴가 추가되었습니다.",
        });
        await menuApi.fetchMenuTree(); // 트리 새로고침
        return true;
      }

      return false;
    } catch (error) {
      await showAlert({
        type: "error",
        message: "메뉴 추가에 실패했습니다.",
      });
      return false;
    }
  };

  // ============================================================================
  // 메뉴 수정
  // ============================================================================

  /**
   * @function handleUpdateMenu
   * @description 메뉴 수정 처리
   * @param {MenuFormData} formData - 메뉴 폼 데이터
   * @returns Promise<boolean> 성공 여부
   */
  const handleUpdateMenu = async (formData: MenuFormData): Promise<boolean> => {
    try {
      // 유효성 검사
      if (!formData.menuCd || formData.menuCd.trim() === "") {
        await showAlert({
          type: "warning",
          message: "메뉴 코드가 없습니다.",
        });
        return false;
      }

      if (!formData.menuNm || formData.menuNm.trim() === "") {
        await showAlert({
          type: "warning",
          message: "메뉴명을 입력해주세요.",
        });
        return false;
      }

      if (!formData.upperMenu || formData.upperMenu.trim() === "") {
        await showAlert({
          type: "warning",
          message: "상위 메뉴를 입력해주세요.",
        });
        return false;
      }

      if (
        formData.menuLv === undefined ||
        formData.menuLv === null ||
        formData.menuLv < 1
      ) {
        await showAlert({
          type: "warning",
          message: "메뉴 레벨을 올바르게 입력해주세요.",
        });
        return false;
      }

      if (!formData.useYn || formData.useYn.trim() === "") {
        await showAlert({
          type: "warning",
          message: "사용 여부를 선택해주세요.",
        });
        return false;
      }

      if (formData.orderNum === undefined || formData.orderNum === null) {
        await showAlert({
          type: "warning",
          message: "정렬 순서를 입력해주세요.",
        });
        return false;
      }

      // DTO 변환
      const menuReqDto = toMenuReqDto(formData);

      // API 호출
      const success = await menuApi.updateMenu(menuReqDto);

      if (success) {
        await showAlert({
          type: "success",
          message: "메뉴가 수정되었습니다.",
        });
        await menuApi.fetchMenuTree(); // 트리 새로고침
        return true;
      }

      return false;
    } catch (error) {
      await showAlert({
        type: "error",
        message: "메뉴 수정에 실패했습니다.",
      });
      return false;
    }
  };

  // ============================================================================
  // 메뉴 삭제
  // ============================================================================

  /**
   * @function handleDeleteMenu
   * @description 메뉴 삭제 처리
   * @param {string} menuCd - 메뉴 코드
   * @returns Promise<boolean> 성공 여부
   */
  const handleDeleteMenu = async (menuCd: string): Promise<boolean> => {
    try {
      if (!menuCd || menuCd.trim() === "") {
        await showAlert({
          type: "warning",
          message: "삭제할 메뉴를 선택해주세요.",
        });
        return false;
      }

      // API 호출
      const success = await menuApi.deleteMenu(menuCd);

      if (success) {
        await showAlert({
          type: "success",
          message: "메뉴가 삭제되었습니다.",
        });
        await menuApi.fetchMenuTree(); // 트리 새로고침
        return true;
      }

      return false;
    } catch (error) {
      await showAlert({
        type: "error",
        message: "메뉴 삭제에 실패했습니다.",
      });
      return false;
    }
  };

  // ============================================================================
  // 폼 초기화
  // ============================================================================

  /**
   * @function handleResetForm
   * @description 메뉴 폼 초기화
   */
  const handleResetForm = (): void => {
    // selectedMenu를 null로 설정하여 폼 초기화
    menuApi.fetchMenuDetail("");
  };

  // ============================================================================
  // 데이터 새로고침
  // ============================================================================

  /**
   * @function refetch
   * @description 메뉴 트리 데이터 새로고침
   * @returns Promise<void>
   */
  const refetch = async (): Promise<void> => {
    await menuApi.fetchMenuTree();
  };

  return {
    loading: menuApi.loading,
    error: menuApi.error,
    menuTree: menuApi.menuTree,
    treeNodes,
    selectedMenu: menuApi.selectedMenu,
    upperMenuOptions,
    handleLoadMenuTree,
    handleNodeClick,
    handleValidateUpperMenu,
    handleInsertMenu,
    handleUpdateMenu,
    handleDeleteMenu,
    handleResetForm,
    refetch,
  };
};
