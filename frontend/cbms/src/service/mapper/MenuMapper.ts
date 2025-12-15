import { MenuReqDto } from "@/types/requestDto/MenuReqDto";

/**
 * @파일명 : MenuMapper.ts
 * @설명 : 메뉴 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

// ============================================================================
// 폼 데이터 → DTO 변환
// ============================================================================

/**
 * @function toMenuReqDto
 * @description 메뉴 폼 데이터를 MenuReqDto로 변환
 * @param {Record<string, any>} formData - 폼 데이터
 * @returns {MenuReqDto} 변환된 메뉴 DTO
 */
export const toMenuReqDto = (formData: Record<string, any>): MenuReqDto => {
  return {
    menuCd: formData.menuCd?.trim() || undefined,
    menuNm: formData.menuNm?.trim() || "",
    upperMenu: formData.upperMenu?.trim() || "",
    menuLv: Number(formData.menuLv) || 0,
    useYn: formData.useYn?.trim() || "Y",
    menuUrl: formData.menuUrl?.trim() || undefined,
    orderNum: Number(formData.orderNum) || 0,
  };
};

/**
 * @function toMenuSearchReqDto
 * @description 검색 폼 데이터를 MenuReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {MenuReqDto} 변환된 검색 DTO
 */
export const toMenuSearchReqDto = (
  searchData: Record<string, any>
): MenuReqDto => {
  return {
    menuNm: searchData.menuNm?.trim() || "",
    upperMenu: searchData.upperMenu?.trim() || "",
    menuLv: searchData.menuLv ? Number(searchData.menuLv) : 0,
    useYn: searchData.useYn?.trim() || "Y",
    orderNum: 0,
  };
};
