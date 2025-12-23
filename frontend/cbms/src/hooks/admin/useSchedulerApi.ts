import { useState, useCallback } from "react";
import { SchedulerApi } from "@/api/admin/schedulerApi";
import { ScheMReqDto } from "@/types/requestDto/ScheMReqDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * @파일명 : useSchedulerApi.ts
 * @설명 : 스케줄러 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

/**
 * @hook useSchedulerApi
 * @description 스케줄러 관리 관련 모든 API 호출을 처리하는 커스텀 훅
 * @returns {Object} 스케줄러 데이터 및 API 호출 함수들
 */
export const useSchedulerApi = () => {
  const [schedulerData, setSchedulerData] = useState<any>(null);
  const [schedulerHistoryData, setSchedulerHistoryData] = useState<any>(null);
  const { loading, error, handleApiCall } = useCommonApi();

  const schedulerApi = SchedulerApi.getInstance();

  /**
   * @function fetchSchedulerList
   * @description 스케줄러 목록 조회
   */
  const fetchSchedulerList = useCallback(
    async (searchForm?: Partial<ScheMReqDto>): Promise<void> => {
      await handleApiCall(
        () =>
          schedulerApi.findAllSchedulerForAdmin(searchForm as ScheMReqDto, {
            page: 0,
            size: 200,
            sort: "scheId",
            direction: "ASC",
          }),
        (response: any) => {
          if (response.success) {
            setSchedulerData(response.data);
          }
        }
      );
    },
    [handleApiCall, schedulerApi]
  );

  /**
   * @function fetchSchedulerHistory
   * @description 선택한 스케줄러의 이력 조회
   */
  const fetchSchedulerHistory = useCallback(
    async (scheId: string): Promise<void> => {
      await handleApiCall(
        () =>
          schedulerApi.findBySchedulerHistoryForAdmin(scheId, {
            page: 0,
            size: 200,
            sort: "endTime",
            direction: "DESC",
          }),
        (response: any) => {
          if (response.success) {
            setSchedulerHistoryData(response.data);
          }
        }
      );
    },
    [handleApiCall, schedulerApi]
  );

  /**
   * @function insertScheduler
   * @description 스케줄러 추가
   */
  const insertScheduler = useCallback(
    async (scheM: ScheMReqDto): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => schedulerApi.insertSchedulerForAdmin(scheM),
        (response: any) => {
          if (response.success) {
            success = true;
          }
        }
      );
      return success;
    },
    [handleApiCall, schedulerApi]
  );

  /**
   * @function updateScheduler
   * @description 스케줄러 수정
   */
  const updateScheduler = useCallback(
    async (scheM: ScheMReqDto): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => schedulerApi.updateSchedulerForAdmin(scheM),
        (response: any) => {
          if (response.success) {
            success = true;
          }
        }
      );
      return success;
    },
    [handleApiCall, schedulerApi]
  );

  /**
   * @function deleteScheduler
   * @description 스케줄러 삭제
   */
  const deleteScheduler = useCallback(
    async (scheId: string): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => schedulerApi.deleteSchedulerForAdmin(scheId),
        (response: any) => {
          if (response.success) {
            success = true;
          }
        }
      );
      return success;
    },
    [handleApiCall, schedulerApi]
  );

  /**
   * @function executeScheduler
   * @description 스케줄러 직접 실행
   */
  const executeScheduler = useCallback(
    async (scheId: string): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => schedulerApi.executeSchedulerForAdmin(scheId),
        (response: any) => {
          if (response.success) {
            success = true;
          }
        }
      );
      return success;
    },
    [handleApiCall, schedulerApi]
  );

  /**
   * @function refetch
   * @description 스케줄러 목록 새로고침
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchSchedulerList();
  }, [fetchSchedulerList]);

  return {
    // 데이터
    schedulerData,
    schedulerHistoryData,

    // 조회 함수
    fetchSchedulerList,
    fetchSchedulerHistory,

    // CRUD 함수
    insertScheduler,
    updateScheduler,
    deleteScheduler,
    executeScheduler,

    // 상태
    loading,
    error,

    // Refetch
    refetch,
  };
};
