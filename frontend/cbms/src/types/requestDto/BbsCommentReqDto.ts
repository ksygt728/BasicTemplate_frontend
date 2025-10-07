/**
 * 게시판 댓글 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface BbsCommentReqDto {
  /** 댓글아이디 */
  commentId?: string;

  /** 게시판아이디 */
  bbsId: string;

  /** 댓글 내용 */
  commentContent: string;

  /** 작성자 */
  writor?: string;
}
