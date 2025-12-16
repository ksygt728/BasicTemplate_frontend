import { MailMReqDto } from "@/types/requestDto/MailMReqDto";

/**
 * @파일명 : MailMapper.ts
 * @설명 : 메일 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 → DTO 변환
// ============================================================================

/**
 * @function toMailSearchReqDto
 * @description SearchForm 데이터를 MailMReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {MailMReqDto} 변환된 검색 DTO
 */
export const toMailSearchReqDto = (
  searchData: Record<string, any>
): Partial<MailMReqDto> => {
  const searchForm: Partial<MailMReqDto> = {};

  // 메일아이디
  if (searchData.mailId && searchData.mailId.trim() !== "") {
    searchForm.mailId = searchData.mailId;
  }

  // 언어타입
  if (searchData.langType && searchData.langType.trim() !== "") {
    searchForm.langType = searchData.langType;
  }

  // 메일명
  if (searchData.mailName && searchData.mailName.trim() !== "") {
    searchForm.mailName = searchData.mailName;
  }

  // 제목
  if (searchData.title && searchData.title.trim() !== "") {
    searchForm.title = searchData.title;
  }

  return searchForm;
};

// ============================================================================
// 테이블 Row → DTO 변환
// ============================================================================

/**
 * @function toMailMReqDto
 * @description 메일 테이블 행 데이터를 MailMReqDto로 변환
 * @param {any} rowData - 테이블 행 데이터
 * @returns {MailMReqDto} 변환된 메일 DTO
 */
export const toMailMReqDto = (rowData: any): MailMReqDto => {
  return {
    mailId: rowData.mailId,
    langType: rowData.langType || "KO",
    mailName: rowData.mailName || "",
    title: rowData.title || "",
    content: rowData.content || "",
    description: rowData.description || "",
  };
};
