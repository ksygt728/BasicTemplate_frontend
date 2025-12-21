import { useState, useMemo, useCallback } from "react";
import { useBbsApi } from "@/hooks/admin/useBbsApi";
import {
  toBbsSearchReqDto,
  toBbsReqDto,
  toCommentSearchReqDto,
  toCommentReqDto,
} from "@/service/mapper/BbsMapper";
import {
  transformBbsListData,
  transformBbsDetailData,
  transformCommentListData,
  BbsTableRow,
  CommentTableRow,
} from "@/service/transformer/BbsTransformer";

/**
 * @파일명 : BbsService.ts
 * @설명 : 게시판 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface SearchFormData
 * @description 검색 폼 데이터 타입
 */
export interface SearchFormData {
  bbsType?: string;
  title?: string;
  content?: string;
  [key: string]: any;
}

/**
 * @interface UseBbsServiceReturn
 * @description 게시판 서비스 훅의 반환 타입
 */
interface UseBbsServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedBbsId: string | null;
  searchFormData: SearchFormData;

  // 원본 데이터
  bbsData: any;
  selectedBbsData: any;
  commentData: any;

  // 테이블 데이터
  bbsListData: BbsTableRow[];
  bbsDetailData: Record<string, any>;
  commentListData: CommentTableRow[];

  // 상태 변경 함수
  setSelectedBbsId: (bbsId: string | null) => void;
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleTableRowClick: (row: BbsTableRow) => Promise<void>;
  refetch: () => Promise<any>;

  // 게시판 CRUD
  handleInsertBbs: (formData: Record<string, any>) => Promise<any>;
  handleUpdateBbs: (formData: Record<string, any>) => Promise<any>;
  handleDeleteBbs: (bbsId: string) => Promise<any>;

  // 댓글 CRUD
  handleFetchComments: (bbsId: string) => Promise<void>;
  handleInsertComment: (formData: Record<string, any>) => Promise<any>;
  handleUpdateComment: (formData: Record<string, any>) => Promise<any>;
  handleDeleteComment: (commentId: string) => Promise<any>;
}

