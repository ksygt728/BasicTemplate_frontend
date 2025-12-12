import { useState, useCallback } from "react";
import { DepartmentApi } from "@/api/admin/departmentApi";
import { DepartmentReqDto } from "@/types/requestDto/DepartmentReqDto";
import { DepartmentResDto } from "@/types/responseDto/DepartmentResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * @파일명 : useDepartmentApi.ts
 * @설명 : 부서 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

/**
 * API 응답 인터페이스
 * @interface ApiResponse
 * @property {DepartmentResDto[]} content - 부서 데이터 배열
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 */
interface ApiResponse {
  content: DepartmentResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 부서 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 부서 관리에 필요한 상태와 함수들을 반환
 * @returns {ApiResponse | null} departmentData - 전체 부서 데이터
 * @returns {DepartmentResDto | null} selectedDepartmentData - 선택된 부서 상세 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchDepartmentData - 부서 검색 함수
 * @returns {Function} fetchDepartmentDetail - 부서 상세 조회 함수
 * @returns {Function} insertDepartment - 부서 추가 함수
 * @returns {Function} updateDepartment - 부서 수정 함수
 * @returns {Function} deleteDepartment - 부서 삭제 함수
 * @returns {Function} refetch - 데이터 새로고침 함수 (fetchDepartmentData 별칭)
 */
export const useDepartmentApi = () => {
  const [departmentData, setDepartmentData] = useState<ApiResponse | null>(
    null
  );
  const [selectedDepartmentData, setSelectedDepartmentData] =
    useState<DepartmentResDto | null>(null);

  const departmentApi = DepartmentApi.getInstance();
  const { loading, error, handleApiCall } = useCommonApi();

  /**
   * @기능 부서 검색 함수
   * @REQ_ID REQ_ADM_005
   * @param {DepartmentReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 부서 검색 결과
   */
  const fetchDepartmentData = useCallback(
    async (
      searchForm: DepartmentReqDto = {} as DepartmentReqDto,
      pageable: Pageable = {
        page: 0,
        size: 2000,
        sort: "deptCode",
        direction: "ASC",
      }
    ) => {
      return handleApiCall(
        () => departmentApi.findAllDepartmentForAdmin(searchForm, pageable),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setDepartmentData(dataMap.data);
            } else {
              setDepartmentData(dataMap);
            }
          }
        }
      );
    },
    [departmentApi, handleApiCall]
  );

  /**
   * @기능 부서 상세 조회 함수
   * @REQ_ID REQ_ADM_005_2
   * @param {string} deptCode - 조회할 부서 코드
   * @returns {Promise} 부서 상세 조회 결과
   */
  const fetchDepartmentDetail = useCallback(
    async (deptCode: string) => {
      return handleApiCall(
        () => departmentApi.findByDepartmentForAdmin(deptCode),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setSelectedDepartmentData(dataMap.data);
            } else {
              setSelectedDepartmentData(dataMap);
            }
          }
        }
      );
    },
    [departmentApi, handleApiCall]
  );

  /**
   * @기능 부서 추가 함수
   * @REQ_ID REQ_ADM_006
   * @param {DepartmentReqDto} department - 추가할 부서 정보
   * @returns {Promise} 부서 추가 결과
   */
  const insertDepartment = useCallback(
    async (department: DepartmentReqDto) => {
      return handleApiCall(() =>
        departmentApi.insertDepartmentForAdmin(department)
      );
    },
    [departmentApi, handleApiCall]
  );

  /**
   * @기능 부서 수정 함수
   * @REQ_ID REQ_ADM_007
   * @param {DepartmentReqDto} department - 수정할 부서 정보
   * @returns {Promise} 부서 수정 결과
   */
  const updateDepartment = useCallback(
    async (department: DepartmentReqDto) => {
      return handleApiCall(() =>
        departmentApi.updateDepartmentForAdmin(department)
      );
    },
    [departmentApi, handleApiCall]
  );

  /**
   * @기능 부서 삭제 함수
   * @REQ_ID REQ_ADM_008
   * @param {string} deptCode - 삭제할 부서 코드
   * @returns {Promise} 부서 삭제 결과
   */
  const deleteDepartment = useCallback(
    async (deptCode: string) => {
      return handleApiCall(() =>
        departmentApi.deleteDepartmentForAdmin(deptCode)
      );
    },
    [departmentApi, handleApiCall]
  );

  /**
   * @기능 데이터 새로고침
   * @description 부서 목록을 다시 가져옴 (fetchDepartmentData 별칭)
   * @returns {Promise} 부서 검색 결과
   */
  const refetch = useCallback(
    async () => fetchDepartmentData(),
    [fetchDepartmentData]
  );

  return {
    departmentData,
    selectedDepartmentData,
    loading,
    error,
    fetchDepartmentData,
    fetchDepartmentDetail,
    insertDepartment,
    updateDepartment,
    deleteDepartment,
    refetch,
  };
};
