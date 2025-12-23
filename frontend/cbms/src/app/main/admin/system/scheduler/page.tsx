"use client";

import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import type { AdvancedTableColumn } from "@/components/common/themed/AdvancedTable";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { TextViewModal } from "@/components/common/themed/TextViewModal";
import { Button } from "@/components/common/themed/Button";
import SplitFrame from "@/components/layout/frame/SplitFrame";
import { useEffect, useRef, useState } from "react";
import {
  searchOptions,
  leftTableColumns,
  rightTableColumns,
} from "@/app/main/admin/system/scheduler/info";
import { useSchedulerService } from "@/service/SchedulerService";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : page.tsx
 * @설명 : 스케줄러 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */
export default function SchedulerManagementPage() {
  const {
    // 상태
    loading,
    error,
    selectedScheId,
    searchFormData,

    // 테이블 데이터
    leftTableData,
    rightTableData,

    // 상태 변경
    setSearchFormData,

    // 비즈니스 로직
    handleSearch,
    handleLeftTableRowClick,
    refetch,

    // 스케줄러 CRUD
    handleInsertScheduler,
    handleUpdateScheduler,
    handleDeleteScheduler,
    handleBulkDeleteScheduler,
    handleExecuteScheduler,
  } = useSchedulerService();

  const { showAlert } = useAlert();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 모달 상태
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [textModalTitle, setTextModalTitle] = useState("");
  const [textModalContent, setTextModalContent] = useState("");

  /**
   * @function handleTextClick
   * @description 긴 텍스트 클릭 시 모달로 전체 내용 표시
   * @param {string} title - 모달 제목
   * @param {string} content - 표시할 내용
   */
  const handleTextClick = (title: string, content: string) => {
    setTextModalTitle(title);
    setTextModalContent(content);
    setTextModalOpen(true);
  };

  /**
   * @function truncateText
   * @description 긴 텍스트를 잘라서 표시
   * @param {string} text - 원본 텍스트
   * @param {number} maxLength - 최대 길이
   * @returns {React.ReactNode} 잘린 텍스트와 클릭 가능한 링크
   */
  const truncateText = (
    text: string,
    maxLength: number = 50
  ): React.ReactNode => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{text.substring(0, maxLength)}...</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTextClick("전체 내용", text);
          }}
          style={{
            padding: "2px 8px",
            fontSize: "12px",
            backgroundColor: "var(--primary-default)",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          전체보기
        </button>
      </div>
    );
  };

  /**
   * @function handleExecuteClick
   * @description 스케줄러 직접 실행 버튼 클릭 핸들러
   */
  const handleExecuteClick = async () => {
    if (!selectedScheId) {
      await showAlert({
        type: "warning",
        title: "스케줄러 선택 필요",
        message: "실행할 스케줄러를 선택해주세요.",
      });
      return;
    }

    const confirmed = await showAlert({
      type: "info",
      title: "스케줄러 실행 확인",
      message: `${selectedScheId} 스케줄러를 직접 실행하시겠습니까?`,
      showCancel: true,
    });

    if (confirmed) {
      await handleExecuteScheduler(selectedScheId);
    }
  };

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
   * @화면구조 2분할 레이아웃
   * @설명
   *   - 좌측: 검색폼 + 스케줄러 기준정보 테이블
   *   - 우측: 스케줄러 실행 이력 테이블 (종료시간 기준 내림차순)
   * @데이터흐름 좌측 스케줄러 선택 → 우측 이력 테이블 필터링
   */

  // 좌측 패널: 검색폼 + 스케줄러 기준정보 테이블 컴포넌트
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
            name: opt.name,
            label: opt.label,
            type: opt.type as any,
            placeholder: opt.placeholder,
            options: opt.options,
            required: opt.required,
          }))}
          onSearch={handleSearch}
          loading={loading}
          initialValues={searchFormData}
          columns={2}
        />
      </div>

      {/* 스케줄러 기준정보 테이블 */}
      <div style={{ flex: 1, overflowX: "auto", overflowY: "visible" }}>
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
            required: col.required,
            options: col.options,
            render:
              col.key === "description" || col.key === "className"
                ? (value: any) => truncateText(value, 30)
                : col.key === "useYn"
                ? (value: any) => (value === "Y" ? "사용" : "미사용")
                : undefined,
          }))}
          data={leftTableData}
          rowKey="scheId"
          title="스케줄러 관리"
          subTitle="스케줄러 기준정보"
          description="시스템에서 사용하는 스케줄러 목록입니다."
          onRowClick={handleLeftTableRowClick}
          onAdd={handleInsertScheduler}
          onUpdate={(id, record) => handleUpdateScheduler(id as string, record)}
          onDelete={(id) => handleDeleteScheduler(id as string)}
          onBulkDelete={(ids) => {
            const selectedRows = leftTableData.filter((row: any) =>
              ids.includes(row.scheId)
            );
            return handleBulkDeleteScheduler(selectedRows);
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

  // 우측 패널: 스케줄러 실행 이력 테이블 컴포넌트
  const rightPanelContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "16px",
      }}
    >
      {/* 실행 버튼 */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleExecuteClick}
          disabled={!selectedScheId}
          variant="primary"
          size="md"
        >
          스케줄러 직접 실행
        </Button>
      </div>

      {/* 이력 테이블 */}
      <div style={{ flex: 1, overflowX: "auto", overflowY: "visible" }}>
        <AdvancedTable
          columns={rightTableColumns.map((col: any) => ({
            key: col.key,
            title: col.label || col.key,
            dataIndex: col.key,
            width: col.width,
            align: "left",
            sortable: col.sortable,
            filterable: true,
            editable: col.editable,
            type: col.type,
            required: col.required,
            render:
              col.key === "errorMsg"
                ? (value: any) => truncateText(value, 30)
                : col.key === "success"
                ? (value: any) =>
                    value === "Y" ? "성공" : value === "N" ? "실패" : value
                : col.key === "execTime"
                ? (value: any) => (value ? `${value}ms` : "-")
                : undefined,
          }))}
          data={rightTableData}
          rowKey="logId"
          title={
            selectedScheId
              ? `${selectedScheId} - 스케줄러 실행 이력`
              : "스케줄러 실행 이력"
          }
          subTitle="스케줄러 이력정보"
          description={
            selectedScheId
              ? `${selectedScheId} 스케줄러의 실행 이력 정보입니다. (종료시간 기준 내림차순)`
              : "좌측에서 스케줄러를 선택하면 실행 이력이 표시됩니다."
          }
          pagination={{ pageSize: 50 }}
          editable={false}
          exportable={true}
          filtering={true}
          striped={true}
          hoverable={true}
        />
      </div>
    </div>
  );

  return (
    <>
      <SplitFrame
        leftContent={leftPanelContent}
        rightContent={rightPanelContent}
        leftWidth="1/2"
        rightWidth="1/2"
        gap="gap-6"
        resizable={true}
      />

      {/* 텍스트 전체 보기 모달 */}
      <TextViewModal
        isOpen={textModalOpen}
        onClose={() => setTextModalOpen(false)}
        title={textModalTitle}
        content={textModalContent}
      />
    </>
  );
}
