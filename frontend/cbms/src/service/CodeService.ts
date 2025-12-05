import { useState, useMemo, useCallback } from "react";
import { useCodeApi } from "@/hooks/useCodeApi";
import {
  toCodeSearchFormReqDto,
  toComCodeMReqDto,
  toComCodeTReqDto,
  toComCodeDReqDto,
  collectValidAttributes,
  extractAttrCdForDelete,
} from "@/service/mapper/CodeMapper";
import {
  transformGroupData,
  transformAttributeData,
  transformDetailData,
} from "@/service/transformer/CodeTransformer";

/**
 * @파일명 : useCodeService.ts
 * @설명 : 코드 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface CodeGroupRow
 * @description 그룹 코드 테이블 Row 타입
 */
export interface CodeGroupRow {
  id: string;
  grpCd: string;
  grpNm: string;
  grpCdType: string;
  useYn?: string;
  rmk?: string;
}

/**
 * @interface CodeAttributeRow
 * @description 속성 코드 테이블 Row 타입
 */
export interface CodeAttributeRow {
  id: string;
  attrCd: string;
  attrNm: string;
  attrOrderNum: number;
  useYn?: string;
}

/**
 * @interface CodeDetailRow
 * @description 상세 코드 테이블 Row 타입
 */
export interface CodeDetailRow {
  id: string;
  dtlCd: string;
  dtlOrderNum: number;
  useYn?: string;
  [key: string]: any; // 동적 속성 컬럼들
}

/**
 * @interface SearchFormData
 * @description 검색 폼 데이터 타입
 */
export interface SearchFormData {
  grpCd?: string;
  grpNm?: string;
  grpCdType?: string;
  useYn?: string;
  [key: string]: any;
}

/**
 * @interface UseCodeServiceReturn
 * @description 코드 서비스 훅의 반환 타입
 */
interface UseCodeServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedGroupCd: string | null;
  searchFormData: SearchFormData;

  // 테이블 데이터
  leftTableData: CodeGroupRow[];
  rightTopTableData: CodeAttributeRow[];
  rightBottomTableData: CodeDetailRow[];

  // 상태 변경 함수
  setSelectedGroupCd: (grpCd: string | null) => void;
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleLeftTableRowClick: (row: CodeGroupRow) => void;
  refetch: () => Promise<any>;

  // 그룹코드 CRUD
  handleInsertGroupCode: (rowData: CodeGroupRow) => Promise<any>;
  handleUpdateGroupCode: (
    id: string | number,
    rowData: CodeGroupRow
  ) => Promise<any>;
  handleDeleteGroupCode: (id: string | number) => Promise<any>;
  handleBulkCopyGroupCode: (selectedRows: CodeGroupRow[]) => Promise<any>;
  handleBulkDeleteGroupCode: (selectedRows: CodeGroupRow[]) => Promise<any>;

  // 속성코드 CRUD
  handleInsertAttributeCode: (rowData: CodeAttributeRow) => Promise<any>;
  handleUpdateAttributeCode: (
    id: string | number,
    rowData: CodeAttributeRow
  ) => Promise<any>;
  handleDeleteAttributeCode: (id: string | number) => Promise<any>;
  handleBulkCopyAttributeCode: (
    selectedRows: CodeAttributeRow[]
  ) => Promise<any>;
  handleBulkDeleteAttributeCode: (
    selectedRows: CodeAttributeRow[]
  ) => Promise<any>;

  // 상세코드 CRUD
  handleInsertDetailCode: (rowData: CodeDetailRow) => Promise<any>;
  handleUpdateDetailCode: (
    id: string | number,
    rowData: CodeDetailRow
  ) => Promise<any>;
  handleDeleteDetailCode: (id: string | number) => Promise<any>;
  handleBulkCopyDetailCode: (selectedRows: CodeDetailRow[]) => Promise<any>;
  handleBulkDeleteDetailCode: (selectedRows: CodeDetailRow[]) => Promise<any>;
}

