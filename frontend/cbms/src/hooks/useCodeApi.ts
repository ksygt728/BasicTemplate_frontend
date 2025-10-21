"use client";

import { useState, useEffect, useCallback } from "react";
import { CodeApi } from "@/api/admin/codeApi";
import { CodeSearchFormReqDto } from "@/types/requestDto/specialDto/CodeSearchFormReqDto";
import { ComCodeMReqDto } from "@/types/requestDto/ComCodeMReqDto";
import { ComCodeDReqDto } from "@/types/requestDto/ComCodeDReqDto";
import { ComCodeTReqDto } from "@/types/requestDto/ComCodeTReqDto";
import { CodeSearchFormResDto } from "@/types/responseDto/specialDto/CodeSearchFormResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { ResponseApi } from "@/types/commonDto/ResponseApi";

/**
 * @파일명 : useCodeApi.ts
 * @설명 : 코드 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.10.13
 * @변경이력 :
 *       2025.10.13 김승연 최초 생성
 *       2025.10.17 김승연 전체 API 메서드 hook 추가 및 JavaDoc 스타일 주석 적용
 */

/**
 * 공통 코드 상세 정보 인터페이스
 * @interface ComCodeInfo
 * @property {string | null} dtlCd - 상세 코드
 * @property {Array} codeAttributes - 코드 속성 배열
 * @property {string | null} useYn - 사용 여부
 * @property {number} dtlOrderNum - 상세 순서 번호
 */
interface ComCodeInfo {
  dtlCd: string | null;
  codeAttributes: Array<{
    attrCd: string | null;
    attrNm: string | null;
    dtlNm: string | null;
    attrOrderNum: number;
  }>;
  useYn: string | null;
  dtlOrderNum: number;
}

/**
 * 코드 데이터 인터페이스
 * @interface CodeData
 * @property {string} grpCdType - 그룹 코드 타입
 * @property {string} grpCd - 그룹 코드
 * @property {string} grpNm - 그룹 코드명
 * @property {ComCodeInfo[]} comCodeInfo - 공통 코드 정보 배열
 */
interface CodeData {
  grpCdType: string;
  grpCd: string;
  grpNm: string;
  comCodeInfo: ComCodeInfo[];
}

