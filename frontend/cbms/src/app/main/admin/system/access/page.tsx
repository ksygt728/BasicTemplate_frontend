"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import SplitFrame from "@/components/layout/frame/SplitFrame";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { Table } from "@/components/common/themed/Table";
import { Button } from "@/components/common/themed/Button";
import { Card } from "@/components/common/themed/Card";
import { searchFields, logTableColumns, detailFields } from "./info";
import { useLogApiService } from "@/service/LogApiService";
import { useAlert } from "@/contexts/AlertContext";
import { theme } from "@/styles/theme";

/**
 * @파일명 : page.tsx
 * @설명 : 사용자 접속 로그 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
 */
export default function AccessLogPage() {
  const {
    // 상태
    loading,
    error,
    selectedLogId,
    searchFormData,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    first,
    last,

    // 원본 데이터
    logData,
    selectedLogData,

    // 테이블 데이터
    logListData,
    logDetailData,

    // 상태 변경
    setSearchFormData,
    setSelectedLogId,

    // 비즈니스 로직
    handleSearch,
    handleTableRowClick,
    handlePageChange,
    handlePageSizeChange,
    refetch,
  } = useLogApiService();

  const { showAlert } = useAlert();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 선택된 로그의 상세 정보
  const [selectedLog, setSelectedLog] = useState<any>(null);

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

  // 초기 데이터 로드 - 제거 (사용자가 직접 검색해야 함)
  // useEffect(() => {
  //   if (isFetched.current) return;
  //   isFetched.current = true;

  //   refetch();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // ============================================================================
  // 테이블 Row 클릭 핸들러
  // ============================================================================

  /**
   * @function handleTableRowClickInstant
   * @description 테이블 row 클릭 시 상세정보 즉시 표시 (API 호출 없이 row 데이터 사용)
   */
  const handleTableRowClickInstant = (row: any) => {
    setSelectedLogId(row.logId);
    setSelectedLog(row); // 상세정보 즉시 세팅
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
  // 렌더링: 좌측 - 로그 리스트
  // ============================================================================

  const renderLeftContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 검색 폼 */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <Card title="접속 로그 검색">
          <SearchForm
            fields={searchFields}
            onSearch={handleSearch}
            loading={loading}
          />
        </Card>
      </div>

      {/* 로그 목록 테이블 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Card title="접속 로그 목록" subtitle={`총 ${totalElements}건`}>
          <Table
            columns={logTableColumns}
            data={logListData}
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
            emptyText="검색된 로그가 없습니다."
          />
        </Card>
      </div>
    </div>
  );

  // ============================================================================
  // 렌더링: 우측 - 로그 상세 정보
  // ============================================================================

  const renderRightContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Card
          title="로그 상세 정보"
          subtitle={selectedLog ? `로그 ID: ${selectedLog.logId}` : ""}
        >
          {selectedLog ? (
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
                            `${field.label}: ${selectedLog[field.name] || "-"}`
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
                        {selectedLog[field.name] || "-"}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Request Body 섹션 */}
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
                    요청 내용 (Request Body)
                  </h4>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      copyToClipboard(
                        selectedLog.requestBody || "요청 내용이 없습니다.",
                        "Request Body"
                      )
                    }
                  >
                    복사
                  </Button>
                </div>
                <div
                  style={{
                    maxHeight: "300px",
                    overflow: "auto",
                    backgroundColor: theme.colors.background.surface,
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.sm,
                    border: `1px solid ${theme.colors.border.default}`,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    MozUserSelect: "text",
                    msUserSelect: "text",
                    cursor: "text",
                  }}
                >
                  {selectedLog.requestBody
                    ? highlightJson(selectedLog.requestBody)
                    : "요청 내용이 없습니다."}
                </div>
              </div>

              {/* Response Body 섹션 */}
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
                    응답 내용 (Response Body)
                  </h4>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      copyToClipboard(
                        selectedLog.responseBody || "응답 내용이 없습니다.",
                        "Response Body"
                      )
                    }
                  >
                    복사
                  </Button>
                </div>
                <div
                  style={{
                    maxHeight: "300px",
                    overflow: "auto",
                    backgroundColor: theme.colors.background.surface,
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.sm,
                    border: `1px solid ${theme.colors.border.default}`,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    MozUserSelect: "text",
                    msUserSelect: "text",
                    cursor: "text",
                  }}
                >
                  {selectedLog.responseBody
                    ? highlightJson(selectedLog.responseBody)
                    : "응답 내용이 없습니다."}
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
              좌측 목록에서 로그를 선택하세요.
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

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * @function formatJson
 * @description JSON 문자열을 읽기 쉽게 포맷팅
 * @param {string} jsonString - JSON 문자열
 * @returns {string} 포맷팅된 JSON 문자열
 */
function formatJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // JSON 파싱 실패 시 원본 반환
    return jsonString;
  }
}

/**
 * @function highlightJson
 * @description JSON 문자열에 구문 강조 적용
 * @param {string} jsonString - JSON 문자열
 * @returns {JSX.Element} 구문 강조된 JSX
 */
function highlightJson(jsonString: string): JSX.Element {
  try {
    const formatted = formatJson(jsonString);
    const highlighted = formatted.split("\n").map((line, i) => {
      // 키 ("key":) - 청록색
      line = line.replace(
        /"([^"]+)":/g,
        '<span style="color: #4ec9b0">"$1"</span>:'
      );
      // 문자열 값 - 주황색
      line = line.replace(
        /: "([^"]*)"/g,
        ': <span style="color: #ce9178">"$1"</span>'
      );
      // 숫자 - 연두색
      line = line.replace(
        /: (\d+)/g,
        ': <span style="color: #b5cea8">$1</span>'
      );
      // boolean - 파란색
      line = line.replace(
        /: (true|false)/g,
        ': <span style="color: #569cd6">$1</span>'
      );
      // null - 파란색
      line = line.replace(
        /: (null)/g,
        ': <span style="color: #569cd6">$1</span>'
      );
      return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />;
    });
    return <>{highlighted}</>;
  } catch {
    return <>{jsonString}</>;
  }
}
