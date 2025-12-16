import { LogErrorResDto } from "@/types/responseDto/LogErrorResDto";

/**
 * @파일명 : LogErrorTransformer.ts
 * @설명 : 에러 로그 도메인의 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface LogErrorTableRow
 * @description 에러 로그 테이블 Row 데이터 타입
 */
export interface LogErrorTableRow {
  id: string;
  errId: string;
  userId: string;
  ipAddr: string;
  userAgent: string;
  requestUri: string;
  httpMethod: string;
  errMsg: string;
  errStack: string;
  createDate: string;
}

// ============================================================================
// 변환 함수
// ============================================================================

/**
 * @function transformLogErrorListData
 * @description API 응답 데이터를 에러 로그 테이블 데이터 배열로 변환
 * @param {any} errorLogData - API 응답 데이터
 * @returns {LogErrorTableRow[]} 에러 로그 테이블 데이터 배열
 */
export const transformLogErrorListData = (
  errorLogData: any
): LogErrorTableRow[] => {
  if (!errorLogData?.content) return [];

  return errorLogData.content.map((log: LogErrorResDto) => ({
    id: log.errId,
    errId: log.errId,
    userId: log.userId,
    ipAddr: log.ipAddr,
    userAgent: log.userAgent,
    requestUri: log.requestUri
      ? decodeURIComponent(log.requestUri)
      : log.requestUri,
    httpMethod: log.httpMethod,
    errMsg: log.errMsg,
    errStack: log.errStack,
    createDate: log.createDate ? log.createDate.replace("T", " ") : "",
  }));
};

/**
 * @function transformLogErrorDetailData
 * @description API 응답 데이터를 에러 로그 상세 데이터로 변환
 * @param {LogErrorResDto | null} errorLogData - API 응답 에러 로그 데이터
 * @returns {Record<string, any>} 에러 로그 상세 데이터
 */
export const transformLogErrorDetailData = (
  errorLogData: LogErrorResDto | null
): Record<string, any> => {
  if (!errorLogData) return {};

  return {
    errId: errorLogData.errId || "",
    userId: errorLogData.userId || "",
    ipAddr: errorLogData.ipAddr || "",
    userAgent: errorLogData.userAgent || "",
    requestUri: errorLogData.requestUri
      ? decodeURIComponent(errorLogData.requestUri)
      : "",
    httpMethod: errorLogData.httpMethod || "",
    errMsg: errorLogData.errMsg || "",
    errStack: errorLogData.errStack || "",
    createDate: errorLogData.createDate
      ? errorLogData.createDate.replace("T", " ")
      : "",
  };
};
