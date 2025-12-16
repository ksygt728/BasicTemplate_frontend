import { useState, useCallback } from "react";
import { LogApi } from "@/api/admin/logApi";
import { LogErrorReqDto } from "@/types/requestDto/LogErrorReqDto";
import { LogErrorResDto } from "@/types/responseDto/LogErrorResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * @파일명 : useLogErrorApi.ts
 * @설명 : 에러 로그 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
 */

/**
 * API 응답 인터페이스
 * @interface ApiResponse
 * @property {LogErrorResDto[]} content - 에러 로그 데이터 배열
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 */
interface ApiResponse {
  content: LogErrorResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 에러 로그 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 에러 로그 관리에 필요한 상태와 함수들을 반환
 * @returns {ApiResponse | null} errorLogData - 전체 에러 로그 데이터
 * @returns {LogErrorResDto | null} selectedErrorLogData - 선택된 에러 로그 상세 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchErrorLogData - 에러 로그 검색 함수
 * @returns {Function} fetchErrorLogDetail - 에러 로그 상세 조회 함수
 * @returns {Function} refetch - 데이터 새로고침 함수 (fetchErrorLogData 별칭)
 */
export const useLogErrorApi = () => {
  const [errorLogData, setErrorLogData] = useState<ApiResponse | null>(null);
  const [selectedErrorLogData, setSelectedErrorLogData] =
    useState<LogErrorResDto | null>(null);

  const logApi = LogApi.getInstance();
  const { loading, error, handleApiCall } = useCommonApi();

  /**
   * @기능 에러 로그 검색 함수
   * @REQ_ID REQ_ADM_065
   * @param {LogErrorReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 에러 로그 검색 결과
   */
  const fetchErrorLogData = useCallback(
    async (
      searchForm: LogErrorReqDto = {} as LogErrorReqDto,
      pageable: Pageable = {
        page: 0,
        size: 100,
        sort: "createDate",
        direction: "DESC",
      }
    ) => {
      return handleApiCall(
        () => logApi.findAllErrorLogForAdmin(searchForm, pageable),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setErrorLogData(dataMap.data);
            } else {
              setErrorLogData(dataMap);
            }
          }
        }
      );
    },
    [logApi, handleApiCall]
  );

  /**
   * @기능 에러 로그 상세 조회 함수
   * @REQ_ID REQ_ADM_066
   * @param {string} errId - 조회할 에러 아이디
   * @returns {Promise} 에러 로그 상세 조회 결과
   */
  const fetchErrorLogDetail = useCallback(
    async (errId: string) => {
      return handleApiCall(
        () => logApi.findByErrorLogForAdmin(errId),
        (response) => {
          if (response.success && response.data) {
            setSelectedErrorLogData(response.data as any);
          }
        }
      );
    },
    [logApi, handleApiCall]
  );

  /**
   * @기능 데이터 새로고침 함수 (fetchErrorLogData 별칭)
   * @param {LogErrorReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 에러 로그 검색 결과
   */
  const refetch = useCallback(
    (
      searchForm: LogErrorReqDto = {} as LogErrorReqDto,
      pageable?: Pageable
    ) => {
      return fetchErrorLogData(searchForm, pageable);
    },
    [fetchErrorLogData]
  );

  return {
    // 상태
    errorLogData,
    selectedErrorLogData,
    loading,
    error,

    // API 함수
    fetchErrorLogData,
    fetchErrorLogDetail,
    refetch,
  };
};
