/**
 * 채번 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ChaebunReqDto {
  /** 채번아이디 */
  seqId: string;

  /** 채번명 */
  seqName: string;

  /** 채번패턴 */
  pattern: string;

  /** 채번고유번호 */
  prefix: string;

  /** 증가량 */
  step: number;

  /** 채번길이 */
  length: number;

  /** 데이터포맷 */
  dateformat?: string;
}
