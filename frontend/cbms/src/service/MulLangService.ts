import { useState, useMemo, useCallback } from "react";
import { useMulLangApi } from "@/hooks/admin/useMulLangApi";
import {
  toMulLangSearchReqDto,
  toMulLangReqDto,
} from "@/service/mapper/MulLangMapper";
import {
  transformMulLangData,
  MulLangRow,
} from "@/service/transformer/MulLangTransformer";

/**
 * @파일명 : MulLangService.ts
 * @설명 : 다국어 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface SearchFormData
 * @description 검색 폼 데이터 타입
 */
export interface SearchFormData {
  langCd?: string;
  langType?: string;
  langNm?: string;
  langGubun?: string;
  useYn?: string;
  [key: string]: any;
}

/**
 * @interface UseMulLangServiceReturn
 * @description 다국어 서비스 훅의 반환 타입
 */
interface UseMulLangServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  searchFormData: SearchFormData;

  // 원본 데이터
  mulLangData: any;

  // 테이블 데이터
  tableData: MulLangRow[];

  // 상태 변경 함수
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  refetch: () => Promise<any>;

  // CRUD 함수
  handleInsertMulLang: (rowData: MulLangRow) => Promise<any>;
  handleUpdateMulLang: (
    id: string | number,
    rowData: MulLangRow
  ) => Promise<any>;
  handleDeleteMulLang: (id: string | number) => Promise<any>;
  handleBulkCopyMulLang: (selectedRows: MulLangRow[]) => Promise<any>;
  handleBulkDeleteMulLang: (selectedRows: MulLangRow[]) => Promise<any>;
}

/**
 * @hook useMulLangService
 * @description 다국어 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseMulLangServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useMulLangService = (): UseMulLangServiceReturn => {
  const {
    mulLangData,
    loading,
    error,
    fetchMulLangData,
    refetch,
    insertMulLang,
    updateMulLang,
    deleteMulLang,
  } = useMulLangApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  // ============================================================================
  // 데이터 변환 (Transformer 사용)
  // ============================================================================

  const tableData = useMemo(
    () => transformMulLangData(mulLangData),
    [mulLangData]
  );

  // ============================================================================
  // 검색 처리
  // ============================================================================

  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      const searchForm = toMulLangSearchReqDto(searchData);
      await fetchMulLangData(searchForm, {
        page: 0,
        size: 2000,
        sort: "langCd",
        direction: "ASC",
      });
    },
    [fetchMulLangData]
  );

  // ============================================================================
  // CRUD 처리
  // ============================================================================

  /**
   * @function handleInsertMulLang
   * @description 다국어 추가 핸들러
   * @param {MulLangRow} rowData - 추가할 행 데이터
   * @returns {Promise<any>} 추가 결과
   */
  const handleInsertMulLang = useCallback(
    async (rowData: MulLangRow) => {
      const mulLang = toMulLangReqDto(rowData);
      const result = await insertMulLang(mulLang);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [insertMulLang, refetch]
  );

  /**
   * @function handleUpdateMulLang
   * @description 다국어 수정 핸들러
   * @param {string | number} id - 행 ID (langGubun_langCd 형식)
   * @param {MulLangRow} rowData - 수정할 행 데이터
   * @returns {Promise<any>} 수정 결과
   */
  const handleUpdateMulLang = useCallback(
    async (id: string | number, rowData: MulLangRow) => {
      const mulLang = toMulLangReqDto(rowData);
      const result = await updateMulLang(mulLang);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [updateMulLang, refetch]
  );

  /**
   * @function handleDeleteMulLang
   * @description 다국어 삭제 핸들러
   * @param {string | number} id - 행 ID ([언어유형]|[언어구분].[언어코드] 형식)
   * @returns {Promise<any>} 삭제 결과
   */
  const handleDeleteMulLang = useCallback(
    async (id: string | number) => {
      // ID 파싱: [언어유형]|[언어구분].[언어코드]
      const idString = String(id);

      // | 기준으로 분리하여 언어유형과 나머지 추출
      const pipeIndex = idString.indexOf("|");
      if (pipeIndex === -1) {
        console.error(
          "Invalid ID format. Expected: [langType]|[langGubun].[langCd]"
        );
        return { success: false, message: "잘못된 ID 형식입니다." };
      }

      // . 기준으로 언어구분과 언어코드 분리
      const remaining = idString.substring(pipeIndex + 1);
      const dotIndex = remaining.indexOf(".");
      if (dotIndex === -1) {
        console.error(
          "Invalid ID format. Expected: [langType]|[langGubun].[langCd]"
        );
        return { success: false, message: "잘못된 ID 형식입니다." };
      }

      const langGubun = remaining.substring(0, dotIndex);
      const langCd = remaining.substring(dotIndex + 1);

      const result = await deleteMulLang(langGubun, langCd);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [deleteMulLang, refetch]
  );

  /**
   * @function handleBulkCopyMulLang
   * @description 다국어 대량 복사 핸들러
   * @param {MulLangRow[]} selectedRows - 선택된 행 배열
   * @returns {Promise<any>} 복사 결과
   */
  const handleBulkCopyMulLang = useCallback(
    async (selectedRows: MulLangRow[]) => {
      let successCount = 0;
      let failCount = 0;

      for (const row of selectedRows) {
        // 복사본 생성 (langCd에 _copy 접미사 추가)
        const copiedRow = {
          ...row,
          langCd: `${row.langCd}_copy`,
        };

        const mulLang = toMulLangReqDto(copiedRow);
        const result = await insertMulLang(mulLang);

        if (result?.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      await refetch();

      return {
        success: failCount === 0,
        message: `복사 완료: 성공 ${successCount}건, 실패 ${failCount}건`,
      };
    },
    [insertMulLang, refetch]
  );

  /**
   * @function handleBulkDeleteMulLang
   * @description 다국어 대량 삭제 핸들러
   * @param {MulLangRow[]} selectedRows - 선택된 행 배열
   * @returns {Promise<any>} 삭제 결과
   */
  const handleBulkDeleteMulLang = useCallback(
    async (selectedRows: MulLangRow[]) => {
      let successCount = 0;
      let failCount = 0;

      for (const row of selectedRows) {
        const result = await deleteMulLang(row.langGubun, row.langCd);

        if (result?.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      await refetch();

      return {
        success: failCount === 0,
        message: `삭제 완료: 성공 ${successCount}건, 실패 ${failCount}건`,
      };
    },
    [deleteMulLang, refetch]
  );

  // ============================================================================
  // 반환
  // ============================================================================

  return {
    // 상태
    loading,
    error,
    searchFormData,

    // 원본 데이터
    mulLangData,

    // 테이블 데이터
    tableData,

    // 상태 변경
    setSearchFormData,

    // 비즈니스 로직
    handleSearch,
    refetch,

    // CRUD
    handleInsertMulLang,
    handleUpdateMulLang,
    handleDeleteMulLang,
    handleBulkCopyMulLang,
    handleBulkDeleteMulLang,
  };
};
