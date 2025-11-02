/**
 * SMS 이력 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface SmsHReqDto {
  /** 로그아이디 */
  logId: string;

  /** SMS아이디 */
  smsId?: string;

  /** 발신자 */
  fromPhone?: string;

  /** 수신자 */
  toPhone?: string;

  /** 내용 */
  text?: string;

  /** 성공여부 (Y,N) */
  success?: string;

  /** 실패사유 */
  errorMsg?: string;
}
