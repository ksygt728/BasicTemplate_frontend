/**
 * 메일 마스터 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface MailMResDto {
  /** 메일아이디 */
  mailId: string;

  /** 언어타입 */
  langType: string;

  /** 메일명 */
  mailName: string;

  /** 제목 */
  title: string;

  /** 내용 */
  content: string;

  /** 설명 */
  description: string;
}
