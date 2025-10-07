/**
 * 공지사항 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface NoticeResDto {
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

  /** 작성일 (yyyy-MM-dd HH:mm:ss) */
  writeDate: string;
}
