/**
 * SMS 이력 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface SmsHResDto {
  /** 사용자이력ID */
  logId: string;

  /** SMS아이디 */
  smsId: string;

  /** 발신자 */
  fromPhone: string;

  /** 수신자 */
  toPhone: string;

  /** 내용 */
  text: string;

  /** 성공여부 */
  success: string;

  /** 실패사유 */
  errorMsg: string;
}
