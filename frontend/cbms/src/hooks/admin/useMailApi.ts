import { useState, useCallback } from "react";
import { MailApi } from "@/api/admin/mailApi";
import { MailMReqDto } from "@/types/requestDto/MailMReqDto";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : useMailApi.ts
 * @설명 : 메일 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

/**
 * @interface MailMasterData
 * @description 메일 마스터 정보 인터페이스
 */
interface MailMasterData {
  mailId: string;
  langType: string;
  mailName: string;
  title: string;
  content: string;
  description: string;
}

/**
 * @interface MailHistoryData
 * @description 메일 발송 이력 정보 인터페이스
 */
interface MailHistoryData {
  logId: string;
  mailId: string;
  fromAddr: string;
  toAddr: string;
  title: string;
  content: string;
  success: string;
  errorMsg: string;
}

/**
 * @interface MailApiResponse
 * @description 메일 API 응답 인터페이스
 */
interface MailApiResponse {
  content: MailMasterData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * @interface MailHistoryApiResponse
 * @description 메일 이력 API 응답 인터페이스
 */
interface MailHistoryApiResponse {
  content: MailHistoryData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * @interface UseMailApiReturn
 * @description 메일 API 훅의 반환 타입
 */
interface UseMailApiReturn {
  mailData: MailApiResponse | null;
  mailDetailData: any;
  mailHistoryData: MailHistoryApiResponse | null;
  loading: boolean;
  error: string | null;
  fetchMailList: (
    searchData: MailMReqDto,
    pageable?: Pageable
  ) => Promise<void>;
  fetchMailDetail: (mailId: string) => Promise<void>;
  fetchMailHistory: (mailId: string, pageable?: Pageable) => Promise<void>;
  insertMail: (mailData: MailMReqDto) => Promise<boolean>;
  updateMail: (mailData: MailMReqDto) => Promise<boolean>;
  deleteMail: (mailId: string) => Promise<boolean>;
  sendMail: (mailId: string, recipients: string[]) => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * @function useMailApi
 * @description 메일 관리 API 호출을 위한 커스텀 훅
 * @returns {UseMailApiReturn} 메일 관리에 필요한 상태와 함수들
 *
 * @example
 * const {
 *   mailData,
 *   loading,
 *   fetchMailList,
 *   insertMail,
 *   updateMail,
 *   deleteMail
 * } = useMailApi();
 */
export const useMailApi = (): UseMailApiReturn => {
  const [mailData, setMailData] = useState<MailApiResponse | null>(null);
  const [mailDetailData, setMailDetailData] = useState<any>(null);
  const [mailHistoryData, setMailHistoryData] =
    useState<MailHistoryApiResponse | null>(null);
  const { loading, error, handleApiCall } = useCommonApi();

  const mailApi = MailApi.getInstance();

  /**
   * @function fetchMailList
   * @description 메일 리스트를 조회하는 함수
   * @param {MailMReqDto} searchData - 검색 조건
   * @param {Pageable} [pageable] - 페이지네이션 정보
   * @returns {Promise<void>}
   */
  const fetchMailList = useCallback(
    async (searchData: MailMReqDto, pageable?: Pageable): Promise<void> => {
      await handleApiCall(
        () => mailApi.findAllMailForAdmin(searchData, pageable),
        (response: any) => {
          if (response.success) {
            setMailData(response.data);
          }
        }
      );
    },
    [handleApiCall, mailApi]
  );

  /**
   * @function fetchMailDetail
   * @description 메일 상세 정보를 조회하는 함수
   * @param {string} mailId - 메일 아이디
   * @returns {Promise<void>}
   */
  const fetchMailDetail = useCallback(
    async (mailId: string): Promise<void> => {
      await handleApiCall(
        () => mailApi.findByMailForAdmin(mailId),
        (response: any) => {
          if (response.success) {
            setMailDetailData(response.data);
          }
        }
      );
    },
    [handleApiCall, mailApi]
  );

  /**
   * @function fetchMailHistory
   * @description 메일 발송 이력을 조회하는 함수
   * @param {string} mailId - 메일 아이디
   * @param {Pageable} [pageable] - 페이지네이션 정보
   * @returns {Promise<void>}
   */
  const fetchMailHistory = useCallback(
    async (mailId: string, pageable?: Pageable): Promise<void> => {
      await handleApiCall(
        () => mailApi.findByMailHistoryForAdmin(mailId, pageable),
        (response: any) => {
          if (response.success) {
            setMailHistoryData(response.data);
          }
        }
      );
    },
    [handleApiCall, mailApi]
  );

  /**
   * @function insertMail
   * @description 메일을 추가하는 함수
   * @param {MailMReqDto} mailData - 메일 정보
   * @returns {Promise<boolean>} 성공 여부
   */
  const insertMail = useCallback(
    async (mailData: MailMReqDto): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => mailApi.insertMailForAdmin(mailData),
        (response: any) => {
          if (response.success) {
            success = true;
          }
        }
      );
      return success;
    },
    [handleApiCall, mailApi]
  );

  /**
   * @function updateMail
   * @description 메일을 수정하는 함수
   * @param {MailMReqDto} mailData - 메일 정보
   * @returns {Promise<boolean>} 성공 여부
   */
  const updateMail = useCallback(
    async (mailData: MailMReqDto): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => mailApi.updateMailForAdmin(mailData),
        (response: any) => {
          if (response.success) {
            success = true;
          }
        }
      );
      return success;
    },
    [handleApiCall, mailApi]
  );

  /**
   * @function deleteMail
   * @description 메일을 삭제하는 함수
   * @param {string} mailId - 메일 아이디
   * @returns {Promise<boolean>} 성공 여부
   */
  const deleteMail = useCallback(
    async (mailId: string): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => mailApi.deleteMailForAdmin(mailId),
        (response: any) => {
          if (response.success) {
            success = true;
          }
        }
      );
      return success;
    },
    [handleApiCall, mailApi]
  );

  /**
   * @function sendMail
   * @description 메일을 발송하는 함수
   * @param {string} mailId - 메일 아이디
   * @param {string[]} recipients - 수신자 목록
   * @returns {Promise<boolean>} 성공 여부
   */
  const sendMail = useCallback(
    async (mailId: string, recipients: string[]): Promise<boolean> => {
      let success = false;
      await handleApiCall(
        () => mailApi.sendMailForAdmin(mailId, recipients),
        (response: any) => {
          if (response.success) {
            success = true;
          }
        }
      );
      return success;
    },
    [handleApiCall, mailApi]
  );

  /**
   * @function refetch
   * @description 데이터를 새로고침하는 함수
   * @returns {Promise<void>}
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchMailList({} as MailMReqDto);
  }, [fetchMailList]);

  return {
    mailData,
    mailDetailData,
    mailHistoryData,
    loading,
    error,
    fetchMailList,
    fetchMailDetail,
    fetchMailHistory,
    insertMail,
    updateMail,
    deleteMail,
    sendMail,
    refetch,
  };
};
