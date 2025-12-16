import { LogApiResDto } from "@/types/responseDto/LogApiResDto";

/**
 * @파일명 : LogApiTransformer.ts
 * @설명 : 로그 관리 도메인의 UI 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface LogTableRow
 * @description 로그 테이블 Row 타입
 */
export interface LogTableRow {
  id: string;
  logId: string;
  userId: string;
  startDate: string;
  endDate: string;
  ipAddr: string;
  requestUri: string;
  httpMethod: string;
  statusCode: string;
  execTime: number;
  userAgent?: string;
  requestBody?: string;
  responseBody?: string;
}

// ============================================================================
// API Response → 테이블 데이터 변환
// ============================================================================

/**
 * @function transformLogListData
 * @description API 응답 데이터를 로그 테이블 데이터로 변환
 * @param {any} logData - API 응답 데이터
 * @returns {LogTableRow[]} 로그 테이블 데이터 배열
 */
export const transformLogListData = (logData: any): LogTableRow[] => {
  if (!logData?.content) return [];

  return logData.content.map((log: LogApiResDto) => ({
    id: log.logId,
    logId: log.logId,
    userId: log.userId,
    startDate: log.startDate,
    endDate: log.endDate,
    ipAddr: log.ipAddr,
    requestUri: log.requestUri
      ? decodeURIComponent(log.requestUri)
      : log.requestUri,
    httpMethod: log.httpMethod,
    statusCode: log.statusCode,
    execTime: log.execTime,
    userAgent: log.userAgent,
    requestBody: log.requestBody,
    responseBody: log.responseBody,
  }));
};

/**
 * @function transformLogDetailData
 * @description API 응답 데이터를 로그 상세 데이터로 변환
 * @param {LogApiResDto | null} logData - API 응답 로그 데이터
 * @returns {Record<string, any>} 로그 상세 데이터
 */
export const transformLogDetailData = (
  logData: LogApiResDto | null
): Record<string, any> => {
  if (!logData) {
    return {
      logId: "",
      userId: "",
      startDate: "",
      endDate: "",
      ipAddr: "",
      userAgent: "",
      requestUri: "",
      httpMethod: "",
      requestBody: "",
      responseBody: "",
      statusCode: "",
      execTime: 0,
    };
  }

  return {
    logId: logData.logId || "",
    userId: logData.userId || "",
    startDate: logData.startDate || "",
    endDate: logData.endDate || "",
    ipAddr: logData.ipAddr || "",
    userAgent: logData.userAgent || "",
    requestUri: logData.requestUri
      ? decodeURIComponent(logData.requestUri)
      : "",
    httpMethod: logData.httpMethod || "",
    requestBody: logData.requestBody || "",
    responseBody: logData.responseBody || "",
    statusCode: logData.statusCode || "",
    execTime: logData.execTime || 0,
  };
};
