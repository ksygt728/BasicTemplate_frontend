import { ScheMReqDto } from "@/types/requestDto/ScheMReqDto";

/**
 * @파일명 : SchedulerMapper.ts
 * @설명 : 스케줄러 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 → DTO 변환
// ============================================================================

/**
 * @function toSchedulerSearchReqDto
 * @description SearchForm 데이터를 ScheMReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {Partial<ScheMReqDto>} 변환된 검색 DTO
 */
export const toSchedulerSearchReqDto = (
  searchData: Record<string, any>
): Partial<ScheMReqDto> => {
  const searchForm: Partial<ScheMReqDto> = {};

  // 스케줄아이디
  if (searchData.scheId && searchData.scheId.trim() !== "") {
    searchForm.scheId = searchData.scheId;
  }

  // 스케줄명
  if (searchData.scheName && searchData.scheName.trim() !== "") {
    searchForm.scheName = searchData.scheName;
  }

  // 스케줄러 그룹명
  if (searchData.scheGroup && searchData.scheGroup.trim() !== "") {
    searchForm.scheGroup = searchData.scheGroup;
  }

  // 사용여부
  if (searchData.useYn && searchData.useYn.trim() !== "") {
    searchForm.useYn = searchData.useYn;
  }

  return searchForm;
};

// ============================================================================
// 테이블 Row → DTO 변환
// ============================================================================

/**
 * @function toScheMReqDto
 * @description 스케줄러 테이블 행 데이터를 ScheMReqDto로 변환
 * @param {any} rowData - 테이블 행 데이터
 * @returns {ScheMReqDto} 변환된 스케줄러 DTO
 */
export const toScheMReqDto = (rowData: any): ScheMReqDto => {
  return {
    scheId: rowData.scheId,
    scheName: rowData.scheName || "",
    description: rowData.description || "",
    scheGroup: rowData.scheGroup || "",
    className: rowData.className || "",
    methodName: rowData.methodName || "",
    triggerName: rowData.triggerName || "",
    cronExp: rowData.cronExp || "",
    useYn: rowData.useYn || "N",
  };
};
