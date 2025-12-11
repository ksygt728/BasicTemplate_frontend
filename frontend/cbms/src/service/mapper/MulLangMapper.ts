import { MulLangReqDto } from "@/types/requestDto/MulLangReqDto";

/**
 * @파일명 : MulLangMapper.ts
 * @설명 : 다국어 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 → DTO 변환
// ============================================================================

/**
 * @function toMulLangSearchReqDto
 * @description SearchForm 데이터를 MulLangReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {Partial<MulLangReqDto>} 변환된 검색 DTO
 */
export const toMulLangSearchReqDto = (
  searchData: Record<string, any>
): Partial<MulLangReqDto> => {
  const searchForm: Partial<MulLangReqDto> = {};

  // 언어 코드
  if (searchData.langCd && searchData.langCd.trim() !== "") {
    searchForm.langCd = searchData.langCd.trim();
  }

  // 언어 유형
  if (searchData.langType && searchData.langType.trim() !== "") {
    searchForm.langType = searchData.langType.trim();
  }

  // 언어명
  if (searchData.langNm && searchData.langNm.trim() !== "") {
    searchForm.langNm = searchData.langNm.trim();
  }

  // 언어 구분
  if (searchData.langGubun && searchData.langGubun.trim() !== "") {
    searchForm.langGubun = searchData.langGubun.trim();
  }

  // 사용 여부
  if (searchData.useYn && searchData.useYn.trim() !== "") {
    searchForm.useYn = searchData.useYn.trim();
  }

  return searchForm;
};

// ============================================================================
// 테이블 Row → DTO 변환
// ============================================================================

/**
 * @function toMulLangReqDto
 * @description 테이블 행 데이터를 MulLangReqDto로 변환
 * @param {any} rowData - 테이블 행 데이터
 * @returns {MulLangReqDto} 변환된 다국어 DTO
 */
export const toMulLangReqDto = (rowData: any): MulLangReqDto => {
  return {
    langCd: rowData.langCd?.trim() || "",
    langType: rowData.langType?.trim() || "",
    langNm: rowData.langNm?.trim() || "",
    langGubun: rowData.langGubun?.trim() || "",
    useYn: rowData.useYn?.trim() || "Y",
  };
};
