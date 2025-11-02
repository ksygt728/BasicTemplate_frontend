/**
 * 공통코드 유형 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ComCodeTReqDto {
  /** 그룹코드 */
  grpCd: string;

  /** 속성코드 */
  attrCd: string;

  /** 속성명 */
  attrNm: string;

  /** 정렬순서 */
  orderNum: number;
}
