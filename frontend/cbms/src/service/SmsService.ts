import { useState, useMemo, useCallback } from "react";
import { useSmsApi } from "@/hooks/admin/useSmsApi";
import type { SmsMResDto } from "@/types/responseDto/SmsMResDto";
import type { SmsHResDto } from "@/types/responseDto/SmsHResDto";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : SmsService.ts
 * @설명 : SMS 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.17
 */

export interface SearchFormData {
  smsId?: string;
  langType?: string;
  smsName?: string;
  [key: string]: any;
}

interface UseSmsServiceReturn {
  loading: boolean;
  error: string | null;
  selectedSmsId: string | null;
  searchFormData: SearchFormData;
  smsData: any;
  leftTableData: any[];
  rightTableData: any[];
  setSearchFormData: (data: SearchFormData) => void;
  setSelectedSmsId: (id: string | null) => void;
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleLeftTableRowClick: (row: any) => void;
  refetch: () => Promise<void>;
  handleInsertSms: (rowData: any) => Promise<any>;
  handleUpdateSms: (id: string | number, rowData: any) => Promise<any>;
  handleDeleteSms: (id: string | number) => Promise<any>;
  handleBulkDeleteSms: (selectedRows: any[]) => Promise<any>;
}

/**
 * @function transformSmsMasterData
 * @description API 응답형 SmsMResDto 배열을 테이블용 행 배열로 변환
 */
const transformSmsMasterData = (data: any): any[] => {
  if (!data) return [];
  // support both shapes: { content: [...] } or { data: { content: [...] } }
  const payload = data.content ? data : data.data ? data.data : null;
  if (!payload || !payload.content) return [];
  const items: SmsMResDto[] = payload.content;
  return items.map((it) => ({
    smsId: it.smsId,
    langType: it.langType,
    smsName: it.smsName,
    text: it.text,
    description: it.description,
  }));
};

/**
 * @function transformSmsHistoryData
 * @description API 응답형 SmsHResDto 배열을 테이블용 행 배열로 변환
 */
const transformSmsHistoryData = (data: any): any[] => {
  if (!data) return [];
  const payload = data.content ? data : data.data ? data.data : null;
  if (!payload || !payload.content) return [];
  const items: SmsHResDto[] = payload.content;
  return items.map((it) => ({
    logId: it.logId,
    smsId: it.smsId,
    fromPhone: it.fromPhone,
    toPhone: it.toPhone,
    text: it.text,
    success: it.success,
    errorMsg: it.errorMsg,
  }));
};

export const useSmsService = (): UseSmsServiceReturn => {
  const {
    smsData,
    smsDetailData,
    smsHistoryData,
    loading,
    error,
    fetchSmsList,
    fetchSmsDetail,
    fetchSmsHistory,
    insertSms,
    updateSms,
    deleteSms,
    refetch,
  } = useSmsApi();

  const { showAlert } = useAlert();

  const [selectedSmsId, setSelectedSmsId] = useState<string | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  const leftTableData = useMemo(
    () => transformSmsMasterData(smsData),
    [smsData]
  );
  const rightTableData = useMemo(
    () => transformSmsHistoryData(smsHistoryData),
    [smsHistoryData]
  );

  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      await fetchSmsList(searchData as any);
    },
    [fetchSmsList]
  );

  const handleLeftTableRowClick = useCallback(
    (row: any) => {
      setSelectedSmsId(row.smsId);
      fetchSmsHistory(row.smsId);
    },
    [fetchSmsHistory]
  );

  const handleInsertSms = useCallback(
    async (rowData: any) => {
      // Clean UI-only fields (AdvancedTable may add `isNew` or similar flags)
      const smsMReqDto: any = { ...rowData };
      delete smsMReqDto.isNew;
      delete smsMReqDto._isNew;
      delete smsMReqDto._rowKey;

      const result = await insertSms(smsMReqDto as any);
      if (result) await refetch();
      return { success: result };
    },
    [insertSms, refetch]
  );

  const handleUpdateSms = useCallback(
    async (id: string | number, rowData: any) => {
      const smsMReqDto = {
        ...rowData,
        smsId: typeof id === "string" ? id : rowData.smsId,
      };
      // Remove UI-only flags before sending
      delete smsMReqDto.isNew;
      delete smsMReqDto._isNew;
      delete smsMReqDto._rowKey;

      const result = await updateSms(smsMReqDto as any);
      if (result) await refetch();
      return { success: result };
    },
    [updateSms, refetch]
  );

  const handleDeleteSms = useCallback(
    async (id: string | number) => {
      const smsId = typeof id === "string" ? id : String(id);
      const result = await deleteSms(smsId);
      if (result) {
        await refetch();
        if (selectedSmsId === smsId) setSelectedSmsId(null);
      }
      return { success: result };
    },
    [deleteSms, refetch, selectedSmsId]
  );

  const handleBulkDeleteSms = useCallback(
    async (selectedRows: any[]) => {
      try {
        for (const row of selectedRows) {
          const result = await deleteSms(row.smsId);
          if (!result) throw new Error(`SMS ${row.smsId} 삭제 실패`);
          if (selectedSmsId === row.smsId) setSelectedSmsId(null);
        }
        await refetch();
        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [deleteSms, refetch, selectedSmsId]
  );

  return {
    loading,
    error,
    selectedSmsId,
    searchFormData,
    smsData,
    leftTableData,
    rightTableData,
    setSearchFormData,
    setSelectedSmsId,
    handleSearch,
    handleLeftTableRowClick,
    refetch,
    handleInsertSms,
    handleUpdateSms,
    handleDeleteSms,
    handleBulkDeleteSms,
  } as UseSmsServiceReturn;
};
