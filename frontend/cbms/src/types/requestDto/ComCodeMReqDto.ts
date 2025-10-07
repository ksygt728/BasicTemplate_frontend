/**
 * 공통코드 마스터 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ComCodeMReqDto {
  /** 그룹코드 */
  grpCd: string;

  /** 그룹코드유형 */
  grpCdType: string;

  /** 그룹코드명 */
  grpNm: string;
}
