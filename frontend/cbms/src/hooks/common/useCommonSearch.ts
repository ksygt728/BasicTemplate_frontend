import { useState, useCallback } from "react";

/**
 * 범용 검색 기능 Hook
 * 모든 도메인에서 재사용 가능한 검색 상태 관리 및 실행 로직
 * 
 * @example
 * // User 도메인
 * const { handleSearch } = useCommonSearch(
 *   fetchUsers,
 *   (searchData) => ({
 *     userName: searchData.userName,
 *     email: searchData.email,
 *     status: searchData.status
 *   })
 * );
 * 
 * // Code 도메인
 * const { handleSearch } = useCommonSearch(
 *   fetchCodeData,
 *   (searchData) => ({
 *     grpCd: searchData.grpCd,
 *     grpNm: searchData.grpNm,
 *     useYn: searchData.useYn
 *   })
 * );
 */

interface UseCommonSearchOptions<TSearchForm> {
  /** API 호출 함수 */
  fetchData: (searchForm: TSearchForm, ...args: any[]) => Promise<any>;
  /** 검색 데이터를 API 요청 DTO로 변환하는 함수 */
  convertToSearchForm: (searchData: Record<string, any>) => TSearchForm;
  /** 추가 fetch 파라미터 (페이지, 크기 등) */
  additionalFetchArgs?: any[];
}

export const useCommonSearch = <TSearchForm = Record<string, any>>(
  options: UseCommonSearchOptions<TSearchForm>
) => {
  const { fetchData, convertToSearchForm, additionalFetchArgs = [] } = options;

  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [searchFormData, setSearchFormData] = useState<Record<string, any>>({});

  /**
   * 검색 실행
   */
  const handleSearch = useCallback(
    async (searchData: Record<string, any>) => {
      setSearchParams(searchData);
      const searchForm = convertToSearchForm(searchData);
      await fetchData(searchForm, ...additionalFetchArgs);
    },
    [convertToSearchForm, fetchData, additionalFetchArgs]
  );

  /**
   * 검색 초기화
   */
  const handleResetSearch = useCallback(() => {
    setSearchParams({});
    setSearchFormData({});
  }, []);

  return {
    searchParams,
    setSearchParams,
    searchFormData,
    setSearchFormData,
    handleSearch,
    handleResetSearch,
  };
};

/**
 * 코드 도메인 전용 검색 Hook (하위 호환성 유지)
 */
export const useCodeSearch = (
  fetchCodeData: (...args: any[]) => Promise<any>
) => {
  return useCommonSearch({
    fetchData: fetchCodeData,
    convertToSearchForm: (searchData: Record<string, any>) => {
      const searchForm: Record<string, any> = {};
      const fields = ["grpCdType", "grpCd", "grpNm", "useYn"] as const;

      fields.forEach((field) => {
        if (searchData[field]?.trim()) {
          searchForm[field] = searchData[field];
        }
      });

      if (searchData.regDate_start && searchData.regDate_end) {
        searchForm.startDate = searchData.regDate_start;
        searchForm.endDate = searchData.regDate_end;
      }

      return searchForm;
    },
    additionalFetchArgs: [0, 2000],
  });
};
