import { useState, useMemo, useCallback } from "react";
import { useSchedulerApi } from "@/hooks/admin/useSchedulerApi";
import {
  toSchedulerSearchReqDto,
  toScheMReqDto,
} from "@/service/mapper/SchedulerMapper";
import {
  transformSchedulerMasterData,
  transformSchedulerHistoryData,
} from "@/service/transformer/SchedulerTransformer";
import type {
  SchedulerMasterRow,
  SchedulerHistoryRow,
} from "@/service/transformer/SchedulerTransformer";

/**
 * @파일명 : SchedulerService.ts
 * @설명 : 스케줄러 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface SearchFormData
 * @description 검색 폼 데이터 타입
 */
export interface SearchFormData {
  scheId?: string;
  scheName?: string;
  scheGroup?: string;
  useYn?: string;
  [key: string]: any;
}

/**
 * @interface UseSchedulerServiceReturn
 * @description 스케줄러 서비스 훅의 반환 타입
 */
interface UseSchedulerServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedScheId: string | null;
  searchFormData: SearchFormData;

  // 원본 데이터
  schedulerData: any;

  // 테이블 데이터
  leftTableData: SchedulerMasterRow[];
  rightTableData: SchedulerHistoryRow[];

  // 상태 변경 함수
  setSelectedScheId: (scheId: string | null) => void;
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleLeftTableRowClick: (row: SchedulerMasterRow) => void;
  refetch: () => Promise<any>;

  // 스케줄러 CRUD
  handleInsertScheduler: (rowData: SchedulerMasterRow) => Promise<any>;
  handleUpdateScheduler: (
    id: string | number,
    rowData: SchedulerMasterRow
  ) => Promise<any>;
  handleDeleteScheduler: (id: string | number) => Promise<any>;
  handleBulkDeleteScheduler: (
    selectedRows: SchedulerMasterRow[]
  ) => Promise<any>;
  handleExecuteScheduler: (scheId: string) => Promise<any>;
}

/**
 * @hook useSchedulerService
 * @description 스케줄러 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseSchedulerServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useSchedulerService = (): UseSchedulerServiceReturn => {
  const {
    schedulerData,
    schedulerHistoryData,
    loading,
    error,
    fetchSchedulerList,
    fetchSchedulerHistory,
    insertScheduler,
    updateScheduler,
    deleteScheduler,
    executeScheduler,
    refetch,
  } = useSchedulerApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [selectedScheId, setSelectedScheId] = useState<string | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  // ============================================================================
  // 데이터 변환 (Transformer 사용)
  // ============================================================================

  const leftTableData = useMemo(
    () => transformSchedulerMasterData(schedulerData),
    [schedulerData]
  );

  const rightTableData = useMemo(
    () => transformSchedulerHistoryData(schedulerHistoryData),
    [schedulerHistoryData]
  );

  // ============================================================================
  // 검색 처리
  // ============================================================================

  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      const searchForm = toSchedulerSearchReqDto(searchData);
      await fetchSchedulerList(searchForm as any);
    },
    [fetchSchedulerList]
  );

  // ============================================================================
  // 이벤트 핸들러
  // ============================================================================

  const handleLeftTableRowClick = useCallback(
    (row: SchedulerMasterRow) => {
      setSelectedScheId(row.scheId);
      // 스케줄러 이력 조회
      fetchSchedulerHistory(row.scheId);
    },
    [fetchSchedulerHistory]
  );

  // ============================================================================
  // 스케줄러 CRUD
  // ============================================================================

  const handleInsertScheduler = useCallback(
    async (rowData: SchedulerMasterRow) => {
      // 신규 추가 시 useYn을 강제로 'N'으로 설정
      const scheMReqDto = {
        ...toScheMReqDto(rowData),
        useYn: "N",
      };
      const result = await insertScheduler(scheMReqDto);
      if (result) {
        await refetch();
      }
      return { success: result };
    },
    [insertScheduler, refetch]
  );

  const handleUpdateScheduler = useCallback(
    async (id: string | number, rowData: SchedulerMasterRow) => {
      const scheMReqDto = {
        ...toScheMReqDto(rowData),
        scheId: typeof id === "string" ? id : rowData.scheId,
      };
      const result = await updateScheduler(scheMReqDto);
      if (result) {
        await refetch();
      }
      return { success: result };
    },
    [updateScheduler, refetch]
  );

  const handleDeleteScheduler = useCallback(
    async (id: string | number) => {
      const scheId = typeof id === "string" ? id : String(id);
      const result = await deleteScheduler(scheId);
      if (result) {
        await refetch();
        if (selectedScheId === scheId) {
          setSelectedScheId(null);
        }
      }
      return { success: result };
    },
    [deleteScheduler, refetch, selectedScheId]
  );

  const handleBulkDeleteScheduler = useCallback(
    async (selectedRows: SchedulerMasterRow[]) => {
      try {
        for (const row of selectedRows) {
          const result = await deleteScheduler(row.scheId);
          if (!result) {
            throw new Error(`스케줄러 ${row.scheId} 삭제 실패`);
          }
          if (selectedScheId === row.scheId) {
            setSelectedScheId(null);
          }
        }
        await refetch();
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    },
    [deleteScheduler, refetch, selectedScheId]
  );

  const handleExecuteScheduler = useCallback(
    async (scheId: string) => {
      const result = await executeScheduler(scheId);
      if (result) {
        // 실행 후 이력 다시 조회
        if (selectedScheId === scheId) {
          await fetchSchedulerHistory(scheId);
        }
      }
      return { success: result };
    },
    [executeScheduler, fetchSchedulerHistory, selectedScheId]
  );

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // 상태
    loading,
    error,
    selectedScheId,
    searchFormData,

    // 원본 데이터
    schedulerData,

    // 테이블 데이터
    leftTableData,
    rightTableData,

    // 상태 변경 함수
    setSelectedScheId,
    setSearchFormData,

    // 비즈니스 로직 함수
    handleSearch,
    handleLeftTableRowClick,
    refetch,

    // 스케줄러 CRUD
    handleInsertScheduler,
    handleUpdateScheduler,
    handleDeleteScheduler,
    handleBulkDeleteScheduler,
    handleExecuteScheduler,
  };
};