/**
 * API 응답 인터페이스
 * @interface ApiResponse
 * @property {CodeData[]} content - 코드 데이터 배열
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 */
interface ApiResponse {
  content: CodeData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 코드 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 코드 관리에 필요한 상태와 함수들을 반환
 * @returns {ApiResponse | null} codeData - 전체 코드 데이터
 * @returns {any} groupCodeData - 선택된 그룹 코드 상세 데이터
 * @returns {CodeSearchFormResDto[]} detailCodeData - 상세 코드 리스트 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchCodeData - 공통코드 검색 함수
 * @returns {Function} fetchGroupCode - 그룹 코드 조회 함수
 * @returns {Function} fetchDetailCodeList - 상세 코드 리스트 조회 함수
 * @returns {Function} insertGroupCode - 그룹 코드 추가 함수
 * @returns {Function} updateGroupCode - 그룹 코드 수정 함수
 * @returns {Function} deleteGroupCode - 그룹 코드 삭제 함수
 * @returns {Function} insertAttrCode - 속성 코드 추가 함수
 * @returns {Function} updateAttrCode - 속성 코드 수정 함수
 * @returns {Function} deleteAttrCode - 속성 코드 삭제 함수
 * @returns {Function} insertDetailCode - 상세 코드 추가 함수
 * @returns {Function} updateDetailCode - 상세 코드 수정 함수
 * @returns {Function} deleteDetailCode - 상세 코드 삭제 함수
 * @returns {Function} refetch - 데이터 새로고침 함수 (fetchCodeData 별칭)
 */
export const useCodeApi = () => {
  const [codeData, setCodeData] = useState<ApiResponse | null>(null);
  const [groupCodeData, setGroupCodeData] = useState<any>(null);
  const [detailCodeData, setDetailCodeData] = useState<CodeSearchFormResDto[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const codeApi = CodeApi.getInstance();

  /**
   * @기능 공통 API 호출 처리 함수
   * @설명 로딩 상태 관리, 에러 처리, 성공 콜백 실행을 담당
   * @template T - API 응답 타입
   * @param {Function} apiCall - 실행할 API 호출 함수
   * @param {Function} [successCallback] - 성공 시 실행할 콜백 함수
   * @returns {Promise<T | null>} API 호출 결과 또는 null
   */
  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    successCallback?: (data: T) => void
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCall();

      if (successCallback) {
        successCallback(result);
      }

      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @기능 공통코드 검색 함수
   * @REQ_ID REQ_ADM_009_1
   * @param {CodeSearchFormReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {number} [page=0] - 페이지 번호
   * @param {number} [size=2000] - 페이지 크기
   * @returns {Promise} 공통코드 검색 결과
   */
  const fetchCodeData = useCallback(
    async (
      searchForm: CodeSearchFormReqDto = {},
      page: number = 0,
      size: number = 2000
    ) => {
      return handleApiCall(
        () => codeApi.findAllCodeMWithConditions(searchForm, page, size),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setCodeData(dataMap.data);
            } else {
              setCodeData(dataMap);
            }
          } else {
            setError(response.message || "데이터 조회에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * @기능 그룹 코드 조회 함수
   * @REQ_ID REQ_ADM_009_2
   * @param {string} grpCd - 조회할 그룹 코드
   * @returns {Promise} 그룹 코드 조회 결과
   */
  const fetchGroupCode = useCallback(
    async (grpCd: string) => {
      return handleApiCall(
        () => codeApi.findByGroupCodeForAdmin(grpCd),
        (response) => {
          if (response.success && response.data) {
            setGroupCodeData(response.data);
          } else {
            setError(response.message || "그룹 코드 조회에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * @기능 그룹 코드 추가 함수
   * @REQ_ID REQ_ADM_010
   * @param {ComCodeMReqDto} comCodeM - 추가할 그룹 코드 정보 DTO
   * @returns {Promise} 그룹 코드 추가 결과
   */
  const insertGroupCode = useCallback(
    async (comCodeM: ComCodeMReqDto) => {
      return handleApiCall(
        () => codeApi.insertGroupCodeForAdmin(comCodeM),
        (response) => {
          if (response.success) {
            console.log("그룹 코드 추가 성공:", response.data);
          } else {
            setError(response.message || "그룹 코드 추가에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * @기능 그룹 코드 수정 함수
   * @REQ_ID REQ_ADM_011
   * @param {ComCodeMReqDto} comCodeM - 수정할 그룹 코드 정보 DTO
   * @returns {Promise} 그룹 코드 수정 결과
   */
  const updateGroupCode = useCallback(
    async (comCodeM: ComCodeMReqDto) => {
      return handleApiCall(
        () => codeApi.updateGroupCodeForAdmin(comCodeM),
        (response) => {
          if (response.success) {
            console.log("그룹 코드 수정 성공:", response.data);
          } else {
            setError(response.message || "그룹 코드 수정에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * @기능 그룹 코드 삭제 함수
   * @REQ_ID REQ_ADM_012
   * @param {string} grpCd - 삭제할 그룹 코드
   * @returns {Promise} 그룹 코드 삭제 결과
   */
  const deleteGroupCode = useCallback(
    async (grpCd: string) => {
      return handleApiCall(
        () => codeApi.deleteGroupCodeForAdmin(grpCd),
        (response) => {
          if (response.success) {
            console.log("그룹 코드 삭제 성공:", response.data);
          } else {
            setError(response.message || "그룹 코드 삭제에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  // /**
  //  * @기능 상세 코드 리스트 조회 함수
  //  * @param {CodeSearchFormReqDto} codeSearchForm - 검색 조건 DTO
  //  * @param {Pageable} [pageable] - 페이징 정보 (기본값: page=0, size=20, sort="searchCdId", direction="ASC")
  //  * @returns {Promise} 상세 코드 리스트 조회 결과
  //  */
  // const fetchDetailCodeList = useCallback(
  //   async (
  //     codeSearchForm: CodeSearchFormReqDto,
  //     pageable: Pageable = {
  //       page: 0,
  //       size: 20,
  //       sort: "grpCd",
  //       direction: "ASC",
  //     }
  //   ) => {
  //     return handleApiCall(
  //       () => codeApi.codeFormD(codeSearchForm, pageable),
  //       (response) => {
  //         if (response.success && response.data) {
  //           setDetailCodeData(response.data);
  //         } else {
  //           setError(response.message || "상세 코드 조회에 실패했습니다.");
  //         }
  //       }
  //     );
  //   },
  //   [codeApi]
  // );

  /**
   * @기능 속성 코드 추가 함수
   * @REQ_ID REQ_ADM_014
   * @param {ComCodeTReqDto} comCodeT - 추가할 속성 코드 정보 DTO
   * @returns {Promise} 속성 코드 추가 결과
   */
  const insertAttrCode = useCallback(
    async (comCodeT: ComCodeTReqDto) => {
      return handleApiCall(
        () => codeApi.insertAttrCodeForAdmin(comCodeT),
        (response) => {
          if (response.success) {
            console.log("속성 코드 추가 성공:", response.data);
          } else {
            setError(response.message || "속성 코드 추가에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * @기능 속성 코드 수정 함수
   * @REQ_ID REQ_ADM_015
   * @param {ComCodeTReqDto} comCodeT - 수정할 속성 코드 정보 DTO
   * @returns {Promise} 속성 코드 수정 결과
   */
  const updateAttrCode = useCallback(
    async (comCodeT: ComCodeTReqDto) => {
      return handleApiCall(
        () => codeApi.updateAttrCodeForAdmin(comCodeT),
        (response) => {
          if (response.success) {
            console.log("속성 코드 수정 성공:", response.data);
          } else {
            setError(response.message || "속성 코드 수정에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * @기능 속성 코드 삭제 함수
   * @REQ_ID REQ_ADM_016
   * @param {string} grpCd - 그룹 코드
   * @param {string} attrCd - 삭제할 속성 코드
   * @returns {Promise} 속성 코드 삭제 결과
   */
  const deleteAttrCode = useCallback(
    async (grpCd: string, attrCd: string) => {
      return handleApiCall(
        () => codeApi.deleteAttrCodeForAdmin(grpCd, attrCd),
        (response) => {
          if (response.success) {
            console.log("속성 코드 삭제 성공:", response.data);
          } else {
            setError(response.message || "속성 코드 삭제에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * @기능 상세 코드 추가 함수
   * @param {ComCodeDReqDto} comCodeD - 추가할 상세 코드 정보 DTO
   * @returns {Promise} 상세 코드 추가 결과
   */
  const insertDetailCode = useCallback(
    async (comCodeD: ComCodeDReqDto) => {
      return handleApiCall(
        () => codeApi.insertDetailCodeForAdmin(comCodeD),
        (response) => {
          if (response.success) {
            console.log("상세 코드 추가 성공:", response.data);
          } else {
            setError(response.message || "상세 코드 추가에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * 상세 코드 수정 함수
   * @param {ComCodeDReqDto} comCodeD - 수정할 상세 코드 정보 DTO
   * @returns {Promise} 상세 코드 수정 결과
   */
  const updateDetailCode = useCallback(
    async (comCodeD: ComCodeDReqDto) => {
      return handleApiCall(
        () => codeApi.updateDetailCodeForAdmin(comCodeD),
        (response) => {
          if (response.success) {
            console.log("상세 코드 수정 성공:", response.data);
          } else {
            setError(response.message || "상세 코드 수정에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  /**
   * @기능 상세 코드 삭제 함수
   * @REQ_ID REQ_ADM_020
   * @param {string} grpCd - 그룹 코드
   * @param {string} attrCd - 속성 코드
   * @param {string} dtlCd - 삭제할 상세 코드
   * @returns {Promise} 상세 코드 삭제 결과
   */
  const deleteDetailCode = useCallback(
    async (grpCd: string, attrCd: string, dtlCd: string) => {
      return handleApiCall(
        () => codeApi.deleteDetailCodeForAdmin(grpCd, attrCd, dtlCd),
        (response) => {
          if (response.success) {
            console.log("상세 코드 삭제 성공:", response.data);
          } else {
            setError(response.message || "상세 코드 삭제에 실패했습니다.");
          }
        }
      );
    },
    [codeApi]
  );

  return {
    // 상태 데이터
    codeData,
    groupCodeData,
    detailCodeData,
    loading,
    error,

    // 검색 관련 함수
    fetchCodeData,
    fetchGroupCode,

    // 그룹 코드 CRUD 함수
    insertGroupCode,
    updateGroupCode,
    deleteGroupCode,

    // 속성 코드 CRUD 함수
    insertAttrCode,
    updateAttrCode,
    deleteAttrCode,

    // 상세 코드 CRUD 함수
    insertDetailCode,
    updateDetailCode,
    deleteDetailCode,

    // 별칭 (기존 호환성 유지)
    refetch: fetchCodeData,
  };
};
