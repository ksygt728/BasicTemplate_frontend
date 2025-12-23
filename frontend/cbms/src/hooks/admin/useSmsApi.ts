import { useState, useCallback } from "react";
import { SmsApi } from "@/api/admin/smsApi";
import { SmsMReqDto } from "@/types/requestDto/SmsMReqDto";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : useSmsApi.ts
 * @설명 : SMS 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.17
 */

interface SmsMasterData {
  smsId: string;
  langType: string;
  smsName: string;
  text: string;
  description?: string;
}

interface SmsHistoryData {
  logId: string;
  smsId: string;
  fromPhone: string;
  toPhone: string;
  text: string;
  success: string;
  errorMsg?: string;
}

interface SmsApiResponse {
  content: SmsMasterData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface SmsHistoryApiResponse {
  content: SmsHistoryData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface UseSmsApiReturn {
  smsData: SmsApiResponse | null;
  smsDetailData: any;
  smsHistoryData: SmsHistoryApiResponse | null;
  loading: boolean;
  error: string | null;
  fetchSmsList: (searchData: SmsMReqDto, pageable?: Pageable) => Promise<void>;
  fetchSmsDetail: (smsId: string) => Promise<void>;
  fetchSmsHistory: (smsId: string, pageable?: Pageable) => Promise<void>;
  insertSms: (smsData: SmsMReqDto) => Promise<boolean>;
  updateSms: (smsData: SmsMReqDto) => Promise<boolean>;
  deleteSms: (smsId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useSmsApi = (): UseSmsApiReturn => {
  const [smsData, setSmsData] = useState<SmsApiResponse | null>(null);
  const [smsDetailData, setSmsDetailData] = useState<any>(null);
  const [smsHistoryData, setSmsHistoryData] =
    useState<SmsHistoryApiResponse | null>(null);
  const { loading, error, handleApiCall } = useCommonApi();

  const smsApi = SmsApi.getInstance();

  const fetchSmsList = useCallback(
    async (searchData: SmsMReqDto, pageable?: Pageable): Promise<void> => {
      await handleApiCall(
        () => smsApi.findAllSmsForAdmin(searchData),
        (response: any) => {
          if (response.success) {
            // Backend returns wrapped object: response.data.data
            const payload =
              response.data && response.data.data
                ? response.data.data
                : response.data;
            setSmsData(payload);
          }
        }
      );
    },
    [handleApiCall, smsApi]
  );

  const fetchSmsDetail = useCallback(
    async (smsId: string): Promise<void> => {
      await handleApiCall(
        () => smsApi.findBySmsForAdmin(smsId),
        (response: any) => {
          if (response.success) {
            const payload =
              response.data && response.data.data
                ? response.data.data
                : response.data;
            setSmsDetailData(payload);
          }
        }
      );
    },
    [handleApiCall, smsApi]
  );

  const fetchSmsHistory = useCallback(
    async (smsId: string, pageable?: Pageable): Promise<void> => {
      await handleApiCall(
        () => smsApi.findBySmsHistoryForAdmin(smsId, pageable),
        (response: any) => {
          if (response.success) {
            const payload =
              response.data && response.data.data
                ? response.data.data
                : response.data;
            setSmsHistoryData(payload);
          }
        }
      );
    },
    [handleApiCall, smsApi]
  );

  const insertSms = useCallback(
    async (smsData: SmsMReqDto): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => smsApi.insertSmsForAdmin(smsData),
        (response: any) => {
          if (response.success) success = true;
        }
      );
      return success;
    },
    [handleApiCall, smsApi]
  );

  const updateSms = useCallback(
    async (smsData: SmsMReqDto): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => smsApi.updateSmsForAdmin(smsData),
        (response: any) => {
          if (response.success) success = true;
        }
      );
      return success;
    },
    [handleApiCall, smsApi]
  );

  const deleteSms = useCallback(
    async (smsId: string): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => smsApi.deleteSmsForAdmin(smsId),
        (response: any) => {
          if (response.success) success = true;
        }
      );
      return success;
    },
    [handleApiCall, smsApi]
  );

  const refetch = useCallback(async (): Promise<void> => {
    await fetchSmsList({} as SmsMReqDto);
  }, [fetchSmsList]);

  return {
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
  };
};
