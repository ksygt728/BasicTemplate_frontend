/**
 * 공통 코드 상세 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ComCodeDResDto {
  /** 상세코드 */
  dtlCd: string;

  /** 상세코드명 */
  dtlNm: string;

  /** 사용여부 (Y,N) */
  useYn: string;

  /** 정렬순서 */
  orderNum: number;
}
