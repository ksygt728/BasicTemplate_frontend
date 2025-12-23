/**
 * @파일명 : SchedulerTransformer.ts
 * @설명 : 스케줄러 관리 도메인의 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

/**
 * @interface SchedulerMasterRow
 * @description 스케줄러 마스터 테이블 Row 타입
 */
export interface SchedulerMasterRow {
  id: string;
  scheId: string;
  scheName: string;
  description: string;
  scheGroup: string;
  className: string;
  methodName: string;
  triggerName: string;
  cronExp: string;
  lastExecTime: string;
  nextExecTime: string;
  useYn: string;
}

/**
 * @interface SchedulerHistoryRow
 * @description 스케줄러 이력 테이블 Row 타입
 */
export interface SchedulerHistoryRow {
  id: string;
  logId: string;
  scheId: string;
  scheGroup: string;
  startTime: string;
  endTime: string;
  execTime: number;
  success: string;
  errorMsg: string;
}

// ============================================================================
// 스케줄러 마스터 데이터 변환
// ============================================================================

/**
 * @function transformSchedulerMasterData
 * @description API 응답 데이터를 스케줄러 마스터 테이블 Row로 변환
 * @param {any} apiData - API 응답 데이터
 * @returns {SchedulerMasterRow[]} 변환된 스케줄러 마스터 테이블 Row 배열
 */
export const transformSchedulerMasterData = (
  apiData: any
): SchedulerMasterRow[] => {
  // 백엔드 응답: { data: { data: { content: [...] } } }
  const actualData = apiData?.data?.data || apiData?.data || apiData;

  if (!actualData?.content || !Array.isArray(actualData.content)) {
    return [];
  }

  return actualData.content.map((item: any) => ({
    id: item.scheId,
    scheId: item.scheId,
    scheName: item.scheName,
    description: item.description || "",
    scheGroup: item.scheGroup,
    className: item.className,
    methodName: item.methodName,
    triggerName: item.triggerName,
    cronExp: item.cronExp,
    lastExecTime: item.lastExecTime || "-",
    nextExecTime: item.nextExecTime || "-",
    useYn: item.useYn,
  }));
};

// ============================================================================
// 스케줄러 이력 데이터 변환
// ============================================================================

/**
 * @function transformSchedulerHistoryData
 * @description API 응답 데이터를 스케줄러 이력 테이블 Row로 변환
 * @param {any} apiData - API 응답 데이터
 * @returns {SchedulerHistoryRow[]} 변환된 스케줄러 이력 테이블 Row 배열
 */
export const transformSchedulerHistoryData = (
  apiData: any
): SchedulerHistoryRow[] => {
  // 백엔드 응답: { data: { data: { content: [...] } } }
  const actualData = apiData?.data?.data || apiData?.data || apiData;

  if (!actualData?.content || !Array.isArray(actualData.content)) {
    return [];
  }

  return actualData.content.map((item: any) => ({
    id: item.logId,
    logId: item.logId,
    scheId: item.scheId,
    scheGroup: item.scheGroup,
    startTime: item.startTime || "-",
    endTime: item.endTime || "-",
    execTime: item.execTime || 0,
    success: item.success,
    errorMsg: item.errorMsg || "",
  }));
};