/**
 * @hook useCodeService
 * @description 코드 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseCodeServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useCodeService = (): UseCodeServiceReturn => {
  const {
    codeData,
    loading,
    error,
    fetchCodeData,
    refetch,
    insertGroupCode,
    updateGroupCode,
    deleteGroupCode,
    insertAttrCode,
    updateAttrCode,
    deleteAttrCode,
    insertDetailCode,
    updateDetailCode,
    deleteDetailCode,
  } = useCodeApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [selectedGroupCd, setSelectedGroupCd] = useState<string | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  // ============================================================================
  // 데이터 변환 (Transformer 사용)
  // ============================================================================

  const leftTableData = useMemo(() => transformGroupData(codeData), [codeData]);

  const rightTopTableData = useMemo(
    () => transformAttributeData(codeData, selectedGroupCd),
    [selectedGroupCd, codeData]
  );

  const rightBottomTableData = useMemo(
    () => transformDetailData(codeData, selectedGroupCd),
    [selectedGroupCd, codeData]
  );

  // ============================================================================
  // 검색 처리
  // ============================================================================

  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      const searchForm = toCodeSearchFormReqDto(searchData);
      await fetchCodeData(searchForm, 0, 2000);
    },
    [fetchCodeData]
  );

  // ============================================================================
  // 이벤트 핸들러
  // ============================================================================

  const handleLeftTableRowClick = useCallback((row: CodeGroupRow) => {
    setSelectedGroupCd(row.grpCd);
  }, []);

  // ============================================================================
  // 그룹코드 CRUD
  // ============================================================================

  const handleInsertGroupCode = useCallback(
    async (rowData: CodeGroupRow) => {
      const comCodeM = toComCodeMReqDto(rowData);
      const result = await insertGroupCode(comCodeM);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [insertGroupCode, refetch]
  );

  const handleUpdateGroupCode = useCallback(
    async (id: string | number, rowData: CodeGroupRow) => {
      const comCodeM = {
        ...toComCodeMReqDto(rowData),
        grpCd: typeof id === "string" ? id : rowData.grpCd,
      };
      const result = await updateGroupCode(comCodeM);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [updateGroupCode, refetch]
  );

  const handleDeleteGroupCode = useCallback(
    async (id: string | number) => {
      const grpCd = typeof id === "string" ? id : String(id);
      const result = await deleteGroupCode(grpCd);
      if (result?.success) {
        await refetch();
        if (selectedGroupCd === grpCd) {
          setSelectedGroupCd(null);
        }
      }
      return result;
    },
    [deleteGroupCode, refetch, selectedGroupCd]
  );

  const handleBulkCopyGroupCode = useCallback(async () => {
    return { success: true };
  }, []);

  const handleBulkDeleteGroupCode = useCallback(
    async (selectedRows: CodeGroupRow[]) => {
      try {
        for (const row of selectedRows) {
          const result = await deleteGroupCode(row.grpCd);
          if (!result?.success) {
            throw new Error(`그룹코드 ${row.grpCd} 삭제 실패`);
          }
          if (selectedGroupCd === row.grpCd) {
            setSelectedGroupCd(null);
          }
        }
        await refetch();
        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [deleteGroupCode, refetch, selectedGroupCd]
  );

  // ============================================================================
  // 속성코드 CRUD
  // ============================================================================

  const handleInsertAttributeCode = useCallback(
    async (rowData: CodeAttributeRow) => {
      const comCodeT = toComCodeTReqDto(rowData, selectedGroupCd ?? "");
      const result = await insertAttrCode(comCodeT);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [selectedGroupCd, insertAttrCode, refetch]
  );

  const handleUpdateAttributeCode = useCallback(
    async (id: string | number, rowData: CodeAttributeRow) => {
      const comCodeT = toComCodeTReqDto(rowData, selectedGroupCd ?? "");
      const result = await updateAttrCode(comCodeT);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [selectedGroupCd, updateAttrCode, refetch]
  );

  const handleDeleteAttributeCode = useCallback(
    async (id: string | number) => {
      const targetRow = rightTopTableData.find((row) => row.id === id);
      if (!targetRow?.attrCd) {
        return;
      }
      const result = await deleteAttrCode(
        selectedGroupCd ?? "",
        targetRow.attrCd
      );
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [selectedGroupCd, rightTopTableData, deleteAttrCode, refetch]
  );

  const handleBulkCopyAttributeCode = useCallback(async () => {
    return { success: true };
  }, [selectedGroupCd]);

  const handleBulkDeleteAttributeCode = useCallback(
    async (selectedRows: CodeAttributeRow[]) => {
      try {
        for (const row of selectedRows) {
          const result = await deleteAttrCode(
            selectedGroupCd ?? "",
            row.attrCd
          );
          if (!result?.success) {
            throw new Error(`속성코드 ${row.attrCd} 삭제 실패`);
          }
        }
        await refetch();
        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [selectedGroupCd, deleteAttrCode, refetch]
  );

  // ============================================================================
  // 상세코드 CRUD
  // ============================================================================

  const handleInsertDetailCode = useCallback(
    async (rowData: CodeDetailRow) => {
      const validAttributes = collectValidAttributes(
        rowData,
        rightTopTableData
      );
      const results = [];

      for (const attr of validAttributes) {
        const comCodeD = toComCodeDReqDto(
          rowData,
          selectedGroupCd ?? "",
          attr.attrCd,
          attr.dtlNm
        );
        const result = await insertDetailCode(comCodeD);
        results.push(result);
      }

      const allSuccess = results.every((result) => result?.success);
      if (allSuccess) {
        await refetch();
      }

      return { success: allSuccess, results };
    },
    [selectedGroupCd, rightTopTableData, insertDetailCode, refetch]
  );

  const handleUpdateDetailCode = useCallback(
    async (id: string | number, rowData: CodeDetailRow) => {
      const validAttributes = collectValidAttributes(
        rowData,
        rightTopTableData
      );
      const results = [];

      for (const attr of validAttributes) {
        const comCodeD = toComCodeDReqDto(
          rowData,
          selectedGroupCd ?? "",
          attr.attrCd,
          attr.dtlNm
        );
        const result = await updateDetailCode(comCodeD);
        results.push(result);
      }

      const allSuccess = results.every((result) => result?.success);
      if (allSuccess) {
        await refetch();
      }

      return { success: allSuccess, results };
    },
    [selectedGroupCd, rightTopTableData, updateDetailCode, refetch]
  );

  const handleDeleteDetailCode = useCallback(
    async (id: string | number) => {
      const targetRow = rightBottomTableData.find((row: any) => row.id === id);
      if (!targetRow?.dtlCd) {
        return;
      }

      const attrCd = extractAttrCdForDelete(
        codeData,
        selectedGroupCd ?? "",
        targetRow.dtlCd
      );
      if (!attrCd) {
        return;
      }

      const result = await deleteDetailCode(
        selectedGroupCd ?? "",
        attrCd,
        targetRow.dtlCd
      );
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [selectedGroupCd, rightBottomTableData, codeData, deleteDetailCode, refetch]
  );

  const handleBulkCopyDetailCode = useCallback(async () => {
    return { success: true };
  }, [selectedGroupCd]);

  const handleBulkDeleteDetailCode = useCallback(
    async (selectedRows: CodeDetailRow[]) => {
      try {
        for (const row of selectedRows) {
          const attrCd = extractAttrCdForDelete(
            codeData,
            selectedGroupCd ?? "",
            row.dtlCd
          );
          if (attrCd) {
            const result = await deleteDetailCode(
              selectedGroupCd ?? "",
              attrCd,
              row.dtlCd
            );
            if (!result?.success) {
              throw new Error(`상세코드 ${row.dtlCd} 삭제 실패`);
            }
          }
        }
        await refetch();
        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [selectedGroupCd, codeData, deleteDetailCode, refetch]
  );

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // 상태
    loading,
    error,
    selectedGroupCd,
    searchFormData,

    // 테이블 데이터
    leftTableData,
    rightTopTableData,
    rightBottomTableData,

    // 상태 변경 함수
    setSelectedGroupCd,
    setSearchFormData,

    // 비즈니스 로직
    handleSearch,
    handleLeftTableRowClick,
    refetch,

    // 그룹코드 CRUD
    handleInsertGroupCode,
    handleUpdateGroupCode,
    handleDeleteGroupCode,
    handleBulkCopyGroupCode,
    handleBulkDeleteGroupCode,

    // 속성코드 CRUD
    handleInsertAttributeCode,
    handleUpdateAttributeCode,
    handleDeleteAttributeCode,
    handleBulkCopyAttributeCode,
    handleBulkDeleteAttributeCode,

    // 상세코드 CRUD
    handleInsertDetailCode,
    handleUpdateDetailCode,
    handleDeleteDetailCode,
    handleBulkCopyDetailCode,
    handleBulkDeleteDetailCode,
  };
};
