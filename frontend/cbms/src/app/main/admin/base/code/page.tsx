"use client";

import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import type { AdvancedTableColumn } from "@/components/common/themed/AdvancedTable";
import { SearchForm } from "@/components/common/themed/SearchForm";
import TripleSplitFrame from "@/components/layout/frame/TripleSplitFrame";
import { MenuList } from "@/components/common/themed/MenuList";
import type { MenuItem } from "@/components/common/themed/MenuList";
import { useEffect, useRef } from "react";
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

    // 원본 데이터
    codeData,

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

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 동적 컬럼 생성 (우측 하단 테이블)
  const _rightBottomTableColumns = rightBottomTableColumns(
    codeData,
    selectedGroupCd
  );

  // ============================================================================
  // 로딩 & 에러 처리
  // ============================================================================

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">로딩 중...</div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full gap-4">
  //       <div className="text-red-500">에러: {error}</div>
  //       <button
  //         onClick={() => refetch()}
  //         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  //       >
  //         다시 시도
  //       </button>
  //     </div>
  //   );
  // }

  // ============================================================================
  // UI 렌더링
  // ============================================================================

  /**
   * @화면구조 상단 메뉴 + 삼중 패널 레이아웃
   * @설명
   *   - 상단: 관리자 메뉴 (코드관리, 사용자관리 등)
   *   - 좌측: 그룹코드 관리 테이블
   *   - 우측 상단: 속성코드 관리 테이블 (선택된 그룹의 속성들)
   *   - 우측 하단: 상세코드 관리 테이블 (선택된 그룹의 상세코드들 + 동적 속성 컬럼들)
   * @데이터흐름 좌측 그룹 선택 → 우측 두 테이블 필터링
   */

  // 좌측 패널: 검색폼 + 그룹코드 관리 테이블 컴포넌트
  const leftPanelContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        height: "100%",
      }}
    >
      {/* 검색 폼 */}
      <div
        style={{
          backgroundColor: "var(--background-surface)",
          borderRadius: "12px",
          padding: "24px",
          margin: "24px",
          border: "1px solid var(--border-default)",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          조회
        </h2>
        <SearchForm
          fields={searchOptions.map((opt) => ({
            name: opt.value,
            label: opt.label,
            type: opt.type as any,
            placeholder: opt.placeholder,
            options: opt.options,
            required: opt.required,
          }))}
          onSearch={handleSearch}
          loading={loading}
          initialValues={searchFormData}
          columns={3}
        />
      </div>{" "}
      {/* 그룹코드 관리 테이블 */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <AdvancedTable
          columns={leftTableColumns.map((col: any) => ({
            key: col.key,
            title: col.label || col.key,
            dataIndex: col.key,
            width: col.width,
            align: "left",
            sortable: col.sortable,
            filterable: true,
            editable: col.editable,
            type: col.type,
            options: col.options,
            required: col.required,
          }))}
          data={leftTableData}
          rowKey="grpCd"
          title="코드 그룹 관리"
          subTitle="그룹코드"
          description="시스템에서 사용하는 공통 코드 그룹 목록입니다."
          onRowClick={handleLeftTableRowClick}
          onAdd={handleInsertGroupCode}
          onUpdate={(id, record) => handleUpdateGroupCode(id as string, record)}
          onDelete={(id) => handleDeleteGroupCode(id as string)}
          onBulkDelete={(ids) => {
            const selectedRows = leftTableData.filter((row: any) =>
              ids.includes(row.grpCd)
            );
            return handleBulkDeleteGroupCode(selectedRows);
          }}
          pagination={{ pageSize: 50 }}
          selection={{ type: "checkbox" }}
          editable={true}
          exportable={true}
          filtering={true}
          striped={true}
          hoverable={true}
        />
      </div>
    </div>
  );

  // 우측 상단 패널: 속성코드 관리 테이블 컴포넌트
  const rightTopPanelContent = (
    <AdvancedTable
      columns={rightTopTableColumns.map((col: any) => ({
        key: col.key,
        title: col.label || col.key,
        dataIndex: col.key,
        width: col.width,
        align: "left",
        sortable: col.sortable,
        filterable: true,
        editable: col.editable,
        type: col.type,
        options: col.options,
        required: col.required,
      }))}
      data={rightTopTableData}
      rowKey="attrCd"
      title={selectedGroupCd ? `${selectedGroupCd} - 속성 정보` : "속성 정보"}
      subTitle="속성 코드"
      description={
        selectedGroupCd
          ? `${selectedGroupCd} 그룹의 속성 정보입니다.`
          : "좌측에서 그룹을 선택하면 속성 정보가 표시됩니다."
      }
      onAdd={selectedGroupCd ? handleInsertAttributeCode : undefined}
      onUpdate={
        selectedGroupCd
          ? (id, record) => handleUpdateAttributeCode(id as string, record)
          : undefined
      }
      onDelete={
        selectedGroupCd
          ? (id) => handleDeleteAttributeCode(id as string)
          : undefined
      }
      onBulkDelete={
        selectedGroupCd
          ? (ids) => {
              const selectedRows = rightTopTableData.filter((row: any) =>
                ids.includes(row.attrCd)
              );
              return handleBulkDeleteAttributeCode(selectedRows);
            }
          : undefined
      }
      pagination={{ pageSize: 30 }}
      selection={{ type: "checkbox" }}
      editable={!!selectedGroupCd}
      exportable={true}
      filtering={true}
      striped={true}
      hoverable={true}
    />
  );

  // 우측 하단 패널: 상세코드 관리 테이블 컴포넌트
  const rightBottomPanelContent = (
    <AdvancedTable
      columns={_rightBottomTableColumns.map((col: any) => ({
        key: col.key,
        title: col.label || col.key,
        dataIndex: col.key,
        width: col.width,
        align: "left",
        sortable: col.sortable,
        filterable: true,
        editable: col.editable,
        type: col.type,
        options: col.options,
        required: col.required,
      }))}
      data={rightBottomTableData}
      rowKey="dtlCd"
      title={selectedGroupCd ? `${selectedGroupCd} - 상세 코드` : "상세 코드"}
      subTitle="상세 코드"
      description={
        selectedGroupCd
          ? `${selectedGroupCd} 그룹의 상세 코드 목록입니다.`
          : "좌측에서 그룹을 선택하면 상세 코드가 표시됩니다."
      }
      onAdd={selectedGroupCd ? handleInsertDetailCode : undefined}
      onUpdate={
        selectedGroupCd
          ? (id, record) => handleUpdateDetailCode(id as string, record)
          : undefined
      }
      onDelete={
        selectedGroupCd
          ? (id) => handleDeleteDetailCode(id as string)
          : undefined
      }
      onBulkDelete={
        selectedGroupCd
          ? (ids) => {
              const selectedRows = rightBottomTableData.filter((row: any) =>
                ids.includes(row.dtlCd)
              );
              return handleBulkDeleteDetailCode(selectedRows);
            }
          : undefined
      }
      pagination={{ pageSize: 50 }}
      selection={{ type: "checkbox" }}
      editable={!!selectedGroupCd}
      exportable={true}
      filtering={true}
      striped={true}
      hoverable={true}
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
