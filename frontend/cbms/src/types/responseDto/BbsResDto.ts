import type { UserResDto } from "@/types/responseDto/UserResDto";

/**
 * 게시판 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface BbsResDto {
  /** 게시판아이디 */
  bbsId: string;

  /** 게시판타입 */
  bbsType: string;

  /** 제목 */
  title: string;

  /** 내용 */
  content: string;

  /** 작성자 */
  writor: UserResDto;

  /** 작성일 (yyyy-MM-dd HH:mm:ss) */
  writeDate: string;
}
