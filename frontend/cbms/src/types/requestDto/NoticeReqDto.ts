/**
 * 공지사항 관리를 위한 요청 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface NoticeReqDto {
  /** 공지아이디 */
  notId: string;

  /** 공지타입 (공지, 매뉴얼) */
  notType: string;

  /** 제목 */
  title: string;

  /** 내용 */
  content: string;

  /** 작성자 */
  writor: string;

  /** 작성일 (시스템에서 자동 처리) */
  writeDate?: string;
}
