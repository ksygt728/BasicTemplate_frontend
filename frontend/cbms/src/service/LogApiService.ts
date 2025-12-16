import { useState, useMemo, useCallback } from "react";
import { useLogApi } from "@/hooks/admin/useLogApi";
import { toLogSearchReqDto } from "@/service/mapper/LogApiMapper";
import {
  transformLogListData,
  transformLogDetailData,
  LogTableRow,
} from "@/service/transformer/LogApiTransformer";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : LogApiService.ts
 * @설명 : 로그 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
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
  logId?: string;
  userId?: string;
  requestUri?: string;
  httpMethod?: string;
  ipAddr?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

/**
 * @interface UseLogApiServiceReturn
 * @description 로그 서비스 훅의 반환 타입
 */
interface UseLogApiServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedLogId: string | null;
  searchFormData: SearchFormData;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;

  // 원본 데이터
  logData: any;
  selectedLogData: any;

  // 테이블 데이터 (페이징 처리된)
  logListData: LogTableRow[];
  logDetailData: Record<string, any>;

  // 상태 변경 함수
  setSelectedLogId: (logId: string | null) => void;
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleTableRowClick: (row: LogTableRow) => Promise<void>;
  handlePageChange: (page: number) => Promise<void>;
  handlePageSizeChange: (size: number) => Promise<void>;
  refetch: () => Promise<any>;
}

/**
 * @hook useLogApiService
 * @description 로그 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseLogApiServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useLogApiService = (): UseLogApiServiceReturn => {
  const {
    logData,
    selectedLogData,
    loading,
    error,
    fetchLogData,
    fetchLogDetail,
    refetch: apiRefetch,
  } = useLogApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
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
    return logData?.totalElements || 0;
  }, [logData]);

  const totalPages = useMemo(() => {
    return logData?.totalPages || 0;
  }, [logData]);

  const first = useMemo(() => {
    return logData?.first ?? true;
  }, [logData]);

  const last = useMemo(() => {
    return logData?.last ?? true;
  }, [logData]);

  /**
   * @메모 로그 목록 데이터
   * @description API 응답 → 테이블 Row 데이터 변환
   */
  const logListData = useMemo(() => {
    return transformLogListData(logData);
  }, [logData]);

  /**
   * @메모 로그 상세 데이터
   * @description API 응답 → 상세 폼 데이터 변환
   */
  const logDetailData = useMemo(() => {
    return transformLogDetailData(selectedLogData);
  }, [selectedLogData]);

  // ============================================================================
  // 비즈니스 로직 함수
  // ============================================================================

  /**
   * @기능 검색 처리
   * @param {SearchFormData} searchData - 검색 폼 데이터
   * @returns {Promise<void>}
   */
  const handleSearch = useCallback(
    async (searchData: SearchFormData): Promise<void> => {
      setSearchFormData(searchData);
      setCurrentPage(0); // 검색 시 페이지 초기화
      const searchDto = toLogSearchReqDto(searchData);
      const pageable: Pageable = {
        page: 0,
        size: pageSize,
        sort: "endDate",
        direction: "DESC",
      };
      await fetchLogData(searchDto as any, pageable);
    },
    [fetchLogData, pageSize]
  );

  /**
   * @기능 페이지 변경 처리
   * @param {number} page - 변경할 페이지 번호 (0-based)
   * @returns {Promise<void>}
   */
  const handlePageChange = useCallback(
    async (page: number): Promise<void> => {
      setCurrentPage(page);
      const searchDto = toLogSearchReqDto(searchFormData);
      const pageable: Pageable = {
        page: page,
        size: pageSize,
        sort: "endDate",
        direction: "DESC",
      };
      await fetchLogData(searchDto as any, pageable);
    },
    [searchFormData, pageSize, fetchLogData]
  );

  /**
   * @기능 페이지 크기 변경 처리
   * @param {number} size - 변경할 페이지 크기
   * @returns {Promise<void>}
   */
  const handlePageSizeChange = useCallback(
    async (size: number): Promise<void> => {
      setPageSize(size);
      setCurrentPage(0); // 페이지 크기 변경 시 페이지 초기화
      const searchDto = toLogSearchReqDto(searchFormData);
      const pageable: Pageable = {
        page: 0,
        size: size,
        sort: "endDate",
        direction: "DESC",
      };
      await fetchLogData(searchDto as any, pageable);
    },
    [searchFormData, fetchLogData]
  );

  /**
   * @기능 테이블 Row 클릭 처리
   * @param {LogTableRow} row - 선택된 Row 데이터
   * @returns {Promise<void>}
   */
  const handleTableRowClick = useCallback(
    async (row: LogTableRow): Promise<void> => {
      setSelectedLogId(row.logId);
      // 상세 조회는 선택적으로 사용 (현재는 row 데이터에 이미 상세 정보 포함)
      // await fetchLogDetail(row.logId);
    },
    [setSelectedLogId]
  );

  /**
   * @기능 데이터 새로고침
   * @returns {Promise<any>}
   */
  const refetch = useCallback(async () => {
    const searchDto = toLogSearchReqDto(searchFormData);
    const pageable: Pageable = {
      page: currentPage,
      size: pageSize,
      sort: "endDate",
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
    selectedLogId,
    searchFormData,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    first,
    last,

    // 원본 데이터
    logData,
    selectedLogData,

    // 테이블 데이터
    logListData,
    logDetailData,

    // 상태 변경
    setSelectedLogId,
    setSearchFormData,

    // 비즈니스 로직
    handleSearch,
    handleTableRowClick,
    handlePageChange,
    handlePageSizeChange,
    refetch,
  };
};
