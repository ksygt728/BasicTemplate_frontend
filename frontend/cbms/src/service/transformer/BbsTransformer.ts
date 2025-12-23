import { BbsResDto } from "@/types/responseDto/BbsResDto";
import { BbsCommentResDto } from "@/types/responseDto/BbsCommentResDto";

/**
 * @파일명 : BbsTransformer.ts
 * @설명 : 게시판 관리 도메인의 UI 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface BbsTableRow
 * @description 게시판 테이블 Row 타입
 */
export interface BbsTableRow {
  id: string;
  bbsId: string;
  bbsType: string;
  title: string;
  content: string;
  writorId: string;
  writorName: string;
  writeDate: string;
}

/**
 * @interface CommentTableRow
 * @description 댓글 테이블 Row 타입
 */
export interface CommentTableRow {
  id: string;
  commentId: string;
  bbsId: string;
  content: string;
  writorId: string;
  writorName: string;
  writeDate: string;
}

// ============================================================================
// API Response → 테이블 데이터 변환 (게시판)
// ============================================================================

/**
 * @function transformBbsListData
 * @description API 응답 데이터를 게시판 테이블 데이터로 변환
 * @param {any} bbsData - API 응답 데이터
 * @returns {BbsTableRow[]} 게시판 테이블 데이터 배열
 */
export const transformBbsListData = (bbsData: any): BbsTableRow[] => {
  if (!bbsData?.content) return [];

  return bbsData.content.map((bbs: BbsResDto) => ({
    id: bbs.bbsId,
    bbsId: bbs.bbsId,
    bbsType: bbs.bbsType,
    title: bbs.title,
    content: bbs.content,
    writorId: bbs.writor?.userId || "",
    writorName: bbs.writor?.name || "",
    writeDate: bbs.writeDate,
  }));
};

/**
 * @function transformBbsDetailData
 * @description API 응답 데이터를 게시판 상세 폼 데이터로 변환
 * @param {BbsResDto | null} bbsData - API 응답 게시판 데이터
 * @returns {Record<string, any>} 게시판 상세 폼 데이터
 */
export const transformBbsDetailData = (
  bbsData: BbsResDto | null
): Record<string, any> => {
  if (!bbsData) {
    return {
      bbsId: "",
      bbsType: "",
      title: "",
      content: "",
      writorId: "",
      writorName: "",
      writeDate: "",
    };
  }

  return {
    bbsId: bbsData.bbsId || "",
    bbsType: bbsData.bbsType || "",
    title: bbsData.title || "",
    content: bbsData.content || "",
    writorId: bbsData.writor?.userId || "",
    writorName: bbsData.writor?.name || "",
    writeDate: bbsData.writeDate || "",
  };
};

// ============================================================================
// API Response → 테이블 데이터 변환 (댓글)
// ============================================================================

/**
 * @function transformCommentListData
 * @description API 응답 데이터를 댓글 테이블 데이터로 변환
 * @param {any} commentData - API 응답 데이터
 * @returns {CommentTableRow[]} 댓글 테이블 데이터 배열
 */
export const transformCommentListData = (
  commentData: any
): CommentTableRow[] => {
  if (!commentData?.content) return [];

  return commentData.content.map((comment: BbsCommentResDto) => ({
    id: comment.commentId,
    commentId: comment.commentId,
    bbsId: comment.bbs?.bbsId || "",
    content: comment.commentContent || "",
    writorId: comment.writor?.userId || "",
    writorName: comment.writor?.name || "",
    writeDate: comment.writeDate || "",
  }));
};

/**
 * @function transformCommentDetailData
 * @description API 응답 데이터를 댓글 상세 폼 데이터로 변환
 * @param {BbsCommentResDto | null} commentData - API 응답 댓글 데이터
 * @returns {Record<string, any>} 댓글 상세 폼 데이터
 */
export const transformCommentDetailData = (
  commentData: BbsCommentResDto | null
): Record<string, any> => {
  if (!commentData) {
    return {
      commentId: "",
      bbsId: "",
      content: "",
      writorId: "",
      writorName: "",
      writeDate: "",
    };
  }

  return {
    commentId: commentData.commentId || "",
    bbsId: commentData.bbs?.bbsId || "",
    content: commentData.commentContent || "",
    writorId: commentData.writor?.userId || "",
    writorName: commentData.writor?.name || "",
    writeDate: commentData.writeDate || "",
  };
};
