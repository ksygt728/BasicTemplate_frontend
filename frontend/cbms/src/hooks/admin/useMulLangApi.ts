import { useState, useCallback } from "react";
import { LangApi } from "@/api/admin/langApi";
import { MulLangReqDto } from "@/types/requestDto/MulLangReqDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * @파일명 : useMulLangApi.ts
 * @설명 : 다국어 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

/**
 * 다국어 정보 인터페이스
 * @interface MulLangData
 * @property {string} langCd - 언어 코드
 * @property {string} langType - 언어 유형
 * @property {string} langNm - 언어명
 * @property {string} langGubun - 언어 구분
 * @property {string} useYn - 사용 여부
 */
interface MulLangData {
  langCd: string;
  langType: string;
  langNm: string;
  langGubun: string;
  useYn: string;
}

/**
 * API 응답 인터페이스
 * @interface ApiResponse
 * @property {MulLangData[]} content - 다국어 데이터 배열
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 */
interface ApiResponse {
  content: MulLangData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 다국어 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 다국어 관리에 필요한 상태와 함수들을 반환
 * @returns {ApiResponse | null} mulLangData - 전체 다국어 데이터
 * @returns {any} mulLangDetail - 선택된 다국어 상세 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchMulLangData - 다국어 리스트 조회 함수
 * @returns {Function} fetchMulLangDetail - 다국어 상세 조회 함수
 * @returns {Function} insertMulLang - 다국어 추가 함수
 * @returns {Function} updateMulLang - 다국어 수정 함수
 * @returns {Function} deleteMulLang - 다국어 삭제 함수
 * @returns {Function} fetchAllMessagesByLang - 언어별 전체 메시지 조회 함수
 * @returns {Function} refetch - 데이터 새로고침 함수 (fetchMulLangData 별칭)
 */
export const useMulLangApi = () => {
  const [mulLangData, setMulLangData] = useState<ApiResponse | null>(null);
  const [mulLangDetail, setMulLangDetail] = useState<any>(null);

  const langApi = LangApi.getInstance();
  const { loading, error, handleApiCall } = useCommonApi();

  /**
   * @기능 다국어 리스트 조회 함수
   * @REQ_ID REQ_ADM_033
   * @param {MulLangReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지네이션 정보
   * @returns {Promise} 다국어 리스트 조회 결과
   */
  const fetchMulLangData = useCallback(
    async (
      searchForm: Partial<MulLangReqDto> = {},
      pageable: Pageable = {
        page: 0,
        size: 2000,
        sort: "langCd",
        direction: "ASC",
      }
    ) => {
      return handleApiCall(
        () =>
          langApi.findAllMulLangForAdmin(searchForm as MulLangReqDto, pageable),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setMulLangData(dataMap.data);
            } else {
              setMulLangData(dataMap);
            }
          }
        }
      );
    },
    [langApi, handleApiCall]
  );

  /**
   * @기능 다국어 상세 조회 함수
   * @REQ_ID REQ_ADM_034
   * @param {string} langGubun - 언어 구분
   * @param {string} langCd - 언어 코드
   * @returns {Promise} 다국어 상세 조회 결과
   */
  const fetchMulLangDetail = useCallback(
    async (langGubun: string, langCd: string) => {
      return handleApiCall(
        () => langApi.findByMulLangForAdmin(langGubun, langCd),
        (response) => {
          if (response.success && response.data) {
            setMulLangDetail(response.data);
          }
        }
      );
    },
    [langApi, handleApiCall]
  );

  /**
   * @기능 다국어 추가 함수
   * @REQ_ID REQ_ADM_035
   * @param {MulLangReqDto} mulLang - 추가할 다국어 정보 DTO
   * @returns {Promise} 다국어 추가 결과
   */
  const insertMulLang = useCallback(
    async (mulLang: MulLangReqDto) => {
      return handleApiCall(() => langApi.insertMulLangForAdmin(mulLang));
    },
    [langApi, handleApiCall]
  );

  /**
   * @기능 다국어 수정 함수
   * @REQ_ID REQ_ADM_036
   * @param {MulLangReqDto} mulLang - 수정할 다국어 정보 DTO
   * @returns {Promise} 다국어 수정 결과
   */
  const updateMulLang = useCallback(
    async (mulLang: MulLangReqDto) => {
      return handleApiCall(() => langApi.updateMulLangForAdmin(mulLang));
    },
    [langApi, handleApiCall]
  );

  /**
   * @기능 다국어 삭제 함수
   * @REQ_ID REQ_ADM_037
   * @param {string} langGubun - 언어 구분
   * @param {string} langCd - 언어 코드
   * @returns {Promise} 다국어 삭제 결과
   */
  const deleteMulLang = useCallback(
    async (langGubun: string, langCd: string) => {
      return handleApiCall(() =>
        langApi.deleteMulLangForAdmin(langGubun, langCd)
      );
    },
    [langApi, handleApiCall]
  );

  /**
   * @기능 언어별 전체 메시지 조회 함수
   * @param {string} langGubun - 언어 구분
   * @returns {Promise} 언어별 전체 메시지 조회 결과
   */
  const fetchAllMessagesByLang = useCallback(
    async (langGubun: string) => {
      return handleApiCall(() => langApi.findAllMessagesByLang(langGubun));
    },
    [langApi, handleApiCall]
  );

  return {
    // 상태 데이터
    mulLangData,
    mulLangDetail,
    loading,
    error,

    // CRUD 함수
    fetchMulLangData,
    fetchMulLangDetail,
    insertMulLang,
    updateMulLang,
    deleteMulLang,
    fetchAllMessagesByLang,

    // 별칭 (기존 호환성 유지)
    refetch: fetchMulLangData,
  };
};
