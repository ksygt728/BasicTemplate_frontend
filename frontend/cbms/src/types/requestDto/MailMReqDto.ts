/**
 * 메일 마스터 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface MailMReqDto {
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
  description?: string;
}
