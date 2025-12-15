/**
 * @파일명 : MulLangTransformer.ts
 * @설명 : 다국어 관리 도메인의 UI 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

/**
 * @interface MulLangRow
 * @description 다국어 테이블 Row 타입
 */
export interface MulLangRow {
  id: string;
  langCd: string;
  langType: string;
  langNm: string;
  langGubun: string;
  useYn: string;
}

// ============================================================================
// API Response → 테이블 데이터 변환
// ============================================================================

/**
 * @function transformMulLangData
 * @description API 응답 데이터를 다국어 테이블 데이터로 변환
 * @param {any} mulLangData - API 응답 데이터
 * @returns {MulLangRow[]} 다국어 테이블 데이터 배열
 */
export const transformMulLangData = (mulLangData: any): MulLangRow[] => {
  if (!mulLangData?.content) return [];

  return mulLangData.content.map((item: any) => ({
    id: `${item.langType || ""}|${item.langGubun || ""}.${item.langCd || ""}`, // DB 복합키 조합: [언어유형]|[언어구분].[언어코드]
    langCd: item.langCd || "",
    langType: item.langType || "",
    langNm: item.langNm || "",
    langGubun: item.langGubun || "",
    useYn: item.useYn || "Y",
  }));
};
