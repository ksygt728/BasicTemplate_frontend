"use client";

import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import type { AdvancedTableColumn } from "@/components/common/themed/AdvancedTable";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { Frame } from "@/components/common/themed/Frame";
import { useEffect, useRef } from "react";
import { searchOptions, tableColumns } from "./info";
import { useMulLangService } from "@/service/MulLangService";

/**
 * @파일명 : page.tsx
 * @설명 : 다국어 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */
export default function MulLangManagementPage() {
  const {
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
  } = useMulLangService();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // UI 렌더링
  // ============================================================================

  /**
   * @화면구조 검색폼 + 단일 테이블 레이아웃
   * @설명
   *   - 상단: 검색 폼 (언어코드, 언어유형, 언어명, 언어구분, 사용여부)
   *   - 하단: 다국어 관리 테이블 (CRUD 기능 포함)
   * @데이터흐름 검색조건 입력 → 테이블 데이터 필터링
   */

  return (
    <Frame mode="basic">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          height: "100%",
          padding: "24px",
        }}
      >
        {/* 검색 폼 */}
        <div
          style={{
            backgroundColor: "var(--background-surface)",
            borderRadius: "12px",
            padding: "24px",
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
            fields={searchOptions.map((opt, index) => ({
              name: opt.name,
              label: opt.label,
              type: opt.type as any,
              placeholder: opt.placeholder,
              options: opt.options,
              required: opt.required,
              key: `search-field-${opt.name}-${index}`,
            }))}
            onSearch={handleSearch}
            loading={loading}
            initialValues={searchFormData}
            columns={3}
          />
        </div>

        {/* 다국어 관리 테이블 */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <AdvancedTable
            columns={tableColumns.map((col: any) => ({
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
            data={tableData}
            rowKey="id"
            title="다국어 관리"
            subTitle="언어 설정"
            description={`[사용법]
                            1. 시스템에서 사용하는 다국어 설정 목록입니다.
                            2. 백엔드 서비스가 시작될 떄, 최초 한 번 다국어 데이터를 Redis에 저장하게 되고, 이후에 Redis의 데이터를 사용하기 떄문에 추가/수정된 데이터는 Redis에 반영되지 않습니다.
                            3. => 만약 추가/수정 후 시스템 적용을 위해선 캐시 Reload(or 백엔드 서비스 재시작)이 필요합니다.
                            4. 캐시 Reload 시스템 관리 > 시스템 설정 > 캐시 재적재 메뉴에서 수행할 수 있습니다.
                            5. 다국어 관리의 언어코드, 언어구분, 언어유형은 복합키로 구성되어 있어, 언어코드와 언어구분, 언어유형은 수정할 수 없습니다.
                              * Redis 저장 Fromat : [언어유형]|[언어구분].[언어코드]
                          `}
            onAdd={handleInsertMulLang}
            onUpdate={(id, record) => handleUpdateMulLang(id as string, record)}
            onDelete={(id) => handleDeleteMulLang(id as string)}
            onBulkDelete={(ids) => {
              const selectedRows = tableData.filter((row: any) =>
                ids.includes(row.id)
              );
              return handleBulkDeleteMulLang(selectedRows);
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
    </Frame>
  );
}
