/**
 * @파일명 : ChaebunService.ts
 * @설명 : 채번 관리 페이지의 비즈니스 로직을 처리하는 서비스
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

import { useChaebunApi } from "@/hooks/admin/useChaebunApi";
import { ChaebunResDto } from "@/types/responseDto/ChaebunResDto";
import { toChaebunReqDto } from "@/service/mapper/ChaebunMapper";
import { transformChaebunListToTableData } from "@/service/transformer/ChaebunTransformer";
import { useAlert } from "@/contexts/AlertContext";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface ChaebunFormData
 * @description 채번 폼 데이터 타입
 */
export interface ChaebunFormData {
  seqId: string;
  seqName: string;
  pattern: string;
  prefix: string;
  step: number;
  length: number;
  dateformat?: string;
}

/**
 * @interface ChaebunServiceHook
 * @description 채번 서비스의 반환 타입
 */
export interface ChaebunServiceHook {
  // 상태
  loading: boolean;
  error: string | null;
  chaebunList: ChaebunResDto[];
  selectedChaebun: ChaebunResDto | null;
  tableData: Array<Record<string, any>>;

  // 비즈니스 로직 함수
  handleSearchChaebun: (searchData: Record<string, any>) => Promise<void>;
  handleChaebunSelect: (chaebun: ChaebunResDto) => void;
  handleInsertChaebun: (formData: ChaebunFormData) => Promise<boolean>;
  handleUpdateChaebun: (formData: ChaebunFormData) => Promise<boolean>;
  handleDeleteChaebun: (seqId: string) => Promise<boolean>;
  handleBulkDeleteChaebun: (seqIds: string[]) => Promise<void>;
  handleGenerateSeq: (seqId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * @hook useChaebunService
 * @description 채번 관리 비즈니스 로직을 처리하는 커스텀 훅
 * @returns {ChaebunServiceHook} 상태, 데이터, 핸들러 함수들
 */
export const useChaebunService = (): ChaebunServiceHook => {
  const chaebunApi = useChaebunApi();
  const { showAlert } = useAlert();

  // ============================================================================
  // 테이블 데이터 변환
  // ============================================================================

  const tableData = transformChaebunListToTableData(chaebunApi.chaebunList);

  // ============================================================================
  // 채번 검색
  // ============================================================================

  /**
   * @function handleSearchChaebun
   * @description 채번 검색 처리
   * @param {Record<string, any>} searchData - 검색 폼 데이터
   * @returns {Promise<void>}
   */
  const handleSearchChaebun = async (
    searchData: Record<string, any>
  ): Promise<void> => {
    const chaebunReqDto = toChaebunReqDto(searchData);
    await chaebunApi.fetchChaebunList(chaebunReqDto);
  };

  // ============================================================================
  // 채번 선택 처리
  // ============================================================================

  /**
   * @function handleChaebunSelect
   * @description 채번 선택 시 상태 업데이트
   * @param {ChaebunResDto} chaebun - 선택된 채번
   */
  const handleChaebunSelect = (chaebun: ChaebunResDto): void => {
    chaebunApi.setSelectedChaebun(chaebun);
  };

  // ============================================================================
  // 채번 추가
  // ============================================================================

  /**
   * @function handleInsertChaebun
   * @description 채번 추가 처리
   * @param {ChaebunFormData} formData - 채번 폼 데이터
   * @returns {Promise<boolean>} 성공 여부
   */
  const handleInsertChaebun = async (
    formData: ChaebunFormData
  ): Promise<boolean> => {
    try {
      // 유효성 검사
      if (!formData.seqId || formData.seqId.trim() === "") {
        await showAlert({
          type: "warning",
          message: "채번 ID를 입력해주세요.",
        });
        return false;
      }

      if (!formData.seqName || formData.seqName.trim() === "") {
        await showAlert({
          type: "warning",
          message: "채번명을 입력해주세요.",
        });
        return false;
      }

      if (!formData.pattern || formData.pattern.trim() === "") {
        await showAlert({
          type: "warning",
          message: "패턴을 입력해주세요.",
        });
        return false;
      }

      if (!formData.prefix || formData.prefix.trim() === "") {
        await showAlert({
          type: "warning",
          message: "접두어를 입력해주세요.",
        });
        return false;
      }

      if (!formData.step || formData.step <= 0) {
        await showAlert({
          type: "warning",
          message: "증가량은 1 이상이어야 합니다.",
        });
        return false;
      }

      if (!formData.length || formData.length <= 0) {
        await showAlert({
          type: "warning",
          message: "길이는 1 이상이어야 합니다.",
        });
        return false;
      }

      // 채번 추가
      await chaebunApi.insertChaebun(formData);

      await showAlert({
        type: "success",
        message: "채번이 성공적으로 추가되었습니다.",
      });

      // 리스트 재조회
      await chaebunApi.refetch();

      return true;
    } catch (error) {
      await showAlert({
        type: "error",
        message: "채번 추가에 실패했습니다.",
      });
      return false;
    }
  };

  // ============================================================================
  // 채번 수정
  // ============================================================================

  /**
   * @function handleUpdateChaebun
   * @description 채번 수정 처리
   * @param {ChaebunFormData} formData - 채번 폼 데이터
   * @returns {Promise<boolean>} 성공 여부
   */
  const handleUpdateChaebun = async (
    formData: ChaebunFormData
  ): Promise<boolean> => {
    try {
      // 유효성 검사
      if (!formData.seqId || formData.seqId.trim() === "") {
        await showAlert({
          type: "warning",
          message: "채번 ID를 입력해주세요.",
        });
        return false;
      }

      if (!formData.seqName || formData.seqName.trim() === "") {
        await showAlert({
          type: "warning",
          message: "채번명을 입력해주세요.",
        });
        return false;
      }

      if (!formData.pattern || formData.pattern.trim() === "") {
        await showAlert({
          type: "warning",
          message: "패턴을 입력해주세요.",
        });
        return false;
      }

      if (!formData.prefix || formData.prefix.trim() === "") {
        await showAlert({
          type: "warning",
          message: "접두어를 입력해주세요.",
        });
        return false;
      }

      if (!formData.step || formData.step <= 0) {
        await showAlert({
          type: "warning",
          message: "증가량은 1 이상이어야 합니다.",
        });
        return false;
      }

      if (!formData.length || formData.length <= 0) {
        await showAlert({
          type: "warning",
          message: "길이는 1 이상이어야 합니다.",
        });
        return false;
      }

      // 채번 수정
      await chaebunApi.updateChaebun(formData);

      await showAlert({
        type: "success",
        message: "채번이 성공적으로 수정되었습니다.",
      });

      // 리스트 재조회
      await chaebunApi.refetch();

      return true;
    } catch (error) {
      await showAlert({
        type: "error",
        message: "채번 수정에 실패했습니다.",
      });
      return false;
    }
  };

  // ============================================================================
  // 채번 삭제
  // ============================================================================

  /**
   * @function handleDeleteChaebun
   * @description 채번 삭제 처리
   * @param {string} seqId - 채번 ID
   * @returns {Promise<boolean>} 성공 여부
   */
  const handleDeleteChaebun = async (seqId: string): Promise<boolean> => {
    try {
      if (!seqId) {
        await showAlert({
          type: "warning",
          message: "삭제할 채번을 선택해주세요.",
        });
        return false;
      }

      // 채번 삭제
      await chaebunApi.deleteChaebun(seqId);

      await showAlert({
        type: "success",
        message: "채번이 성공적으로 삭제되었습니다.",
      });

      // 선택 해제 및 리스트 재조회
      chaebunApi.setSelectedChaebun(null);
      await chaebunApi.refetch();

      return true;
    } catch (error) {
      await showAlert({
        type: "error",
        message: "채번 삭제에 실패했습니다.",
      });
      return false;
    }
  };

  // ============================================================================
  // 채번 일괄 삭제
  // ============================================================================

  /**
   * @function handleBulkDeleteChaebun
   * @description 채번 일괄 삭제 처리
   * @param {string[]} seqIds - 채번 ID 배열
   * @returns {Promise<void>}
   */
  const handleBulkDeleteChaebun = async (seqIds: string[]): Promise<void> => {
    try {
      if (!seqIds || seqIds.length === 0) {
        await showAlert({
          type: "warning",
          message: "삭제할 채번을 선택해주세요.",
        });
        return;
      }

      // 각 채번 삭제
      for (const seqId of seqIds) {
        await chaebunApi.deleteChaebun(seqId);
      }

      await showAlert({
        type: "success",
        message: `${seqIds.length}개의 채번이 성공적으로 삭제되었습니다.`,
      });

      // 선택 해제 및 리스트 재조회
      chaebunApi.setSelectedChaebun(null);
      await chaebunApi.refetch();
    } catch (error) {
      await showAlert({
        type: "error",
        message: "채번 일괄 삭제에 실패했습니다.",
      });
    }
  };

  // ============================================================================
  // 채번 생성 (번호 발급)
  // ============================================================================

  /**
   * @function handleGenerateSeq
   * @description 채번 생성 (다음 번호 발급)
   * @param {string} seqId - 채번 ID
   * @returns {Promise<void>}
   */
  const handleGenerateSeq = async (seqId: string): Promise<void> => {
    try {
      if (!seqId) {
        await showAlert({
          type: "warning",
          message: "채번을 선택해주세요.",
        });
        return;
      }

      const generatedSeq = await chaebunApi.generateSeq(seqId);

      await showAlert({
        type: "success",
        message: `생성된 채번: ${generatedSeq}`,
      });

      // 리스트 재조회 (현재값 업데이트 반영)
      await chaebunApi.refetch();
    } catch (error) {
      await showAlert({
        type: "error",
        message: "채번 생성에 실패했습니다.",
      });
    }
  };

  // ============================================================================
  // 전체 데이터 재조회
  // ============================================================================

  /**
   * @function refetch
   * @description 채번 리스트 재조회
   * @returns {Promise<void>}
   */
  const refetch = async (): Promise<void> => {
    await chaebunApi.refetch();
  };

  return {
    loading: chaebunApi.loading,
    error: chaebunApi.error,
    chaebunList: chaebunApi.chaebunList,
    selectedChaebun: chaebunApi.selectedChaebun,
    tableData,
    handleSearchChaebun,
    handleChaebunSelect,
    handleInsertChaebun,
    handleUpdateChaebun,
    handleDeleteChaebun,
    handleBulkDeleteChaebun,
    handleGenerateSeq,
    refetch,
  };
};
