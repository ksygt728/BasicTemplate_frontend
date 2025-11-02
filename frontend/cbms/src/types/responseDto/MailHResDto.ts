/**
 * 메일 이력 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface MailHResDto {
  /** 사용자이력ID */
  logId: string;

  /** 메일아이디 */
  mailId: string;

  /** 발신자 */
  fromAddr: string;

  /** 수신자 */
  toAddr: string;

  /** 제목 */
  title: string;

  /** 내용 */
  content: string;

  /** 성공여부 */
  success: string;

  /** 실패사유 */
  errorMsg: string;
}
