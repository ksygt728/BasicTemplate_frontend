/**
 * 게시판 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface BbsReqDto {
  /** 게시판아이디 */
  bbsId?: string;

  /** 게시판타입 */
  bbsType: string;

  /** 제목 */
  title: string;

  /** 내용 */
  content: string;

  /** 작성자 */
  writor?: string;
}
