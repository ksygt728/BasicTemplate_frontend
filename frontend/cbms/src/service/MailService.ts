import { useState, useMemo, useCallback } from "react";
import { useMailApi } from "@/hooks/admin/useMailApi";
import { toMailSearchReqDto, toMailMReqDto } from "@/service/mapper/MailMapper";
import {
  transformMailMasterData,
  transformMailHistoryData,
} from "@/service/transformer/MailTransformer";
import type {
  MailMasterRow,
  MailHistoryRow,
} from "@/service/transformer/MailTransformer";

/**
 * @파일명 : MailService.ts
 * @설명 : 메일 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface SearchFormData
 * @description 검색 폼 데이터 타입
 */
export interface SearchFormData {
  mailId?: string;
  langType?: string;
  mailName?: string;
  title?: string;
  [key: string]: any;
}

/**
 * @interface UseMailServiceReturn
 * @description 메일 서비스 훅의 반환 타입
 */
interface UseMailServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedMailId: string | null;
  searchFormData: SearchFormData;

  // 원본 데이터
  mailData: any;

  // 테이블 데이터
  leftTableData: MailMasterRow[];
  rightTableData: MailHistoryRow[];

  // 상태 변경 함수
  setSelectedMailId: (mailId: string | null) => void;
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleLeftTableRowClick: (row: MailMasterRow) => void;
  refetch: () => Promise<any>;

  // 메일 CRUD
  handleInsertMail: (rowData: MailMasterRow) => Promise<any>;
  handleUpdateMail: (
    id: string | number,
    rowData: MailMasterRow
  ) => Promise<any>;
  handleDeleteMail: (id: string | number) => Promise<any>;
  handleBulkDeleteMail: (selectedRows: MailMasterRow[]) => Promise<any>;
  handleSendMail: (mailId: string, recipients: string[]) => Promise<any>;
}

/**
 * @hook useMailService
 * @description 메일 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseMailServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useMailService = (): UseMailServiceReturn => {
  const {
    mailData,
    mailHistoryData,
    loading,
    error,
    fetchMailList,
    fetchMailHistory,
    insertMail,
    updateMail,
    deleteMail,
    sendMail,
    refetch,
  } = useMailApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  // ============================================================================
  // 데이터 변환 (Transformer 사용)
  // ============================================================================

  const leftTableData = useMemo(
    () => transformMailMasterData(mailData),
    [mailData]
  );

  const rightTableData = useMemo(
    () => transformMailHistoryData(mailHistoryData),
    [mailHistoryData]
  );

  // ============================================================================
  // 검색 처리
  // ============================================================================

  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      const searchForm = toMailSearchReqDto(searchData);
      await fetchMailList(searchForm as any);
    },
    [fetchMailList]
  );

  // ============================================================================
  // 이벤트 핸들러
  // ============================================================================

  const handleLeftTableRowClick = useCallback(
    (row: MailMasterRow) => {
      setSelectedMailId(row.mailId);
      // 메일 이력 조회
      fetchMailHistory(row.mailId);
    },
    [fetchMailHistory]
  );

  // ============================================================================
  // 메일 CRUD
  // ============================================================================

  const handleInsertMail = useCallback(
    async (rowData: MailMasterRow) => {
      const mailMReqDto = toMailMReqDto(rowData);
      const result = await insertMail(mailMReqDto);
      if (result) {
        await refetch();
      }
      return { success: result };
    },
    [insertMail, refetch]
  );

  const handleUpdateMail = useCallback(
    async (id: string | number, rowData: MailMasterRow) => {
      const mailMReqDto = {
        ...toMailMReqDto(rowData),
        mailId: typeof id === "string" ? id : rowData.mailId,
      };
      const result = await updateMail(mailMReqDto);
      if (result) {
        await refetch();
      }
      return { success: result };
    },
    [updateMail, refetch]
  );

  const handleDeleteMail = useCallback(
    async (id: string | number) => {
      const mailId = typeof id === "string" ? id : String(id);
      const result = await deleteMail(mailId);
      if (result) {
        await refetch();
        if (selectedMailId === mailId) {
          setSelectedMailId(null);
        }
      }
      return { success: result };
    },
    [deleteMail, refetch, selectedMailId]
  );

  const handleBulkDeleteMail = useCallback(
    async (selectedRows: MailMasterRow[]) => {
      try {
        for (const row of selectedRows) {
          const result = await deleteMail(row.mailId);
          if (!result) {
            throw new Error(`메일 ${row.mailId} 삭제 실패`);
          }
          if (selectedMailId === row.mailId) {
            setSelectedMailId(null);
          }
        }
        await refetch();
        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [deleteMail, refetch, selectedMailId]
  );

  const handleSendMail = useCallback(
    async (mailId: string, recipients: string[]) => {
      const result = await sendMail(mailId, recipients);
      if (result) {
        // 발송 후 이력 새로고침
        await fetchMailHistory(mailId);
      }
      return { success: result };
    },
    [sendMail, fetchMailHistory]
  );

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // 상태
    loading,
    error,
    selectedMailId,
    searchFormData,

    // 테이블 데이터
    leftTableData,
    rightTableData,

    // 상태 변경 함수
    setSelectedMailId,
    setSearchFormData,

    // 원본 데이터
    mailData,

    // 비즈니스 로직
    handleSearch,
    handleLeftTableRowClick,
    refetch,

    // 메일 CRUD
    handleInsertMail,
    handleUpdateMail,
    handleDeleteMail,
    handleBulkDeleteMail,
    handleSendMail,
  };
};
