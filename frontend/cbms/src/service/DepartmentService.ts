import { useState, useMemo, useCallback } from "react";
import { useDepartmentApi } from "@/hooks/admin/useDepartmentApi";
import {
  toDepartmentSearchReqDto,
  toDepartmentReqDto,
  toDepartmentReqDtoFromForm,
} from "@/service/mapper/DepartmentMapper";
import {
  transformDepartmentToTreeNodes,
  transformDepartmentDetailData,
} from "@/service/transformer/DepartmentTransformer";
import { TreeNode } from "@/components/common/themed/TreeView";
import { DepartmentResDto } from "@/types/responseDto/DepartmentResDto";

/**
 * @파일명 : DepartmentService.ts
 * @설명 : 부서 관리 페이지의 비즈니스 로직을 처리하는 서비스 훅
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
  deptCode?: string;
  deptNm?: string;
  upperDeptCode?: string;
  useYn?: string;
  [key: string]: any;
}

/**
 * @interface UseDepartmentServiceReturn
 * @description 부서 서비스 훅의 반환 타입
 */
interface UseDepartmentServiceReturn {
  // 상태
  loading: boolean;
  error: string | null;
  selectedDeptCode: string | null;
  searchFormData: SearchFormData;

  // 원본 데이터
  departmentData: any;
  selectedDepartmentData: any;

  // 트리뷰 데이터
  treeData: TreeNode[];
  departmentDetailData: Record<string, any>;

  // 상태 변경 함수
  setSelectedDeptCode: (deptCode: string | null) => void;
  setSearchFormData: (data: SearchFormData) => void;

  // 비즈니스 로직 함수
  handleSearch: (searchData: SearchFormData) => Promise<void>;
  handleNodeClick: (node: TreeNode) => void;
  refetch: () => Promise<any>;

  // 부서 CRUD
  handleInsertDepartment: (formData: Record<string, any>) => Promise<any>;
  handleUpdateDepartment: (formData: Record<string, any>) => Promise<any>;
  handleDeleteDepartment: (deptCode: string) => Promise<any>;
  handleToggleUseYn: (deptCode: string, currentUseYn: string) => Promise<any>;
}

/**
 * @hook useDepartmentService
 * @description 부서 관리의 모든 비즈니스 로직을 처리하는 서비스 훅
 * @returns {UseDepartmentServiceReturn} 상태, 데이터, 핸들러 함수들
 */
