import { LogApiReqDto } from "@/types/requestDto/LogApiReqDto";

/**
 * @파일명 : LogApiMapper.ts
 * @설명 : 로그 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 → DTO 변환
// ============================================================================

/**
 * @function toLogSearchReqDto
 * @description SearchForm 데이터를 LogApiReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {LogApiReqDto} 변환된 검색 DTO
 */
export const toLogSearchReqDto = (
  searchData: Record<string, any>
): Partial<LogApiReqDto> => {
  const searchForm: Partial<LogApiReqDto> = {};

  // 로그 아이디
  if (searchData.logId && searchData.logId.trim() !== "") {
    searchForm.logId = searchData.logId;
  }

  // 사용자 아이디
  if (searchData.userId && searchData.userId.trim() !== "") {
    searchForm.userId = searchData.userId;
  }

  // 요청 URI
  if (searchData.requestUri && searchData.requestUri.trim() !== "") {
    searchForm.requestUri = searchData.requestUri;
  }

  // HTTP 메소드
  if (searchData.httpMethod && searchData.httpMethod.trim() !== "") {
    searchForm.httpMethod = searchData.httpMethod;
  }

  // 시작일자 범위 (startDateRange를 "from~to" 형식으로 전달)
  if (searchData.startDateRange && searchData.startDateRange.trim() !== "") {
    searchForm.startDate = searchData.startDateRange;
  }

  // 종료일자 범위 (endDateRange를 "from~to" 형식으로 전달)
  if (searchData.endDateRange && searchData.endDateRange.trim() !== "") {
    searchForm.endDate = searchData.endDateRange;
  }

  // IP 주소
  if (searchData.ipAddr && searchData.ipAddr.trim() !== "") {
    searchForm.ipAddr = searchData.ipAddr;
  }

  return searchForm;
};
