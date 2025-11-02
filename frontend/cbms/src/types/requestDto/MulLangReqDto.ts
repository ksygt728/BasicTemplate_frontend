/**
 * 다국어 처리를 위한 요청 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface MulLangReqDto {
  /** 언어코드 */
  langCd: string;

  /** 언어유형 */
  langType: string;

  /** 언어명 */
  langNm: string;

  /** 언어구분 */
  langGubun: string;

  /** 사용여부 (Y,N) */
  useYn: string;
}
