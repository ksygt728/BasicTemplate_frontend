import { RoleResDto } from "@/types/responseDto/RoleResDto";
import { RoleMenuResDto } from "@/types/responseDto/RoleMenuResDto";
import { RoleMenuReqDto } from "@/types/requestDto/RoleMenuReqDto";
import { useRoleApi } from "@/hooks/admin/useRoleApi";
import { toRoleReqDto, toRoleMenuReqDto } from "@/service/mapper/RoleMapper";
import {
  transformRoleMenuListToTreeNodes,
  transformRoleListToTableData,
  getRoleTableColumns,
  flattenRoleMenuTree,
} from "@/service/transformer/RoleTransformer";
import { TreeNode } from "@/components/common/themed/TreeView";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : RoleService.ts
 * @설명 : 권한 관리 페이지의 비즈니스 로직을 처리하는 서비스
 * @작성자 : 김승연
 * @작성일 : 2025.12.12
 * @변경이력 :
 *       2025.12.12 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface RoleFormData
 * @description 권한 폼 데이터 타입
 */
export interface RoleFormData {
  roleCd: string;
  roleName: string;
  roleDesc?: string;
}

/**
 * @interface RoleServiceHook
 * @description 권한 서비스의 반환 타입
 */
export interface RoleServiceHook {
  // 상태
  loading: boolean;
  error: string | null;
  roleList: RoleResDto[];
  selectedRole: RoleResDto | null;
  roleMenuTree: RoleMenuResDto[];
  treeNodes: TreeNode[];
  tableData: Array<Record<string, any>>;

