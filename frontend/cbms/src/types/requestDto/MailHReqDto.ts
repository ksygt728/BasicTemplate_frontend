/**
 * 메일 이력 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface MailHReqDto {
  /** 로그아이디 */
  logId: string;

  /** 메일아이디 */
  mailId?: string;

  /** 발신자 */
  fromAddr?: string;

  /** 수신자 */
  toAddr?: string;

  /** 제목 */
  title?: string;

  /** 내용 */
  content?: string;

  /** 성공여부 (Y, N, W) */
  success?: string;

  /** 실패사유 */
  errorMsg?: string;
}
