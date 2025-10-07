/**
 * 채번 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ChaebunResDto {
  /** 채번아이디 */
  seqId: string;

  /** 채번명 */
  seqName: string;

  /** 채번패턴 */
  pattern: string;

  /** 채번고유번호 */
  prefix: string;

  /** 현재 채번값 */
  currentValue: number;

  /** 증가량 */
  step: number;

  /** 채번길이 */
  length: number;

  /** 데이터포맷 */
  dateformat: string;
}
