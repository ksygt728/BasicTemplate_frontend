"use client";

import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import type { AdvancedTableColumn } from "@/components/common/themed/AdvancedTable";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { TextViewModal } from "@/components/common/themed/TextViewModal";
import SplitFrame from "@/components/layout/frame/SplitFrame";
import { useEffect, useRef, useState } from "react";
import {
  searchOptions,
  leftTableColumns,
  rightTableColumns,
} from "@/app/main/admin/system/mail/info";
import { useMailService } from "@/service/MailService";

/**
 * @파일명 : page.tsx
 * @설명 : 메일 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */
export default function MailManagementPage() {
  const {
    // 상태
    loading,
    error,
    selectedMailId,
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

    // 메일 CRUD
    handleInsertMail,
    handleUpdateMail,
    handleDeleteMail,
    handleBulkDeleteMail,
  } = useMailService();

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
   *   - 좌측: 검색폼 + 메일 기준정보 테이블
   *   - 우측: 메일 발송 이력 테이블
   * @데이터흐름 좌측 메일 선택 → 우측 이력 테이블 필터링
   */

  // 좌측 패널: 검색폼 + 메일 기준정보 테이블 컴포넌트
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

      {/* 메일 기준정보 테이블 */}
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
              col.key === "content" || col.key === "description"
                ? (value: any) => truncateText(value, 30)
                : undefined,
          }))}
          data={leftTableData}
          rowKey="mailId"
          title="메일 관리"
          subTitle="메일 기준정보"
          description="시스템에서 사용하는 메일 템플릿 목록입니다."
          onRowClick={handleLeftTableRowClick}
          onAdd={handleInsertMail}
          onUpdate={(id, record) => handleUpdateMail(id as string, record)}
          onDelete={(id) => handleDeleteMail(id as string)}
          onBulkDelete={(ids) => {
            const selectedRows = leftTableData.filter((row: any) =>
              ids.includes(row.mailId)
            );
            return handleBulkDeleteMail(selectedRows);
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

  // 우측 패널: 메일 발송 이력 테이블 컴포넌트
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
          col.key === "content" || col.key === "errorMsg"
            ? (value: any) => truncateText(value, 30)
            : col.key === "success"
            ? (value: any) =>
                value === "Y" ? "성공" : value === "N" ? "실패" : value
            : undefined,
      }))}
      data={rightTableData}
      rowKey="logId"
      title={
        selectedMailId ? `${selectedMailId} - 메일 발송 이력` : "메일 발송 이력"
      }
      subTitle="메일 이력정보"
      description={
        selectedMailId
          ? `${selectedMailId} 메일의 발송 이력 정보입니다.`
          : "좌측에서 메일을 선택하면 발송 이력이 표시됩니다."
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
