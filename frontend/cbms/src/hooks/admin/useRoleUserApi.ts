/**
 * @파일명 : useRoleUserApi.ts
 * @설명 : 사용자별 권한 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

import { useState, useCallback } from "react";
import { RoleApi } from "@/api/admin/roleApi";
import { UserApi } from "@/api/admin/userApi";
import { RoleUserReqDto } from "@/types/requestDto/RoleUserReqDto";
import { RoleUserResDto } from "@/types/responseDto/RoleUserResDto";
import { UserResDto } from "@/types/responseDto/UserResDto";
import { RoleResDto } from "@/types/responseDto/RoleResDto";
import { UserReqDto } from "@/types/requestDto/UserReqDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * API 응답 인터페이스
 * @interface UserListApiResponse
 * @property {UserResDto[]} content - 사용자 데이터 배열
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 */
interface UserListApiResponse {
  content: UserResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 사용자별 권한 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 사용자별 권한 관리에 필요한 상태와 함수들을 반환
 * @returns {UserListApiResponse | null} userList - 사용자 리스트 데이터
 * @returns {UserResDto | null} selectedUser - 선택된 사용자 정보
 * @returns {RoleUserResDto[]} userRoleList - 선택된 사용자의 권한 리스트
 * @returns {RoleResDto[]} availableRoleList - 부여 가능한 전체 권한 리스트
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchUserList - 사용자 리스트 조회 함수
 * @returns {Function} fetchUserRoleList - 사용자별 권한 리스트 조회 함수
 * @returns {Function} fetchAvailableRoles - 전체 권한 리스트 조회 함수
 * @returns {Function} updateUserRoles - 사용자 권한 수정 함수
 * @returns {Function} setSelectedUser - 선택된 사용자 설정 함수
 * @returns {Function} refetch - 데이터 새로고침 함수
 */
export const useRoleUserApi = () => {
  const [userList, setUserList] = useState<UserListApiResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserResDto | null>(null);
  const [userRoleList, setUserRoleList] = useState<RoleUserResDto[]>([]);
  const [availableRoleList, setAvailableRoleList] = useState<RoleResDto[]>([]);

  const userApi = UserApi.getInstance();
  const roleApi = RoleApi.getInstance();
  const { loading, error, handleApiCall } = useCommonApi();

  /**
   * @기능 사용자 리스트 조회 함수
   * @REQ_ID REQ_ADM_001
   * @param {UserReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 사용자 리스트 조회 결과
   */
  const fetchUserList = useCallback(
    async (
      searchForm: UserReqDto = {} as UserReqDto,
      pageable: Pageable = {
        page: 0,
        size: 2000,
        sort: "userId",
        direction: "ASC",
      }
    ) => {
      return handleApiCall(
        () => userApi.findAllUserForAdmin(searchForm, pageable),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setUserList(dataMap.data);
            } else {
              setUserList(dataMap);
            }
          }
        }
      );
    },
    [userApi, handleApiCall]
  );

  /**
   * @기능 사용자별 권한 리스트 조회 함수
   * @REQ_ID REQ_ADM_048 (사용자 ID로 해당 사용자의 권한 조회)
   * @param {string} userId - 조회할 사용자 아이디
   * @returns {Promise} 사용자별 권한 리스트 조회 결과
   */
  const fetchUserRoleList = useCallback(
    async (userId: string) => {
      await handleApiCall(
        () => roleApi.findByRoleUserForAdmin(userId),
        (response) => {
          const responseData = response as any;

          // API 응답 구조에 따라 데이터 추출
          let roleUsers: RoleUserResDto[] = [];

          if (
            responseData.data?.data?.content &&
            Array.isArray(responseData.data.data.content)
          ) {
            roleUsers = responseData.data.data.content;
          } else if (
            responseData.data?.data &&
            Array.isArray(responseData.data.data)
          ) {
            roleUsers = responseData.data.data;
          } else if (
            responseData.data?.content &&
            Array.isArray(responseData.data.content)
          ) {
            roleUsers = responseData.data.content;
          } else if (Array.isArray(responseData.data)) {
            roleUsers = responseData.data;
          }

          setUserRoleList(roleUsers);
        }
      );
    },
    [roleApi, handleApiCall]
  );

  /**
   * @기능 전체 권한 리스트 조회 함수
   * @REQ_ID REQ_ADM_042
   * @returns {Promise} 전체 권한 리스트 조회 결과
   */
  const fetchAvailableRoles = useCallback(async () => {
    return handleApiCall(
      () =>
        roleApi.findAllRoleForAdmin(
          { roleCd: "", roleName: "" },
          { page: 0, size: 2000, sort: "roleCd" }
        ),
      (response) => {
        const responseData = response as any;
        if (
          responseData.data?.data?.content &&
          Array.isArray(responseData.data.data.content)
        ) {
          setAvailableRoleList(responseData.data.data.content);
        } else if (
          responseData.data?.data &&
          Array.isArray(responseData.data.data)
        ) {
          setAvailableRoleList(responseData.data.data);
        } else {
          setAvailableRoleList([]);
        }
      }
    );
  }, [roleApi, handleApiCall]);

  /**
   * @기능 사용자 권한 부여 함수
   * @REQ_ID REQ_ADM_049
   * @param {RoleUserReqDto[]} roleUsers - 권한별 사용자 리스트 DTO
   * @returns {Promise} 사용자 권한 부여 결과
   */
  const grantUserRole = useCallback(
    async (roleUsers: RoleUserReqDto[]) => {
      return handleApiCall(
        () => roleApi.grantRoleToUser(roleUsers),
        (response) => {
          // 성공 시 처리 (공통 API에서 처리됨)
        }
      );
    },
    [roleApi, handleApiCall]
  );

  /**
   * @기능 사용자 권한 회수 함수
   * @REQ_ID REQ_ADM_050
   * @param {RoleUserReqDto[]} roleUsers - 권한별 사용자 리스트 DTO
   * @returns {Promise} 사용자 권한 회수 결과
   */
  const revokeUserRole = useCallback(
    async (roleUsers: RoleUserReqDto[]) => {
      return handleApiCall(
        () => roleApi.revokeRoleFromUser(roleUsers),
        (response) => {
          // 성공 시 처리 (공통 API에서 처리됨)
        }
      );
    },
    [roleApi, handleApiCall]
  );

  /**
   * @기능 데이터 새로고침 함수
   * @returns {Promise} 데이터 새로고침 결과
   */
  const refetch = useCallback(async () => {
    await fetchUserList();
    await fetchAvailableRoles();
    if (selectedUser) {
      await fetchUserRoleList(selectedUser.userId);
    }
  }, [fetchUserList, fetchAvailableRoles, fetchUserRoleList, selectedUser]);

  return {
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
    refetch,
  };
};
