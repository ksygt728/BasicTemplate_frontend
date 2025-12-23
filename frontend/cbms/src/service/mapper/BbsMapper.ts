import { BbsReqDto } from "@/types/requestDto/BbsReqDto";
import { BbsCommentReqDto } from "@/types/requestDto/BbsCommentReqDto";

/**
 * @파일명 : BbsMapper.ts
 * @설명 : 게시판 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 → DTO 변환 (게시판)
// ============================================================================

/**
 * @function toBbsSearchReqDto
 * @description SearchForm 데이터를 BbsReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {Partial<BbsReqDto>} 변환된 검색 DTO
 */
export const toBbsSearchReqDto = (
  searchData: Record<string, any>
): Partial<BbsReqDto> => {
  const searchForm: Partial<BbsReqDto> = {};

  // 게시판 타입
  if (searchData.bbsType && searchData.bbsType.trim() !== "") {
    searchForm.bbsType = searchData.bbsType;
  }

  // 제목
  if (searchData.title && searchData.title.trim() !== "") {
    searchForm.title = searchData.title;
  }

  // 내용
  if (searchData.content && searchData.content.trim() !== "") {
    searchForm.content = searchData.content;
  }

  return searchForm;
};

// ============================================================================
// 폼 데이터 → DTO 변환 (게시판)
// ============================================================================

/**
 * @function toBbsReqDto
 * @description 게시판 폼 데이터를 BbsReqDto로 변환
 * @param {any} formData - 폼 데이터
 * @returns {BbsReqDto} 변환된 게시판 DTO
 */
export const toBbsReqDto = (formData: any): BbsReqDto => {
  const dto: BbsReqDto = {
    bbsType: formData.bbsType,
    title: formData.title,
    content: formData.content,
    writor: formData.writor || formData.writorId, // writor 또는 writorId 사용
  };

  // bbsId가 존재하고 빈 문자열이 아닐 때만 포함 (신규 등록 시 제외)
  if (formData.bbsId && formData.bbsId !== "") {
    dto.bbsId = formData.bbsId;
  }

  return dto;
};

// ============================================================================
// 검색 폼 → DTO 변환 (댓글)
// ============================================================================

/**
 * @function toCommentSearchReqDto
 * @description SearchForm 데이터를 BbsCommentReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {Partial<BbsCommentReqDto>} 변환된 검색 DTO
 */
export const toCommentSearchReqDto = (
  searchData: Record<string, any>
): Partial<BbsCommentReqDto> => {
  const searchForm: Partial<BbsCommentReqDto> = {};

  // 게시판 아이디
  if (searchData.bbsId && searchData.bbsId.trim() !== "") {
    searchForm.bbsId = searchData.bbsId;
  }

  return searchForm;
};

// ============================================================================
// 폼 데이터 → DTO 변환 (댓글)
// ============================================================================

/**
 * @function toCommentReqDto
 * @description 댓글 폼 데이터를 BbsCommentReqDto로 변환
 * @param {any} formData - 폼 데이터
 * @returns {BbsCommentReqDto} 변환된 댓글 DTO
 */
export const toCommentReqDto = (formData: any): BbsCommentReqDto => {
  const dto: BbsCommentReqDto = {
    bbsId: formData.bbsId,
    commentContent: formData.commentContent,
    writor: formData.writor || formData.writorId,
  };

  // commentId가 존재하고 빈 문자열이 아닐 때만 포함 (신규 등록 시 제외)
  if (formData.commentId && formData.commentId !== "") {
    dto.commentId = formData.commentId;
  }

  return dto;
};
