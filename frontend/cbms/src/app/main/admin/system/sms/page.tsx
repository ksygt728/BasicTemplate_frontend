"use client";

import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import type { AdvancedTableColumn } from "@/components/common/themed/AdvancedTable";
import { SearchForm } from "@/components/common/themed/SearchForm";
import SplitFrame from "@/components/layout/frame/SplitFrame";
import { useEffect, useRef, useState } from "react";
import { searchOptions, leftTableColumns, rightTableColumns } from "./info";
import { useSmsService } from "@/service/SmsService";
import { TextViewModal } from "@/components/common/themed/TextViewModal";

/**
 * @파일명 : page.tsx
 * @설명 : SMS 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.17
 */
export default function SmsManagementPage() {
  const {
    loading,
    error,
    selectedSmsId,
    searchFormData,
    leftTableData,
    rightTableData,
    setSearchFormData,
    setSelectedSmsId,
    handleSearch,
    handleLeftTableRowClick,
    refetch,
    handleInsertSms,
    handleUpdateSms,
    handleDeleteSms,
    handleBulkDeleteSms,
  } = useSmsService();

  const isFetched = useRef(false);

  const [textModalOpen, setTextModalOpen] = useState(false);
  const [textModalTitle, setTextModalTitle] = useState("");
  const [textModalContent, setTextModalContent] = useState("");

  const handleTextClick = (title: string, content: string) => {
    setTextModalTitle(title);
    setTextModalContent(content);
    setTextModalOpen(true);
  };

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const leftPanelContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        height: "100%",
      }}
    >
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
              col.key === "text" || col.key === "description"
                ? (value: any) => truncateText(value, 30)
                : undefined,
          }))}
          data={leftTableData}
          rowKey="smsId"
          title="SMS 관리"
          subTitle="SMS 기준정보"
          description="시스템에서 사용하는 SMS 템플릿 목록입니다."
          onRowClick={handleLeftTableRowClick}
          onAdd={handleInsertSms}
          onUpdate={(id, record) => handleUpdateSms(id as string, record)}
          onDelete={(id) => handleDeleteSms(id as string)}
          onBulkDelete={(ids) => {
            const selectedRows = leftTableData.filter((row: any) =>
              ids.includes(row.smsId)
            );
            return handleBulkDeleteSms(selectedRows);
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

  const rightPanelContent = (
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
          col.key === "text" || col.key === "errorMsg"
            ? (value: any) => truncateText(value, 30)
            : undefined,
      }))}
      data={rightTableData}
      rowKey="logId"
      title={
        selectedSmsId ? `${selectedSmsId} - SMS 발송 이력` : "SMS 발송 이력"
      }
      subTitle="SMS 이력정보"
      description={
        selectedSmsId
          ? `${selectedSmsId} SMS의 발송 이력 정보입니다.`
          : "좌측에서 SMS를 선택하면 발송 이력이 표시됩니다."
      }
      pagination={{ pageSize: 50 }}
      editable={false}
      exportable={true}
      filtering={true}
      striped={true}
      hoverable={true}
    />
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

      <TextViewModal
        isOpen={textModalOpen}
        onClose={() => setTextModalOpen(false)}
        title={textModalTitle}
        content={textModalContent}
      />
    </>
  );
}
