import type { BbsResDto } from "@/types/responseDto/BbsResDto";
import type { UserResDto } from "@/types/responseDto/UserResDto";

/**
 * 게시판 댓글 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface BbsCommentResDto {
  /** 댓글아이디 */
  commentId: string;

  /** 게시판 정보 */
  bbs: BbsResDto;

  /** 댓글 내용 */
  commentContent: string;

  /** 작성자 */
  writor: UserResDto;

  /** 작성일 (yyyy-MM-dd HH:mm:ss) */
  writeDate: string;
}