  // 비즈니스 로직 함수
  handleSearchRoles: (searchData: Record<string, any>) => Promise<void>;
  handleRoleSelect: (role: RoleResDto) => Promise<void>;
  handleInsertRole: (formData: RoleFormData) => Promise<boolean>;
  handleUpdateRole: (formData: RoleFormData) => Promise<boolean>;
  handleDeleteRole: (roleCd: string) => Promise<boolean>;
  handleBulkDeleteRole: (roleCds: string[]) => Promise<void>;
  handleUpdateRoleMenu: (
    roleCd: string,
    menuList: Array<{ menuCd: string; menuRw: string; useYn: string }>
  ) => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * @hook useRoleService
 * @description 권한 관리 비즈니스 로직을 처리하는 커스텀 훅
 * @returns {RoleServiceHook} 상태, 데이터, 핸들러 함수들
 */
export const useRoleService = (): RoleServiceHook => {
  const roleApi = useRoleApi();
  const { showAlert } = useAlert();

  // ============================================================================
  // TreeView 노드 변환
  // ============================================================================

  const treeNodes = transformRoleMenuListToTreeNodes(roleApi.roleMenuTree);

  // ============================================================================
  // 테이블 데이터 변환
  // ============================================================================

  const tableData = transformRoleListToTableData(roleApi.roleList);
  const tableColumns = getRoleTableColumns();

  // ============================================================================
  // 권한 리스트 로드
  // ============================================================================

  /**
   * @function handleLoadRoleList
   * @description 권한 리스트 데이터를 로드
   * @returns Promise<void>
   */
  const handleLoadRoleList = async (): Promise<void> => {
    await roleApi.fetchRoleList();
  };

  // ============================================================================
  // 권한 검색
  // ============================================================================

  /**
   * @function handleSearchRoles
   * @description 권한 검색 처리
   * @param {Record<string, any>} searchData - 검색 폼 데이터
   * @returns Promise<void>
   */
  const handleSearchRoles = async (
    searchData: Record<string, any>
  ): Promise<void> => {
    const roleReqDto = toRoleReqDto(searchData);
    await roleApi.fetchRoleList(roleReqDto);
  };

  // ============================================================================
  // 권한 선택 처리
  // ============================================================================

  /**
   * @function handleRoleSelect
   * @description 권한 선택 시 권한별 메뉴 트리를 로드
   * @param {RoleResDto} role - 선택된 권한
   */
  const handleRoleSelect = async (role: RoleResDto): Promise<void> => {
    roleApi.setSelectedRole(role);
    await roleApi.fetchRoleMenuTree(role.roleCd);
  };

  // ============================================================================
  // 권한 추가
  // ============================================================================

  /**
   * @function handleInsertRole
   * @description 권한 추가 처리
   * @param {RoleFormData} formData - 권한 폼 데이터
   * @returns Promise<boolean> 성공 여부
   */
  const handleInsertRole = async (formData: RoleFormData): Promise<boolean> => {
    try {
      // 유효성 검사
      if (!formData.roleCd || formData.roleCd.trim() === "") {
        await showAlert({
          type: "warning",
          message: "권한 코드를 입력해주세요.",
        });
        return false;
      }

      if (!formData.roleName || formData.roleName.trim() === "") {
        await showAlert({
          type: "warning",
          message: "권한명을 입력해주세요.",
        });
        return false;
      }

      // DTO 변환
      const roleReqDto = toRoleReqDto(formData);

      // API 호출
      const success = await roleApi.insertRole(roleReqDto);

      if (success) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("권한 추가 중 오류 발생:", error);
      return false;
    }
  };

  // ============================================================================
  // 권한 수정
  // ============================================================================

  /**
   * @function handleUpdateRole
   * @description 권한 수정 처리
   * @param {RoleFormData} formData - 권한 폼 데이터
   * @returns Promise<boolean> 성공 여부
   */
  const handleUpdateRole = async (formData: RoleFormData): Promise<boolean> => {
    try {
      // 유효성 검사
      if (!formData.roleCd || formData.roleCd.trim() === "") {
        await showAlert({
          type: "warning",
          message: "권한 코드를 입력해주세요.",
        });
        return false;
      }

      if (!formData.roleName || formData.roleName.trim() === "") {
        await showAlert({
          type: "warning",
          message: "권한명을 입력해주세요.",
        });
        return false;
      }

      // DTO 변환
      const roleReqDto = toRoleReqDto(formData);

      // API 호출
      const success = await roleApi.updateRole(roleReqDto);

      if (success) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("권한 수정 중 오류 발생:", error);
      return false;
    }
  };

  // ============================================================================
  // 권한 삭제
  // ============================================================================

  /**
   * @function handleDeleteRole
   * @description 권한 삭제 처리
   * @param {string} roleCd - 삭제할 권한 코드
   * @returns Promise<boolean> 성공 여부
   */
  const handleDeleteRole = async (roleCd: string): Promise<boolean> => {
    try {
      if (!roleCd || roleCd.trim() === "") {
        await showAlert({
          type: "warning",
          message: "삭제할 권한을 선택해주세요.",
        });
        return false;
      }

      // // 삭제 확인
      // const confirmResult = await showAlert({
      //   type: "warning",
      //   message: "정말 삭제하시겠습니까?",
      //   showCancel: true,
      // });

      // if (!confirmResult) {
      //   return false;
      // }

      // API 호출
      const success = await roleApi.deleteRole(roleCd);

      if (success) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("권한 삭제 중 오류 발생:", error);
      return false;
    }
  };

  // ============================================================================
  // 권한별 메뉴 수정 (단건)
  // ============================================================================

  /**
   * @function handleUpdateRoleMenuSingle
   * @description 권한별 메뉴 권한 수정 처리 (단건)
   * @param {string} roleCd - 권한 코드
   * @param {string} menuCd - 메뉴 코드
   * @param {string} menuRw - 메뉴 접근 수준 (C,R,U,D)
   * @param {string} useYn - 사용 여부 (Y, N)
   * @returns Promise<boolean> 성공 여부
   */
  const handleUpdateRoleMenuSingle = async (
    roleCd: string,
    menuCd: string,
    menuRw: string,
    useYn: string
  ): Promise<boolean> => {
    try {
      // 유효성 검사
      if (!roleCd || roleCd.trim() === "") {
        await showAlert({
          type: "warning",
          message: "권한을 선택해주세요.",
        });
        return false;
      }

      if (!menuCd || menuCd.trim() === "") {
        await showAlert({
          type: "warning",
          message: "메뉴를 선택해주세요.",
        });
        return false;
      }

      // DTO 변환
      const roleMenuReqDto = toRoleMenuReqDto(roleCd, menuCd, menuRw, useYn);

      // API 호출
      const success = await roleApi.updateRoleMenu([roleMenuReqDto]);

      if (success) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("메뉴 권한 수정 중 오류 발생:", error);
      return false;
    }
  };

  // ============================================================================
  // 폼 초기화
  // ============================================================================

  /**
   * @function handleResetForm
   * @description 폼을 초기화하고 선택된 권한을 해제
   */
  const handleResetForm = (): void => {
    roleApi.setSelectedRole(null);
  };

  // ============================================================================
  // 일괄 삭제
  // ============================================================================

  /**
   * @function handleBulkDeleteRole
   * @description 권한 일괄 삭제 처리
   * @param {string[]} roleCds - 삭제할 권한 코드 배열
   * @returns Promise<void>
   */
  const handleBulkDeleteRole = async (roleCds: string[]): Promise<void> => {
    for (const roleCd of roleCds) {
      await handleDeleteRole(roleCd);
    }
  };

  // ============================================================================
  // 메뉴 권한 업데이트
  // ============================================================================

  /**
   * @function handleUpdateRoleMenu
   * @description 권한별 메뉴 권한 일괄 업데이트
   * @param {string} roleCd - 권한 코드
   * @param {Array} menuList - 메뉴 권한 목록
   * @returns Promise<boolean>
   */
  const handleUpdateRoleMenu = async (
    roleCd: string,
    menuList: Array<{ menuCd: string; menuRw: string; useYn: string }>
  ): Promise<boolean> => {
    try {
      // DTO 변환 - 각 메뉴마다 변환
      const roleMenuReqDtos = menuList.map((menu) =>
        toRoleMenuReqDto(roleCd, menu.menuCd, menu.menuRw, menu.useYn)
      );

      // API 호출
      const success = await roleApi.updateRoleMenu(roleMenuReqDtos);

      if (success) {
        // 메뉴 트리 다시 조회
        if (roleApi.selectedRole) {
          await roleApi.fetchRoleMenuTree(roleCd);
        }
        return true;
      } else {
        await showAlert({
          type: "error",
          message: "메뉴 권한 수정에 실패했습니다.",
        });
        return false;
      }
    } catch (error) {
      console.error("메뉴 권한 수정 실패:", error);
      await showAlert({
        type: "error",
        message: "메뉴 권한 수정에 실패했습니다.",
      });
      return false;
    }
  };

  // ============================================================================
  // 데이터 새로고침
  // ============================================================================

  /**
   * @function refetch
   * @description 권한 리스트 및 선택된 권한의 메뉴 트리를 새로고침
   * @returns Promise<void>
   */
  const refetch = async (): Promise<void> => {
    await roleApi.refetch();
  };

  return {
    loading: roleApi.loading,
    error: roleApi.error,
    roleList: roleApi.roleList,
    selectedRole: roleApi.selectedRole,
    roleMenuTree: roleApi.roleMenuTree,
    treeNodes,
    tableData,
    handleSearchRoles,
    handleRoleSelect,
    handleInsertRole,
    handleUpdateRole,
    handleDeleteRole,
    handleBulkDeleteRole,
    handleUpdateRoleMenu,
    refetch,
  };
};
