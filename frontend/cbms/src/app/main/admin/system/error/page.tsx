"use client";

import React, { useState } from "react";
import SplitFrame from "@/components/layout/frame/SplitFrame";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { Table } from "@/components/common/themed/Table";
import { Button } from "@/components/common/themed/Button";
import { Card } from "@/components/common/themed/Card";
import { searchFields, errorLogTableColumns, detailFields } from "./info";
import { useLogErrorService } from "@/service/LogErrorService";
import { useAlert } from "@/contexts/AlertContext";
import { theme } from "@/styles/theme";

/**
 * @파일명 : page.tsx
 * @설명 : 에러 로그 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
 */
export default function ErrorLogPage() {
  const {
    // 상태
    loading,
    error,
    selectedErrId,
    searchFormData,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    first,
    last,

    // 원본 데이터
    errorLogData,
    selectedErrorLogData,

    // 테이블 데이터
    errorLogListData,
    errorLogDetailData,

    // 상태 변경
    setSearchFormData,
    setSelectedErrId,

    // 비즈니스 로직
    handleSearch,
    handleTableRowClick,
    handlePageChange,
    handlePageSizeChange,
    refetch,
  } = useLogErrorService();

  const { showAlert } = useAlert();

  // 선택된 에러 로그의 상세 정보
  const [selectedErrorLog, setSelectedErrorLog] = useState<any>(null);

  // ============================================================================
  // 복사 함수
  // ============================================================================

  /**
   * @function copyToClipboard
   * @description 텍스트를 클립보드에 복사
   */
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      await showAlert({
        type: "success",
        title: "복사 성공",
        message: `${label}이(가) 복사되었습니다.`,
      });
    } catch (err) {
      await showAlert({
        type: "error",
        title: "복사 실패",
        message: "클립보드 복사에 실패했습니다.",
      });
    }
  };

  // ============================================================================
  // 테이블 Row 클릭 핸들러
  // ============================================================================

  /**
   * @function handleTableRowClickInstant
   * @description 테이블 row 클릭 시 상세정보 즉시 표시 (API 호출 없이 row 데이터 사용)
   */
  const handleTableRowClickInstant = (row: any) => {
    setSelectedErrId(row.errId);
    setSelectedErrorLog(row); // 상세정보 즉시 세팅
  };

  // ============================================================================
  // 새로고침 핸들러
  // ============================================================================

  /**
   * @function handleRefresh
   * @description 데이터 새로고침
   */
  const handleRefresh = async () => {
    try {
      await refetch();
      await showAlert({
        type: "success",
        title: "새로고침 완료",
        message: "데이터가 새로고침되었습니다.",
      });
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "데이터 새로고침 중 오류가 발생했습니다.",
      });
    }
  };

  // ============================================================================
  // 렌더링: 좌측 - 에러 로그 리스트
  // ============================================================================

  const renderLeftContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 검색 폼 */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <Card title="에러 로그 검색">
          <SearchForm
            fields={searchFields}
            onSearch={handleSearch}
            loading={loading}
          />
        </Card>
      </div>

      {/* 에러 로그 목록 테이블 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Card title="에러 로그 목록" subtitle={`총 ${totalElements}건`}>
          <Table
            columns={errorLogTableColumns}
            data={errorLogListData}
            loading={loading}
            hoverable
            striped
            pagination={true}
            page={currentPage}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            first={first}
            last={last}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowClick={handleTableRowClickInstant}
            emptyText="검색된 에러 로그가 없습니다."
          />
        </Card>
      </div>
    </div>
  );

  // ============================================================================
  // 렌더링: 우측 - 에러 로그 상세 정보 (Stacktrace)
  // ============================================================================

  const renderRightContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Card
          title="에러 상세 정보"
          subtitle={
            selectedErrorLog ? `에러 ID: ${selectedErrorLog.errId}` : ""
          }
        >
          {selectedErrorLog ? (
            <div
              style={{
                flex: 1,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.md,
              }}
            >
              {/* 기본 정보 섹션 */}
              <div
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background.default,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border.default}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: theme.typography.weights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    기본 정보
                  </h4>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const basicInfo = detailFields
                        .map(
                          (field) =>
                            `${field.label}: ${
                              selectedErrorLog[field.name] || "-"
                            }`
                        )
                        .join("\n");
                      copyToClipboard(basicInfo, "기본 정보");
                    }}
                  >
                    복사
                  </Button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr",
                    gap: theme.spacing.sm,
                    fontSize: "14px",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    MozUserSelect: "text",
                    msUserSelect: "text",
                  }}
                >
                  {detailFields.map((field) => (
                    <React.Fragment key={field.name}>
                      <div
                        style={{
                          color: theme.colors.text.secondary,
                          fontWeight: theme.typography.weights.medium,
                        }}
                      >
                        {field.label}:
                      </div>
                      <div style={{ color: theme.colors.text.primary }}>
                        {selectedErrorLog[field.name] || "-"}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Error Stack Trace 섹션 */}
              <div
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background.default,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border.default}`,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: theme.typography.weights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    에러 스택 트레이스 (Stack Trace)
                  </h4>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      copyToClipboard(
                        selectedErrorLog.errStack ||
                          "스택 트레이스가 없습니다.",
                        "Stack Trace"
                      )
                    }
                  >
                    복사
                  </Button>
                </div>
                <div
                  style={{
                    flex: 1,
                    overflow: "auto",
                    backgroundColor: theme.colors.background.surface,
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.sm,
                    border: `1px solid ${theme.colors.border.default}`,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    color: "#60a5fa",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    MozUserSelect: "text",
                    msUserSelect: "text",
                    cursor: "text",
                    minHeight: "300px",
                    maxHeight: "600px",
                  }}
                >
                  {selectedErrorLog.errStack || "스택 트레이스가 없습니다."}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.text.secondary,
                fontSize: "14px",
              }}
            >
              좌측 목록에서 에러 로그를 선택하세요.
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  // ============================================================================
  // 메인 렌더링
  // ============================================================================

  return (
    <div style={{ padding: theme.spacing.lg, height: "100%" }}>
      <SplitFrame
        leftContent={renderLeftContent()}
        rightContent={renderRightContent()}
        leftWidth="50%"
        rightWidth="50%"
        gap="gap-4"
        resizable
      />
    </div>
  );
}
