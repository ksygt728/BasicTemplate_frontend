/**
 * @파일명 : MailTransformer.ts
 * @설명 : 메일 관리 도메인의 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

/**
 * @interface MailMasterRow
 * @description 메일 마스터 테이블 Row 타입
 */
export interface MailMasterRow {
  id: string;
  mailId: string;
  langType: string;
  mailName: string;
  title: string;
  content: string;
  description: string;
}

/**
 * @interface MailHistoryRow
 * @description 메일 이력 테이블 Row 타입
 */
export interface MailHistoryRow {
  id: string;
  logId: string;
  mailId: string;
  fromAddr: string;
  toAddr: string;
  title: string;
  content: string;
  success: string;
  errorMsg: string;
}

// ============================================================================
// 메일 마스터 데이터 변환
// ============================================================================

/**
 * @function transformMailMasterData
 * @description API 응답 데이터를 메일 마스터 테이블 Row로 변환
 * @param {any} apiData - API 응답 데이터
 * @returns {MailMasterRow[]} 변환된 메일 마스터 테이블 Row 배열
 */
export const transformMailMasterData = (apiData: any): MailMasterRow[] => {
  // 백엔드 응답: { data: { data: { content: [...] } } }
  const actualData = apiData?.data?.data || apiData?.data || apiData;

  if (!actualData?.content || !Array.isArray(actualData.content)) {
    return [];
  }

  return actualData.content.map((item: any) => ({
    id: item.mailId,
    mailId: item.mailId,
    langType: item.langType,
    mailName: item.mailName,
    title: item.title,
    content: item.content,
    description: item.description,
  }));
};

// ============================================================================
// 메일 이력 데이터 변환
// ============================================================================

/**
 * @function transformMailHistoryData
 * @description API 응답 데이터를 메일 이력 테이블 Row로 변환
 * @param {any} apiData - API 응답 데이터
 * @returns {MailHistoryRow[]} 변환된 메일 이력 테이블 Row 배열
 */
export const transformMailHistoryData = (apiData: any): MailHistoryRow[] => {
  // 백엔드 응답: { data: { data: { content: [...] } } }
  const actualData = apiData?.data?.data || apiData?.data || apiData;

  if (!actualData?.content || !Array.isArray(actualData.content)) {
    return [];
  }

  return actualData.content.map((item: any) => ({
    id: item.logId,
    logId: item.logId,
    mailId: item.mailId,
    fromAddr: item.fromAddr,
    toAddr: item.toAddr,
    title: item.title,
    content: item.content,
    success: item.success,
    errorMsg: item.errorMsg || "",
  }));
};
