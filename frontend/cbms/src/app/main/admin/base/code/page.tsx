"use client";

import BasicTableView from "@/components/common/table/BasicTableView";
import SearchForm from "@/components/common/searchForm/SearchForm";
import TripleSplitFrame from "@/components/layout/frame/TripleSplitFrame";
import { useEffect } from "react";
import {
  searchOptions,
  leftTableColumns,
  rightTopTableColumns,
  rightBottomTableColumns,
} from "@/app/main/admin/base/code/info";
import { useCodeService } from "@/service/CodeService";

/**
 * @파일명 : page.tsx
 * @설명 : 공통 코드 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.10.18
 * @변경이력 :
 *       2025.10.18 김승연 최초 생성
 *       2025.12.01 김승연 비즈니스 로직 분리 (useCodeService로 이동)
 */
export default function CodeManagementPage() {
  const {
    // 상태
    loading,
    error,
    selectedGroupCd,
    searchFormData,

    // 테이블 데이터
    leftTableData,
    rightTopTableData,
    rightBottomTableData,

    // 상태 변경
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
  } = useCodeService();

  // 초기 데이터 로드
  useEffect(() => {
    refetch();
  }, [refetch]);

  // 동적 컬럼 생성 (우측 하단 테이블)
  const _rightBottomTableColumns = rightBottomTableColumns(
    { content: leftTableData },
    selectedGroupCd
  );

  // ============================================================================
  // 로딩 & 에러 처리
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">로딩 중...</div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-red-500">에러: {error}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // ============================================================================
  // UI 렌더링
  // ============================================================================

  /**
   * @화면구조 삼중 패널 레이아웃
   * @설명
   *   - 좌측: 그룹코드 관리 테이블
   *   - 우측 상단: 속성코드 관리 테이블 (선택된 그룹의 속성들)
   *   - 우측 하단: 상세코드 관리 테이블 (선택된 그룹의 상세코드들 + 동적 속성 컬럼들)
   * @데이터흐름 좌측 그룹 선택 → 우측 두 테이블 필터링
   */
  // 좌측 패널: 검색폼 + 그룹코드 관리 테이블 컴포넌트
  const leftPanelContent = (
    <div className="space-y-4">
      {/* 검색 폼 */}
      <SearchForm
        key="code-search-form"
        searchOptions={searchOptions}
        onSearch={handleSearch}
        loading={loading}
        className="mb-4"
        searchData={searchFormData}
        onSearchDataChange={setSearchFormData}
      />

      {/* 그룹코드 관리 테이블 */}
      <BasicTableView
        columns={leftTableColumns}
        data={leftTableData}
        title="코드 그룹 관리"
        subTitle="그룹코드"
        description="시스템에서 사용하는 공통 코드 그룹 목록입니다."
        onRowClick={handleLeftTableRowClick}
        onInsert={handleInsertGroupCode}
        onUpdate={handleUpdateGroupCode}
        onDelete={handleDeleteGroupCode}
        onBulkCopy={handleBulkCopyGroupCode}
        onBulkDelete={handleBulkDeleteGroupCode}
      />
    </div>
  );

  // 우측 상단 패널: 속성코드 관리 테이블 컴포넌트
  const rightTopPanelContent = (
    <BasicTableView
      columns={rightTopTableColumns}
      data={rightTopTableData}
      title={selectedGroupCd ? `${selectedGroupCd} - 속성 정보` : "속성 정보"}
      subTitle="속성 코드"
      description={
        selectedGroupCd
          ? `${selectedGroupCd} 그룹의 속성 정보입니다.`
          : "좌측에서 그룹을 선택하면 속성 정보가 표시됩니다."
      }
      onInsert={selectedGroupCd ? handleInsertAttributeCode : undefined}
      onUpdate={selectedGroupCd ? handleUpdateAttributeCode : undefined}
      onDelete={selectedGroupCd ? handleDeleteAttributeCode : undefined}
      onBulkCopy={selectedGroupCd ? handleBulkCopyAttributeCode : undefined}
      onBulkDelete={selectedGroupCd ? handleBulkDeleteAttributeCode : undefined}
    />
  );

  // 우측 하단 패널: 상세코드 관리 테이블 컴포넌트
  const rightBottomPanelContent = (
    <BasicTableView
      columns={_rightBottomTableColumns}
      data={rightBottomTableData}
      title={selectedGroupCd ? `${selectedGroupCd} - 상세 코드` : "상세 코드"}
      subTitle="상세 코드"
      description={
        selectedGroupCd
          ? `${selectedGroupCd} 그룹의 상세 코드 목록입니다.`
          : "좌측에서 그룹을 선택하면 상세 코드가 표시됩니다."
      }
      onInsert={selectedGroupCd ? handleInsertDetailCode : undefined}
      onUpdate={selectedGroupCd ? handleUpdateDetailCode : undefined}
      onDelete={selectedGroupCd ? handleDeleteDetailCode : undefined}
      onBulkCopy={selectedGroupCd ? handleBulkCopyDetailCode : undefined}
      onBulkDelete={selectedGroupCd ? handleBulkDeleteDetailCode : undefined}
    />
  );

  return (
    <TripleSplitFrame
      leftContent={leftPanelContent}
      rightTopContent={rightTopPanelContent}
      rightBottomContent={rightBottomPanelContent}
    />
  );
}