/**
 * @hook useBbsService
 * @description 게시판 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseBbsServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useBbsService = (): UseBbsServiceReturn => {
  const {
    bbsData,
    selectedBbsData,
    commentData,
    loading,
    error,
    fetchBbsData,
    fetchBbsDetail,
    insertBbs,
    updateBbs,
    deleteBbs,
    fetchCommentData,
    insertComment,
    updateComment,
    deleteComment,
    refetch: apiRefetch,
  } = useBbsApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [selectedBbsId, setSelectedBbsId] = useState<string | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  // ============================================================================
  // 데이터 변환 (useMemo로 최적화)
  // ============================================================================

  const bbsListData = useMemo(() => transformBbsListData(bbsData), [bbsData]);

  const bbsDetailData = useMemo(
    () => transformBbsDetailData(selectedBbsData),
    [selectedBbsData]
  );

  const commentListData = useMemo(
    () => transformCommentListData(commentData),
    [commentData]
  );

  // ============================================================================
  // 비즈니스 로직 함수
  // ============================================================================

  /**
   * @function handleSearch
   * @description 검색 조건에 따라 게시판 목록 조회
   * @param {SearchFormData} searchData - 검색 폼 데이터
   */
  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      const searchDto = toBbsSearchReqDto(searchData);
      await fetchBbsData(searchDto, {
        page: 0,
        size: 100,
        sort: "writeDate",
        direction: "DESC",
      });
      setSearchFormData(searchData);
    },
    [fetchBbsData]
  );

  /**
   * @function handleTableRowClick
   * @description 테이블 row 클릭 시 상세정보 조회
   * @param {BbsTableRow} row - 클릭된 테이블 행
   */
  const handleTableRowClick = useCallback(
    async (row: BbsTableRow) => {
      setSelectedBbsId(row.bbsId);
      await fetchBbsDetail(row.bbsId);
      await handleFetchComments(row.bbsId);
    },
    [fetchBbsDetail]
  );

  /**
   * @function refetch
   * @description 현재 검색 조건으로 데이터 재조회
   */
  const refetch = useCallback(async () => {
    const searchDto = toBbsSearchReqDto(searchFormData);
    return fetchBbsData(searchDto, {
      page: 0,
      size: 100,
      sort: "writeDate",
      direction: "DESC",
    });
  }, [searchFormData, fetchBbsData]);

  // ============================================================================
  // 게시판 CRUD 함수
  // ============================================================================

  /**
   * @function handleInsertBbs
   * @description 게시판 추가
   * @param {Record<string, any>} formData - 게시판 폼 데이터
   */
  const handleInsertBbs = useCallback(
    async (formData: Record<string, any>) => {
      const bbsDto = toBbsReqDto(formData);
      const result = await insertBbs(bbsDto);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [insertBbs, refetch]
  );

  /**
   * @function handleUpdateBbs
   * @description 게시판 수정
   * @param {Record<string, any>} formData - 게시판 폼 데이터
   */
  const handleUpdateBbs = useCallback(
    async (formData: Record<string, any>) => {
      const bbsDto = toBbsReqDto(formData);
      const result = await updateBbs(bbsDto);
      if (result?.success) {
        await refetch();
        if (selectedBbsId) {
          await fetchBbsDetail(selectedBbsId);
        }
      }
      return result;
    },
    [updateBbs, refetch, selectedBbsId, fetchBbsDetail]
  );

  /**
   * @function handleDeleteBbs
   * @description 게시판 삭제
   * @param {string} bbsId - 게시판 아이디
   */
  const handleDeleteBbs = useCallback(
    async (bbsId: string) => {
      const result = await deleteBbs(bbsId);
      if (result?.success) {
        setSelectedBbsId(null);
        await refetch();
      }
      return result;
    },
    [deleteBbs, refetch]
  );

  // ============================================================================
  // 댓글 CRUD 함수
  // ============================================================================

  /**
   * @function handleFetchComments
   * @description 특정 게시판의 댓글 목록 조회
   * @param {string} bbsId - 게시판 아이디
   */
  const handleFetchComments = useCallback(
    async (bbsId: string) => {
      const searchDto = toCommentSearchReqDto({ bbsId });
      await fetchCommentData(searchDto);
    },
    [fetchCommentData]
  );

  /**
   * @function handleInsertComment
   * @description 댓글 추가
   * @param {Record<string, any>} formData - 댓글 폼 데이터
   */
  const handleInsertComment = useCallback(
    async (formData: Record<string, any>) => {
      const commentDto = toCommentReqDto(formData);
      const result = await insertComment(commentDto);
      if (result?.success && formData.bbsId) {
        await handleFetchComments(formData.bbsId);
      }
      return result;
    },
    [insertComment, handleFetchComments]
  );

  /**
   * @function handleUpdateComment
   * @description 댓글 수정
   * @param {Record<string, any>} formData - 댓글 폼 데이터
   */
  const handleUpdateComment = useCallback(
    async (formData: Record<string, any>) => {
      const commentDto = toCommentReqDto(formData);
      const result = await updateComment(commentDto);
      if (result?.success && formData.bbsId) {
        await handleFetchComments(formData.bbsId);
      }
      return result;
    },
    [updateComment, handleFetchComments]
  );

  /**
   * @function handleDeleteComment
   * @description 댓글 삭제
   * @param {string} commentId - 댓글 아이디
   */
  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      const result = await deleteComment(commentId);
      if (result?.success && selectedBbsId) {
        await handleFetchComments(selectedBbsId);
      }
      return result;
    },
    [deleteComment, selectedBbsId, handleFetchComments]
  );

  return {
    // 상태
    loading,
    error,
    selectedBbsId,
    searchFormData,

    // 원본 데이터
    bbsData,
    selectedBbsData,
    commentData,

    // 테이블 데이터
    bbsListData,
    bbsDetailData,
    commentListData,

    // 상태 변경
    setSelectedBbsId,
    setSearchFormData,

    // 비즈니스 로직
    handleSearch,
    handleTableRowClick,
    refetch,

    // 게시판 CRUD
    handleInsertBbs,
    handleUpdateBbs,
    handleDeleteBbs,

    // 댓글 CRUD
    handleFetchComments,
    handleInsertComment,
    handleUpdateComment,
    handleDeleteComment,
  };
};