export const useDepartmentService = (): UseDepartmentServiceReturn => {
  const {
    departmentData,
    selectedDepartmentData,
    loading,
    error,
    fetchDepartmentData,
    fetchDepartmentDetail,
    insertDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: apiRefetch,
  } = useDepartmentApi();

  // ============================================================================
  // 상태 관리
  // ============================================================================

  const [selectedDeptCode, setSelectedDeptCode] = useState<string | null>(null);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({});

  // ============================================================================
  // 데이터 변환 (useMemo)
  // ============================================================================

  /**
   * @memo treeData
   * @description 부서 목록을 TreeView용 데이터로 변환
   */
  const treeData = useMemo<TreeNode[]>(() => {
    if (!departmentData?.content) {
      return [];
    }
    return transformDepartmentToTreeNodes(departmentData.content);
  }, [departmentData]);

  /**
   * @memo departmentDetailData
   * @description 선택된 부서 상세 데이터를 폼 데이터로 변환
   */
  const departmentDetailData = useMemo<Record<string, any>>(() => {
    return transformDepartmentDetailData(selectedDepartmentData);
  }, [selectedDepartmentData]);

  // ============================================================================
  // 비즈니스 로직 함수
  // ============================================================================

  /**
   * @function handleSearch
   * @description 부서 검색 처리
   * @param {SearchFormData} searchData - 검색 조건
   */
  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      setSearchFormData(searchData);
      const reqDto = toDepartmentSearchReqDto(searchData);
      await fetchDepartmentData(reqDto);
    },
    [fetchDepartmentData]
  );

  /**
   * @function handleNodeClick
   * @description TreeView 노드 클릭 처리
   * @param {TreeNode} node - 클릭된 노드
   */
  const handleNodeClick = useCallback((node: TreeNode) => {
    const dept = node.data as DepartmentResDto;
    if (dept && dept.deptCode) {
      setSelectedDeptCode(dept.deptCode);
    }
  }, []);

  /**
   * @function refetch
   * @description 부서 목록 새로고침
   */
  const refetch = useCallback(async () => {
    return apiRefetch();
  }, [apiRefetch]);

  // ============================================================================
  // CRUD 함수
  // ============================================================================

  /**
   * @function handleInsertDepartment
   * @description 부서 추가 처리
   * @param {Record<string, any>} formData - 폼 데이터
   * @returns {Promise<any>} 추가 결과
   */
  const handleInsertDepartment = useCallback(
    async (formData: Record<string, any>) => {
      const reqDto = toDepartmentReqDtoFromForm(formData);
      const result = await insertDepartment(reqDto);
      if (result?.success) {
        await refetch();
      }
      return result;
    },
    [insertDepartment, refetch]
  );

  /**
   * @function handleUpdateDepartment
   * @description 부서 수정 처리
   * @param {Record<string, any>} formData - 폼 데이터
   * @returns {Promise<any>} 수정 결과
   */
  const handleUpdateDepartment = useCallback(
    async (formData: Record<string, any>) => {
      const reqDto = toDepartmentReqDtoFromForm(formData);
      const result = await updateDepartment(reqDto);
      if (result?.success) {
        await refetch();
        if (formData.deptCode) {
          await fetchDepartmentDetail(formData.deptCode);
        }
      }
      return result;
    },
    [updateDepartment, refetch, fetchDepartmentDetail]
  );

  /**
   * @function handleDeleteDepartment
   * @description 부서 삭제 처리
   * @param {string} deptCode - 부서 코드
   * @returns {Promise<any>} 삭제 결과
   */
  const handleDeleteDepartment = useCallback(
    async (deptCode: string) => {
      const result = await deleteDepartment(deptCode);
      if (result?.success) {
        setSelectedDeptCode(null);
        await refetch();
      }
      return result;
    },
    [deleteDepartment, refetch]
  );

  /**
   * @function handleToggleUseYn
   * @description 부서 사용여부 토글 처리
   * @param {string} deptCode - 부서 코드
   * @param {string} currentUseYn - 현재 사용여부 (Y/N)
   * @returns {Promise<any>} 수정 결과
   */
  const handleToggleUseYn = useCallback(
    async (deptCode: string, currentUseYn: string) => {
      const newUseYn = currentUseYn === "Y" ? "N" : "Y";

      // 현재 부서 데이터 찾기
      const currentDept = departmentData?.content?.find(
        (dept: DepartmentResDto) => dept.deptCode === deptCode
      );

      if (!currentDept) {
        return { success: false, message: "부서 정보를 찾을 수 없습니다." };
      }

      const reqDto = toDepartmentReqDto(currentDept);
      reqDto.useYn = newUseYn;

      const result = await updateDepartment(reqDto);
      if (result?.success) {
        await refetch();
        if (selectedDeptCode === deptCode) {
          await fetchDepartmentDetail(deptCode);
        }
      }
      return result;
    },
    [
      departmentData,
      updateDepartment,
      refetch,
      selectedDeptCode,
      fetchDepartmentDetail,
    ]
  );

  return {
    // 상태
    loading,
    error,
    selectedDeptCode,
    searchFormData,

    // 원본 데이터
    departmentData,
    selectedDepartmentData,

    // 변환된 데이터
    treeData,
    departmentDetailData,

    // 상태 변경
    setSelectedDeptCode,
    setSearchFormData,

    // 비즈니스 로직
    handleSearch,
    handleNodeClick,
    refetch,

    // CRUD
    handleInsertDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleToggleUseYn,
  };
};
