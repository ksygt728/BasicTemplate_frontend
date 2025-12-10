import { useState, useMemo, useCallback } from "react";
import { useUserApi } from "@/hooks/useUserApi";
import {
  toUserSearchReqDto,
  toUserReqDto,
  toUserReqDtoFromForm,
} from "@/service/mapper/UserMapper";
import {
  transformUserListData,
  transformUserDetailData,
  UserTableRow,
} from "@/service/transformer/UserTransformer";

/**
 * @파일명 : UserService.ts
 * @설명 : 사용자 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.10
 * @변경이력 :
 *       2025.12.10 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface SearchFormData
 * @description 검색 폼 데이터 타입
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
 * @interface UseUserServiceReturn
 * @description 사용자 서비스 훅의 반환 타입
 */
interface UseUserServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedUserId: string | null;
  searchFormData: SearchFormData;

  // 원본 데이터
  userData: any;
  selectedUserData: any;

  // 테이블 데이터
  userListData: UserTableRow[];
  userDetailData: Record<string, any>;

  // 상태 변경 함수
  setSelectedUserId: (userId: string | null) => void;
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleTableRowClick: (row: UserTableRow) => Promise<void>;
  refetch: () => Promise<any>;

  // 사용자 CRUD
  handleInsertUser: (rowData: Record<string, any>) => Promise<any>;
  handleUpdateUser: (formData: Record<string, any>) => Promise<any>;
  handleDeleteUser: (userId: string) => Promise<any>;
}

/**
 * @hook useUserService
 * @description 사용자 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseUserServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useUserService = (): UseUserServiceReturn => {
  const {
    userData,
    selectedUserData,
    loading,
    error,
    fetchUserData,
    fetchUserDetail,
    insertUser,
    updateUser,
    deleteUser,
    refetch: apiRefetch,
  } = useUserApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  // ============================================================================
  // 데이터 변환 (Transformer 사용)
  // ============================================================================

  const userListData = useMemo(
    () => transformUserListData(userData),
    [userData]
  );

  const userDetailData = useMemo(
    () => transformUserDetailData(selectedUserData),
    [selectedUserData]
  );

  // ============================================================================
  // 검색 처리
  // ============================================================================

  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      const searchForm = toUserSearchReqDto(searchData);
      await fetchUserData(searchForm as any);
    },
    [fetchUserData]
  );

  // ============================================================================
  // 이벤트 핸들러
  // ============================================================================

  const handleTableRowClick = useCallback(
    async (row: UserTableRow) => {
      setSelectedUserId(row.userId);
      await fetchUserDetail(row.userId);
    },
    [fetchUserDetail]
  );

  // ============================================================================
  // 데이터 새로고침
  // ============================================================================

  const refetch = useCallback(async () => {
    const searchForm = toUserSearchReqDto(searchFormData);
    return await fetchUserData(searchForm as any);
  }, [fetchUserData, searchFormData]);

  // ============================================================================
  // 사용자 CRUD
  // ============================================================================

  /**
   * @function handleInsertUser
   * @description 사용자 추가 처리
   * @param {Record<string, any>} rowData - 추가할 사용자 데이터
   * @returns {Promise<any>} API 응답 결과
   */
  const handleInsertUser = useCallback(
    async (rowData: Record<string, any>) => {
      const userDto = toUserReqDtoFromForm(rowData);
      const result = await insertUser(userDto);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [insertUser, refetch]
  );

  /**
   * @function handleUpdateUser
   * @description 사용자 수정 처리
   * @param {Record<string, any>} formData - 수정할 사용자 데이터
   * @returns {Promise<any>} API 응답 결과
   */
  const handleUpdateUser = useCallback(
    async (formData: Record<string, any>) => {
      const userDto = toUserReqDtoFromForm(formData);
      const result = await updateUser(userDto);
      if (result?.success) {
        await refetch();
        if (selectedUserId) {
          await fetchUserDetail(selectedUserId);
        }
      }
      return result;
    },
    [updateUser, refetch, selectedUserId, fetchUserDetail]
  );

  /**
   * @function handleDeleteUser
   * @description 사용자 삭제 처리
   * @param {string} userId - 삭제할 사용자 아이디
   * @returns {Promise<any>} API 응답 결과
   */
  const handleDeleteUser = useCallback(
    async (userId: string) => {
      const result = await deleteUser(userId);
      if (result?.success) {
        await refetch();
        if (selectedUserId === userId) {
          setSelectedUserId(null);
        }
      }
      return result;
    },
    [deleteUser, refetch, selectedUserId]
  );

  // ============================================================================
  // 반환값
  // ============================================================================

  return {
    // 상태
    loading,
    error,
    selectedUserId,
    searchFormData,

    // 원본 데이터
    userData,
    selectedUserData,

    // 테이블 데이터
    userListData,
    userDetailData,

    // 상태 변경
    setSelectedUserId,
    setSearchFormData,

    // 비즈니스 로직
    handleSearch,
    handleTableRowClick,
    refetch,

    // 사용자 CRUD
    handleInsertUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};
