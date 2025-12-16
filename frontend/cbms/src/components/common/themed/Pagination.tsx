/**
 * @파일명 : Pagination.tsx
 * @설명 : 백엔드 페이지네이션을 위한 재사용 가능한 Pagination 컴포넌트
 * @작성일 : 2025.12.16
 * @기능 : 이전/다음 페이지, 페이지 크기 선택, 페이지 정보 표시
 */

"use client";

import React from "react";
import { theme } from "@/styles/theme";
import { Button } from "./Button";
import { Select } from "./Select";

export interface PaginationProps {
  /** 현재 페이지 번호 (0-based) */
  currentPage: number;
  /** 페이지당 항목 수 */
  pageSize: number;
  /** 전체 항목 수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 첫 번째 페이지 여부 */
  first?: boolean;
  /** 마지막 페이지 여부 */
  last?: boolean;
  /** 페이지 변경 콜백 (0-based) */
  onPageChange: (page: number) => void;
  /** 페이지 크기 변경 콜백 */
  onPageSizeChange: (size: number) => void;
  /** 사용 가능한 페이지 크기 옵션 */
  pageSizeOptions?: number[];
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalElements,
  totalPages,
  first = currentPage === 0,
  last = currentPage >= totalPages - 1,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 30, 50, 100, 500, 1000],
  loading = false,
  className = "",
}) => {
  // 표시할 시작/끝 인덱스 계산 (1-based for display)
  const startIndex = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

  // 페이지 변경 핸들러
  const handleFirstPage = () => {
    if (!first && !loading) {
      onPageChange(0);
    }
  };

  const handlePreviousPage = () => {
    if (!first && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!last && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (!last && !loading && totalPages > 0) {
      onPageChange(totalPages - 1);
    }
  };

  const handlePageSizeChange = (value: string) => {
    if (!loading) {
      onPageSizeChange(Number(value));
    }
  };

  // 표시할 페이지 번호 범위 계산
  const getPageNumbers = () => {
    const maxVisible = 10; // 최대 표시 페이지 개수
    const pages: number[] = [];

    if (totalPages <= maxVisible) {
      // 전체 페이지가 maxVisible 이하면 모두 표시
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 표시
      let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible);

      // 끝이 totalPages에 닿으면 start 조정
      if (end === totalPages) {
        start = Math.max(0, end - maxVisible);
      }

      for (let i = start; i < end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.border.default}`,
    backgroundColor: theme.colors.background.surface,
    fontFamily: theme.typography.fontFamily,
  };

  const sectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  };

  const textStyle: React.CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
  };

  const pageInfoStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: "14px",
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  };

  return (
    <div style={containerStyle} className={className}>
      {/* 왼쪽: 페이지 크기 선택 */}
      <div style={sectionStyle}>
        <span style={textStyle}>Rows per page:</span>
        <Select
          value={String(pageSize)}
          onChange={handlePageSizeChange}
          options={pageSizeOptions.map((size) => ({
            value: String(size),
            label: String(size),
          }))}
          disabled={loading}
        />
      </div>

      {/* 중간: 항목 범위 표시 */}
      <div style={textStyle}>
        {startIndex}-{endIndex} of {totalElements}
      </div>

      {/* 오른쪽: 페이지 네비게이션 */}
      <div style={sectionStyle}>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleFirstPage}
          disabled={first || loading}
          title="First page"
        >
          «
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePreviousPage}
          disabled={first || loading}
          title="Previous page"
        >
          ‹
        </Button>

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map((pageNum) => {
          const isCurrentPage = pageNum === currentPage;
          return (
            <Button
              key={pageNum}
              size="sm"
              variant={isCurrentPage ? "primary" : "ghost"}
              onClick={() => !loading && onPageChange(pageNum)}
              disabled={loading}
              style={{
                minWidth: "32px",
                fontWeight: isCurrentPage
                  ? theme.typography.weights.semibold
                  : theme.typography.weights.regular,
                backgroundColor: isCurrentPage
                  ? theme.colors.primary.default
                  : "transparent",
                color: isCurrentPage
                  ? theme.colors.primary.text
                  : theme.colors.text.primary,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {pageNum + 1}
            </Button>
          );
        })}

        <Button
          size="sm"
          variant="ghost"
          onClick={handleNextPage}
          disabled={last || loading}
          title="Next page"
        >
          ›
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleLastPage}
          disabled={last || loading}
          title="Last page"
        >
          »
        </Button>
      </div>
    </div>
  );
};
