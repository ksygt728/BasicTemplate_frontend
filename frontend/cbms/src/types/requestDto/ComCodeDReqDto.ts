/**
 * 공통코드 상세 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ComCodeDReqDto {
  /** 그룹코드 */
  grpCd: string;

  /** 속성코드 */
  attrCd: string;

  /** 상세코드 */
  dtlCd: string;

  /** 상세코드명 */
  dtlNm: string;

  /** 사용여부 (Y,N) */
  useYn: string;

  /** 정렬순서 */
  orderNum: number;
}
