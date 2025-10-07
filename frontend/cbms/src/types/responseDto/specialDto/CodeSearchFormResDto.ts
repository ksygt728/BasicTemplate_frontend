/**
 * 코드 검색 폼 응답 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface CodeSearchFormResDto {
  /** 그룹코드유형 */
  grpCdType: string;

  /** 그룹코드 */
  grpCd: string;

  /** 그룹코드명 */
  grpNm: string;

  /** 상세코드 */
  dtlCd: string;

  /** 속성코드 */
  attrCd: string;

  /** 상세코드명 */
  dtlNm: string;

  /** 속성명 */
  attrNm: string;

  /** 사용여부 (Y,N) */
  useYn: string;

  /** 정렬순서 */
  codeTOrderNum: number;

  /** 정렬순서 */
  codeDOrderNum: number;
}
