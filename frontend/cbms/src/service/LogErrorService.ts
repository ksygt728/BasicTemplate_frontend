import { useState, useMemo, useCallback } from "react";
import { useLogErrorApi } from "@/hooks/admin/useLogErrorApi";
import { toLogErrorSearchReqDto } from "@/service/mapper/LogErrorMapper";
import {
  transformLogErrorListData,
  transformLogErrorDetailData,
  LogErrorTableRow,
} from "@/service/transformer/LogErrorTransformer";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : LogErrorService.ts
 * @설명 : 에러 로그 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface SearchFormData
 * @description 검색 폼 데이터 타입
 */
export interface SearchFormData {
  errId?: string;
  userId?: string;
  requestUri?: string;
  httpMethod?: string;
  ipAddr?: string;
  errMsg?: string;
  [key: string]: any;
}

/**
 * @interface UseLogErrorServiceReturn
 * @description 에러 로그 서비스 훅의 반환 타입
 */
interface UseLogErrorServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedErrId: string | null;
  searchFormData: SearchFormData;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;

  // 원본 데이터
  errorLogData: any;
  selectedErrorLogData: any;

  // 테이블 데이터 (페이징 처리된)
  errorLogListData: LogErrorTableRow[];
  errorLogDetailData: Record<string, any>;

  // 상태 변경 함수
  setSelectedErrId: (errId: string | null) => void;
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleTableRowClick: (row: LogErrorTableRow) => Promise<void>;
  handlePageChange: (page: number) => Promise<void>;
  handlePageSizeChange: (size: number) => Promise<void>;
  refetch: () => Promise<any>;
}

/**
 * @hook useLogErrorService
 * @description 에러 로그 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseLogErrorServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useLogErrorService = (): UseLogErrorServiceReturn => {
  const {
    errorLogData,
    selectedErrorLogData,
    loading,
    error,
    fetchErrorLogData,
    fetchErrorLogDetail,
    refetch: apiRefetch,
  } = useLogErrorApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [selectedErrId, setSelectedErrId] = useState<string | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(100);

  // ============================================================================
  // 데이터 변환 (useMemo)
  // ============================================================================

  /**
   * @메모 페이지네이션 정보 (백엔드에서 받아옴)
   */
  const totalElements = useMemo(() => {
    return errorLogData?.totalElements || 0;
  }, [errorLogData]);

  const totalPages = useMemo(() => {
    return errorLogData?.totalPages || 0;
  }, [errorLogData]);

  const first = useMemo(() => {
    return errorLogData?.first ?? true;
  }, [errorLogData]);

  const last = useMemo(() => {
    return errorLogData?.last ?? true;
  }, [errorLogData]);

  /**
   * @메모 에러 로그 목록 데이터
   * @description API 응답 → 테이블 Row 데이터 변환
   */
  const errorLogListData = useMemo(() => {
    return transformLogErrorListData(errorLogData);
  }, [errorLogData]);

  /**
   * @메모 에러 로그 상세 데이터
   * @description API 응답 → 상세 폼 데이터 변환
   */
  const errorLogDetailData = useMemo(() => {
    return transformLogErrorDetailData(selectedErrorLogData);
  }, [selectedErrorLogData]);

  // ============================================================================
  // 비즈니스 로직 함수
  // ============================================================================

  /**
   * @기능 검색 처리
   * @param {SearchFormData} searchData - 검색 조건
   * @returns {Promise<void>}
   */
  const handleSearch = useCallback(
    async (searchData: SearchFormData): Promise<void> => {
      setSearchFormData(searchData);
      setCurrentPage(0); // 검색 시 페이지 초기화

      const searchDto = toLogErrorSearchReqDto(searchData);
      const pageable: Pageable = {
        page: 0,
        size: pageSize,
        sort: "createDate",
        direction: "DESC",
      };

      await fetchErrorLogData(searchDto as any, pageable);
    },
    [pageSize, fetchErrorLogData]
  );

  /**
   * @기능 페이지 변경 처리
   * @param {number} page - 변경할 페이지 번호 (0-based)
   * @returns {Promise<void>}
   */
  const handlePageChange = useCallback(
    async (page: number): Promise<void> => {
      setCurrentPage(page);

      const searchDto = toLogErrorSearchReqDto(searchFormData);
      const pageable: Pageable = {
        page: page,
        size: pageSize,
        sort: "createDate",
        direction: "DESC",
      };

      await fetchErrorLogData(searchDto as any, pageable);
    },
    [searchFormData, pageSize, fetchErrorLogData]
  );

  /**
   * @기능 페이지 크기 변경 처리
   * @param {number} size - 변경할 페이지 크기
   * @returns {Promise<void>}
   */
  const handlePageSizeChange = useCallback(
    async (size: number): Promise<void> => {
      setPageSize(size);
      setCurrentPage(0); // 페이지 크기 변경 시 첫 페이지로

      const searchDto = toLogErrorSearchReqDto(searchFormData);
      const pageable: Pageable = {
        page: 0,
        size: size,
        sort: "createDate",
        direction: "DESC",
      };

      await fetchErrorLogData(searchDto as any, pageable);
    },
    [searchFormData, fetchErrorLogData]
  );

  /**
   * @기능 테이블 Row 클릭 처리
   * @param {LogErrorTableRow} row - 선택된 Row 데이터
   * @returns {Promise<void>}
   */
  const handleTableRowClick = useCallback(
    async (row: LogErrorTableRow): Promise<void> => {
      setSelectedErrId(row.errId);
      // 상세 조회는 선택적으로 사용 (현재는 row 데이터에 이미 상세 정보 포함)
      // await fetchErrorLogDetail(row.errId);
    },
    [setSelectedErrId]
  );

  /**
   * @기능 데이터 새로고침
   * @returns {Promise<any>}
   */
  const refetch = useCallback(async () => {
    const searchDto = toLogErrorSearchReqDto(searchFormData);
    const pageable: Pageable = {
      page: currentPage,
      size: pageSize,
      sort: "createDate",
      direction: "DESC",
    };

    return apiRefetch(searchDto as any, pageable);
  }, [searchFormData, currentPage, pageSize, apiRefetch]);

  // ============================================================================
  // 반환
  // ============================================================================

  return {
    // 상태
    loading,
    error,
    selectedErrId,
    searchFormData,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    first,
    last,

    // 원본 데이터
    errorLogData,
    selectedErrorLogData,

    // 테이블 데이터
    errorLogListData,
    errorLogDetailData,

    // 상태 변경
    setSelectedErrId,
    setSearchFormData,

    // 비즈니스 로직
    handleSearch,
    handleTableRowClick,
    handlePageChange,
    handlePageSizeChange,
    refetch,
  };
};
