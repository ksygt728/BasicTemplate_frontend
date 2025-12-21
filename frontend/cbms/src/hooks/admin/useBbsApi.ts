import { useState, useCallback } from "react";
import { BbsApi } from "@/api/admin/bbsApi";
import { BbsReqDto } from "@/types/requestDto/BbsReqDto";
import { BbsResDto } from "@/types/responseDto/BbsResDto";
import { BbsCommentReqDto } from "@/types/requestDto/BbsCommentReqDto";
import { BbsCommentResDto } from "@/types/responseDto/BbsCommentResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * @파일명 : useBbsApi.ts
 * @설명 : 게시판 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

/**
 * API 응답 인터페이스 - 게시판
 * @interface BbsApiResponse
 * @property {BbsResDto[]} content - 게시판 데이터 배열
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 */
interface BbsApiResponse {
  content: BbsResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * API 응답 인터페이스 - 댓글
 * @interface BbsCommentApiResponse
 */
interface BbsCommentApiResponse {
  content: BbsCommentResDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * 게시판 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 게시판 관리에 필요한 상태와 함수들을 반환
 * @returns {BbsApiResponse | null} bbsData - 전체 게시판 데이터
 * @returns {BbsResDto | null} selectedBbsData - 선택된 게시판 상세 데이터
 * @returns {BbsCommentApiResponse | null} commentData - 댓글 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchBbsData - 게시판 검색 함수
 * @returns {Function} fetchBbsDetail - 게시판 상세 조회 함수
 * @returns {Function} insertBbs - 게시판 추가 함수
 * @returns {Function} updateBbs - 게시판 수정 함수
 * @returns {Function} deleteBbs - 게시판 삭제 함수
 * @returns {Function} fetchCommentData - 댓글 검색 함수
 * @returns {Function} insertComment - 댓글 추가 함수
 * @returns {Function} updateComment - 댓글 수정 함수
 * @returns {Function} deleteComment - 댓글 삭제 함수
 * @returns {Function} refetch - 데이터 새로고침 함수
 */
export const useBbsApi = () => {
  const [bbsData, setBbsData] = useState<BbsApiResponse | null>(null);
  const [selectedBbsData, setSelectedBbsData] = useState<BbsResDto | null>(
    null
  );
  const [commentData, setCommentData] = useState<BbsCommentApiResponse | null>(
    null
  );

  const bbsApi = BbsApi.getInstance();
  const { loading, error, handleApiCall } = useCommonApi();

  /**
   * @기능 게시판 검색 함수
   * @REQ_ID REQ_ADM_081
   * @param {BbsReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 게시판 검색 결과
   */
  const fetchBbsData = useCallback(
    async (
      searchForm: Partial<BbsReqDto> = {},
      pageable: Pageable = {
        page: 0,
        size: 100,
        sort: "writeDate",
        direction: "DESC",
      }
    ) => {
      return handleApiCall(
        () => bbsApi.findAllBbsForAdmin(searchForm as BbsReqDto, pageable),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setBbsData(dataMap.data);
            } else {
              setBbsData(dataMap);
            }
          }
        }
      );
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 게시판 상세 조회 함수
   * @REQ_ID REQ_ADM_081_2
   * @param {string} bbsId - 조회할 게시판 아이디
   * @returns {Promise} 게시판 상세 조회 결과
   */
  const fetchBbsDetail = useCallback(
    async (bbsId: string) => {
      return handleApiCall(
        () => bbsApi.findByBbsForAdmin(bbsId),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setSelectedBbsData(dataMap.data);
            } else {
              setSelectedBbsData(dataMap);
            }
          }
        }
      );
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 게시판 추가 함수
   * @REQ_ID REQ_ADM_083
   * @param {BbsReqDto} bbs - 게시판 정보 DTO
   * @returns {Promise} 게시판 추가 결과
   */
  const insertBbs = useCallback(
    async (bbs: BbsReqDto) => {
      return handleApiCall(() => bbsApi.insertBbsForAdmin(bbs));
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 게시판 수정 함수
   * @REQ_ID REQ_ADM_084
   * @param {BbsReqDto} bbs - 게시판 정보 DTO
   * @returns {Promise} 게시판 수정 결과
   */
  const updateBbs = useCallback(
    async (bbs: BbsReqDto) => {
      return handleApiCall(() => bbsApi.updateBbsForAdmin(bbs));
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 게시판 삭제 함수
   * @REQ_ID REQ_ADM_085
   * @param {string} bbsId - 삭제할 게시판 아이디
   * @returns {Promise} 게시판 삭제 결과
   */
  const deleteBbs = useCallback(
    async (bbsId: string) => {
      return handleApiCall(() => bbsApi.deleteBbsForAdmin(bbsId));
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 댓글 검색 함수
   * @param {BbsCommentReqDto} [searchForm={}] - 검색 조건 DTO
   * @param {Pageable} [pageable] - 페이지 정보
   * @returns {Promise} 댓글 검색 결과
   */
  const fetchCommentData = useCallback(
    async (
      searchForm: Partial<BbsCommentReqDto> = {},
      pageable: Pageable = {
        page: 0,
        size: 100,
      }
    ) => {
      return handleApiCall(
        () =>
          bbsApi.findAllBbsCommentForAdmin(
            searchForm as BbsCommentReqDto,
            pageable
          ),
        (response) => {
          if (response.success && response.data) {
            const dataMap = response.data as any;
            if (dataMap.data) {
              setCommentData(dataMap.data);
            } else {
              setCommentData(dataMap);
            }
          }
        }
      );
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 댓글 추가 함수
   * @param {BbsCommentReqDto} comment - 댓글 정보 DTO
   * @returns {Promise} 댓글 추가 결과
   */
  const insertComment = useCallback(
    async (comment: BbsCommentReqDto) => {
      return handleApiCall(() => bbsApi.insertBbsCommentForAdmin(comment));
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 댓글 수정 함수
   * @param {BbsCommentReqDto} comment - 댓글 정보 DTO
   * @returns {Promise} 댓글 수정 결과
   */
  const updateComment = useCallback(
    async (comment: BbsCommentReqDto) => {
      return handleApiCall(() => bbsApi.updateBbsCommentForAdmin(comment));
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 댓글 삭제 함수
   * @param {string} commentId - 삭제할 댓글 아이디
   * @returns {Promise} 댓글 삭제 결과
   */
  const deleteComment = useCallback(
    async (commentId: string) => {
      return handleApiCall(() => bbsApi.deleteBbsCommentForAdmin(commentId));
    },
    [bbsApi, handleApiCall]
  );

  /**
   * @기능 데이터 새로고침 (fetchBbsData 별칭)
   */
  const refetch = useCallback(() => {
    return fetchBbsData();
  }, [fetchBbsData]);

  return {
    // 상태
    bbsData,
    selectedBbsData,
    commentData,
    loading,
    error,

    // 게시판 CRUD
    fetchBbsData,
    fetchBbsDetail,
    insertBbs,
    updateBbs,
    deleteBbs,

    // 댓글 CRUD
    fetchCommentData,
    insertComment,
    updateComment,
    deleteComment,

    // 유틸리티
    refetch,
  };
};
