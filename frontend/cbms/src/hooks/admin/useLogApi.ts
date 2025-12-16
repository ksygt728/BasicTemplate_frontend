import { useState, useCallback } from "react";
import { LogApi } from "@/api/admin/logApi";
import { LogApiReqDto } from "@/types/requestDto/LogApiReqDto";
import { LogApiResDto } from "@/types/responseDto/LogApiResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * @파일명 : useLogApi.ts
 * @설명 : 로그 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
 */

/**
 * API 응답 인터페이스
 * @interface ApiResponse
 * @property {LogApiResDto[]} content - 로그 데이터 배열
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 */
interface ApiResponse {
  content: LogApiResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 로그 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 로그 관리에 필요한 상태와 함수들을 반환
 * @returns {ApiResponse | null} logData - 전체 로그 데이터
 * @returns {LogApiResDto | null} selectedLogData - 선택된 로그 상세 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchLogData - 로그 검색 함수
 * @returns {Function} fetchLogDetail - 로그 상세 조회 함수
 * @returns {Function} refetch - 데이터 새로고침 함수 (fetchLogData 별칭)
 */
export const useLogApi = () => {
  const [logData, setLogData] = useState<ApiResponse | null>(null);
  const [selectedLogData, setSelectedLogData] = useState<LogApiResDto | null>(
    null
  );

  const logApi = LogApi.getInstance();
  const { loading, error, handleApiCall } = useCommonApi();

  /**
   * @기능 로그 검색 함수
   * @REQ_ID REQ_ADM_064
   * @param {LogApiReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 로그 검색 결과
   */
  const fetchLogData = useCallback(
    async (
      searchForm: LogApiReqDto = {} as LogApiReqDto,
      pageable: Pageable = {
        page: 0,
        size: 100,
        sort: "endDate",
        direction: "DESC",
      }
    ) => {
      return handleApiCall(
        () => logApi.findAllAccessLogForAdmin(searchForm, pageable),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setLogData(dataMap.data);
            } else {
              setLogData(dataMap);
            }
          }
        }
      );
    },
    [logApi, handleApiCall]
  );

  /**
   * @기능 로그 상세 조회 함수
   * @REQ_ID REQ_ADM_064_2
   * @param {string} logId - 조회할 로그 아이디
   * @returns {Promise} 로그 상세 조회 결과
   */
  const fetchLogDetail = useCallback(
    async (logId: string) => {
      return handleApiCall(
        () => logApi.findByAccessLogForAdmin(logId),
        (response) => {
          if (response.success && response.data) {
            setSelectedLogData(response.data as any);
          }
        }
      );
    },
    [logApi, handleApiCall]
  );

  /**
   * @기능 데이터 새로고침 함수 (fetchLogData 별칭)
   * @param {LogApiReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 로그 검색 결과
   */
  const refetch = useCallback(
    (searchForm: LogApiReqDto = {} as LogApiReqDto, pageable?: Pageable) => {
      return fetchLogData(searchForm, pageable);
    },
    [fetchLogData]
  );

  return {
    // 상태
    logData,
    selectedLogData,
    loading,
    error,

    // API 함수
    fetchLogData,
    fetchLogDetail,
    refetch,
  };
};
