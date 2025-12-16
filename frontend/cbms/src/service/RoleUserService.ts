import { useState, useMemo, useCallback } from "react";
import { useRoleUserApi } from "@/hooks/admin/useRoleUserApi";
import {
  toUserSearchReqDto,
  toRoleUserReqDtoList,
} from "@/service/mapper/RoleUserMapper";
import {
  transformUserListToTableData,
  transformUserRoleListToTableData,
  transformAvailableRoleListToTableData,
  UserTableRow,
  UserRoleTableRow,
  AvailableRoleTableRow,
} from "@/service/transformer/RoleUserTransformer";
import { UserResDto } from "@/types/responseDto/UserResDto";

/**
 * @파일명 : RoleUserService.ts
 * @설명 : 사용자별 권한 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface SearchFormData
 * @description 사용자 검색 폼 데이터 타입
 */
export interface SearchFormData {
  userId?: string;
  name?: string;
  email?: string;
  phoneNum?: string;
  userType?: string;
  gender?: string;
  deptCode?: string;
  [key: string]: any;
}

/**
 * @interface UseRoleUserServiceReturn
 * @description 사용자별 권한 서비스 훅의 반환 타입
 */
interface UseRoleUserServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedUser: UserResDto | null;
  searchFormData: SearchFormData;

  // 원본 데이터
  userList: any;
  userRoleList: any;
  availableRoleList: any;

  // 테이블 데이터
  userTableData: UserTableRow[];
  userRoleTableData: UserRoleTableRow[];
  availableRoleTableData: AvailableRoleTableRow[];

  // 상태 변경 함수
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearchUsers: (searchData: SearchFormData) => Promise<void>;
  handleUserSelect: (user: UserResDto) => Promise<void>;
  handleGrantRole: (roleCd: string) => Promise<void>;
  handleRevokeRole: (roleCd: string) => Promise<void>;
  handleToggleRoleUseYn: (roleCd: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * @hook useRoleUserService
 * @description 사용자별 권한 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseRoleUserServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useRoleUserService = (): UseRoleUserServiceReturn => {
  const {
    userList,
    selectedUser,
    userRoleList,
    availableRoleList,
    loading,
    error,
    fetchUserList,
    fetchUserRoleList,
    fetchAvailableRoles,
    grantUserRole,
    revokeUserRole,
    setSelectedUser,
    refetch: apiRefetch,
  } = useRoleUserApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  // ============================================================================
  // 테이블 데이터 변환 (Memoized)
  // ============================================================================

  const userTableData = useMemo(
    () => transformUserListToTableData(userList),
    [userList]
  );

  const userRoleTableData = useMemo(
    () => transformUserRoleListToTableData(userRoleList),
    [userRoleList]
  );

  const availableRoleTableData = useMemo(
    () =>
      transformAvailableRoleListToTableData(availableRoleList, userRoleList),
    [availableRoleList, userRoleList]
  );

  // ============================================================================
  // 비즈니스 로직 함수
  // ============================================================================

  /**
   * @function handleSearchUsers
   * @description 사용자 검색 처리
   * @param {SearchFormData} searchData - 검색 폼 데이터
   * @returns {Promise<void>}
   */
  const handleSearchUsers = useCallback(
    async (searchData: SearchFormData): Promise<void> => {
      setSearchFormData(searchData);
      const searchDto = toUserSearchReqDto(searchData);
      await fetchUserList(searchDto as any);
    },
    [fetchUserList]
  );

  /**
   * @function handleUserSelect
   * @description 사용자 선택 처리
   * @param {UserResDto} user - 선택된 사용자
   * @returns {Promise<void>}
   */
  const handleUserSelect = useCallback(
    async (user: UserResDto): Promise<void> => {
      // 사용자 선택을 먼저 설정 (UI 반응성)
      setSelectedUser(user);

      // 데이터는 백그라운드에서 로딩 (Promise.all로 병렬 처리)
      await Promise.all([
        fetchUserRoleList(user.userId),
        fetchAvailableRoles(),
      ]);
    },
    [setSelectedUser, fetchUserRoleList, fetchAvailableRoles]
  );

  /**
   * @function handleGrantRole
   * @description 권한 부여 처리
   * @param {string} roleCd - 부여할 권한 코드
   * @returns {Promise<void>}
   */
  const handleGrantRole = useCallback(
    async (roleCd: string): Promise<void> => {
      if (!selectedUser) return;

      const roleUserDto = toRoleUserReqDtoList(selectedUser.userId, [
        { roleCd, useYn: "Y" },
      ]);

      await grantUserRole(roleUserDto);
      await fetchUserRoleList(selectedUser.userId);
      await fetchAvailableRoles();
    },
    [selectedUser, grantUserRole, fetchUserRoleList, fetchAvailableRoles]
  );

  /**
   * @function handleRevokeRole
   * @description 권한 회수 처리
   * @param {string} roleCd - 회수할 권한 코드
   * @returns {Promise<void>}
   */
  const handleRevokeRole = useCallback(
    async (roleCd: string): Promise<void> => {
      if (!selectedUser) return;

      const roleUserDto = toRoleUserReqDtoList(selectedUser.userId, [
        { roleCd, useYn: "N" },
      ]);

      await revokeUserRole(roleUserDto);
      await fetchUserRoleList(selectedUser.userId);
      await fetchAvailableRoles();
    },
    [selectedUser, revokeUserRole, fetchUserRoleList, fetchAvailableRoles]
  );

  /**
   * @function handleToggleRoleUseYn
   * @description 권한 사용여부 토글 처리
   * @param {string} roleCd - 토글할 권한 코드
   * @returns {Promise<void>}
   */
  const handleToggleRoleUseYn = useCallback(
    async (roleCd: string): Promise<void> => {
      if (!selectedUser) return;

      const currentRole = userRoleList.find(
        (ur: any) => ur.role.roleCd === roleCd
      );
      if (!currentRole) return;

      const newUseYn = currentRole.useYn === "Y" ? "N" : "Y";
      const roleUserDto = toRoleUserReqDtoList(selectedUser.userId, [
        { roleCd, useYn: newUseYn },
      ]);

      if (newUseYn === "Y") {
        await grantUserRole(roleUserDto);
      } else {
        await revokeUserRole(roleUserDto);
      }
      await fetchUserRoleList(selectedUser.userId);
    },
    [
      selectedUser,
      userRoleList,
      grantUserRole,
      revokeUserRole,
      fetchUserRoleList,
    ]
  );

  /**
   * @function refetch
   * @description 데이터 새로고침
   * @returns {Promise<void>}
   */
  const refetch = useCallback(async (): Promise<void> => {
    await apiRefetch();
  }, [apiRefetch]);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // 상태
    loading,
    error,
    selectedUser,
    searchFormData,

    // 원본 데이터
    userList,
    userRoleList,
    availableRoleList,

    // 테이블 데이터
    userTableData,
    userRoleTableData,
    availableRoleTableData,

    // 상태 변경 함수
    setSearchFormData,

    // 비즈니스 로직 함수
    handleSearchUsers,
    handleUserSelect,
    handleGrantRole,
    handleRevokeRole,
    handleToggleRoleUseYn,
    refetch,
  };
};
