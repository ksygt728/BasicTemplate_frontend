import { useState, useCallback } from "react";
import { UserApi } from "@/api/admin/userApi";
import { UserReqDto } from "@/types/requestDto/UserReqDto";
import { UserResDto } from "@/types/responseDto/UserResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApi";

/**
 * @파일명 : useUserApi.ts
 * @설명 : 사용자 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.10
 * @변경이력 :
 *       2025.12.10 김승연 최초 생성
 */

/**
 * API 응답 인터페이스
 * @interface ApiResponse
 * @property {UserResDto[]} content - 사용자 데이터 배열
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 */
interface ApiResponse {
  content: UserResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 사용자 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 사용자 관리에 필요한 상태와 함수들을 반환
 * @returns {ApiResponse | null} userData - 전체 사용자 데이터
 * @returns {UserResDto | null} selectedUserData - 선택된 사용자 상세 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchUserData - 사용자 검색 함수
 * @returns {Function} fetchUserDetail - 사용자 상세 조회 함수
 * @returns {Function} insertUser - 사용자 추가 함수
 * @returns {Function} updateUser - 사용자 수정 함수
 * @returns {Function} deleteUser - 사용자 삭제 함수
 * @returns {Function} refetch - 데이터 새로고침 함수 (fetchUserData 별칭)
 */
export const useUserApi = () => {
  const [userData, setUserData] = useState<ApiResponse | null>(null);
  const [selectedUserData, setSelectedUserData] = useState<UserResDto | null>(
    null
  );

  const userApi = UserApi.getInstance();
  const { loading, error, handleApiCall } = useCommonApi();

  /**
   * @기능 사용자 검색 함수
   * @REQ_ID REQ_ADM_001
   * @param {UserReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 사용자 검색 결과
   */
  const fetchUserData = useCallback(
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
              setUserData(dataMap.data);
            } else {
              setUserData(dataMap);
            }
          }
        }
      );
    },
    [userApi, handleApiCall]
  );

  /**
   * @기능 사용자 상세 조회 함수
   * @REQ_ID REQ_ADM_002
   * @param {string} userId - 조회할 사용자 아이디
   * @returns {Promise} 사용자 상세 조회 결과
   */
  const fetchUserDetail = useCallback(
    async (userId: string) => {
      return handleApiCall(
        () => userApi.findByUserForAdmin(userId),
        (response) => {
          if (response.success && response.data) {
            setSelectedUserData(response.data as any);
          }
        }
      );
    },
    [userApi, handleApiCall]
  );

  /**
   * @기능 사용자 추가 함수
   * @REQ_ID REQ_ADM_003 (미구현 - API 확인 필요)
   * @param {UserReqDto} user - 추가할 사용자 정보 DTO
   * @returns {Promise} 사용자 추가 결과
   */
  const insertUser = useCallback(
    async (user: UserReqDto) => {
      return handleApiCall(() => userApi.updateUserForAdmin(user));
    },
    [userApi, handleApiCall]
  );

  /**
   * @기능 사용자 수정 함수
   * @REQ_ID REQ_ADM_003
   * @param {UserReqDto} user - 수정할 사용자 정보 DTO
   * @returns {Promise} 사용자 수정 결과
   */
  const updateUser = useCallback(
    async (user: UserReqDto) => {
      return handleApiCall(() => userApi.updateUserForAdmin(user));
    },
    [userApi, handleApiCall]
  );

  /**
   * @기능 사용자 삭제 함수
   * @REQ_ID REQ_ADM_004
   * @param {string} userId - 삭제할 사용자 아이디
   * @returns {Promise} 사용자 삭제 결과
   */
  const deleteUser = useCallback(
    async (userId: string) => {
      return handleApiCall(() => userApi.deleteUserForAdmin(userId));
    },
    [userApi, handleApiCall]
  );

  /**
   * @기능 데이터 새로고침 함수 (fetchUserData 별칭)
   * @param {UserReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 사용자 검색 결과
   */
  const refetch = useCallback(
    (searchForm: UserReqDto = {} as UserReqDto, pageable?: Pageable) => {
      return fetchUserData(searchForm, pageable);
    },
    [fetchUserData]
  );

  return {
    // 상태
    userData,
    selectedUserData,
    loading,
    error,

    // API 함수
    fetchUserData,
    fetchUserDetail,
    insertUser,
    updateUser,
    deleteUser,
    refetch,
  };
};
