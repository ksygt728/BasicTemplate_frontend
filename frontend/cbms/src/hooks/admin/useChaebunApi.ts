/**
 * @파일명 : useChaebunApi.ts
 * @설명 : 채번 관리 API Hook (React Query 사용)
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

import { useState, useCallback } from "react";
import { ChaebunApi } from "@/api/admin/chaebunApi";
import { ChaebunResDto } from "@/types/responseDto/ChaebunResDto";
import { ChaebunReqDto } from "@/types/requestDto/ChaebunReqDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * @interface UseChaebunApiReturn
 * @description 채번 API Hook 반환 타입
 */
export interface UseChaebunApiReturn {
  // 상태
  loading: boolean;
  error: string | null;
  chaebunList: ChaebunResDto[];
  selectedChaebun: ChaebunResDto | null;

  // API 호출 함수
  fetchChaebunList: (
    searchData?: ChaebunReqDto,
    pageable?: Pageable
  ) => Promise<void>;
  fetchChaebunDetail: (seqId: string) => Promise<void>;
  insertChaebun: (chaebunData: ChaebunReqDto) => Promise<void>;
  updateChaebun: (chaebunData: ChaebunReqDto) => Promise<void>;
  deleteChaebun: (seqId: string) => Promise<void>;
  generateSeq: (seqId: string) => Promise<string>;

  // 상태 관리
  setSelectedChaebun: (chaebun: ChaebunResDto | null) => void;
  refetch: () => Promise<void>;
}

/**
 * @hook useChaebunApi
 * @description 채번 API 호출을 위한 커스텀 훅
 * @returns {UseChaebunApiReturn} API 호출 함수와 상태
 */
export const useChaebunApi = (): UseChaebunApiReturn => {
  const chaebunApi = ChaebunApi.getInstance();
  const { handleApiCall } = useCommonApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chaebunList, setChaebunList] = useState<ChaebunResDto[]>([]);
  const [selectedChaebun, setSelectedChaebun] = useState<ChaebunResDto | null>(
    null
  );

  // ============================================================================
  // 채번 리스트 조회
  // ============================================================================

  /**
   * @function fetchChaebunList
   * @description 채번 리스트 조회
   * @param {ChaebunReqDto} searchData - 검색 조건
   * @param {Pageable} pageable - 페이지네이션 정보
   */
  const fetchChaebunList = useCallback(
    async (
      searchData: ChaebunReqDto = {} as ChaebunReqDto,
      pageable?: Pageable
    ): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await handleApiCall(() =>
          chaebunApi.findAllChaebunForAdmin(searchData, pageable)
        );

        // 응답 구조: response.data.data.content 또는 response.data.content
        const responseData = response as any;
        if (responseData?.data?.data?.content) {
          setChaebunList(responseData.data.data.content);
        } else if (responseData?.data?.content) {
          setChaebunList(responseData.data.content);
        } else if (Array.isArray(responseData?.data?.data)) {
          setChaebunList(responseData.data.data);
        } else if (Array.isArray(responseData?.data)) {
          setChaebunList(responseData.data);
        } else {
          setChaebunList([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
        setChaebunList([]);
      } finally {
        setLoading(false);
      }
    },
    [handleApiCall, chaebunApi]
  );

  // ============================================================================
  // 채번 상세 조회
  // ============================================================================

  /**
   * @function fetchChaebunDetail
   * @description 채번 상세 정보 조회
   * @param {string} seqId - 채번 아이디
   */
  const fetchChaebunDetail = useCallback(
    async (seqId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await handleApiCall(() =>
          chaebunApi.findByChaebunForAdmin(seqId)
        );

        const responseData = response as any;
        if (responseData?.data) {
          setSelectedChaebun(responseData.data as ChaebunResDto);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    },
    [handleApiCall, chaebunApi]
  );

  // ============================================================================
  // 채번 추가
  // ============================================================================

  /**
   * @function insertChaebun
   * @description 채번 추가
   * @param {ChaebunReqDto} chaebunData - 채번 정보
   */
  const insertChaebun = useCallback(
    async (chaebunData: ChaebunReqDto): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await handleApiCall(() =>
          chaebunApi.insertChaebunForAdmin(chaebunData)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleApiCall, chaebunApi]
  );

  // ============================================================================
  // 채번 수정
  // ============================================================================

  /**
   * @function updateChaebun
   * @description 채번 수정
   * @param {ChaebunReqDto} chaebunData - 채번 정보
   */
  const updateChaebun = useCallback(
    async (chaebunData: ChaebunReqDto): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await handleApiCall(() =>
          chaebunApi.updateChaebunForAdmin(chaebunData)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleApiCall, chaebunApi]
  );

  // ============================================================================
  // 채번 삭제
  // ============================================================================

  /**
   * @function deleteChaebun
   * @description 채번 삭제
   * @param {string} seqId - 채번 아이디
   */
  const deleteChaebun = useCallback(
    async (seqId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await handleApiCall(() => chaebunApi.deleteChaebunForAdmin(seqId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleApiCall, chaebunApi]
  );

  // ============================================================================
  // 채번 생성
  // ============================================================================

  /**
   * @function generateSeq
   * @description 채번 생성 (다음 번호 발급)
   * @param {string} seqId - 채번 아이디
   * @returns {Promise<string>} 생성된 채번값
   */
  const generateSeq = useCallback(
    async (seqId: string): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const response = await handleApiCall(() =>
          chaebunApi.generateSeq(seqId)
        );

        const responseData = response as any;
        // 응답 구조: response.data.data (문자열)
        if (
          responseData?.data?.data &&
          typeof responseData.data.data === "string"
        ) {
          return responseData.data.data;
        } else if (typeof responseData?.data === "string") {
          return responseData.data;
        } else if (responseData?.data?.seqValue) {
          return responseData.data.seqValue;
        }
        return "";
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleApiCall, chaebunApi]
  );

  // ============================================================================
  // 전체 데이터 재조회
  // ============================================================================

  /**
   * @function refetch
   * @description 채번 리스트 재조회
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchChaebunList();
  }, [fetchChaebunList]);

  return {
    loading,
    error,
    chaebunList,
    selectedChaebun,
    fetchChaebunList,
    fetchChaebunDetail,
    insertChaebun,
    updateChaebun,
    deleteChaebun,
    generateSeq,
    setSelectedChaebun,
    refetch,
  };
};
